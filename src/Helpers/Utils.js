const execa = require("execa");
const fs = require("fs");
const path = require("path");
const fsExtra = require("fs-extra");
const clear = require("clear");
const Config = require("../Helpers/Config.json");

const routeConfig = path.join(__dirname, "../Helpers/Config.json");

const updateRepo = async (path) => {
  const { stdout } = await execa(
    "git",
    ["pull", "origin", "main", "--rebase"],
    { cwd: path }
  );
  console.log(stdout);
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

const typeDepartament = {
  front: "base-front-end",
  back: "base-back-end",
};

const typeExtension = {
  front: "front",
  back: "back",
};

/**
 * Actualización del nombre del package json
 * @param answer {object} - Debe recibir dos valores {versionApp: "(versión del template)", nameApp: "(Nombre del proyecto"}
 * @param typeProject  {string} - Es el tipo del proyecto, si es front o back, este string debe ser "front" o "back"
 */
const modifyJson = async (answer, typeProject) => {
  const route = path.join(
    __dirname,
    `../ProyectsBase/${typeDepartament[typeProject]}`
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

const gitInitCommand = async () => {
  const tmpConfig = Config;
  const route = path.join(__dirname, `../ProyectsBase`);
  const { stdout } = await execa("git", ["clone", `${Config.repoFront}`], {
    cwd: route,
  });
  console.log(stdout);
  tmpConfig.isNewFront = false;
  fsExtra.writeFileSync(routeConfig, JSON.stringify(tmpConfig, null, 2));
};

module.exports = {
  updateRepo,
  copiarData,
  restarJson,
  modifyJson,
  printFinalMsg,
  createDirectory,
  gitInitCommand,
};
