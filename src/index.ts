import { readFileSync } from "fs";

import { DateTime } from "luxon";

function main() {
  if (process.argv.length < 3) {
    console.log("Path to birthdays file required. Try using examples.txt");
    return;
  }
  const birthdays = parseTsv(readFileSync(process.argv[2], "utf-8"), [
    "person",
    "dateString",
  ]);

  // Sidereal year in Earth days according to Wikipedia (what's a sidereal year?).
  // Three sigfigs is enough to calculate precisely (to the day) within a human lifetime.
  const MARS_YEAR = 686.98;

  const milestones = parseTsv(
    `
      {}	Born
      {"months": 100}	100  months (~8 years)
      {"days": ${MARS_YEAR * 10}}	10   Martian years (~19 years)
      {"weeks": 1000}	1K   weeks (~19 years)
      {"weeks": 1024}	2^10 weeks (~20 years)
      {"days": 10000}	10K  days (1K tendays) (~27 years)
      {"days": 11111}	11111 days (~30 years)
      {"days": 11235}	11235 days (~31 years)
      {"seconds": 1e9}	1B   seconds (~32 years)
      {"days": 12345}	12345 days (~34 years)
      {"days": ${MARS_YEAR * 18}}	18   Martian years (~34 years)
      {"seconds": 1073741824}	2^30 seconds (~34 years)
      {"weeks": 2000}	1K   fortnights (~38 years)
      {"weeks": 2048}	2^10 fortnights (~39 years)
      {"days": ${MARS_YEAR * 21}}	21   Martian years (~40 years)
      {"days": 16384}	2^14 days (~45 years)
    `,
    ["durationString", "description"]
  );

  for (let [i, birthday] of birthdays.entries()) {
    console.log(birthday.person);
    const bday = DateTime.fromISO(birthday.dateString);

    for (let milestone of milestones) {
      if (milestone.durationString) {
        const plusObj = JSON.parse(milestone.durationString);
        const description = milestone.description ?? milestone.durationString;
        const formattedDate = bday.plus(plusObj).toISODate();
        console.log(`* ${formattedDate}   ${description}`);
      } else {
        console.log();
      }
    }
    if (i !== birthdays.length - 1) {
      console.log("\n");
    }
  }
}

function parseTsv(text: string, fieldNames: string[]) {
  // TODO Do this FP style
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
        record[fieldName] = value.trim();
      });
      result.push(record);
    });
  return result;
}

main();
