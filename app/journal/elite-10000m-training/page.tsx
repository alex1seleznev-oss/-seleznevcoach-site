import { eliteArticle } from '@/components/site/elite-article';
import { dossier } from '@/lib/elite-dossiers/track';

const article = eliteArticle('elite-10000m-training', dossier);
export const generateMetadata = article.generateMetadata;
export default article.Page;
