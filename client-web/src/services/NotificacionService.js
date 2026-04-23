/**
 * Patrón Observer — NotificacionService
 * Permite suscribirse a eventos del sistema (stock bajo, pedido asignado, etc.)
 * sin recargar la página.
 *
 * Uso:
 *   const unsub = NotificacionService.suscribir('STOCK_BAJO', (msg) => console.log(msg));
 *   NotificacionService.publicar('STOCK_BAJO', { nombre: 'Caja Frágil', cantidad: 2 });
 *   unsub(); // Cancelar suscripción
 */
const NotificacionService = (() => {
    const suscriptores = {};

    const suscribir = (evento, callback) => {
        if (!suscriptores[evento]) {
            suscriptores[evento] = [];
        }
        suscriptores[evento].push(callback);

        // Retorna función para cancelar la suscripción
        return () => {
            suscriptores[evento] = suscriptores[evento].filter(fn => fn !== callback);
        };
    };

    const publicar = (evento, datos) => {
        if (suscriptores[evento]) {
            suscriptores[evento].forEach(callback => callback(datos));
        }
    };

    return { suscribir, publicar };
})();

export default NotificacionService;
