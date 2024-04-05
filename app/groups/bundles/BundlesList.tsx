"use client";

import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	useDataStore,
	Bundle as BundleType,
	useGroupsbySubject,
} from "@/lib/state";
import { Group } from "@/lib/types";
import React, { useState } from "react";

function BundlesList() {
	const bundles = useDataStore((state) => state.bundles);
	const newBundle = useDataStore((state) => state.newBundle);

	return (
		<div>
			<div className="mb-2 flex gap-2 items-center">
				<h1 className="text-2xl">Pakiety</h1>
				<Button onClick={() => newBundle()}>Dodaj pakiet</Button>
			</div>
			<div className="flex gap-2">
				{bundles.map((bundle: BundleType) => (
					<Bundle key={bundle.id} bundle={bundle} />
				))}
			</div>
		</div>
	);
}

export default BundlesList;

function NameInput({ bundle }: { bundle: BundleType }) {
	const [value, setValue] = useState(bundle.name);
	const setBundle = useDataStore((state) => state.setBundle);

	return (
		<div>
			<Label htmlFor={"name" + bundle.id}>Nazwa</Label>
			<Input
				value={value}
				onChange={(e) => setValue(e.target.value)}
				onBlur={() => {
					setBundle(bundle.id, { name: value });
				}}
			/>
		</div>
	);
}

function CostInput({ bundle }: { bundle: BundleType }) {
	const [value, setValue] = useState(bundle.cost);
	const setBundle = useDataStore((state) => state.setBundle);

	return (
		<div>
			<Label htmlFor={"cost" + bundle.id}>Koszt</Label>
			<div className="flex gap-2 items-center">
				<Input
					value={value}
					onChange={(e) => setValue(+e.target.value)}
					type="number"
					onBlur={() => {
						setBundle(bundle.id, { cost: value });
					}}
					id={"cost" + bundle.id}
				/>
				<h1>zł</h1>
			</div>
		</div>
	);
}

function GroupsInput({ bundle }: { bundle: BundleType }) {
	const groupsBySubject = useGroupsbySubject();

	return (
		<div className="flex flex-col gap-2">
			{groupsBySubject.map((subject) => (
				<div key={subject.name}>
					<h1 className="font-bold">{subject.name}</h1>
					<div className="flex gap-2">
						<div>
							<div className="flex flex-col gap-2">
								{subject.groups.map((group) => (
									<GroupCheckbox key={group.id} group={group} bundle={bundle} />
								))}
							</div>
						</div>
					</div>
				</div>
			))}
		</div>
	);
}

function GroupCheckbox({
	group,
	bundle,
}: { group: Group; bundle: BundleType }) {
	const setBundle = useDataStore((state) => state.setBundle);

	return (
		<div className="flex items-center gap-1">
			<Checkbox
				checked={bundle.groups.some((e) => e == group.id)}
				onCheckedChange={(e) => {
					setBundle(bundle.id, {
						groups: e
							? [...bundle.groups, group.id]
							: bundle.groups.filter((g) => g !== group.id),
					});
				}}
			/>
			<Label>{group.class}</Label>
		</div>
	);
}

function Bundle({ bundle }: { bundle: BundleType }) {
	const deleteBundle = useDataStore((state) => state.deleteBundle);

	return (
		<Card className="w-fit mx-2">
			<CardHeader>
				<NameInput bundle={bundle} />
				<CostInput bundle={bundle} />
			</CardHeader>
			<CardContent className="flex flex-col gap-2">
				<GroupsInput bundle={bundle} />
			</CardContent>
			<CardFooter className="flex">
				<Button variant="destructive" onClick={() => deleteBundle(bundle.id)}>
					Usuń pakiet
				</Button>
			</CardFooter>
		</Card>
	);
}
