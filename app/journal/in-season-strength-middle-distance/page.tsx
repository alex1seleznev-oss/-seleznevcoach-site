import { scienceArticle } from '@/components/site/science-article';
import { inSeasonStrength } from '@/lib/journal-stories/in-season-strength';

const article = scienceArticle('in-season-strength-middle-distance', inSeasonStrength);
export const generateMetadata = article.generateMetadata;
export default article.Page;
