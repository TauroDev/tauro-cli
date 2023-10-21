import { Command } from "commander";
import { AbstractCommand } from "./abstract.command";
import inquirer from "inquirer";
import { InputCommand } from "./command.input";
import { Config } from "../lib/Configurations";
import { ERROR_PREFIX } from "../lib/Ui";
import chalk from "chalk";
import clear from "clear";

export class RoutesCommand extends AbstractCommand {
  private ConfigAnswer: any = [
    {
      type: "list",
      name: "typeApp",
      message: "¿En qué área te gustaría añadir una nueva ruta?",
      choices: Config.apps,
    },
  ];
  private selected = inquirer.prompt;
  private HashMapApp: any = {
    front: "front-end-app",
    back: "back-end-app",
  };
  public load(program: Command): void {
    program
      .command("route")
      .alias("r")
      .option("-f, --front <path>", "Start directly with a front end route")
      .option("-b, --back <path>", "Start directly with a back end route")
      .description("Start application add route at project")
      .action(async (options) => {
        clear();
        let config: InputCommand = { name: "", value: "selected" };
        let isValid: boolean = true;
        if (Object.keys(options).length == 0) {
          const answer = await this.selected(this.ConfigAnswer);
          const parseData = answer.typeApp.replace(/\s/g, "").toLowerCase();
          config.name = parseData.replace("(endesarrollo)", "");
        }
        if (options?.front) {
          config = this.captureData(options);
          isValid = this.validateArgs(config);
        }
        if (options?.back) {
          config = this.captureData(options);
          isValid = this.validateArgs(config);
        }
        if (isValid) {
          await this.action.handle(config);
        } else {
          this.handleError(config);
        }
      });
  }

  private captureData(setting: any): InputCommand {
    return {
      name: this.HashMapApp[Object.keys(setting)[0]],
      value: "instant",
      options: Object.values(setting)[0],
    };
  }

  private validateArgs(config: InputCommand): boolean {
    const validFlag: any = {
      "front-end-app": Config.frontFlags.includes(config.options),
      "back-end-app": Config.backFlags.includes(config.options),
    };
    return validFlag[config.name];
  }

  private handleError(config: InputCommand): void {
    console.error(
      `\n${ERROR_PREFIX} Invalid command flag: ${chalk.red("%s")}`,
      config.options
    );
    console.log(
      `See ${chalk.red(
        "https://cli.taurodev.com/front#list-routes"
      )} for a list flags of available commands.\n`
    );
    process.exit(1);
  }
}
