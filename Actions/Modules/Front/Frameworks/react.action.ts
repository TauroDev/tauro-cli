import clear from "clear";
import { Config } from "../../../../lib/Configurations";
import { AbstractAction } from "../../../abstract.action";
import {
  DirectoryRunner,
  GitRunner,
  JsonRunner,
} from "../../../../lib/Runners";
import path from "path";
import inquirer from "inquirer";
import { printFinalMsg } from "../../../../lib/Utils";

export class ReactAction extends AbstractAction {
  private git: GitRunner = new GitRunner();
  private dir: DirectoryRunner = new DirectoryRunner();
  private json: JsonRunner = new JsonRunner();
  private selected = inquirer.prompt;
  private typeApp: string = "front";
  private baseApp: string = "react";
  private routeFramework: string = path.join(
    __dirname,
    `../../../../Templates/base-front-end/${this.baseApp}/`
  );
  public async handle(): Promise<void> {
    try {
      if (Config.isNewFront) {
        await this.git.gitInitCommand(this.typeApp);
      }
      await this.git.updateRepo(this.typeApp);
      clear();
      const { pathProject, data, pathPackage } = await this.generatedVersions();
      await this.dir.createDirectory(data.nameApp, this.typeApp);
      const routeFinal = path.join(
        process.cwd(),
        `${data.nameApp.toLowerCase()}-${this.typeApp}`
      );
      this.dir.copyData(pathProject, routeFinal);
      await this.json.restarJson(pathPackage);
      printFinalMsg(`${data.nameApp.toLowerCase()}`);
    } catch (error) {
      console.error("Comunicación no disponible");
      console.error(
        `ERROR TYPE PROCESS START FLOW ${this.typeApp.toUpperCase()}: ${error}`
      );
    }
  }

  private async generatedVersions(): Promise<{
    pathProject: string;
    pathPackage: string;
    data: any;
  }> {
    try {
      const versionsApp = this.dir.chargeVersion(this.routeFramework);
      const Flows: any = [
        {
          type: "list",
          name: "versionApp",
          message: "Qué tipo de versión desea usar?",
          choices: versionsApp,
        },
        {
          type: "input",
          name: "nameApp",
          message: "Ingrese nombre del proyecto",
          default: "tauro-app",
        },
      ];
      const answer = await this.selected(Flows);
      const routes = await this.json.modifyJson(
        answer,
        this.typeApp,
        this.baseApp
      );
      return { data: answer, ...routes };
    } catch (error) {
      console.error("Comunicación no disponible");
      console.error(
        `ERROR TYPE PROCESS CAPTURE INFO FLOW ${this.typeApp.toUpperCase()}: ${error}`
      );
      return { data: null, pathProject: "", pathPackage: "" };
    }
  }
}
