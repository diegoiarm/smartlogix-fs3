package com.smartlogix.inventory.factory;

import org.springframework.stereotype.Component;

@Component("perecible")
public class StockPerecible implements StockItem {

    @Override
    public String getTipo() {
        return "PERECIBLE";
    }

    @Override
    public int getStockMinimoRecomendado() {
        return 20;
    }

    @Override
    public String getDescripcionAlmacenamiento() {
        return "Refrigeración obligatoria. Alta rotación requerida para evitar pérdidas.";
    }
}
