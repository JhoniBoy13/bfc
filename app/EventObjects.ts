export interface Event {
    title: string;
    start: Date | string;
    end?: Date | string;
    allDay: boolean;
    id: number;
    color: string;
    eventType: EventType;
    description?: string;
    isInCalendar?:boolean;
}

export interface EventType {
    id: number;
    color: string;
    name: string;
    iconUrl?: string;
    isFiltered?:boolean;
}

export interface EventTypeOption {
    readonly value: string;
    readonly label: string;
    readonly color: string;
    isFiltered: boolean;
    readonly isDisabled?: boolean;
}