import path from "path";
import fs from "fs";
import { Config } from "../Configurations";
import fsExtra from 'fs-extra';

const getExtendedExtname = (filePath: string): string => {
  // Extraer el nombre del archivo de la ruta completa
  const filename = path.basename(filePath);

  // Buscar la extensión a partir de dos posiciones antes del punto
  const match = filename.match(/.{2}\.\w+$/);

  return match ? match[0] : "";
};

const deleteFilesFromDir = (
  startPath: string,
  fileExtensionArray: string[],
  ignorePaths: string[] = []
) => {
  if (!fs.existsSync(startPath)) {
    console.log("No existe el directorio:", startPath);
    return;
  }

  const files = fs.readdirSync(startPath);

  for (let i = 0; i < files.length; i++) {
    const filename = path.join(startPath, files[i]);

    // Ignorar si la ruta está en la lista de rutas ignoradas
    if (ignorePaths.includes(filename)) {
      console.log(`Ignorado: ${filename}`);
      continue;
    }

    const stat = fs.lstatSync(filename);

    if (stat.isDirectory()) {
      deleteFilesFromDir(filename, fileExtensionArray, ignorePaths);
    } else if (fileExtensionArray.indexOf(path.extname(filename)) !== -1) {
      fs.unlinkSync(filename);
      console.log(`Eliminado: ${filename}`);
    } else if (
      fileExtensionArray.indexOf(getExtendedExtname(filename)) !== -1
    ) {
      fs.unlinkSync(filename);
      console.log(`Eliminado: ${filename}`);
    }
  }
};

const pathsToIgnore = [
  path.join(__dirname, "../../node_modules"),
  path.join(__dirname, "../../.git"),
  path.join(__dirname, "../../Templates/base-front-end"),
  path.join(__dirname, "../../Templates/base-back-end"),
];

deleteFilesFromDir(
  path.join(__dirname, "../../"),
  [".js", ".d.ts"],
  pathsToIgnore
);

const routeConfig = path.join(__dirname, '../Configurations/params.config.json')
const pathProject = path.join(__dirname, '../../Templates')

const tmpConfig = Config
tmpConfig.isNewFront = true
tmpConfig.isNewBack = true
tmpConfig.isProd = true

fsExtra.writeFileSync(routeConfig, JSON.stringify(tmpConfig, null, 2));
fsExtra.removeSync(`${pathProject}/base-front-end`)
fsExtra.removeSync(`${pathProject}/base-back-end`)