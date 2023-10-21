import { InputCommand } from "../../../../Command";
import { AbstractAction } from "../../../abstract.action";

export class NextAction extends AbstractAction {
    public handle(args: InputCommand): Promise<void> {
        throw new Error("Method not implemented.");
    }

}