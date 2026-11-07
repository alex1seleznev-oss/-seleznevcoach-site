import { scienceArticle } from '@/components/site/science-article';
import { strength } from '@/lib/journal-stories/strength';

const article = scienceArticle('strength-training-without-bulk', strength);
export const generateMetadata = article.generateMetadata;
export default article.Page;
