package com.example.demo.controller;

import org.apache.kafka.common.protocol.types.Field.Str;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;


@RestController
@RequestMapping("/api/ventas")
@CrossOrigin(origins = "*")
public class VentaController {
    
    @Autowired
    private KafkaTemplate<String, String> kafkaTemplate;

    @PostMapping("/{id}/{cantidad}")
    public String procesarVenta(@PathVariable Long id, @PathVariable int cantidad) {
        String mensaje = id + ":" + cantidad;
        kafkaTemplate.send("ventas", mensaje);
        return "Venta procesada";        
    }
    
}
