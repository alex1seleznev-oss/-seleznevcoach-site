export type SeoTarget = {
  title: string;
  description: string;
  indexable?: boolean;
};

export const seoTargets: Record<string, SeoTarget> = {
  '/': {
    title: 'Тренер по бегу в Москве и онлайн | Александр Селезнёв',
    description: 'Тренер по бегу в Москве и онлайн: индивидуальная подготовка, планы тренировок, сопровождение и анализ подготовки.',
  },
  '/training/online': {
    title: 'Онлайн-тренер по бегу | Александр Селезнёв',
    description: 'Онлайн-тренер по бегу: индивидуальный план, контроль нагрузки, обратная связь и корректировка подготовки под вашу цель.',
  },
  '/training/moscow': {
    title: 'Тренер по бегу в Москве | Александр Селезнёв',
    description: 'Тренер по бегу в Москве: индивидуальные и групповые тренировки, развитие выносливости, ОФП и подготовка к стартам.',
  },
  '/training/3k': {
    title: 'Подготовка к 3 км с тренером | Александр Селезнёв',
    description: 'Индивидуальная подготовка к 3 км: аэробная мощность, интервалы, скоростной резерв, ОФП, контроль нагрузки и подводка к старту.',
  },
  '/training/5k': {
    title: 'Подготовка к 5 км с тренером | Александр Селезнёв',
    description: 'Индивидуальная подготовка к 5 км: оценка текущего уровня, беговая нагрузка, интервалы, ОФП, контроль восстановления и подводка к старту.',
  },
  '/training/10k': {
    title: 'Подготовка к 10 км с тренером | Александр Селезнёв',
    description: 'Индивидуальная подготовка к 10 км: аэробная выносливость, пороговая работа, интервалы, ОФП, контроль нагрузки и подводка к старту.',
  },
  '/training/half-marathon': {
    title: 'Подготовка к полумарафону | Александр Селезнёв',
    description: 'Подготовка к полумарафону 21,1 км: индивидуальный план, длительные тренировки, пороговая работа, питание, темп и подводка к старту.',
  },
  '/training/marathon': {
    title: 'Подготовка к марафону с тренером | Александр Селезнёв',
    description: 'Индивидуальная подготовка к марафону: устойчивый объём, длительные тренировки, питание, восстановление, контроль нагрузки и подводка.',
  },
  '/services/diagnostics': {
    title: 'Разбор подготовки бегуна | Александр Селезнёв',
    description: 'Разбор подготовки бегуна: анализ тренировок, нагрузки, восстановления и результатов с практическими рекомендациями.',
  },
  '/services/plan': {
    title: 'План тренировок по бегу на 4 недели | Александр Селезнёв',
    description: 'Индивидуальный план тренировок по бегу на 4 недели: структура нагрузки, интенсивность, восстановление и контрольные точки.',
  },
  '/services/personal': {
    title: 'Онлайн-ведение бегуна | Александр Селезнёв',
    description: 'Персональное онлайн-ведение бегуна: план, обратная связь, анализ выполненной работы и регулярная корректировка нагрузки.',
  },
  '/services/performance': {
    title: 'Подготовка к старту | Александр Селезнёв',
    description: 'Подготовка к ключевому старту: структура сезона, развитие приоритетных качеств, контроль нагрузки, темп, тактика и подводка.',
  },
  '/journal': {
    title: 'Журнал о беге и тренировках | Александр Селезнёв',
    description: 'Статьи о беге, физиологии выносливости, тренировочной нагрузке, восстановлении и подготовке спортсменов-любителей.',
  },
  '/journal/vo2max-and-5000m': {
    title: 'VO₂max и результат на 5000 м | Александр Селезнёв',
    description: 'Как VO₂max, экономичность, порог и устойчивость к утомлению влияют на результат в беге на 5000 м.',
  },
  '/journal/elite-running-training': {
    title: 'Как тренируются элитные бегуны | Александр Селезнёв',
    description: 'Какие принципы подготовки элитных бегунов можно перенести в любительский бег без копирования профессиональных объёмов.',
  },
  '/journal/400-vs-1000-intervals': {
    title: '10×400 и 5×1000: разные стимулы | Александр Селезнёв',
    description: 'Чем отличаются интервалы 10×400 и 5×1000: интенсивность, длительность работы, восстановление и тренировочный стимул.',
  },
  '/journal/heart-rate-zones-running': {
    title: 'Пульсовые зоны для бега: как использовать | Александр Селезнёв',
    description: 'Как определить и использовать пульсовые зоны в беге: HRmax, пороговая ЧСС, влияние жары и усталости, ограничения часов и роль RPE.',
  },
  '/contacts': {
    title: 'Контакты тренера по бегу в Москве | Александр Селезнёв',
    description: 'Контакты Александра Селезнёва: онлайн-подготовка и очные тренировки по бегу в Москве. Telegram, почта и площадки занятий.',
  },
  '/privacy': {
    title: 'Политика обработки персональных данных | Александр Селезнёв',
    description: 'Политика обработки персональных данных сайта seleznevcoach.ru.',
    indexable: false,
  },
  '/terms': {
    title: 'Условия работы с тренером | Александр Селезнёв',
    description: 'Условия оказания тренерских услуг Александром Селезнёвым.',
    indexable: false,
  },
  '/cookies': {
    title: 'Файлы cookie и внешние сервисы | Александр Селезнёв',
    description: 'Информация о файлах cookie и внешних сервисах сайта seleznevcoach.ru.',
    indexable: false,
  },
  '/en': {
    title: 'Online Running Coach | Alexander Seleznev',
    description: 'Individual online running coaching and in-person training in Moscow: structured plans, feedback, load monitoring and race preparation.',
  },
  '/en/training/online': {
    title: 'Online Running Coaching | Alexander Seleznev',
    description: 'Individual online running coaching with a structured plan, training feedback, load monitoring and regular adjustments.',
  },
  '/en/training/moscow': {
    title: 'Running Coach in Moscow | Alexander Seleznev',
    description: 'Running coaching in Moscow: individual and group sessions, endurance development, strength work and race preparation.',
  },
  '/en/services/diagnostics': {
    title: 'Running Training Review | Alexander Seleznev',
    description: 'A structured review of your training, results, workload and recovery with clear priorities and practical next steps.',
  },
  '/en/services/plan': {
    title: '4-Week Running Training Plan | Alexander Seleznev',
    description: 'An individual four-week running plan with training structure, intensity guidance, recovery and defined checkpoints.',
  },
  '/en/services/personal': {
    title: 'Personal Online Running Coaching | Alexander Seleznev',
    description: 'Personal online running coaching with planning, weekly feedback, workload analysis and ongoing training adjustments.',
  },
  '/en/services/performance': {
    title: 'Race Preparation Coaching | Alexander Seleznev',
    description: 'Race-focused coaching: season structure, key training priorities, workload monitoring, pacing, tactics and tapering.',
  },
  '/en/journal': {
    title: 'Running Training Journal | Alexander Seleznev',
    description: 'Articles on endurance physiology, running training, workload, recovery and evidence-informed coaching practice.',
  },
  '/en/journal/vo2max-and-5000m': {
    title: 'VO₂max and 5K Performance | Alexander Seleznev',
    description: 'Why the same VO₂max can produce different 5K results: running economy, threshold characteristics and fatigue resistance.',
  },
  '/en/journal/elite-running-training': {
    title: 'How Elite Runners Train | Alexander Seleznev',
    description: 'What recreational runners can learn from elite training principles without copying professional training volume.',
  },
  '/en/journal/400-vs-1000-intervals': {
    title: '10×400 vs 5×1000: Different Stimuli | Alexander Seleznev',
    description: 'How 10×400 m and 5×1000 m differ in intensity, work duration, recovery demands and the training stimulus they create.',
  },
  '/en/contacts': {
    title: 'Contact Running Coach Alexander Seleznev',
    description: 'Contact Alexander Seleznev for online running coaching or in-person training in Moscow. Telegram, email and training locations.',
  },
  '/en/privacy': {
    title: 'Privacy and Personal Data | Alexander Seleznev',
    description: 'Privacy and personal data processing information for seleznevcoach.ru.',
    indexable: false,
  },
  '/en/terms': {
    title: 'Coaching Terms | Alexander Seleznev',
    description: 'Terms for coaching services provided by Alexander Seleznev.',
    indexable: false,
  },
  '/en/cookies': {
    title: 'Cookies and External Services | Alexander Seleznev',
    description: 'Information about cookies and external services used by seleznevcoach.ru.',
    indexable: false,
  },
};

export const defaultOgImage = 'https://seleznevcoach.ru/media/race-autumn.webp';
