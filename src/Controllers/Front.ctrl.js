const clear = require("clear");
const fsExtra = require("fs-extra");
const path = require("path");
const { prompt } = require("inquirer");
const {
  updateRepo,
  copiarData,
  restarJson,
  modifyJson,
  printFinalMsg,
  createDirectory,
  gitInitCommand,
} = require("../Helpers/Utils");
const Config = require("../Helpers/Config.json");

const typeApp = "front";

const route = path.join(__dirname, "../ProyectsBase/base-front-end");

const actionFlows = async () => {
  try {
    const versionsApp = fsExtra
      .readdirSync(route)
      .filter(
        (elemento) =>
          elemento !== ".DS_Store" &&
          elemento !== "README.md" &&
          elemento !== ".git" &&
          elemento !== ".gitignore"
      );

    const Flows = [
      {
        type: "list",
        name: "versionApp",
        message: "Que tipo de versión desea usar?",
        choices: versionsApp,
      },
      {
        type: "input",
        name: "nameApp",
        message: "Ingrese nombre del proyecto",
        default: "tauro-app",
      },
    ];
    const answer = await prompt(Flows);
    const routes = await modifyJson(answer, typeApp);
    return { data: answer, ...routes };
  } catch (error) {
    console.error("Comunicación no disponible");
    console.error(
      `ERROR TYPE PROCESS CAPTURE INFO FLOW ${typeApp.toUpperCase()}: ${error}`
    );
  }
};

const startFront = async () => {
  try {
    if (Config.isNewFront) {
      await gitInitCommand(typeApp);
    }
    await updateRepo(route);
    clear();
    const { pathProject, data, pathPackage } = await actionFlows();
    await createDirectory(data.nameApp, typeApp);
    const routeFinal = path.join(
      process.cwd(),
      `${data.nameApp.toLowerCase()}-${typeApp}`
    );
    copiarData(pathProject, routeFinal);
    await restarJson(pathPackage);
    printFinalMsg(`${data.nameApp.toLowerCase()}`);
  } catch (error) {
    console.error("Comunicación no disponible");
    console.error(
      `ERROR TYPE PROCESS START FLOW ${typeApp.toUpperCase()}: ${error}`
    );
  }
};

module.exports = { startFront };
