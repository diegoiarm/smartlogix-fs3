package com.smartlogix.inventory;

import com.smartlogix.inventory.factory.ProductoFactory;
import com.smartlogix.inventory.factory.StockItem;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
class InventarioApplicationTests {

    @Autowired
    private ProductoFactory productoFactory;

    @Test
    void contextLoads() {
    }

    @Test
    void factoryCreasStockEstandar() {
        StockItem item = productoFactory.crear("estandar");
        assertEquals("ESTANDAR", item.getTipo());
        assertEquals(10, item.getStockMinimoRecomendado());
    }

    @Test
    void factoryCreasStockFragil() {
        StockItem item = productoFactory.crear("fragil");
        assertEquals("FRAGIL", item.getTipo());
        assertEquals(5, item.getStockMinimoRecomendado());
    }

    @Test
    void factoryCreasStockPerecible() {
        StockItem item = productoFactory.crear("perecible");
        assertEquals("PERECIBLE", item.getTipo());
        assertEquals(20, item.getStockMinimoRecomendado());
    }

    @Test
    void factoryLanzaExcepcionTipoInvalido() {
        assertThrows(IllegalArgumentException.class, () -> productoFactory.crear("invalido"));
    }
}
