package com.smartlogix.inventory.factory;

import org.springframework.stereotype.Component;

@Component("estandar")
public class StockEstandar implements StockItem {

    @Override
    public String getTipo() {
        return "ESTANDAR";
    }

    @Override
    public int getStockMinimoRecomendado() {
        return 10;
    }

    @Override
    public String getDescripcionAlmacenamiento() {
        return "Almacenamiento en bodega estándar a temperatura ambiente.";
    }
}
