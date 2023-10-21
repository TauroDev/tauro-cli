import { Config } from "../Configurations";
import { incrementVersion } from "../Utils";
import path from "path";
import fsExtra from "fs-extra";
import execa from "execa";

const initDeployConfig = async () => {
  const { stdout } = await execa("git", ["rev-parse", "--abbrev-ref", "HEAD"], {
    cwd: path.join(__dirname, "../../"),
  });
  const branch = stdout.trim();

  const routeConfig = path.join(
    __dirname,
    "../Configurations/params.config.json"
  );
  const binPath = "./bin/tauro.js";
  const paramConfigJson = {...Config.packageConfig};
  const routePackage = path.join(__dirname, "../../package.json");
  const pathProject = path.join(__dirname, "../../Templates");
  const tmpVersion = branch == "main" ? Config.versionProdPackage : Config.versionDevPackage;
  const tmpConfig = Config;
  const args = process.argv.includes("-c");

  paramConfigJson.version = tmpVersion;

  if (branch == "main") {
    paramConfigJson.name = Config.namePackageProd;
    paramConfigJson.bin = { [`${Config.binProd}`]: binPath };
    !args && (paramConfigJson.version = incrementVersion(tmpVersion));
    !args && (tmpConfig.versionProdPackage = incrementVersion(tmpVersion));
  } else {
    paramConfigJson.name = Config.namePackageDev;
    paramConfigJson.bin = { [`${Config.binDev}`]: binPath };
    !args && (paramConfigJson.version = incrementVersion(tmpVersion));
    !args && (tmpConfig.versionDevPackage = incrementVersion(tmpVersion));
  }

  !args && (tmpConfig.versionApp = incrementVersion(tmpVersion));
  tmpConfig.isNewFront = true;
  tmpConfig.isNewBack = true;
  tmpConfig.isProd = true;

  fsExtra.writeFileSync(routeConfig, JSON.stringify(tmpConfig, null, 2));
  fsExtra.writeFileSync(routePackage, JSON.stringify(paramConfigJson, null, 2));
  fsExtra.removeSync(`${pathProject}/base-front-end`);
  fsExtra.removeSync(`${pathProject}/base-back-end`);
};
initDeployConfig();
