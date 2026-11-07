import { eliteArticle } from '@/components/site/elite-article';
import { dossier } from '@/lib/elite-dossiers/middle';

const article = eliteArticle('elite-800m-training', dossier);
export const generateMetadata = article.generateMetadata;
export default article.Page;
