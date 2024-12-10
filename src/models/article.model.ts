export interface Article {
    id: number;
    userId: number;
    titre: string;
    contenu: string;
}

export const articles: Article[] = [];
