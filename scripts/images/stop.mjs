import fs from "node:fs";
import { fromRoot, parseArgs } from "./lib.mjs";

const args = parseArgs();
const target = fromRoot("data/image-automation/STOP");
if (args["--clear"]) {
  if (fs.existsSync(target)) fs.unlinkSync(target);
  console.log("Parada segura removida. A automação poderá ser retomada explicitamente.");
} else {
  fs.writeFileSync(target, `Parada segura solicitada em ${new Date().toISOString()}\n`, "utf8");
  console.log("Parada segura solicitada. O runner terminará após o item atual.");
}
