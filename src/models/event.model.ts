export interface Event {
    id: string;
    name: string;
    sport: string;
    date: Date;
    location: string;
    image?: string;
    description?: string;
    createdAt: Date;
    updatedAt: Date;
}
