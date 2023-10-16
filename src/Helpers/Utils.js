const execa = require("execa");
const fs = require("fs");
const path = require("path");
const fsExtra = require("fs-extra");
const clear = require("clear");
const Config = require("../Helpers/Config.json");
const ora = require("ora");
const cliSpinners = require("cli-spinners");
const chalk = require("chalk");

const routeConfig = path.join(__dirname, "../Helpers/Config.json");
const typeDepartament = {
  front: "base-front-end",
  back: "base-back-end",
};

const typeExtension = {
  front: "front",
  back: "back",
};

const urlRepos = {
  front: Config.repoFront,
  back: Config.repoBack,
};

const updateRepo = async (typeApp) => {
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

const copiarData = (origen, destino) => {
  // Verifica si la carpeta de origen existe
  if (fs.existsSync(origen) && fs.statSync(origen).isDirectory()) {
    // Lee los elementos en la carpeta de origen
    const elementos = fs.readdirSync(origen);

    // Itera sobre los elementos y cópialos a la carpeta de destino
    elementos.forEach((elemento) => {
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

const restarJson = async (route) => {
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
const modifyJson = async (answer, typeProject, base) => {
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
const printFinalMsg = async (name) => {
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
 * Impresión de mensaje final para template React js
 * @param name {string} - Recibe como argumento el nombre del proyecto
 * @param typeApp {string} - Es el tipo del proyecto, si es front o back, este string debe ser "front" o "back"
 */
const createDirectory = async (name, typeApp) => {
  const { stdout } = await execa(
    "mkdir",
    [`${name.toLowerCase()}-${typeExtension[typeApp]}`],
    { cwd: process.cwd() }
  );
  console.log(stdout);
};

const gitInitCommand = async (typeApp) => {
  const spinner = ora({
    text: chalk.yellowBright(
      `Descargando el templates: ${urlRepos[typeApp]}...`
    ),
    spinner: cliSpinners.dots8,
  }).start();
  try {
    const tmpConfig = Config;
    const route = path.join(__dirname, `../ProyectsBase`);
    await fsExtra.removeSync(`${route}/${typeDepartament[typeApp]}`);
    const { stdout } = await execa("git", ["clone", `${urlRepos[typeApp]}`], {
      cwd: route,
    });
    console.log(stdout);
    tmpConfig.isNewFront = false;
    fsExtra.writeFileSync(routeConfig, JSON.stringify(tmpConfig, null, 2));
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
const chargeVersion = (route) => {
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
const chargeItems = (route) => {
  try {
    return fsExtra.readdirSync(route);;
  } catch (error) {
    return [];
  }
};

module.exports = {
  updateRepo,
  copiarData,
  restarJson,
  modifyJson,
  printFinalMsg,
  createDirectory,
  gitInitCommand,
  chargeVersion,
  chargeItems
};
