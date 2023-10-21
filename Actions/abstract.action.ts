import { InputCommand } from "../Command";

export abstract class AbstractAction {
  public abstract handle(args?: InputCommand): Promise<void>;
}
