"use client";

import { Button } from "@/components/ui/button";
import { DataStore, useDataStore } from "@/lib/state";
import {
	fillTemplate,
	// fillTemplateToHTML,
	// fillTemplateToPDF,
} from "@/lib/templating";
import { TemplateData } from "@/lib/types";
import { Loader2 } from "lucide-react";
import { useState } from "react";

let PizZipUtils = null;
if (typeof window !== "undefined") {
	import("pizzip/utils/index.js").then(function (r) {
		PizZipUtils = r;
	});
}

function base64ToUnit8Array(input: string) {
	const byteCharacters = atob(input);
	const byteNumbers = new Array(byteCharacters.length);
	for (let i = 0; i < byteCharacters.length; i++) {
		byteNumbers[i] = byteCharacters.charCodeAt(i);
	}
	const byteArray = new Uint8Array(byteNumbers);

	return byteArray;
}

function prepareData(data: DataStore) {
	return {
		students: data.students.map((s) => {
			if (s.bundle) {
				const bundle = data.bundles.find((e) => e.id == s.bundle)!;
				let groups = s.groups.map((g) => {
					const group = data.groups.find((e) => e.id == g.id)!;
					return {
						...group,
						cost: group.cost,
					};
				});

				groups = groups.map((g) => {
					g.cost = 0;
					return g;
				});

				groups[0].cost = bundle.cost;

				return {
					...s,
					groups,
				};
			} else {
				return {
					...s,
					groups: s.groups.map((g) => {
						const group = data.groups.find((e) => e.id == g.id)!;
						return {
							...group,
							cost: group.cost - g.discount,
						};
					}),
				};
			}
		}),
		discounts: data.discounts,
		date: data.date,
	} satisfies TemplateData;
}

export default function FillTemplateButton() {
	const [loading, setLoading] = useState(false);

	function download(reportName: string, byte: Uint8Array) {
		var blob = new Blob([byte], {
			type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
		});
		var link = document.createElement("a");
		link.href = window.URL.createObjectURL(blob);
		var fileName = reportName;
		link.download = fileName;
		link.click();
		setLoading(false);
	}

	return (
		<div className="flex items-center gap-2">
			<Button
				className="w-40"
				onClick={() => {
					setLoading(true);
					fillTemplate(prepareData(useDataStore.getState())).then((e) =>
						download(e.filename, base64ToUnit8Array(e.file)),
					);
				}}
				disabled={loading}
			>
				{loading ? <Loader2 className="animate-spin" /> : "Wygeneruj umowę"}
			</Button>
			{/* <Button
				variant={"outline"}
				onClick={async () => {
					const printable = await fillTemplateToPDF(
						prepareData(useDataStore.getState()),
					);
					console.log(printable);
					printJS({
						printable: printable,
						type: "pdf",
						base64: true,
					});
				}}
			>
				Wydrukuj umowe
			</Button> */}
		</div>
	);
}
