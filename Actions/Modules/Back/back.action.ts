import { InputCommand } from "../../../Command";
import { AbstractAction } from "../../abstract.action";

export class BackAction extends AbstractAction {
    public handle(args: InputCommand): Promise<void> {
        console.log("Action for back")
        throw new Error("Method not implemented.");
    }

}