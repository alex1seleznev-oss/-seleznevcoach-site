import { scienceArticle } from '@/components/site/science-article';
import { endurance } from '@/lib/journal-stories/endurance';

const article = scienceArticle('elite-endurance-training-week', endurance);
export const generateMetadata = article.generateMetadata;
export default article.Page;
