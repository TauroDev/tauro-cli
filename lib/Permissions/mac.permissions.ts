import path from "path";
import { ShellRunner } from "../Runners";

export class MacPermissions {
    private shell: ShellRunner = new ShellRunner()
  public async GetAdminPermissions() {
    if (process.platform === "darwin") {
      try {
        const originPath = path.join(__dirname, "../../");
        await this.shell.executeExecaSync("sudo", ["chmod", "-R", "777", originPath]);
      } catch (error) {
        console.log(error)
      }
    }
  };
}
