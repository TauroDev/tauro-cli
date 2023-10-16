const prettier = require("prettier");
const { chargeItems } = require("../../Helpers/Utils");

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

const validateExistFolder = (path) => {
  const items = chargeItems(path);
  const lowerItems = items.map((item) => item.toLocaleLowerCase());
  const existFiles = {
    routesOne: false,
    src: false,
    routesTwo: false,
    intoRoutes: false
  };
  if (lowerItems.includes["routes"]) {
    existFiles[routesOne] = true
  }

  if (!lowerItems.includes["src"]) {
    console.log("ESTRUCTURA DEL PROYECTO NO VALIDA");
    return false;
  }
};

const entryPoint = () => {
  validateExistFolder(process.cwd());
};

module.exports = entryPoint;
