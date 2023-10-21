export const incrementVersion = (version: string) => {
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