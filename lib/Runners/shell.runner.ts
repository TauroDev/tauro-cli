import execa from "execa";
import { Config } from "../Configurations";

export class ShellRunner {
  public async executeExecaSync(
    initialCommand: string,
    args: string[],
    path: string = ""
  ) {
    const config = path.length > 0 ? { cwd: path } : {};
    try {
      const proceso: any = execa(initialCommand, args, config);
      proceso.stdout.on("data", (data: any) => {
        console.log(data.toString());
      });
      return new Promise<void>((resolve, reject) => {
        proceso.on("close", (code: number) => {
          !Config.isProd && console.log("El proceso ha terminado con código de salida:", code); 
          resolve();
        });

        proceso.on("error", (error: Error) => {
          !Config.isProd && console.error("Error al ejecutar el proceso:", error); 
          reject(error);
        });
      });
    } catch (error) {
      console.error("Error:", error);
    }
  }
}
