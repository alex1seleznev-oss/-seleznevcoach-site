import { eliteArticle } from '@/components/site/elite-article';
import { dossier } from '@/lib/elite-dossiers/sprint';

const article = eliteArticle('elite-100m-training', dossier);
export const generateMetadata = article.generateMetadata;
export default article.Page;
