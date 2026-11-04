import {services} from '../../lib/site-content';
import {Header,Footer,Arrow} from './shell';
import {telegramBotLink} from '../../lib/telegram-bot';
export function ServiceIntro({id}:{id:'kids'|'sport-conditioning'}){
 const service=services.find(item=>item.id===id)!;
 return <><Header/><main id="main" className="native-detail"><article className="section"><a className="text-link" href="/#services">Все форматы работы</a><h1>{service.name}</h1><p className="native-detail-lead">{service.problem}</p><div className="native-detail-grid"><div><h2>Как проходит занятие</h2><p>{service.process}</p><h2>Что вы получите</h2><p>{service.result}</p></div><aside><strong>4 990 ₽</strong><p>{service.period}</p><p>{service.note}</p><a className="button button-red" href={telegramBotLink(service.id)} target="_blank" rel="noreferrer">Обсудить занятие <Arrow/></a></aside></div><p className="native-detail-boundary">До начала согласуем площадку, время и полную стоимость. <a href="/terms">Условия работы</a> · <a href="/privacy">Обработка данных</a></p></article></main><Footer/></>;
}
