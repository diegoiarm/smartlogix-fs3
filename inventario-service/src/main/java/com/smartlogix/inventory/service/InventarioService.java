package com.smartlogix.inventory.service;

import com.smartlogix.inventory.factory.ProductoFactory;
import com.smartlogix.inventory.factory.StockItem;
import com.smartlogix.inventory.model.Stock;
import com.smartlogix.inventory.repository.StockRepository;
import io.github.resilience4j.circuitbreaker.annotation.CircuitBreaker;
import io.github.resilience4j.retry.annotation.Retry;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;
import java.util.Optional;

@Service
public class InventarioService {

    @Autowired
    private StockRepository stockRepository;

    @Autowired
    private ProductoFactory productoFactory;

    @CircuitBreaker(name = "dbInventario", fallbackMethod = "fallbackListar")
    @Retry(name = "dbInventario")
    public List<Stock> listarTodo() {
        return stockRepository.findAll();
    }

    @CircuitBreaker(name = "dbInventario", fallbackMethod = "fallbackListar")
    public List<Stock> listarStockBajo() {
        return stockRepository.findStockBajo();
    }

    @CircuitBreaker(name = "dbInventario", fallbackMethod = "fallbackGuardar")
    public Stock guardar(Stock stock) {
        // El Factory enriquece el stock con el mínimo recomendado si no fue provisto
        StockItem tipoItem = productoFactory.crear(stock.getTipo().name());
        if (stock.getStockMinimo() == null) {
            stock.setStockMinimo(tipoItem.getStockMinimoRecomendado());
        }
        return stockRepository.save(stock);
    }

    @CircuitBreaker(name = "dbInventario", fallbackMethod = "fallbackGuardar")
    public Optional<Stock> actualizar(Long id, Stock datos) {
        return stockRepository.findById(id).map(existente -> {
            existente.setNombre(datos.getNombre());
            existente.setPrecio(datos.getPrecio());
            existente.setCantidad(datos.getCantidad());
            existente.setTipo(datos.getTipo());
            return stockRepository.save(existente);
        });
    }

    public void eliminar(Long id) {
        stockRepository.deleteById(id);
    }

    // --- MÉTODOS FALLBACK ---

    public List<Stock> fallbackListar(Throwable e) {
        System.err.println("[Inventario] Circuito abierto al listar: " + e.getMessage());
        return Collections.emptyList();
    }

    public Stock fallbackGuardar(Stock stock, Throwable e) {
        System.err.println("[Inventario] Circuito abierto al guardar: " + e.getMessage());
        Stock respuestaError = new Stock();
        respuestaError.setNombre("Servicio temporalmente no disponible. Intente más tarde.");
        return respuestaError;
    }
}
