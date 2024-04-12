"use client";

import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useDataStore, type Student, useGroupsbySubject } from "@/lib/state";
import { Group } from "@/lib/types";
import { Label } from "@radix-ui/react-label";
import { useState } from "react";

function StudentList() {
	const students = useDataStore((state) => state.students);
	const newStudent = useDataStore((state) => state.newStudent);
	const clearStudents = useDataStore((state) => state.clearStudents);

	return (
		<div className="flex flex-col gap-2">
			<DateInput />
			<div className="mb-2 flex gap-2 items-center">
				<h1 className="text-2xl">Uczniowie</h1>
				<Button onClick={() => newStudent()}>Dodaj ucznia</Button>
				<Button variant="destructive" onClick={() => clearStudents()}>
					Wyczyść uczniów
				</Button>
			</div>
			<div className="flex gap-2">
				{students.map((student) => (
					<Student key={student.id} student={student} />
				))}
			</div>
		</div>
	);
}

export default StudentList;

function DateInput() {
	const setDate = useDataStore((state) => state.setDate);
	const date = useDataStore((state) => state.date);

	return (
		<div className="flex gap-2 items-center">
			<Label htmlFor="date">Data</Label>
			<Input
				id="date"
				value={date}
				className="w-32"
				onChange={(e) => {
					setDate(e.target.value);
				}}
			/>
		</div>
	);
}

function Student({ student }: { student: Student }) {
	const deleteStudent = useDataStore((state) => state.deleteStudent);

	return (
		<Card className="w-fit">
			<CardHeader>
				<NameInput student={student} />
			</CardHeader>
			<CardContent className="flex flex-col gap-2">
				<BundleDisplay student={student} />
				<GroupSelect student={student} />
			</CardContent>
			<CardFooter>
				<Button variant="destructive" onClick={() => deleteStudent(student.id)}>
					Usuń ucznia
				</Button>
			</CardFooter>
		</Card>
	);
}

function NameInput({ student }: { student: Student }) {
	const updateStudent = useDataStore((state) => state.updateStudent);

	const [value, setValue] = useState(student.name + " " + student.surname);

	return (
		<div>
			<Label htmlFor="name">Imię i nazwisko</Label>
			<Input
				id="name"
				value={value.trimStart()}
				onChange={(e) => {
					setValue(e.target.value.trimStart());
				}}
				onBlur={(e) => {
					const [name, surname] = e.target.value.split(" ");
					updateStudent(student.id, { name, surname });
				}}
			/>
		</div>
	);
}

function BundleDisplay({ student }: { student: Student }) {
	const groups = useDataStore((state) => state.groups);
	const bundles = useDataStore((state) => state.bundles);

	const bundle = bundles.find((bundle) =>
		bundle.groups.every((group) =>
			student.groups.some((studentGroup) => studentGroup.id === group),
		),
	);

	return (
		<h1 className="font-bold text-xl text-red-500">
			{bundle && <p>{bundle.name}</p>}
		</h1>
	);
}

function GroupSelect({ student }: { student: Student }) {
	const groupsBySubject = useGroupsbySubject();

	const updateStudent = useDataStore((state) => state.updateStudent);

	function onValueChange(v: string, subjectName: string) {
		const subject = groupsBySubject.find((s) => s.name == subjectName)!;

		if (v == "none") {
			updateStudent(student.id, {
				groups: student.groups.filter(
					(g) => !subject.groups.some((sg) => sg.id == g.id),
				),
			});
		}
		const value = parseInt(v);
		if (value) {
			const previousGroupFromSubject = student.groups.find((g) =>
				subject.groups.some((sg) => sg.id == g.id),
			);

			if (previousGroupFromSubject) {
				updateStudent(student.id, {
					groups: student.groups.map((g) =>
						g.id == previousGroupFromSubject.id
							? { id: value, discount: previousGroupFromSubject.discount }
							: g,
					),
				});
				return;
			}

			updateStudent(student.id, {
				groups: [
					...student.groups,
					{
						id: value,
						discount: 0,
					},
				],
			});
		}
	}

	return (
		<div className="flex flex-col gap-2">
			{groupsBySubject.map((subject) => (
				<div key={subject.name}>
					<h1 className="font-bold">{subject.name}</h1>
					<div className="flex gap-2">
						<div>
							<h1>Grupa</h1>
							<RadioGroup
								className="flex flex-col"
								onValueChange={(v) => onValueChange(v, subject.name)}
							>
								<div className="flex items-center gap-1">
									<RadioGroupItem
										id={student.id + "none" + subject.name}
										checked={
											!student.groups.some((g) =>
												subject.groups.some((sg) => sg.id == g.id),
											)
										}
										value="none"
									/>
									<Label htmlFor={student.id + "none" + subject.name}>
										Nie chodzi
									</Label>
								</div>
								{subject.groups.map((group) => (
									<GroupRadiobox
										key={group.id}
										group={group}
										student={student}
									/>
								))}
							</RadioGroup>
						</div>
						{!student.bundle && (
							<DiscountSelect student={student} subject={subject.name} />
						)}
					</div>
				</div>
			))}
		</div>
	);
}

function GroupRadiobox({ group, student }: { group: Group; student: Student }) {
	const updateStudent = useDataStore((state) => state.updateStudent);

	return (
		<div className="flex items-center gap-1">
			<RadioGroupItem
				id={`${group.id}+${student.id}`}
				checked={student.groups.some((e) => e.id == group.id)}
				value={`${group.id}`}
			/>
			<Label htmlFor={`${group.id}+${student.id}`}>{group.class}</Label>
		</div>
	);
}

function DiscountSelect({
	student,
	subject,
}: { student: Student; subject: string }) {
	const updateStudent = useDataStore((state) => state.updateStudent);
	const discounts = useDataStore((state) => state.discounts);
	const groups = useDataStore((state) => state.groups);

	const currentGroup = student.groups.find((g) => {
		const group = groups.find((group) => group.id == g.id);
		return group?.subject == subject;
	})!;

	function onValueChange(v: string) {
		updateStudent(student.id, {
			groups: student.groups.map((g) =>
				g.id == currentGroup.id ? { id: g.id, discount: parseInt(v) } : g,
			),
		});
	}
	if (!currentGroup) return null;
	return (
		<div>
			<h1>Zniżka</h1>
			<RadioGroup onValueChange={onValueChange}>
				<div className="flex items-center gap-1">
					<RadioGroupItem
						id={"0" + subject + student.id}
						checked={currentGroup.discount == 0}
						value="0"
					/>
					<Label htmlFor={"0" + subject + student.id}>Brak</Label>
				</div>
				{discounts.map((discount) => (
					<div className="flex items-center gap-1" key={discount}>
						<RadioGroupItem
							id={`${discount}`}
							checked={currentGroup.discount == discount}
							value={`${discount}`}
						/>
						<Label htmlFor={`${discount}`}>-{discount}zł</Label>
					</div>
				))}
			</RadioGroup>
		</div>
	);
}
