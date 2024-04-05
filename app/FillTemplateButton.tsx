"use client";

import { Button } from "@/components/ui/button";
import { DataStore, useDataStore } from "@/lib/state";
import { fillTemplate } from "@/lib/templating";
import { TemplateData } from "@/lib/types";

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
		students: data.students.map((s) => ({
			...s,
			groups: s.groups.map((g) => {
				const group = data.groups.find((e) => e.id == g.id)!;
				return {
					...group,
					cost: group.cost - g.discount,
				};
			}),
		})),
		discounts: data.discounts,
	} satisfies TemplateData;
}

export default function FillTemplateButton() {
	function download(reportName: string, byte: Uint8Array) {
		var blob = new Blob([byte], {
			type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
		});
		var link = document.createElement("a");
		link.href = window.URL.createObjectURL(blob);
		var fileName = reportName;
		link.download = fileName;
		link.click();
	}

	return (
		<Button
			className="w-fit"
			onClick={() =>
				fillTemplate(prepareData(useDataStore.getState())).then((e) =>
					download(e.filename, base64ToUnit8Array(e.file)),
				)
			}
		>
			Wygeneruj umowę
		</Button>
	);
}
