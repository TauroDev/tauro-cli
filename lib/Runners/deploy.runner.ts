import { Config } from "../Configurations";
import { incrementVersion } from "../Utils";
import PackageJson from "../../package.json";
import path from "path";
import fsExtra from "fs-extra";
import execa from "execa";

const initDeployConfig = async () => {
    const { stdout } = await execa("git", ["rev-parse", "--abbrev-ref", "HEAD"], {
        cwd: path.join(__dirname, "../../"),
      });
      const branch = stdout.trim();
      console.log(branch)
}

initDeployConfig();

// const routeConfig = path.join(__dirname, '../Configurations/params.config.json')
// const routePackage = path.join(__dirname, '../../package.json')
// const pathProject = path.join(__dirname, '../../Templates')
// const tmpVersion = Config.versionApp

// const tmpConfig = Config
// const tmpPackage = PackageJson
// tmpConfig.versionApp = incrementVersion(tmpVersion)
// tmpPackage.version = incrementVersion(tmpVersion)
// tmpConfig.isNewFront = true
// tmpConfig.isNewBack = true
// tmpConfig.isProd = true

// fsExtra.writeFileSync(routeConfig, JSON.stringify(tmpConfig, null, 2));
// fsExtra.writeFileSync(routePackage, JSON.stringify(tmpPackage, null, 2));
// fsExtra.removeSync(`${pathProject}/base-front-end`)
// fsExtra.removeSync(`${pathProject}/base-back-end`)
