import { AbstractAction } from ".";
import { InputCommand } from "../Command";

export class RoutesAction extends AbstractAction {
    public async handle(args?: InputCommand): Promise<void> {
        console.log(args)
    }

}