export interface Event {
    id: string;
    name: string;
    sport: string;
    date: Date;
    location: string;
    description?: string;
    createdAt: Date;
    updatedAt: Date;
}
