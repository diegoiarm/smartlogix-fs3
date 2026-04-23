package com.smartlogix.inventory.factory;

/**
 * Contrato del Factory Method.
 * Cada implementación representa un tipo de producto con
 * sus propias reglas de stock mínimo y descripción.
 */
public interface StockItem {
    String getTipo();
    int getStockMinimoRecomendado();
    String getDescripcionAlmacenamiento();
}
