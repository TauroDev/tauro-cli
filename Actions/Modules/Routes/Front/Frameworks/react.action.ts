import { AbstractAction } from "../../../..";
import { InputCommand } from "../../../../../Command";

export class ReactAction extends AbstractAction {
    public async handle(args?: InputCommand): Promise<void> {
        console.log("Desde react js")
    }

}