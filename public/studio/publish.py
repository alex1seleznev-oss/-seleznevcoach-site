"""Publish due, explicitly exported carousels via Instagram Login. Run from cron."""
import argparse
import datetime as dt
import fcntl
import json
import os
from pathlib import Path
import re
import sqlite3
import sys
import time
from urllib.parse import urlencode, quote
from urllib.request import Request, urlopen
from urllib.error import HTTPError

ROOT = Path(__file__).resolve().parent

def graph(endpoint, fields=None):
    version = os.environ['IG_API_VERSION']
    if not re.fullmatch(r'v\d+\.\d+', version):
        raise ValueError('Invalid IG_API_VERSION')
    url = 'https://graph.instagram.com/' + version + '/' + endpoint
    req = Request(url, data=urlencode(fields).encode() if fields is not None else None,
                  headers={'Authorization': 'Bearer ' + os.environ['IG_ACCESS_TOKEN']})
    try:
        with urlopen(req, timeout=45) as response:
            return json.load(response)
    except HTTPError as e:
        detail = json.loads(e.read()).get('error', {})
        raise RuntimeError('Instagram HTTP %s, code %s: %s' % (e.code, detail.get('code'),detail.get('message',''))) from None

def ready(container):
    for _ in range(30):
        status = graph(container + '?fields=status_code')['status_code']
        if status == 'FINISHED':
            return
        if status != 'IN_PROGRESS':
            raise RuntimeError('Container ' + status)
        time.sleep(10)
    raise RuntimeError('Container timed out')

def run(live):
    plan = json.loads((ROOT / 'schedule.json').read_text())
    now = dt.datetime.now(dt.timezone.utc)
    if not live:
        for p in plan:
            print(p['at'], p['title'], len(p['images']))
        return
    account = os.environ['IG_ACCOUNT_ID']
    base = os.environ['PUBLIC_MEDIA_BASE'].rstrip('/')
    if not base.startswith('https://') or not account.isdigit():
        raise ValueError('Invalid PUBLIC_MEDIA_BASE or IG_ACCOUNT_ID')
    db = sqlite3.connect(ROOT / 'publications.sqlite')
    db.execute('CREATE TABLE IF NOT EXISTS jobs (account TEXT,id TEXT,state TEXT,remote TEXT,PRIMARY KEY(account,id))')
    for post in plan:
        due = dt.datetime.fromisoformat(post['at'])
        key = (account, post['id'])
        if due > now or db.execute('SELECT 1 FROM jobs WHERE account=? AND id=?',key).fetchone():
            continue
        if (now-due).total_seconds()>3600:
            print('Missed window, reschedule:', post['title'],file=sys.stderr)
            continue
        try:
            children = []
            for path in post['images']:
                child = graph(account+'/media', {'image_url':base+'/'+quote(path),'is_carousel_item':'true'})['id']
                ready(child)
                children.append(child)
            parent = graph(account+'/media', {'media_type':'CAROUSEL','children':','.join(children),'caption':post['caption']})['id']
            ready(parent)
            # Persist before the irreversible API request. An uncertain result needs human review.
            db.execute('INSERT INTO jobs VALUES(?,?,?,?)',(*key,'publishing',parent))
            db.commit()
            media = graph(account+'/media_publish', {'creation_id':parent})['id']
            db.execute('UPDATE jobs SET state=?,remote=? WHERE account=? AND id=?',('published',media,*key))
            db.commit()
            print('Published', post['title'],media)
        except Exception as exc:
            print('Review',post['title'],str(exc),file=sys.stderr)
            continue

if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('--publish',action='store_true')
    args=parser.parse_args()
    with (ROOT / '.lock').open('a') as lock:
        try:
            fcntl.flock(lock,fcntl.LOCK_EX|fcntl.LOCK_NB)
        except BlockingIOError:
            sys.exit()
        run(args.publish)
