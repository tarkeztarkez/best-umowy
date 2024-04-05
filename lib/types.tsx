export type Group = {
	id: number;
	class: string;
	length: number; // in min
	subject: string;
	amountInWeek: number;
	cost: number;
	schedule: string;
};

export type Student = {
	id: number;
	name: string;
	surname: string;
	groups: Group[];
};

export type TemplateData = {
	students: Student[];
	discounts: number[];
};
