import chalk from "chalk";
import execa from "execa";
import fs from "fs";
import path from 'path';
import fsExtra from "fs-extra";
import clear from "clear";
import Config from "../Helpers/Config.json";
import ora from "ora";
import cliSpinners from "cli-spinners";
import { GetAdminPermissions } from "../lib/Permissions/mac.permissions";

const routeConfig = path.join(__dirname, "../Helpers/Config.json");

const typeDepartament: any = {
  front: "base-front-end",
  back: "base-back-end",
};

const typeExtension: any = {
  front: "front",
  back: "back",
};

const urlRepos: any = {
  front: Config.repoFront,
  back: Config.repoBack,
};

const updateRepo = async (typeApp: string) => {
  const route = path.join(
    __dirname,
    `../ProyectsBase/${typeDepartament[typeApp]}`
  );
  const spinner = ora({
    text: chalk.yellowBright(`Actualizando templates...`),
    spinner: cliSpinners.dots8,
  }).start();
  try {
    await execa("git", ["reset", "--hard"], { cwd: route });
    const { stdout } = await execa(
      "git",
      ["pull", "origin", "main", "--rebase"],
      { cwd: route }
    );
    console.log(stdout);
    spinner.succeed(chalk.green("Templates actualizados correctamente"));
  } catch (error) {
    spinner.fail(chalk.red(`Error al actualizar los templates :(`));
  }
};

const copiarData = (origen: string, destino: string) => {
  // Verifica si la carpeta de origen existe
  if (fs.existsSync(origen) && fs.statSync(origen).isDirectory()) {
    // Lee los elementos en la carpeta de origen
    const elementos = fs.readdirSync(origen);

    // Itera sobre los elementos y cópialos a la carpeta de destino
    elementos.forEach((elemento: any) => {
      const origenPath = path.join(origen, elemento);
      const destinoPath = path.join(destino, elemento);

      // Si es un archivo, cópialo
      if (fs.statSync(origenPath).isFile()) {
        fs.copyFileSync(origenPath, destinoPath);
      }

      // Si es una carpeta, crea la carpeta de destino si no existe y luego copia su contenido
      if (fs.statSync(origenPath).isDirectory()) {
        if (!fs.existsSync(destinoPath)) {
          fs.mkdirSync(destinoPath);
        }
        copiarData(origenPath, destinoPath); // Llamada recursiva para copiar subcarpetas
      }
    });
  } else {
    console.error("La carpeta de origen no existe o no es una carpeta.");
  }
};

const restarJson = async (route: string) => {
  const dataPackage = require(route);
  dataPackage.name = "name-here";
  fsExtra.writeFileSync(route, JSON.stringify(dataPackage, null, 2));
};

/**
 * Actualización del nombre del package json
 * @param answer {object} - Debe recibir dos valores {versionApp: "(versión del template)", nameApp: "(Nombre del proyecto"}
 * @param typeProject  {string} - Es el tipo del proyecto, si es front o back, este string debe ser "front" o "back"
 * @param base  {string} - La base del proyecto es el tipo de framework que seleccionó el usuario
 */
const modifyJson = async (answer: any, typeProject: string, base: string) => {
  await GetAdminPermissions()
  const route = path.join(
    __dirname,
    `../ProyectsBase/${typeDepartament[typeProject]}/${base}`
  );
  const pathProject = path.join(route, answer.versionApp);
  const pathPackage = path.join(route, `${answer.versionApp}/package.json`);
  const dataPackage = require(pathPackage);
  dataPackage.name = answer.nameApp.toLowerCase();
  fsExtra.writeFileSync(pathPackage, JSON.stringify(dataPackage, null, 2));
  return { pathProject, pathPackage };
};

/**
 * Impresión de mensaje final para template React js
 * @param name {string} - Recibe como argumento el nombre del proyecto
 */
const printFinalMsg = (name: string) => {
  clear();
  console.log("");
  console.log("Instrucciones de uso:");
  console.log("");
  console.log(`cd ${name}-front`);
  console.log(`Configurar las apis en ${name}-front/src/Constant/Params.json`);
  console.log("npm install o npm i");
  console.log("para desarrollo: npm run dev");
  console.log("para producción: npm run prod");
  console.log("para el compilado: npm run build");
  console.log("");
  console.log("Powered by Tauro Dev - Software factory");
};

/**
 * Creación de carpeta contenedora de proyecto
 * @param name {string} - Recibe como argumento el nombre del proyecto
 * @param typeApp {string} - Es el tipo del proyecto, si es front o back, este string debe ser "front" o "back"
 */
const createDirectory = async (name: string, typeApp: string) => {
  const { stdout } = await execa(
    "mkdir",
    [`${name.toLowerCase()}-${typeExtension[typeApp]}`],
    { cwd: process.cwd() }
  );
  console.log(stdout);
};

/**
 * Función para crear carpetas según un path especifico
 * @param path {string} - Es la ruta donde se va a crear la carpeta
 * @param name {string} - Recibe como argumento el nombre de la carpeta
 */
const writeDir = async (path: string, name: string, typeApp: string) => {
  try {
    await execa("mkdir", [`${name.toLowerCase()}-${typeExtension[typeApp]}`], {
      cwd: process.cwd(),
    });
  } catch (error) {
    console.error(`ERROR AL CREAR LA CARPPETA EN LA RUTA: ${path}`);
  }
};

export const executeExecaSync = async (initialCommand: string, args: string[], path: string = "") => {
  const config = path.length > 0 ? { cwd: path } : {};
  try {
    const proceso: any = execa(initialCommand, args, config);
    proceso.stdout.on("data", (data: any) => {
      console.log(data.toString());
    });
    return new Promise<void>((resolve, reject) => {
      proceso.on("close", (code: number) => {
        console.log("El proceso ha terminado con código de salida:", code);
        resolve();
      });

      proceso.on("error", (error: Error) => {
        console.error("Error al ejecutar el proceso:", error);
        reject(error);
      });
    });
  } catch (error) {
    console.error("Error:", error);
  }
};

const initMacOs = async (typeApp: string, route: string) => {
  try {
    const tmpConfig = Config;
    await executeExecaSync("rm", [
      "-r",
      `${route}/${typeDepartament[typeApp]}`,
    ]);
    await executeExecaSync(
      "sudo",
      ["git", "clone", `${urlRepos[typeApp]}`],
      route
    );
    tmpConfig.isNewFront = false;
    fsExtra.writeFileSync(routeConfig, JSON.stringify(tmpConfig, null, 2));
  } catch (error) {
    console.error(
      `ERROR AL EJECUTAR EL COMANDO: 'sudo git clone ${urlRepos[typeApp]}'`
    );
  }
};

const initWindows = async (typeApp: string, route: string) => {
  const tmpConfig = Config;
  await fsExtra.removeSync(`${route}/${typeDepartament[typeApp]}`);
  await executeExecaSync("git", ["clone", `${urlRepos[typeApp]}`], route);
  tmpConfig.isNewFront = false;
  fsExtra.writeFileSync(routeConfig, JSON.stringify(tmpConfig, null, 2));
};

const gitInitCommand = async (typeApp: string) => {
  const spinner = ora({
    text: chalk.yellowBright(
      `Descargando el templates: ${urlRepos[typeApp]}...`
    ),
    spinner: cliSpinners.dots8,
  }).start();
  const route = path.join(__dirname, `../ProyectsBase`);
  try {
    if (process.platform === "darwin") {
      await initMacOs(typeApp, route);
    } else {
      await initWindows(typeApp, route);
    }
    spinner.succeed(chalk.green("Templates descargados correctamente"));
  } catch (error) {
    spinner.fail(
      chalk.red(`Error al descargar los templates: ${urlRepos[typeApp]} :(`)
    );
  }
};

/**
 * Leer las versiones de los templates
 * @param route {string} - Ruta del template a leer
 * @returns {string[]} Un array con las versiones, por ejemplo: ['v1', 'v2', 'v3', 'v4']
 */
const chargeVersion = (route: string) => {
  try {
    const versionsApp = fsExtra
      .readdirSync(route)
      .filter(
        (elemento: string) =>
          elemento !== ".DS_Store" &&
          elemento !== "README.md" &&
          elemento !== ".git" &&
          elemento !== ".gitignore"
      );
    return versionsApp;
  } catch (error) {
    return [];
  }
};

/**
 * Leer los archivos de una carpeta
 * @param route {string} - Ruta del folder a leer
 * @returns {string[]} Un array con las versiones, por ejemplo: ['src', 'index.js'...]
 */
const chargeItems = (route: string) => {
  try {
    return fsExtra.readdirSync(route);
  } catch (error) {
    return [];
  }
};

/**
 * Capitalizar un string
 * @param route {string} - Palabra a capitalizar
 */
const capitalizarString = (string: string) => {
  if (string.length === 0) {
    return string;
  }
  return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
};

export {
  updateRepo,
  copiarData,
  restarJson,
  modifyJson,
  printFinalMsg,
  createDirectory,
  gitInitCommand,
  chargeVersion,
  chargeItems,
  capitalizarString,
  writeDir,
};
