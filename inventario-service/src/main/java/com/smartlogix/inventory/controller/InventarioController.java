package com.smartlogix.inventory.controller;

import com.smartlogix.inventory.model.Stock;
import com.smartlogix.inventory.service.InventarioService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/inventario")
@CrossOrigin(origins = "*")
public class InventarioController {

    @Autowired
    private InventarioService inventarioService;

    @GetMapping
    public ResponseEntity<List<Stock>> listar() {
        return ResponseEntity.ok(inventarioService.listarTodo());
    }

    @GetMapping("/alerta/stock-bajo")
    public ResponseEntity<List<Stock>> stockBajo() {
        return ResponseEntity.ok(inventarioService.listarStockBajo());
    }

    @PostMapping
    public ResponseEntity<Stock> crear(@Valid @RequestBody Stock stock) {
        Stock creado = inventarioService.guardar(stock);
        return ResponseEntity.status(HttpStatus.CREATED).body(creado);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Stock> actualizar(@PathVariable Long id, @Valid @RequestBody Stock stock) {
        return inventarioService.actualizar(id, stock)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        inventarioService.eliminar(id);
        return ResponseEntity.noContent().build();
    }
}
