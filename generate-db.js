import { writeFileSync } from "node:fs";
import { TerminaldataFull } from "./src/Apis/Terminaldata.js";

writeFileSync(
  "db.json",
  JSON.stringify({ devices: TerminaldataFull }, null, 2)
);

console.log(`Wrote ${TerminaldataFull.length} devices to db.json`);