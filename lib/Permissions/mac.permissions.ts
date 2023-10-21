import path from "path";
import { ShellRunner } from "../Runners";
import clear from "clear";
import { ERROR_PREFIX } from "../Ui";
import chalk from "chalk";

export class MacPermissions {
    private shell: ShellRunner = new ShellRunner()
  public async GetAdminPermissions() {
    if (process.platform === "darwin") {
      const originPath = path.join(__dirname, "../../");
      const commandError = `sudo chmod -R 777 ${originPath}`
      try {
        clear();
        console.log(chalk.yellow("Enter the password to grant system interaction permissions to @tauro/cli: "))
        await this.shell.executeExecaSync("sudo", ["chmod", "-R", "777", originPath]);
        clear();
      } catch (error) {
        this.handleError("in requesting permissions for system interaction, please try again. Command used: ", commandError)
      }
    }
  };

  private handleError(text: string, entry: string): void {
    clear();
    console.error(
      `\n${ERROR_PREFIX} ${text} ${chalk.red("%s")}`,
      entry
    );
    process.exit(1);
  }
}
