"use client";

import { Button } from "@/components/ui/button";
import { fillTemplate } from "@/lib/templating";
import { Data } from "@/lib/types";



const sampleData: Data = {
  students: [
    {
      name: "Jan",
      surname: "Kowalski",
      groups: [
        {
          amountInWeek: 2,
          class: "IVB",
          cost: 150,
          length: 60,
          subject: "J. Angielski",
          schedule: "Wtorek: 17.20-18.05\nCzwartek: 17.30-18.15"
        },
        {
          amountInWeek: 2,
          class: "IVB",
          cost: 150,
          length: 60,
          subject: "J. Angielski",
          schedule: "Wtorek: 17.20-18.05\nCzwartek: 17.30-18.15"

        }
      ]
    },
    {
      name: "Jan",
      surname: "Kowalski",
      groups: [
        {
          amountInWeek: 2,
          class: "IVB",
          cost: 150,
          length: 60,
          subject: "J. Angielski",
          schedule: "Wtorek: 17.20-18.05\nCzwartek: 17.30-18.15"
        }
      ]
    }
  ]
}

function base64ToUnit8Array(input: string) {
  const byteCharacters = atob(input);
  const byteNumbers = new Array(byteCharacters.length);
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  const byteArray = new Uint8Array(byteNumbers);

  return byteArray
}

export default function FillTemplateButton() {

  function download(reportName: string, byte: Uint8Array) {
    var blob = new Blob([byte], { type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document" });
    var link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    var fileName = reportName;
    link.download = fileName;
    link.click();
  }


  return <Button onClick={() => fillTemplate(sampleData).then(e => download("output.docx", base64ToUnit8Array(e)))}>Wygenruj umowę

  </Button>
}