package com.example.demo.controller;

import java.util.Collections;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.model.Producto;
import com.example.demo.repository.ProductoRepository;

import io.github.resilience4j.circuitbreaker.annotation.CircuitBreaker;
import io.github.resilience4j.retry.annotation.Retry;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import com.example.demo.model.ProductoProtos;

@RestController
@RequestMapping("/api/productos")
//@CrossOrigin(origins = "*")
public class ProductoController {
    
    @Autowired
    private ProductoRepository productoRepository;
    
    @Autowired
    private KafkaTemplate<String, Producto> kafkaTemplate;

    @GetMapping(produces = {"application/x-protobuf", "application/json"})
    @CircuitBreaker(name = "dbProductos", fallbackMethod = "fallbackListar")
    @Retry(name = "dbProductos")
    public ResponseEntity<ProductoProtos.ListaProductos> listar() {
        List<Producto> productos = productoRepository.findAll();
        // crear builder de productos protobuf
        ProductoProtos.ListaProductos.Builder lista = ProductoProtos.ListaProductos.newBuilder();
        // mapear entidades JPA a protobuf
        for (Producto p : productos){
            ProductoProtos.Producto protoPro = ProductoProtos.Producto.newBuilder()
                .setId(p.getId().intValue())
                .setNombre(p.getNombre())
                .setPrecio(p.getPrecio())
                .setStock(p.getStock())
                .build();
            lista.addProductos(protoPro);
        }
        return ResponseEntity.ok(lista.build());

    }


    
    
    @PostMapping(value = "", 
    consumes = {"application/json", "application/x-protobuf"}, 
    produces = "application/x-protobuf")
    @CircuitBreaker(name = "dbProductos", fallbackMethod = "fallbackGrabar")
    public ResponseEntity<ProductoProtos.Producto> grabar(@RequestBody ProductoProtos.Producto pro) {
        // convertir de protobuf a entidad JPA
        Producto producto = new Producto();
        producto.setNombre(pro.getNombre());
        producto.setPrecio(pro.getPrecio());
        producto.setStock(pro.getStock());
        // guardar en base de datos
        Producto p = productoRepository.save(producto);
        // convertir de entidad JPA a protobuf para la respuesta
        ProductoProtos.Producto response = ProductoProtos.Producto.newBuilder()
            .setId(p.getId().intValue())
            .setNombre(p.getNombre())
            .setPrecio(p.getPrecio())
            .setStock(p.getStock())
            .build();

        return ResponseEntity.ok(response);
    }
    

    // @GetMapping
    // @CircuitBreaker(name = "dbProductos", fallbackMethod = "fallbackListar")
    // @Retry(name = "dbProductos")
    // public List<Producto> listar() {
    //     return productoRepository.findAll();
    // }

    // @PostMapping
    // @CircuitBreaker(name = "dbProductos", fallbackMethod = "fallbackGrabar")
    // public Producto grabar(@RequestBody Producto pro) {
    //     pro.setId(null);
    //     Producto p = productoRepository.save(pro);
    //     return p;
    // }
    
    // // --- MÉTODOS FALLBACK (Resiliencia) ---

    // // Si la DB falla al listar, devolvemos una lista vacía o un mensaje
    // public List<Producto> fallbackListar(Throwable e) {
    //     System.err.println("Error al listar: " + e.getMessage());
    //     return Collections.emptyList(); // Evita que el frontend explote
    // }

    // Si la DB falla al grabar, podrías informar al usuario o mandarlo a Kafka
    public Producto fallbackGrabar(Producto pro, Throwable e) {
        System.err.println("Error al grabar, circuito abierto: " + e.getMessage());
        // Creamos un objeto ficticio para avisar al frontend
        kafkaTemplate.send("productos-pendientes", pro);
        Producto errorPro = new Producto();
        errorPro.setNombre("Sistema temporalmente fuera de línea. Intente más tarde.");
        return errorPro;
    }
    
 
    @KafkaListener(topics = "productos-pendientes", groupId = "ecommerce-group")
    public void escuchar(Producto pro) {
        // Aquí procesas el producto cuando la DB esté lista
        productoRepository.save(pro);
    }
}
