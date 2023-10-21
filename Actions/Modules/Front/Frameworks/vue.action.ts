import { InputCommand } from "../../../../Command";
import { AbstractAction } from "../../../abstract.action";

export class VueAction extends AbstractAction {
    public handle(args: InputCommand): Promise<void> {
        throw new Error("Method not implemented.");
    }

}