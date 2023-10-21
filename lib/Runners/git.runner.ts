import chalk from "chalk";
import {
  Config,
  routeConfig,
  typeDepartament,
  urlRepos,
} from "../Configurations";
import ora from "ora";
import cliSpinners from "cli-spinners";
import execa from "execa";
import { ShellRunner } from "./shell.runner";
import path from "path";
import fsExtra from "fs-extra";
import { MacPermissions } from "../Permissions";

export class GitRunner {
  private shell: ShellRunner = new ShellRunner();
  private macPermissions: MacPermissions = new MacPermissions();
  public async updateRepo(typeApp: string) {
    await this.macPermissions.GetAdminPermissions();
    const route = path.join(
      __dirname,
      `../../Templates/${typeDepartament[typeApp]}`
    );

    const spinner = ora({
      text: chalk.yellowBright(`Actualizando templates...`),
      spinner: cliSpinners.dots8,
    }).start();
    try {
      await execa("git", ["reset", "--hard"], { cwd: route });
      const { stdout } = await execa(
        "git",
        ["pull", "origin", "main", "--rebase"],
        { cwd: route }
      );
      console.log(stdout);
      spinner.succeed(chalk.green("Templates actualizados correctamente"));
    } catch (error) {
      try {
        await execa("git", ["config", "--global", "--add", "safe.directory", route], { cwd: route })
        await execa("git", ["reset", "--hard"], { cwd: route });
        const { stdout } = await execa(
          "git",
          ["pull", "origin", "main", "--rebase"],
          { cwd: route }
        );
        console.log(stdout);
      } catch (error) {
        console.log(error)
        spinner.fail(chalk.red(`Error al actualizar los templates :(`));
      }
      spinner.succeed(chalk.green(`Actualización en segundo intento`));
    }
  }

  public async initMacOs(typeApp: string, route: string) {
    try {
      await this.macPermissions.GetAdminPermissions();
      const tmpConfig = Config;
      await this.shell.executeExecaSync("rm", [
        "-r",
        `${route}/${typeDepartament[typeApp]}`,
      ]);
      await this.shell.executeExecaSync(
        "sudo",
        ["git", "clone", `${urlRepos[typeApp]}`],
        route
      );
      tmpConfig.isNewFront = false;
      fsExtra.writeFileSync(routeConfig, JSON.stringify(tmpConfig, null, 2));
    } catch (error) {
      console.error(
        `ERROR AL EJECUTAR EL COMANDO: 'sudo git clone ${urlRepos[typeApp]}'`
      );
    }
  }

  public async initWindows(typeApp: string, route: string) {
    const tmpConfig = Config;
    fsExtra.removeSync(`${route}/${typeDepartament[typeApp]}`);
    await this.shell.executeExecaSync("git", ["clone", `${urlRepos[typeApp]}`], route);
    tmpConfig.isNewFront = false;
    fsExtra.writeFileSync(routeConfig, JSON.stringify(tmpConfig, null, 2));
  };

  public async gitInitCommand(typeApp: string) {
    const spinner = ora({
      text: chalk.yellowBright(
        `Descargando el templates: ${urlRepos[typeApp]}...`
      ),
      spinner: cliSpinners.dots8,
    }).start();
    const route = path.join(__dirname, `../../Templates/`);
    console.log(route)
    try {
      if (process.platform === "darwin") {
        await this.initMacOs(typeApp, route);
      } else {
        await this.initWindows(typeApp, route);
      }
      spinner.succeed(chalk.green("Templates descargados correctamente"));
    } catch (error) {
      spinner.fail(
        chalk.red(`Error al descargar los templates: ${urlRepos[typeApp]} :(`)
      );
    }
  };
  
}
