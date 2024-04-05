import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import React from "react";
import DiscountList from "./DiscountList";

function page() {
	return (
		<div className="">
			<Card className="rounded-none rounded-br-md w-fit">
				<Link href={"/"}>
					<Button variant={"link"}>Wróć</Button>
				</Link>
			</Card>
			<div className="mt-2 ml-2">
				<DiscountList />
			</div>
		</div>
	);
}

export default page;
