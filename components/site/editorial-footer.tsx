import {ArrowUpRight,ChevronDown} from 'lucide-react';
import {telegramBotLink} from '@/lib/telegram-bot';
import {siteConfig} from '@/lib/site-content';
import {TrainingMap} from './training-map';

export function EditorialFooter(){
 return <footer className="editorial-footer" id="contacts">
  <div className="editorial-footer-main">
   <div className="editorial-footer-intro">
    <p className="editorial-footer-label">АЛЕКСАНДР СЕЛЕЗНЁВ / ТРЕНЕР ПО БЕГУ</p>
    <h2>НАЧНЁМ<br/>С ВАШЕЙ ЦЕЛИ.</h2>
    <a className="editorial-footer-action" href={telegramBotLink()} target="_blank" rel="noreferrer">Написать в Telegram <ArrowUpRight size={20} aria-hidden="true"/></a>
   </div>
   <div className="editorial-footer-meta">
    <div><span>ОЧНЫЕ ТРЕНИРОВКИ</span><p>Москва · вторник / пятница · 19:30</p><p>Манеж Баумана / стадион «Энергия» МЭИ</p><a href="/training/moscow">Как проходят занятия <ArrowUpRight size={16} aria-hidden="true"/></a></div>
    <div><span>КОНТАКТЫ</span><a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a><a href={siteConfig.telegramChannel} target="_blank" rel="noreferrer">Telegram-канал <ArrowUpRight size={16} aria-hidden="true"/></a></div>
   </div>
  </div>
  <details className="editorial-footer-map"><summary>Площадки тренировок и карта <ChevronDown size={19} aria-hidden="true"/></summary><TrainingMap/></details>
  <div className="editorial-footer-bottom">
   <a className="editorial-footer-mark" href="/" aria-label="На главную">AS<span>/</span></a>
   <span>© {new Date().getFullYear()} Александр Селезнёв</span>
   <nav aria-label="Документы сайта"><a href="/privacy">Политика данных</a><a href="/cookies">Cookie и карты</a><a href="/terms">Условия работы</a></nav>
  </div>
 </footer>;
}
