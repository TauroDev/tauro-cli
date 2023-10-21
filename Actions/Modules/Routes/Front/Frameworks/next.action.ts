import { AbstractAction } from "../../../..";
import { InputCommand } from "../../../../../Command";

export class NextAction extends AbstractAction {
    public async handle(args?: InputCommand): Promise<void> {
        console.log("Desde Next js")
    }

}