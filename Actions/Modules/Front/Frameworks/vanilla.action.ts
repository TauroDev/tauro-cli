import { InputCommand } from "../../../../Command";
import { AbstractAction } from "../../../abstract.action";

export class VanillaAction extends AbstractAction {
    public handle(args: InputCommand): Promise<void> {
        throw new Error("Method not implemented.");
    }

}