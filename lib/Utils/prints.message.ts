import clear from "clear";

/**
 * Impresión de mensaje final para template React js
 * @param name {string} - Recibe como argumento el nombre del proyecto
 */
export const printFinalMsg = (name: string) => {
    // clear();;
    console.log("");
    console.log("Instrucciones de uso:");
    console.log("");
    console.log(`cd ${name}-front`);
    console.log(`Configurar las apis en ${name}-front/src/Constant/Params.json`);
    console.log("npm install o npm i");
    console.log("para desarrollo: npm run dev");
    console.log("para producción: npm run prod");
    console.log("para el compilado: npm run build");
    console.log("");
    console.log("Powered by Tauro Dev - Software factory");
  };