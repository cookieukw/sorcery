import Dexie from "dexie";

export class StudyDatabase extends Dexie {
  subjects!: Dexie.Table<Subject, number>;
  settings!: Dexie.Table<Settings, number>; // Nova tabela para configurações

  constructor() {
    super("StudyDatabase");
    this.version(1).stores({
      subjects: "++id, name, difficulty", // Definindo as colunas da tabela de matérias
      settings: "++id, hoursPerDay, daysPerWeek", // Definindo as colunas da tabela de configurações
    });
    this.subjects = this.table("subjects");
    this.settings = this.table("settings");
  }
}

export interface Subject {
  id: number; // Certifique-se de que é sempre um número
  name: string;
  difficulty: number; // Grau de dificuldade
  selectedSquares: boolean[]; // Para armazenar a seleção dos quadrados
}

export interface Settings {
  id?: number;
  hoursPerDay: number;
  daysPerWeek: number;
}

export const db = new StudyDatabase();
