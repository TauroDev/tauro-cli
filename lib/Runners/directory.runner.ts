import execa from "execa";
import { typeExtension } from "../Configurations";
import fs from "fs";
import path from "path";
import fsExtra from "fs-extra";
import { ERROR_PREFIX } from "../Ui";
import chalk from "chalk";
import inquirer from "inquirer";
import clear from "clear";

export class DirectoryRunner {
  private selected = inquirer.prompt;
  /**
   * Creación de carpeta contenedora de proyecto
   * @param name {string} - Recibe como argumento el nombre del proyecto
   * @param typeApp {string} - Es el tipo del proyecto, si es front o back, este string debe ser "front" o "back"
   */
  public async createDirectory(name: string, typeApp: string) {
    const nameDir = `${name.toLowerCase()}-${typeExtension[typeApp]}`;
    try {
      const { stdout } = await execa("mkdir", [nameDir], {
        cwd: process.cwd(),
      });
      console.log(stdout);
    } catch (error) {
      this.handleError(
        "The directory already exists, try with another name.",
        nameDir
      );
    }
  }

  public async copyData(origen: string, destino: string) {
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
          this.copyData(origenPath, destinoPath); // Llamada recursiva para copiar subcarpetas
        }
      });
    } else {
      console.error("La carpeta de origen no existe o no es una carpeta.");
    }
  }

  /**
   * Función para crear carpetas según un path especifico
   * @param path {string} - Es la ruta donde se va a crear la carpeta
   * @param name {string} - Recibe como argumento el nombre de la carpeta
   */
  public async writeDir(path: string, name: string, typeApp: string) {
    try {
      await execa(
        "mkdir",
        [`${name.toLowerCase()}-${typeExtension[typeApp]}`],
        {
          cwd: process.cwd(),
        }
      );
    } catch (error) {
      console.error(`ERROR AL CREAR LA CARPPETA EN LA RUTA: ${path}`);
    }
  }

  /**
   * Leer las versiones de los templates
   * @param route {string} - Ruta del template a leer
   * @returns {string[]} Un array con las versiones, por ejemplo: ['v1', 'v2', 'v3', 'v4']
   */
  public chargeVersion(route: string): string[] {
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
  }

  /**
   * Leer los archivos de una carpeta
   * @param route {string} - Ruta del folder a leer
   * @returns {string[]} Un array con las versiones, por ejemplo: ['src', 'index.js'...]
   */
  public chargeItems(route: string): string[] {
    try {
      return fsExtra.readdirSync(route);
    } catch (error) {
      return [];
    }
  }

  public async navigateFolders(
    currentDir: string,
    initialDir?: string
  ): Promise<string> {
    clear();
    if (!initialDir) {
      initialDir = currentDir;
    }

    const choices = await this.listFiles(currentDir);
    if (currentDir !== initialDir) {
      choices.push({ name: "...Retroceder", value: "...Retroceder" });
    }

    const { selectedFile } = await this.selected([
      {
        type: "list",
        name: "selectedFile",
        message: "Selecciona un archivo o carpeta:",
        choices,
      },
    ]);

    const newPath = path.join(currentDir, selectedFile);

    if (selectedFile === "...Retroceder") {
      const parentPath = path.dirname(currentDir);
      if (parentPath !== initialDir) {
        return await this.navigateFolders(parentPath, initialDir);
      } else {
        return await this.navigateFolders(initialDir, initialDir); // Limitar a retroceder solo hasta el directorio inicial
      }
    }

    if (fs.lstatSync(newPath).isDirectory()) {
      return await this.navigateFolders(newPath, initialDir);
    } else if (selectedFile.endsWith(".js") || selectedFile.endsWith(".jsx")) {
      return newPath;
    } else {
      console.log("Archivo no válido, elija otro.");
      return await this.navigateFolders(currentDir, initialDir);
    }
  }

  public async listFiles(
    currentDir: string
  ): Promise<Array<{ name: string; value: string }>> {
    const dir = await fs.promises.opendir(currentDir);
    const choices: Array<{ name: string; value: string }> = [];

    for await (const dirent of dir) {
      const type = dirent.isDirectory() ? "[carpeta]" : "[archivo]";
      choices.push({ name: `${dirent.name} ${type}`, value: dirent.name });
    }

    return choices;
  }

  public validateDirectoryAndCreateDirectory(
    pathBae: string,
    directory: string
  ) {
    const directoryPath = path.join(pathBae, directory); 

    if (!fs.existsSync(directoryPath)) {
      fs.mkdirSync(directoryPath, { recursive: true });
    }
  }

  private handleError(text: string, entry: string): void {
    console.error(`\n${ERROR_PREFIX} ${text} ${chalk.red("%s")}`, entry);
    process.exit(1);
  }
}
