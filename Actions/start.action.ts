import { InputCommand } from "../Command";
import { AbstractAction } from "./abstract.action";
import { FrontAction } from "./Modules/Front";
import { BackAction } from "./Modules/Back";

export class StartAction extends AbstractAction {
  private HashMapApp: any = {
    "front-end-app": FrontAction,
    "back-end-app": BackAction,
  };
  public async handle(args: InputCommand): Promise<void> {
    const GoFlow = this.HashMapApp[args.name];
    new GoFlow().handle(args)
  }
}
