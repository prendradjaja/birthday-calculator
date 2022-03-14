import { readFileSync } from "fs";

import { DateTime } from "luxon";

import { hello } from "./hello";

function main() {
  const examples = parseTsv(readFileSync("./examples.txt", "utf-8"), [
    "name",
    "bdayString",
  ]);

  const milestones = parseTsv(
    `

{"days": 10000}	10K days (~27 years)
{"days": 16384}	2^14 days (~45 years)

{"seconds": 1e9}	1B seconds (~32 years)
{"seconds": 1073741824}	2^30 seconds (~34 years)

`,
    ["plusObjString", "description"]
  );

  for (let example of examples) {
    console.log("\n\n" + example.name);
    const bday = DateTime.fromISO(example.bdayString);

    for (let milestone of milestones) {
      if (milestone.plusObjString) {
        const plusObj = JSON.parse(milestone.plusObjString);
        const description = milestone.description ?? milestone.plusObjString;
        const formattedDate = bday.plus(plusObj).toISODate();
        console.log(`- ${formattedDate} ${description}`);
      } else {
        console.log();
      }
    }
  }
}

function parseTsv(text: string, fieldNames: string[]) {
  const result: any = [];
  text
    .trim()
    .split("\n")
    .map((line) => line.split("\t"))
    .forEach((line) => {
      const fields = line;
      const record: any = {};
      fields.forEach((value, i) => {
        const fieldName = fieldNames[i];
        record[fieldName] = value;
      });
      result.push(record);
    });
  return result;
}

main();
