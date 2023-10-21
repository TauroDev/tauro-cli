import path from 'path';
import fs from 'fs';

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
        console.log(fileExtensionArray.indexOf(path.extname(filename)) !== -1)
        console.log(path.extname(filename))

        // Ignorar si la ruta está en la lista de rutas ignoradas
        if (ignorePaths.includes(filename)) {
            console.log(`Ignorado: ${filename}`);
            continue;
        }

        const stat = fs.lstatSync(filename);

        if (stat.isDirectory()) {
            deleteFilesFromDir(filename, fileExtensionArray, ignorePaths); // Recursividad
        } else if (path.extname(filename)) {
            fs.unlinkSync(filename); // Eliminar archivo
            console.log(`Eliminado: ${filename}`);
        }
    }
};

const pathsToIgnore = [
    path.join(__dirname, '../../node_modules'),
    path.join(__dirname, '../../.git')
]

// Ejecutar función para eliminar archivos .js y .d.ts en el directorio actual y subdirectorios
deleteFilesFromDir(path.join(__dirname, "../../"), ['.js', '.d.ts'], pathsToIgnore);
