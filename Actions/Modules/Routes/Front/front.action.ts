import inquirer from "inquirer";
import clear from "clear";
import {
  ReactAction,
  VueAction,
  NextAction,
  VanillaAction,
} from "./Frameworks";
import { Config } from "../../../../lib/Configurations";
import { InputCommand } from "../../../../Command";
import { AbstractAction } from "../../..";

export class FrontAction extends AbstractAction {
  private selected = inquirer.prompt;
  private flows = [
    {
      type: "list",
      name: "framework",
      message: "A que framework deseas crear la ruta?",
      choices: Config["frameworks-front"],
    },
  ];
  private frameworks: any = {
    reactjs: ReactAction,
    nextjs: NextAction,
    vanillajs: VanillaAction,
    vuejs: VueAction,
  };
  private minNameFramework: any = {
    r: "reactjs",
    n: "nextjs",
    j: "vanillajs",
    v: "vuejs",
  };
  public async handle(args: InputCommand): Promise<void> {
    clear();
    let exectAction;
    if (args?.value == "selected") {
      exectAction = this.frameworks[await this.actionQuestion()];
    } else {
      const framework = this.minNameFramework[args.options];
      exectAction = this.frameworks[framework];
    }
    new exectAction().handle();
  }

  private async actionQuestion() {
    const answer = await this.selected(this.flows);
    const parseData = answer.framework.replace(/\s/g, "").toLowerCase();
    return parseData.replace("(endesarrollo)", "");
  }
}
