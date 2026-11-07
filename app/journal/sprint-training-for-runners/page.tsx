import { scienceArticle } from '@/components/site/science-article';
import { sprint } from '@/lib/journal-stories/sprint';

const article = scienceArticle('sprint-training-for-runners', sprint);
export const generateMetadata = article.generateMetadata;
export default article.Page;
