package com.smartlogix.inventory.repository;

import com.smartlogix.inventory.model.Stock;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface StockRepository extends JpaRepository<Stock, Long> {

    List<Stock> findByTipo(Stock.TipoStock tipo);

    @Query("SELECT s FROM Stock s WHERE s.cantidad <= s.stockMinimo")
    List<Stock> findStockBajo();
}
