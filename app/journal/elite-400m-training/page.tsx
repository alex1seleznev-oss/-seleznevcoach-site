import { eliteArticle } from '@/components/site/elite-article';
import { dossier } from '@/lib/elite-dossiers/lap';

const article = eliteArticle('elite-400m-training', dossier);
export const generateMetadata = article.generateMetadata;
export default article.Page;
