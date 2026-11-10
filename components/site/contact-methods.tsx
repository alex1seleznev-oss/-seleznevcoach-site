import {siteConfig} from '@/lib/site-content';
import {telegramBotLink} from '@/lib/telegram-bot';
import {Arrow} from './shell';

export function ContactMethods({english=false, service=''}:{english?:boolean;service?:string}) {
 const placement = {'data-coaching-placement':'contact_section', 'data-coaching-format':service || 'general'};
 return <>
  <a className="button button-red" href={telegramBotLink(service)} {...placement} data-coaching-channel="telegram" target="_blank" rel="noreferrer">{english?'Open Telegram bot':'Открыть Telegram-бота'} <Arrow/></a>
  {siteConfig.whatsapp&&<a className="text-link" href={siteConfig.whatsapp} {...placement} data-coaching-channel="whatsapp" target="_blank" rel="noreferrer">WhatsApp <Arrow/></a>}
  <a className="text-link" href={`mailto:${siteConfig.email}`} {...placement} data-coaching-channel="email">{english?'Send an email':'Написать на почту'} <Arrow/></a>
  <p><a href={siteConfig.instagram} target="_blank" rel="noreferrer">Instagram*: @seleznevcoach</a></p>
 </>;
}
