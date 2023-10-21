import { typeDepartament } from "../Configurations";
import fsExtra from "fs-extra";
import path from "path";
import { MacPermissions } from "../Permissions";

export class JsonRunner {
  private mac: MacPermissions = new MacPermissions();
  public async restarJson(route: string) {
    const dataPackage = require(route);
    dataPackage.name = "name-here";
    fsExtra.writeFileSync(route, JSON.stringify(dataPackage, null, 2));
  }

  /**
   * Actualización del nombre del package json
   * @param answer {object} - Debe recibir dos valores {versionApp: "(versión del template)", nameApp: "(Nombre del proyecto"}
   * @param typeProject  {string} - Es el tipo del proyecto, si es front o back, este string debe ser "front" o "back"
   * @param base  {string} - La base del proyecto es el tipo de framework que seleccionó el usuario
   */
  public async modifyJson(
    answer: any,
    typeProject: string,
    base: string
  ): Promise<{ pathProject: string; pathPackage: string }> {
    await this.mac.GetAdminPermissions();
    const route = path.join(
      __dirname,
      `../../Templates/${typeDepartament[typeProject]}/${base}`
    );
    const pathProject = path.join(route, answer.versionApp);
    const pathPackage = path.join(route, `${answer.versionApp}/package.json`);
    const dataPackage = require(pathPackage);
    dataPackage.name = answer.nameApp.toLowerCase();
    fsExtra.writeFileSync(pathPackage, JSON.stringify(dataPackage, null, 2));
    return { pathProject, pathPackage };
  }
}
