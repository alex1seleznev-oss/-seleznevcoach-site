'use client';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';
import { athleteSituations, workingSteps, coachingFaq } from '@/lib/coaching-content';
import { Kicker, Arrow } from './shell';

export function CoachingFit(){
 return <section className="coaching-fit section" aria-labelledby="fit-title"><div className="fit-heading"><div><span className="mono">ВАША ИСХОДНАЯ ТОЧКА</span><h2 id="fit-title" className="display">ВАША ЖИЗНЬ.<br/><span>ВАШ БЕГ.</span></h2></div><p>Вам не нужно жить как профессиональному спортсмену, чтобы относиться к своей подготовке серьёзно.</p></div><Tabs defaultValue="plateau" className="fit-tabs"><TabsList className="fit-tab-list" aria-label="Выберите вашу ситуацию">{athleteSituations.map((s,i)=><TabsTrigger value={s.id} key={s.id}><span className="mono">0{i+1}</span>{s.label}</TabsTrigger>)}</TabsList>{athleteSituations.map(s=><TabsContent value={s.id} className="fit-panel" key={s.id}><div className="fit-question"><h3>{s.title}</h3><p>{s.wish}</p></div><div className="fit-answer"><span className="mono">КАК МЫ БУДЕМ РАБОТАТЬ</span><p>{s.process}</p><div className="fit-outcome"><span className="mono">ЧТО ВЫ ПОЛУЧИТЕ</span><p>{s.outcome}</p></div></div></TabsContent>)}</Tabs><a href="#services" className="text-link">Выбрать уровень поддержки <Arrow/></a></section>;
}
export function WorkingTogether(){
 return <div className="working-together"><div className="working-title"><span className="mono">ОТ ПЕРВОГО СООБЩЕНИЯ ДО СЛЕДУЮЩЕГО ЦИКЛА</span><h3>Как выглядит работа со мной</h3></div><ol>{workingSteps.map((s,i)=><li key={s.title}><span className="display work-number">0{i+1}</span><div><h4>{s.title}</h4><p>{s.text}</p></div></li>)}</ol><p className="working-note">В начале согласуем канал связи, формат обратной связи и объём сопровождения. Вы понимаете, что входит в работу, до её начала.</p></div>;
}
export function CoachingQuestions(){
 return <section className="coaching-questions section" aria-labelledby="questions-title"><div className="questions-heading"><Kicker number="?">ПЕРЕД ТЕМ КАК НАЧАТЬ</Kicker><h2 id="questions-title" className="display">ДАВАЙТЕ<br/>РАЗБЕРЁМСЯ<span className="signal">.</span></h2><p>Вам не обязательно разбираться в физиологии, чтобы прийти к тренеру. Разобраться в своей подготовке мы сможем вместе.</p></div><Accordion type="single" collapsible className="questions-list">{coachingFaq.map((f,i)=><AccordionItem key={f.question} value={`question-${i}`}><AccordionTrigger>{f.question}</AccordionTrigger><AccordionContent><p>{f.answer}</p></AccordionContent></AccordionItem>)}</Accordion></section>;
}
