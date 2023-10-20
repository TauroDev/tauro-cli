//imports files
import clear from "clear";
import path from "path";
import inquirer from "inquirer";
import Config from "../../Helpers/Config.json";

const { prompt } = inquirer;

const {
  updateRepo,
  copiarData,
  restarJson,
  modifyJson,
  printFinalMsg,
  createDirectory,
  gitInitCommand,
  chargeVersion,
} = require("../../Helpers/Utils");

//Config file
const typeApp = "front";
const baseApp = "react";

//path templates base
const routeFramework = path.join(
  __dirname,
  `../../ProyectsBase/base-front-end/${baseApp}/`
);

//functions access
const generatedVersions = async () => {
  try {
    const versionsApp = chargeVersion(routeFramework);
    const Flows = [
      {
        type: "list",
        name: "versionApp",
        message: "Qué tipo de versión desea usar?",
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
    const routes = await modifyJson(answer, typeApp, baseApp);
    return { data: answer, ...routes };
  } catch (error) {
    console.error("Comunicación no disponible");
    console.error(
      `ERROR TYPE PROCESS CAPTURE INFO FLOW ${typeApp.toUpperCase()}: ${error}`
    );
  }
};

export const ReactCtrl = async () => {
  try {
    if (Config.isNewFront) {
      await gitInitCommand(typeApp);
    }
    await updateRepo(typeApp);
    clear();
    const { pathProject, data, pathPackage } = await generatedVersions();
    await createDirectory(data.nameApp, typeApp);
    const routeFinal = path.join(
      process.cwd(),
      `${data.nameApp.toLowerCase()}-${typeApp}`
    );
    console.log(pathProject)
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
