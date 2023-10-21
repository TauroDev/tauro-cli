import path from 'path';
import fs from 'fs';

const getExtendedExtname = (filePath: string): string => {
    // Extraer el nombre del archivo de la ruta completa
    const filename = path.basename(filePath);
    
    // Buscar la extensión a partir de dos posiciones antes del punto
    const match = filename.match(/.{2}\.\w+$/);
    
    return match ? match[0] : '';
};

const deleteFilesFromDir = (
    startPath: string,
    fileExtensionArray: string[],
    ignorePaths: string[] = []
) => {
    if (!fs.existsSync(startPath)) {
        console.log("No existe el directorio:", startPath);
        return;
    }

    const files = fs.readdirSync(startPath);

    for (let i = 0; i < files.length; i++) {
        const filename = path.join(startPath, files[i]);

        // Ignorar si la ruta está en la lista de rutas ignoradas
        if (ignorePaths.includes(filename)) {
            console.log(`Ignorado: ${filename}`);
            continue;
        }

        const stat = fs.lstatSync(filename);

        if (stat.isDirectory()) {
            deleteFilesFromDir(filename, fileExtensionArray, ignorePaths);
        } else if (path.extname(filename)) {
            if(fileExtensionArray.indexOf(path.extname(filename)) !== -1) {
                fs.unlinkSync(filename);
                console.log(`Eliminado: ${filename}`);
            } else if (fileExtensionArray.indexOf(getExtendedExtname(filename)) !== -1) {
                fs.unlinkSync(filename);
                console.log(`Eliminado: ${filename}`);
            }
        }
    }
};

const pathsToIgnore = [
    path.join(__dirname, '../../node_modules'),
    path.join(__dirname, '../../.git')
]

deleteFilesFromDir(path.join(__dirname, "../../"), ['.js', '.d.ts'], pathsToIgnore);