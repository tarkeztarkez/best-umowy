"use server";

import { readFileSync } from "fs";
import path from "path";
import { TemplateData, Group } from "./types";

import PizZip from "pizzip";
import Docxtemplater from "docxtemplater";
import axios from "axios";

// import mammoth from "mammoth";
// import html_to_pdf from "html-pdf-node";

export async function fillTemplate(data: TemplateData) {
	let totalCost = 0;

	let allGroups: Group[] = [];

	data.students.forEach((s) =>
		s.groups.forEach((g) => {
			totalCost += g.cost;
			if (
				!allGroups.some(
					(e) =>
						e.class == g.class &&
						g.subject == e.subject &&
						g.schedule == e.schedule,
				)
			)
				allGroups.push(g);
		}),
	);

	const preparedData = {
		date: data.date,
		totalCost: totalCost,
		students: data.students.map((s, sIndex) => {
			return {
				index: `${sIndex + 1}. `,
				name: s.name,
				surname: s.surname,
				courses: s.groups.map((g) => ({
					subject: g.subject,
					amountInWeek: g.amountInWeek,
					length: g.length,
					class: g.class,
				})),
				amountInWeek: s.groups.map((g) => g.amountInWeek * 30),
				cost: s.groups.map((g) => (g.cost == 0 ? "" : `${g.cost}zł`)),
			};
		}),
		schedules: allGroups.map((g) => ({
			class: g.class,
			subject: g.subject,
			schedule: g.schedule,
		})),
	};

	console.log(preparedData);
	let content: Buffer;

	if (process.env.NODE_ENV == "production") {
		const response = await axios.get(
			"https://best-umowy.vercel.app/umowa.docx",
			{
				responseType: "arraybuffer",
			},
		);
		content = Buffer.from(response.data, "utf-8");
	} else {
		const response = await axios.get("http://localhost:3000/umowa.docx", {
			responseType: "arraybuffer",
		});
		content = Buffer.from(response.data, "utf-8");
	}
	const zip = new PizZip(content);
	const doc = new Docxtemplater(zip, {
		linebreaks: true,
	});

	doc.render(preparedData);

	const buf = doc.getZip().generate({
		type: "base64",
		compression: "STORE",
	});

	// combine student names and surnames into one string
	const filename = data.students
		.map((s) => `${s.name} ${s.surname}`)
		.join(", ");

	return { file: buf, filename: filename };
}

// export async function fillTemplateToHTML(data: TemplateData) {
// 	let { file: doc, filename } = await fillTemplate(data);

// 	// doc base64 to file
// 	const buf = Buffer.from(doc, "base64");
// 	const html = await mammoth.convertToHtml({
// 		buffer: buf,
// 	});

// 	// convert pdf.create.tofile to promise
// 	// to base64

// 	return html.value;
// }

// export async function fillTemplateToPDF(data: TemplateData) {
// 	let html = await fillTemplateToHTML(data);

// 	return await html_to_pdf
// 		.generatePdf({ content: html }, { format: "A4" })
// 		// @ts-ignore
// 		.then((e) => e.toString("base64"));
// }
