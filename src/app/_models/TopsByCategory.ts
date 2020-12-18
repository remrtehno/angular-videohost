import { CategoryContent } from "./CategoryContent";

export class TopsByCategory
{
    title: string;
    footer: string;
    contentNew: CategoryContent[];
    contentPopular: CategoryContent[];
    contentUnWatched: CategoryContent[];
}