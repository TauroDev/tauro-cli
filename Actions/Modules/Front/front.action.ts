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
  public async handle(args: InputCommand): Promise<void> {
    // clear();;
    const answer = await this.selected(this.selecteFramework);
    const parseData = answer.framework.replace(/\s/g, "").toLowerCase()
    const execAction = this.ConfigFramewoks[parseData.replace("(endesarrollo)", '')]
    new execAction().handle();
  }
}
