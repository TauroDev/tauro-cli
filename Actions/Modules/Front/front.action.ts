import clear from "clear";
import { InputCommand } from "../../../Command";
import { AbstractAction } from "../../abstract.action";
import inquirer from "inquirer";
import { Config } from "../../../lib/Configurations";
import { NextAction, ReactAction, VanillaAction, VueAction } from "./Frameworks";

export class FrontAction extends AbstractAction {
  private selected = inquirer.prompt;
  private selecteFramework: any = [
    {
      type: "list",
      name: "framework",
      message: "En que tipo de framework deseas desarrollar?",
      choices: Config["frameworks-front"],
    },
  ];
  private ConfigFramewoks: any = {
    reactjs: ReactAction,
    nextjs: NextAction,
    vanillajs: VanillaAction,
    vuejs: VueAction,
  };

  private minNameFramework: any = {
    r: "reactjs",
    n: "nextjs",
    j: "vanillajs",
    v: "vuejs"
  }

  public async handle(args: InputCommand): Promise<void> {
    clear();
    let execAction;
    if(args.value == "selected") {
      const answer = await this.selected(this.selecteFramework);
      const parseData = answer.framework.replace(/\s/g, "").toLowerCase()
      execAction = this.ConfigFramewoks[parseData.replace("(endesarrollo)", '')]
    } else {
      const framework = this.minNameFramework[args.options]
      execAction = this.ConfigFramewoks[framework];
    }
    new execAction().handle();
  }
}
