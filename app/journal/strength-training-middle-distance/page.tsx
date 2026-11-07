import { scienceArticle } from '@/components/site/science-article';
import { middleDistanceStrength } from '@/lib/journal-stories/middle-distance-strength';

const article = scienceArticle('strength-training-middle-distance', middleDistanceStrength);
export const generateMetadata = article.generateMetadata;
export default article.Page;
