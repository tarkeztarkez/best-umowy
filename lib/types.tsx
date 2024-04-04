
export type Group = {
  subject: string;
  class: string;
  length: number; // in min
  amountInWeek: number;
  cost: number;
  schedule: string
}

export type Student = {
  name: string;
  surname: string;
  groups: Group[];
}

export type Data = {
  students: Student[];
}