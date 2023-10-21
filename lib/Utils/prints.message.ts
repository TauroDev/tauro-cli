import chalk from "chalk";
import clear from "clear";
import path from "path";

/**
 * Impresión de mensaje final para template React js
 * @param name {string} - Recibe como argumento el nombre del proyecto
 */
export const printFinalMsg = (name: string) => {
  clear();
  console.log("");
  console.log(
    `Scaffolding project in ${path.join(process.cwd(), name + "-front...")}`
  );
  console.log("");
  console.log("Done. Now run:")
  console.log("")
  console.log(`     cd ${name}-front`);
  console.log("     npm install");
  console.log("     dev: npm run dev");
  console.log("     prod: npm run prod");
  console.log("     build: npm run build");
  console.log("");
  console.log(`documentation for the use of the template in: ${chalk.red("https://cli.taurodev.com/front#config")}`);
  console.log("Powered by Tauro Dev - Software factory");
};
