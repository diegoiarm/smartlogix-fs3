package com.smartlogix.inventory.factory;

import org.springframework.stereotype.Component;

@Component("fragil")
public class StockFragil implements StockItem {

    @Override
    public String getTipo() {
        return "FRAGIL";
    }

    @Override
    public int getStockMinimoRecomendado() {
        return 5;
    }

    @Override
    public String getDescripcionAlmacenamiento() {
        return "Requiere embalaje especial y zona de carga con cuidado. Mínimo de rotación.";
    }
}
