export interface Medstaff {
    id: string;
    qualification: string;
    experience: string;
}

export interface Shift {
    id: number;
    start: string;
    staffShifts: StaffShift[];
}

export interface StaffShift {
    id: number;
    staff: Medstaff;
    room: string;
}
