export interface User {
    id: number;
    nom: string;
    prenom: string;
    password: string;
}

export const users: User[] = [];