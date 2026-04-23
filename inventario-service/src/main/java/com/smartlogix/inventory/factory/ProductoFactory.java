package com.smartlogix.inventory.factory;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.Map;

/**
 * Factory Method que delega la creación a Spring mediante inyección
 * del mapa de componentes por nombre (alias del @Component).
 *
 * Uso: productoFactory.crear("fragil") → StockFragil
 */
@Component
public class ProductoFactory {

    @Autowired
    private Map<String, StockItem> tiposStock;

    public StockItem crear(String tipo) {
        StockItem item = tiposStock.get(tipo.toLowerCase());
        if (item == null) {
            throw new IllegalArgumentException("Tipo de stock desconocido: " + tipo +
                    ". Opciones válidas: estandar, fragil, perecible.");
        }
        return item;
    }
}
