/**
 * Capitalizar un string
 * @param route {string} - Palabra a capitalizar
 */
export const capitalizarString = (string: string, lower: boolean = true) => {
  if (string.length === 0) {
    return string;
  }
  return `${string.charAt(0).toUpperCase()}${ lower ? string.slice(1).toLowerCase() : string.slice(1)}`;
};

/**
 * Quita los acentos de las palabras
 * @param str {string} - Palabra a normalizar
 * @param lower {boolean} - true para minusculas, false para dejarlo normal
 * @param repreplacement? {string} - Si deseas remplazar los espacios por un caracter especial
 * @param removeChars? {string} - Recibe caracteres para borrar en el string
 */
export const normalizeString = (
  str: string,
  lower: boolean = false,
  replacement: string = "",
  removeChars: string = ""
) => {
  // Quitar acentos
  const accents = "áÁéÉíÍóÓúÚüÜñÑ";
  const without = "aAeEiIoOuUuUnN";

  // Eliminar caracteres especiales si removeChars se proporciona
  if (removeChars.length > 0) {
    const pattern = new RegExp(`[${removeChars}]`, "g");
    str = str.replace(pattern, "");
  }

  let normalized = str
    .split("")
    .map((char) => {
      const index = accents.indexOf(char);
      return index !== -1 ? without[index] : char;
    })
    .join("");

  // Reemplazar espacios si replacement se proporciona
  if (replacement.length > 0) {
    normalized = normalized.replace(/ /g, replacement);
  }

  return lower ? normalized.toLowerCase() : normalized;
};


/**
 * Convierte un string en formato "kebab-case" a "camelCase".
 * 
 * @param {string} camelCase - El string en formato "camel-case" que se quiere convertir.
 * @returns {string} El string convertido a "camelCase".
 */
export const convertToCamelCase = (camelCase: string): string => {
  return camelCase
    .split("-")
    .map((word, index) =>
      index === 0 ? word : word.charAt(0).toUpperCase() + word.slice(1)
    )
    .join("");
};
