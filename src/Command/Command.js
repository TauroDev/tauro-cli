const { program } = require("commander");
const { prompt } = require("inquirer");
const { enruting, startRoutes } = require("../Controllers");
const Config = require("../Helpers/Config.json");
const clear = require("clear");

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
  .action(async () => {
    clear();
    const answer = await prompt(ConfigAnswer);
    enruting(answer);
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
    await startRoutes();
  });

program.parse(process.argv);
