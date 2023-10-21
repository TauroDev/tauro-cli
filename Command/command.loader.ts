import chalk from "chalk";
import { Command } from "commander";
import { ERROR_PREFIX } from "../lib/Ui";
import { StartAction, RoutesAction } from "../Actions";
import { StartCommand } from "./start.command";
import { RoutesCommand } from "./routes.command";

export class CommandLoader {
  public static async load(program: Command): Promise<void> {
    new StartCommand(new StartAction()).load(program);
    new RoutesCommand(new RoutesAction()).load(program);

    this.handleInvalidCommand(program);
  }

  private static handleInvalidCommand(program: Command) {
    program.on("command:*", () => {
      console.error(
        `\n${ERROR_PREFIX} Invalid command: ${chalk.red("%s")}`,
        program.args.join(" ")
      );
      console.log(
        `See ${chalk.red("--help")} for a list of available commands.\n`
      );
      process.exit(1);
    });
  }
}
