import { scienceArticle } from '@/components/site/science-article';
import { threshold } from '@/lib/journal-stories/threshold';

const article = scienceArticle('double-threshold-training', threshold);
export const generateMetadata = article.generateMetadata;
export default article.Page;
