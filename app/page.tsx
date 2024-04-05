import Link from "next/link";
import FillTemplateButton from "./FillTemplateButton";
import GroupList from "./groups/GroupList";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import StudentList from "./StudentList";

export default function Home() {
	return (
		<main className="">
			<Card className="rounded-none rounded-br-md w-fit flex">
				<Link href={"/groups"}>
					<Button variant={"link"}>Ustawienia grup</Button>
				</Link>
				<Link href={"/discounts"}>
					<Button variant={"link"}>Ustawienia zniżek</Button>
				</Link>
			</Card>
			<div className="mt-2 ml-2 flex flex-col gap-2">
				<StudentList />
				<FillTemplateButton />
			</div>
		</main>
	);
}
