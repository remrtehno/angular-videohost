export class RootQuery
{
    name: string;
    status: string;
    authorized: boolean;
    categories: Category[];
}

export class Views
{
    content_idx: number;
    count: number;
}

export class Likes
{
    content_idx: number;
    count: number;
}

export interface Preview
{
    id: number;
    type: string;
    file: string;
}

export interface Tag
{
    id: number;
    type: string;
    display_name: string;
    priority: number;
}

export interface Content
{
    id: number;
    name: string;
    type: string;
    file: string;
    priority: number;
    previews: Preview[];
    tags: Tag[];
    description: string;
    likes: number;
    // If auth
    liked: boolean | undefined;
    views: number;
    // If auth
    viewed: boolean | undefined;
}

export interface Category
{
    id: number;
    name: string;
    alias: string;
    contents: Content[];
}
