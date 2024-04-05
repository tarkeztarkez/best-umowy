import { Group } from "lucide-react";
import React from "react";
import GroupList from "./GroupList";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

function page() {
	return (
		<div className="">
			<Card className="rounded-none rounded-br-md w-fit">
				<Link href={"/"}>
					<Button variant={"link"}>Wróć</Button>
				</Link>
				<Link href={"/groups/bundles"}>
					<Button variant={"link"}>Ustawienia pakietów</Button>
				</Link>
			</Card>
			<div className="mt-2 ml-2">
				<GroupList />
			</div>
		</div>
	);
}

export default page;
