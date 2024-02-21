export interface Event {
    title: string;
    start: Date | string;
    allDay: boolean;
    id: number;
    color: string;
    eventType?: EventType;
}

export interface EventType {
    id: number;
    color: string;
    name: string;
    iconUrl?: string;
}