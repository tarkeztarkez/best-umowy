"use server";

import { readFileSync } from "fs";
import { Data, Group } from "./types";

import PizZip from "pizzip";
import Docxtemplater from "docxtemplater";


export async function fillTemplate(data: Data) {
  let totalCost = 0

  let allGroups: Group[] = []


  data.students.forEach(s => s.groups.forEach(g => {
    totalCost += g.cost
    if (!allGroups.some(e => e.class == g.class && g.subject == e.subject && g.schedule == e.schedule)) allGroups.push(g)
  }))



  const preparedData = {
    totalCost: totalCost,
    students: data.students.map((s, sIndex) => {
      return {
        index: `${sIndex + 1}. `,
        name: s.name,
        surname: s.surname,
        courses: s.groups.map(g => ({ subject: g.subject, amountInWeek: g.amountInWeek, length: g.length, class: g.class })),
        amountInWeek: s.groups.map(g => g.amountInWeek * 30),
        cost: s.groups.map(g => g.cost),
      }
    }),
    schedules: allGroups.map(g => ({ class: g.class, subject: g.subject, schedule: g.schedule }))
  }

  console.log(preparedData)



  const content = readFileSync(process.cwd() + "/public/umowa.docx")
  const zip = new PizZip(content);
  const doc = new Docxtemplater(zip, {
    linebreaks: true,
  });

  doc.render(preparedData)

  const buf = doc.getZip().generate({
    type: "base64",
    compression: "STORE"
  })

  return buf
}