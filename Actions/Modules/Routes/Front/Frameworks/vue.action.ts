import { AbstractAction } from "../../../..";
import { InputCommand } from "../../../../../Command";

export class VueAction extends AbstractAction {
    public async handle(args?: InputCommand): Promise<void> {
        console.log("Desde Vue js")
    }

}