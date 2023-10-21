import { Command } from "commander";
import { AbstractCommand } from "./abstract.command";
import { InputCommand } from "./command.input";

export class StartCommand extends AbstractCommand {
  public load(program: Command): void {
    program
      .command("start")
      .alias("s")
      .option("-f, --front <path>", "Start directly with a front end framework")
      .option("-b, --back <path>", "Start directly with a back end framework")
      .description("Start application with a Tauro Cli")
      .action(async (options) => {
        const config: InputCommand = {name: "front-end-app", value: ""};
        if(options?.front) {
            console.log(`Front Application ${JSON.stringify(options)}`)
        }
        if(options?.back) {
            console.log(`Back Application ${JSON.stringify(options)}`)
        }
        this.action.handle(config)
      })
  }
}
