import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import React from "react";
import BundlesList from "./BundlesList";

function page() {
	return (
		<div className="">
			<Card className="rounded-none rounded-br-md w-fit">
				<Link href={"/groups"}>
					<Button variant={"link"}>Wróc do ustawień grup</Button>
				</Link>
				<Link href={"/"}>
					<Button variant={"link"}>Wróć do generatora</Button>
				</Link>
			</Card>
			<div className="mt-2 ml-2">
				<BundlesList />
			</div>
		</div>
	);
}

export default page;
