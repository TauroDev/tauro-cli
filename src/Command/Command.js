const { program } = require("commander");
const { prompt } = require("inquirer");
const {enruting} = require("../Controllers/EnRuting.ctrl")
const Config = require("../Helpers/Config.json")

const ConfigAnswer = [
  {
    type: "list",
    name: "typeApp",
    message: "Que tipo de aplicación vas a crear?",
    choices: Config.apps,
  },
];

program
  .version("0.0.1")
  .description(
    "Tauro Cli: Administrador de arquitecturas de Front y back basadas en node js y react"
  );

program
  .command("start")
  .alias("s")
  .description("Inicializar proceso de creación de aplicación")
  .action(async () => {
    const answer = await prompt(ConfigAnswer);
    enruting(answer)
  });

program
  .command("version")
  .alias("-v")
  .description("Versión del software Tauro Cli")
  .action(async () => {
    console.log(`Version App:${Config.versionApp}`)
    console.log(`${Config.descriptionApp}`)
  });

program.parse(process.argv);
