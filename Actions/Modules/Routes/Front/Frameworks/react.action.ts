import { AbstractAction } from "../../../..";
import { InputCommand } from "../../../../../Command";
import fs from "fs";
import prettier from "prettier";
import Path from "path";
import inquirer from "inquirer";
import {
  GenericPage,
  GenericPageStyle,
  GenericPageViewModel,
  capitalizarString,
  convertToCamelCase,
  normalizeString,
} from "../../../../../lib/Utils";
import { DirectoryRunner } from "../../../../../lib/Runners";
import clear from "clear";
import { ERROR_PREFIX } from "../../../../../lib/Ui";
import chalk from "chalk";
import path from "path";
import { Config } from "../../../../../lib/Configurations";

export class ReactAction extends AbstractAction {
  private selected = inquirer.prompt;
  private dir: DirectoryRunner = new DirectoryRunner();
  private flows = [
    {
      type: "list",
      name: "typeRoute",
      message: "¿Que tipo de ruta deseas crear?",
      choices: [
        { name: "Pública", value: "public" },
        { name: "Privada", value: "private" },
      ],
    },
    {
      type: "list",
      name: "routeExist",
      message: "¿Deseas crear la ruta fuera del index?",
      choices: ["No", "Si"],
      filter: (val: string) => {
        return val.toLowerCase();
      },
    },
  ];
  private flowAfter = [
    {
      type: "input",
      name: "nameRoute",
      message: "Ingresa nombre de la ruta: ",
      filter: (val: string) => {
        return normalizeString(
          val.trim(),
          true,
          "-",
          "~`!@#$%^&*()_+={}[]|:;'\"<>,.?/"
        );
      },
      validate: (val: string) => {
        if (!val.includes('"')) {
          return true;
        }
        return "El nombre de la ruta no debe contener comillas dobles";
      },
    },
    {
      type: "list",
      name: "routeQuantity",
      message: "¿La ruta va a ser multi ruta o una sola ruta?",
      choices: [
        { name: "Multi ruta", value: "multi" },
        { name: "Una sola ruta", value: "single" },
      ],
    },
    {
      type: "input",
      name: "listNewRoutes",
      message: "Ingresa el nombre de las rutas separadas con una ',': ",
      when: (answer: any) => answer.routeQuantity == "multi",
      filter: function (val: string) {
        const parseVal = val
          .split(",")
          .map((item: string) =>
            normalizeString(
              item.trim(),
              true,
              "-",
              "~`!@#$%^&*()_+={}[]|:;'\"<>.?/"
            )
          );
        return parseVal;
      },
      validate: (val: string[]) => {
        if (!val.some((item: string) => item.includes('"'))) {
          return true;
        }
        return "Ninguna sub ruta debe contener comillas dobles";
      },
    },
    {
      type: "list",
      name: "pageContain",
      message: "¿Va a contener página o solo la ruta?",
      choices: [
        { name: "Contener página", value: "page" },
        { name: "Solo la ruta", value: "rute" },
      ],
    },
  ];
  public async handle(args?: InputCommand): Promise<void> {
    const answers = await this.executeFlows();
    const isValidPath = this.validateExistFolderRoutes(
      process.cwd(),
      answers.typeRoute
    );
    try {
      await this.coreAction({ ...answers, isValidPath });
    } catch (error) {
      this.handleError("Error in the route creation process");
    }
  }

  // another functions
  private async coreAction(config: any): Promise<void> {
    if (config.routeExist == "no") {
      const nameCamelCase = convertToCamelCase(config.nameRoute);
      const isPage =
        config.pageContain == "page"
          ? `<${capitalizarString(nameCamelCase, false)} />`
          : `<h1>Nueva ruta ${capitalizarString(nameCamelCase, false)}</h1>`;
      const filePath = path.join(config.isValidPath, "index.jsx");
      await this.createRoute({
        pathPage: path.join(process.cwd(), "src/pages"),
        name: nameCamelCase,
        upper: capitalizarString(nameCamelCase, false),
        namePage: isPage,
        filePath,
        ...config,
      });
    }
  }

  private async createPage(config: any): Promise<void> {
    // Construir el path de la carpeta typeRoute dentro de pathPage
    const typeRoutePath = path.join(config.pathPage, config.typeRoute);
    this.dir.validateDirectoryAndCreateDirectory(
      config.pathPage,
      config.typeRoute
    );

    // Construir el path de la carpeta upper dentro de typeRoutePath
    const upperPath = path.join(typeRoutePath, config.upper);
    this.dir.validateDirectoryAndCreateDirectory(typeRoutePath, config.upper);

    // Definir los nombres de archivo basados en upper
    const jsxFileName = `${config.upper}.jsx`;
    const cssModuleName = `${config.upper}.style.module.css`;
    const viewModelName = `${config.upper}.viewmodel.jsx`;

    // Crear los archivos con contenido opcional
    fs.writeFileSync(
      path.join(upperPath, jsxFileName),
      (await GenericPage(config.upper)) || "",
      "utf8"
    );
    fs.writeFileSync(
      path.join(upperPath, cssModuleName),
      (await GenericPageStyle()) || "",
      "utf8"
    );
    fs.writeFileSync(
      path.join(upperPath, viewModelName),
      (await GenericPageViewModel(config.upper)) || "",
      "utf8"
    );
  }

  private async createRoute(config: any): Promise<void> {
    if (config.routeQuantity == "single") {
      try {
        const routeAdd = Config.ConfigRoutes.front.react.single;
        const replaceData = routeAdd
          .replace("{nameRoute}", config.nameRoute)
          .replace("{component}", config.namePage);
        if (config.pageContain == "rute") {
          await this.newRouteAdd(config.filePath, replaceData, false);
        } else {
          await this.createPage(config);
          this.dir.generateBarrel(config.pathPage);
          await this.newRouteAdd(
            config.filePath,
            replaceData,
            true,
            config.upper
          );
        }
      } catch (error) {
        this.handleError("Error al crear la ruta");
        process.exit(1);
      }
    }
    if (config.routeQuantity == "multi") {
      try {
        this.dir.validateDirectoryAndCreateDirectory(config.filePath, "Module");
      } catch (error) {
        this.handleError("Error al crear multi rutas");
        process.exit(1);
      }
    }
  }

  /**
   * Agregar nueva ruta al archivo de rutas
   * @param pathRoute {string} - Path del archivo que contiene las rutas
   * @param routeAdd {string} - Estructura de código que desea añadir al archivo <Route></Route>
   */
  private async newRouteAdd(
    pathRoute: string,
    routeAdd: string,
    isImport: boolean,
    componentName?: string
  ) {
    const contentFile = fs.readFileSync(pathRoute, "utf8");

    let newFileContent = contentFile;

    if (isImport && componentName) {
      const importString = `import { ${componentName} } from "@Pages";\n`;
      const importRegex = /import { ([\s\S]*?) } from "@Pages";/;
      if (contentFile.match(importRegex)) {
        newFileContent = contentFile.replace(
          importRegex,
          (match, existingImports) => {
            if (
              !existingImports
                .split(",")
                .map((s: string) => s.trim())
                .includes(componentName)
            ) {
              return `import { ${existingImports}, ${componentName} } from "@Pages";`;
            }
            return match;
          }
        );
      } else {
        newFileContent = importString + newFileContent;
      }
    }

    const position = newFileContent.lastIndexOf("</Routes>");
    if (position === -1) {
      console.error("No se pudo encontrar la posición para insertar la ruta.");
      return;
    }

    newFileContent =
      newFileContent.slice(0, position) +
      routeAdd +
      newFileContent.slice(position);

    const formattedCode = await prettier.format(newFileContent, {
      parser: "babel",
    });

    fs.writeFile(pathRoute, formattedCode, "utf8", () => {
      console.log("Ruta generada exitosamente.");
    });
  }

  private validatePath(pathBase: string, validateFolder: string) {
    if (fs.existsSync(Path.join(pathBase, validateFolder.toLowerCase()))) {
      return Path.join(pathBase, validateFolder.toLowerCase());
    }
    return false;
  }

  private validateExistFolderRoutes(path: string, typeAccess: string) {
    const existRoutes = this.validatePath(path, `src/routes/${typeAccess}`);
    if (!existRoutes) {
      this.handleError("Structure validation error");
      process.exit(1);
    }
    return existRoutes;
  }

  private async executeFlows(): Promise<any> {
    clear();
    const flowOne = await this.selected(this.flows);
    clear();
    const selectedFile =
      flowOne.routeExist == "si"
        ? await this.dir.navigateFolders(process.cwd(), process.cwd())
        : "";
    clear();
    const flowTwo = await this.selected(this.flowAfter);
    return { ...flowOne, selectedFile, ...flowTwo };
  }

  private handleError(error: string): void {
    console.error(
      `\n${ERROR_PREFIX} Error in action processing: ${chalk.red("%s")}`,
      error
    );
    process.exit(1);
  }
}

// {
//   typeRoute: 'public',
//   routeExist: 'si',
//   selectedFile: '/Users/andresroa/Documents/Mis documentos personales/TauroCli/bin/tauro.js',
//   nameRoute: 'laurita-de-mi-corazon',
//   routeQuantity: 'multi',
//   listNewRoutes: [ 'andres-roa', 'juanita-la-del-barrio', 'laura-mi-vida' ],
//   pageContain: 'rute'
// }
