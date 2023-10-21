import { InputCommand } from "../Command";
import { BackAction } from "./Modules/Routes/Back";
import { FrontAction } from "./Modules/Routes/Front";
import { AbstractAction } from "./abstract.action";

export class RoutesAction extends AbstractAction {
  private HashMapApp: any = {
    "front-end-app": FrontAction,
    "back-end-app": BackAction,
  };
  public async handle(args: InputCommand): Promise<void> {
    console.log(args)
    const GoFlow = this.HashMapApp[args.name];
    new GoFlow().handle(args)
  }
}
