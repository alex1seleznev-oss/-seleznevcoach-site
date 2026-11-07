import { eliteArticle } from '@/components/site/elite-article';
import { dossier } from '@/lib/elite-dossiers/marathon';

const article = eliteArticle('elite-marathon-training', dossier);
export const generateMetadata = article.generateMetadata;
export default article.Page;
