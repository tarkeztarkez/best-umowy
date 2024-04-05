import { create } from "zustand";
import { Group, Student as TemplateStudent } from "./types";
import { persist, createJSONStorage } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { v4 as uuidv4 } from "uuid";

export interface Student extends Omit<TemplateStudent, "groups"> {
	groups: {
		id: number;
		discount: number;
	}[];
}

export interface DataStore {
	setGroups: (groups: Group[]) => void;
	updateGroup: (id: number, group: Partial<Group>) => void;
	newGroup: () => void;
	deleteGroup: (id: number) => void;
	switchGroups: (group: Group, after: Group) => void;

	updateStudent: (id: number, student: Partial<Student>) => void;
	newStudent: () => void;
	deleteStudent: (id: number) => void;
	clearStudents: () => void;

	setDiscount: (index: number, discount: number) => void;
	newDiscount: () => void;
	deleteDiscount: (index: number) => void;

	students: Student[];
	groups: Group[];

	discounts: number[];
}

export const useDataStore = create<DataStore>()(
	persist(
		immer((set, get) => ({
			setGroups: (groups: Group[]) => {
				set((state: DataStore) => {
					state.groups = groups;
				});
			},
			updateGroup: (id: number, group: Partial<Group>) => {
				set((state: DataStore) => {
					const index = state.groups.findIndex((e: Group) => e.id === id);
					state.groups[index] = { ...state.groups[index], ...group };
				});
			},
			newGroup: () => {
				set((state: DataStore) => {
					state.groups.push({
						// timestamp number
						id: Date.now(),
						amountInWeek: 2,
						class: "",
						subject: "",
						cost: 0,
						length: 45,
						schedule: "",
					});
				});
			},
			deleteGroup: (id: number) => {
				set((state: DataStore) => {
					const index = state.groups.findIndex((e: Group) => e.id === id);
					state.groups.splice(index, 1);
				});
			},
			switchGroups: (group: Group, after: Group) => {
				set((state: DataStore) => {
					const index = state.groups.findIndex((e: Group) => e.id === group.id);
					const afterIndex = state.groups.findIndex(
						(e: Group) => e.id === after.id,
					);

					const temp = state.groups[index];
					state.groups[index] = state.groups[afterIndex];
					state.groups[afterIndex] = temp;
				});
			},

			updateStudent: (id: number, student: Partial<Student>) => {
				set((state: DataStore) => {
					const index = state.students.findIndex((e: Student) => e.id === id);
					state.students[index] = { ...state.students[index], ...student };
				});
			},
			newStudent: () => {
				set((state: DataStore) => {
					state.students.push({
						id: Date.now(),
						name: "",
						surname: "",
						groups: [],
					});
				});
			},
			deleteStudent: (id: number) => {
				set((state: DataStore) => {
					const index = state.students.findIndex((e: Student) => e.id === id);
					state.students.splice(index, 1);
				});
			},
			clearStudents: () => {
				set((state: DataStore) => {
					state.students = [];
				});
			},

			setDiscount(index: number, discount: number) {
				set((state: DataStore) => {
					state.discounts[index] = discount;
				});
			},
			newDiscount() {
				set((state: DataStore) => {
					state.discounts.push(0);
				});
			},
			deleteDiscount(index: number) {
				set((state: DataStore) => {
					state.discounts.splice(index, 1);
				});
			},

			groups: [
				{
					id: 3,
					amountInWeek: 2,
					class: "IVB",
					cost: 150,
					length: 60,
					subject: "J. Angielski",
					schedule: "Wtorek: 17.20-18.05\nCzwartek: 17.30-18.15",
				},
			],

			students: [
				{
					id: 3,
					name: "Jan",
					surname: "Kowalski",
					groups: [{ id: 3, discount: 0 }],
				},
			],

			discounts: [0, 10, 20],
		})),
		{
			name: "data-storage", // name of the item in the storage (must be unique)
			storage: createJSONStorage(() => localStorage), // which storage to use
		},
	),
);

export function useGroupsbySubject() {
	const groups = useDataStore((state) => state.groups);

	const groupsBySubject = groups.reduce(
		(acc, group) => {
			if (!acc[group.subject]) {
				acc[group.subject] = [];
			}
			acc[group.subject].push(group);

			return acc;
		},
		{} as Record<string, Group[]>,
	);

	const array = Object.entries(groupsBySubject).map(([subject, groups]) => {
		return {
			name: subject,
			groups,
		};
	});

	array.sort((a, b) => a.name.localeCompare(b.name));

	return array;
}
