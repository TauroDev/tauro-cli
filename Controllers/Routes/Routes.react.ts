const prettier = require("prettier");
const {} = require("../../Helpers/Utils");
const Path = require("path");
const fs = require("fs");

const newRouteAdd = async (pathRoute: string, routeAdd: string) => {
  const contentFile = fs.readFileSync(pathRoute, "utf8");
  const position = contentFile.lastIndexOf("</Routes>");
  if (position === -1) {
    console.error("No se pudo encontrar la posición para insertar la ruta.");
    return;
  }
  const newFileContent =
    contentFile.slice(0, position) + routeAdd + contentFile.slice(position);
  const formattedCode = await prettier.format(newFileContent, {
    parser: "babel",
  });
  fs.writeFile(pathRoute, formattedCode, "utf8", (err: Error) => {
    if (err) {
      console.error(err);
      return;
    }
    console.log("Ruta generada exitosamente.");
  });
};

const validatePath = (pathBase: string, validateFolder: string) => {
  if (fs.existsSync(Path.join(pathBase, validateFolder.toLowerCase()))) {
    return Path.join(pathBase, validateFolder.toLowerCase());
  }
  return false;
};

const validateExistFolderRoutes = (path: string, typeAccess: string) => {
  const existRoutes = validatePath(path, `src/routes/${typeAccess}`);
  if (!existRoutes) {
    console.log("ESTRUCTURA DE PROYECTO NO VALIDA");
    return false;
  }
  return existRoutes;
};

const Flows = [];

const flowSingleRoute = () => {};

const flowModuleRoutes = () => {};

export const EntryReact = () => {
  const isValidPath = validateExistFolderRoutes(process.cwd(), "private");
  if (!isValidPath) return;
};

