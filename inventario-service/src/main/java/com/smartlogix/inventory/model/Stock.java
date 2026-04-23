package com.smartlogix.inventory.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "stock")
public class Stock {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    private String nombre;

    @NotNull
    @Min(0)
    private Double precio;

    @NotNull
    @Min(0)
    private Integer cantidad;

    /**
     * Tipo de producto: ESTANDAR | FRAGIL | PERECIBLE
     * Determina las reglas de almacenamiento y alerta de stock bajo.
     */
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TipoStock tipo;

    private Integer stockMinimo;

    public enum TipoStock {
        ESTANDAR, FRAGIL, PERECIBLE
    }
}
