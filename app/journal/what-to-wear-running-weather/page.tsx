import { scienceArticle } from '@/components/site/science-article';
import { weather } from '@/lib/journal-stories/weather';

const article = scienceArticle('what-to-wear-running-weather', weather);
export const generateMetadata = article.generateMetadata;
export default article.Page;
