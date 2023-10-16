const Config = require('../Helpers/Config.json')
const PackageJson = require('../../package.json')
const path = require('path')
const fsExtra = require("fs-extra");

const routeConfig = path.join(__dirname, '../Helpers/Config.json')
const routePackage = path.join(__dirname, '../../package.json')
const pathProject = path.join(__dirname, '../ProyectsBase')
const readme = path.join(__dirname, '../../README.md')
const tmpVersion = Config.versionApp

function incrementVersion(version) {
    const parts = version.split('.').map(Number);

    if (parts.length !== 3) {
        throw new Error('El formato de la versión debe ser "x.y.z".');
    }

    // Incrementa el tercer valor (revisión)
    parts[2]++;

    // Verifica si se necesita llevar a cabo incrementos adicionales
    if (parts[2] > 9) {
        parts[2] = 0;
        parts[1]++; // Incrementa el segundo valor (menor)

        if (parts[1] > 9) {
            parts[1] = 0;
            parts[0]++; // Incrementa el primer valor (mayor)
        }
    }

    return parts.join('.');
}

const tmpConfig = Config
const tmpPackage = PackageJson
tmpConfig.versionApp = incrementVersion(tmpVersion)
tmpPackage.version = incrementVersion(tmpVersion)
tmpConfig.isNewFront = true
tmpConfig.isNewBack = true

fsExtra.writeFileSync(routeConfig, JSON.stringify(tmpConfig, null, 2));
fsExtra.writeFileSync(routePackage, JSON.stringify(tmpPackage, null, 2));
fsExtra.removeSync(`${pathProject}/base-front-end`)
fsExtra.removeSync(`${pathProject}/base-back-end`)