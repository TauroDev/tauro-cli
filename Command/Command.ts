import { program } from "commander";
import inquirer from "inquirer";
import { InitAddRoute, InitProject } from "../Controllers";
import Config from "../Helpers/Config.json";
import clear from "clear";

const { prompt } = inquirer

const ConfigAnswer = [
  {
    type: "list",
    name: "typeApp",
    message: "Qué tipo de aplicación vas a crear?",
    choices: Config.apps,
  },
];

program
  .version(
    `Version App: ${Config.versionApp}`,
    "-v, --version",
    Config.descriptionApp
  )
  .description(
    "Tauro Cli: Administrador de arquitecturas de Front y back basadas en node js y react"
  );

program
  .command("start")
  .alias("s")
  .description("Inicializar proceso de creación de aplicación")
  .option('-f, --front <path>', 'Expeficicar framework de front')
  .option('-b, --back <path>', 'Expeficicar framework de back')
  .action(async (options) => {
    // // clear();;
    // const answer = await prompt(ConfigAnswer);
    // InitProject(answer);
    console.log(options)
  });

program
  .command("version")
  .alias("v")
  .description(
    "Tauro Cli: Administrador de arquitecturas de Front y back basadas en node js y react"
  )
  .action(async () => {
    console.log(`Version App: ${Config.versionApp}`);
  });

program
  .command("route")
  .alias("r")
  .description("Agregar nueva ruta al proyecto")
  .action(async () => {
    await InitAddRoute();
  });

program.parse(process.argv);

// comando para permisos chmod -R 777 .