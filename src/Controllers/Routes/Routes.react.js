const prettier = require("prettier");
const { chargeItems, capitalizarString } = require("../../Helpers/Utils");
const Path = require("path")
const fs = require("fs");

const newRouteAdd = async (pathRoute, routeAdd) => {
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

  fs.writeFile(pathRoute, formattedCode, "utf8", (err) => {
    if (err) {
      console.error(err);
      return;
    }
    console.log("Ruta generada exitosamente.");
  });
};

const validatePath = (pathBase, validateFolder) => {
  if (fs.existsSync(Path.join(pathBase, validateFolder.toLowerCase()))) {
    return Path.join(pathBase, validateFolder.toLowerCase())
  }
  return false;
}

const validateExistFolderRoutes = (path, typeAccess) => {
  const existRoutes = validatePath(path, `src/routes/${typeAccess}`)
  if(!existRoutes) {
    console.log('ESTRUCTURA DE PROYECTO NO VALIDA')
    return false
  }
  return existRoutes
};

const entryPoint = () => {
  const isValidPath = validateExistFolderRoutes(process.cwd(), "private");
  console.log(isValidPath)
};

module.exports = entryPoint;
