import path from 'path';
import { executeExecaSync } from "../../Helpers/Utils";


export const GetAdminPermissions = async () => {
    const originPath = path.join(__dirname, "../../")
    await executeExecaSync("sudo", ["chmod", "-R", "777", originPath]);
}