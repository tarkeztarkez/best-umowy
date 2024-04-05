"use client";

import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useDataStore } from "@/lib/state";
import React from "react";

function DiscountList() {
	const discounts = useDataStore((state) => state.discounts);
	const newDiscount = useDataStore((state) => state.newDiscount);

	return (
		<div>
			<div className="mb-2 flex gap-2 items-center">
				<h1 className="text-2xl">Zniżki</h1>
				<Button onClick={() => newDiscount()}>Dodaj grupę</Button>
			</div>
			<div className="flex gap-2">
				{discounts.map((discount, index) => (
					<div key={index} className="">
						<Discount index={index} discount={discount} />
					</div>
				))}
			</div>
		</div>
	);
}

export default DiscountList;

function Discount({ index, discount }: { index: number; discount: number }) {
	const setDiscount = useDataStore((state) => state.setDiscount);
	const deleteDiscount = useDataStore((state) => state.deleteDiscount);
	return (
		<Card>
			<CardHeader>Zniżka {index + 1}.</CardHeader>
			<CardContent className="flex gap-4 items-center">
				<Input
					value={discount}
					onChange={(e) => setDiscount(index, parseInt(e.target.value))}
					type="number"
				/>
				<h1>zł</h1>
			</CardContent>
			<CardFooter>
				<Button variant="destructive" onClick={() => deleteDiscount(index)}>
					Usuń zniżkę
				</Button>
			</CardFooter>
		</Card>
	);
}
