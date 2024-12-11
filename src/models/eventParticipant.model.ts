export interface EventParticipant {
    id: string;
    eventId: string;
    participantId: string;
    registrationDate: Date;
    status: 'REGISTERED' | 'CANCELLED';
    result?: number; // Position finale dans l'événement
    performance?: string; // Temps/Score selon le type d'événement
    createdAt: Date;
    updatedAt: Date;
}