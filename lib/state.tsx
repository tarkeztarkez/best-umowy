import { create } from "zustand";
import { Group, Student as TemplateStudent } from "./types";
import { persist, createJSONStorage } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { devtools } from "zustand/middleware";

export interface Student extends Omit<TemplateStudent, "groups"> {
  groups: {
    id: number;
    discount: number;
  }[];

  bundle?: number;
}

export interface Bundle {
  id: number;
  name: string;
  cost: number;
  groups: number[];
}

export interface DataStore {
  date: string;
  setDate: (date: string) => void;

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

  setBundle: (id: number, bundle: Partial<Bundle>) => void;
  newBundle: () => void;
  deleteBundle: (id: number) => void;

  /**
   * Replace the entire data state (date, groups, students, discounts, bundles)
   * by parsing a JSON string.
   */
  setWholeState: (json: string) => void;

  students: Student[];
  groups: Group[];

  discounts: number[];
  bundles: Bundle[];
}

export const useDataStore = create<DataStore>()(
  devtools(
    persist(
      immer((set, get) => ({
        // date formatted as DD.MM.YYYY
        date: new Date().toLocaleDateString("pl-PL"),
        setDate: (date: string) => {
          set((state: DataStore) => {
            state.date = date;
          });
        },

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
            const index = state.groups.findIndex(
              (e: Group) => e.id === group.id,
            );
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
            const index = state.students.findIndex((e) => e.id === id);
            state.students[index] = { ...state.students[index], ...student };
          });

          if (student.groups) {
            const st = get().students.find((e) => e.id === id)!;
            const bundles = get().bundles;
            const allGroups = get().groups;

            const matchingBundle = bundles.find((b) => {
              const bundleGroups = allGroups.filter((g) =>
                b.groups.includes(g.id),
              );
              const subjects = Array.from(
                new Set(bundleGroups.map((g) => g.subject)),
              );

              return subjects.every((subject) => {
                const groupIdsForSubject = bundleGroups
                  .filter((g) => g.subject === subject)
                  .map((g) => g.id);
                return st.groups.some((sg) =>
                  groupIdsForSubject.includes(sg.id),
                );
              });
            });

            if (matchingBundle) {
              set((state: DataStore) => {
                const target = state.students.find((e) => e.id === id)!;
                target.bundle = matchingBundle.id;
                target.groups = target.groups.map((g) => ({
                  id: g.id,
                  discount: 0,
                }));
              });
            } else {
              set((state: DataStore) => {
                state.students.find((e) => e.id === id)!.bundle = undefined;
              });
            }
          }
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

        setBundle: (id: number, bundle: Partial<Bundle>) => {
          set((state: DataStore) => {
            const index = state.bundles.findIndex((e: Bundle) => e.id === id);
            state.bundles[index] = { ...state.bundles[index], ...bundle };
          });
        },
        newBundle: () => {
          set((state: DataStore) => {
            state.bundles.push({
              id: Date.now(),
              name: "",
              cost: 0,
              groups: [],
            });
          });
        },
        deleteBundle: (id: number) => {
          set((state: DataStore) => {
            const index = state.bundles.findIndex((e: Bundle) => e.id === id);
            state.bundles.splice(index, 1);
          });
        },

        // NEW FUNCTION: replace entire data state from JSON
        setWholeState: (json: string) => {
          try {
            const parsed = JSON.parse(json) as Partial<
              Pick<
                DataStore,
                "date" | "groups" | "students" | "discounts" | "bundles"
              >
            >;
            set((state: DataStore) => {
              if (parsed.date !== undefined) state.date = parsed.date;
              if (parsed.groups !== undefined) state.groups = parsed.groups;
              if (parsed.students !== undefined)
                state.students = parsed.students;
              if (parsed.discounts !== undefined)
                state.discounts = parsed.discounts;
              if (parsed.bundles !== undefined) state.bundles = parsed.bundles;
            });
          } catch (e) {
            console.error("setWholeState: invalid JSON", e);
          }
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
        bundles: [],
      })),
      {
        name: "data-storage",
        storage: createJSONStorage(() => localStorage),
      },
    ),
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
