//classes/db.ts
import Dexie from "dexie";

export interface Subject {
    id?: number;
    name: string;
    difficulty: number;
    selectedSquares: boolean[];
}

export interface Settings {
    id: number;
    hoursPerDay: number;
    daysPerWeek: number;
    darkMode: boolean;
}

export class StudyDatabase extends Dexie {
    subjects!: Dexie.Table<Subject, number>;
    settings!: Dexie.Table<Settings, number>; // Nova tabela para configurações

    constructor() {
        super("StudyDatabase");
        this.version(3).stores({
            subjects: "++id, name, difficulty, selectedSquares",
            settings: "++id, hoursPerDay, daysPerWeek, darkMode"
        });
        this.subjects = this.table("subjects");
        this.settings = this.table("settings");
        
    }
}

export const db = new StudyDatabase();
