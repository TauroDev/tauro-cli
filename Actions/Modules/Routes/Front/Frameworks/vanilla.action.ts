import { AbstractAction } from "../../../..";
import { InputCommand } from "../../../../../Command";

export class VanillaAction extends AbstractAction {
    public async handle(args?: InputCommand): Promise<void> {
        console.log("Desde Vanilla js")
    }

}