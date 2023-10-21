import { AbstractAction } from "../../..";
import { InputCommand } from "../../../../Command";

export class BackAction extends AbstractAction {
    public async handle(args?: InputCommand): Promise<void> {
        console.log("en desarrollo")
        process.exit(1);
    }

}