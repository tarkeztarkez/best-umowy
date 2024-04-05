"use client";

import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useDataStore, useGroupsbySubject } from "@/lib/state";
import { Group } from "@/lib/types";
import React from "react";

function GroupList() {
	const subjects = useGroupsbySubject();
	const newGroup = useDataStore((state) => state.newGroup);
	const setGroups = useDataStore((state) => state.setGroups);

	return (
		<div>
			<div className="mb-2 flex gap-2 items-center">
				<h1 className="text-2xl">Grupy</h1>
				<Button onClick={() => newGroup()}>Dodaj grupę</Button>
			</div>
			<div className="flex flex-col gap-2">
				{subjects.map((subject) => (
					<div key={subject.name} className="">
						<h2 className="text-xl">{subject.name}</h2>
						<div className="flex gap-2">
							{subject.groups.map((group, index) => (
								<Group
									key={group.id}
									group={group}
									nextGroup={subject.groups[index + 1] || null}
									prevGroup={subject.groups[index - 1] || null}
								/>
							))}
						</div>
					</div>
				))}
			</div>
		</div>
	);
}

export default GroupList;

function Group({
	group,
	nextGroup,
	prevGroup,
}: { group: Group; nextGroup: Group | null; prevGroup: Group | null }) {
	const deleteGroup = useDataStore((state) => state.deleteGroup);
	const switchGroups = useDataStore((state) => state.switchGroups);

	return (
		<Card className="w-fit mx-2">
			<CardHeader>
				<GroupInput group={group} field="subject" label="Przedmiot" />
				<GroupInput group={group} field="class" label="Klasa" />
			</CardHeader>
			<CardContent className="flex flex-col gap-2">
				<GroupInput group={group} field="length" label="Długość trwania" />
				<GroupInput
					group={group}
					field="amountInWeek"
					label="Ilość w tygodniu"
				/>
				<GroupInput group={group} field="cost" label="Cena" />
				<GroupInput
					group={group}
					field="schedule"
					label="Plan lekcji"
					textarea
				/>
			</CardContent>
			<CardFooter className="flex">
				<Button variant="destructive" onClick={() => deleteGroup(group.id)}>
					Usuń grupę
				</Button>
				{prevGroup && (
					<Button variant="link" onClick={() => switchGroups(group, prevGroup)}>
						{"<"}
					</Button>
				)}
				{nextGroup && (
					<Button variant="link" onClick={() => switchGroups(group, nextGroup)}>
						{">"}
					</Button>
				)}
			</CardFooter>
		</Card>
	);
}

function GroupInput({
	group,
	field,
	textarea,
	label,
}: { group: Group; field: keyof Group; textarea?: boolean; label: string }) {
	const updateGroup = useDataStore((state) => state.updateGroup);

	const [value, setValue] = React.useState(group[field]);

	function parseValue(value: string | number) {
		value = value.toString();
		if (typeof group[field] == "number") {
			return parseInt(value);
		}
		return value;
	}
	return (
		<div>
			<Label htmlFor={field}>{label}</Label>
			{textarea ? (
				<Textarea
					id={field}
					value={value}
					onChange={(e) => setValue(e.target.value)}
					onBlur={(e) => updateGroup(group.id, { [field]: parseValue(value) })}
					className="w-fit"
				/>
			) : (
				<Input
					id={field}
					value={value}
					onChange={(e) => setValue(e.target.value)}
					onBlur={(e) => updateGroup(group.id, { [field]: parseValue(value) })}
					type={typeof group[field] == "number" ? "number" : "text"}
					className="w-fit"
				/>
			)}
		</div>
	);
}
