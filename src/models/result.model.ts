export interface Result {
    id: string;
    eventId: string;
    userId: string;
    score: number;
    position: number;
    description?: string;
    createdAt: Date;
    updatedAt: Date;
}