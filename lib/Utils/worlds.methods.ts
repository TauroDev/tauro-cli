/**
 * Capitalizar un string
 * @param route {string} - Palabra a capitalizar
 */
export const capitalizarString = (string: string) => {
    if (string.length === 0) {
      return string;
    }
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
  };