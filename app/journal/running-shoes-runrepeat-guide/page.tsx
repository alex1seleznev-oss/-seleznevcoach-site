import { scienceArticle } from '@/components/site/science-article';
import { shoes } from '@/lib/journal-stories/shoes';

const article = scienceArticle('running-shoes-runrepeat-guide', shoes);
export const generateMetadata = article.generateMetadata;
export default article.Page;
