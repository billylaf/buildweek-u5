package team4.buildweek_u5.repositories;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import team4.buildweek_u5.entities.Fattura;

import java.time.LocalDate;

public interface FatturaRepository extends JpaRepository<Fattura, Long> {

    // derived query per trovare la fattura da un cliente dall'id
    Page<Fattura> findByClienteId(Long clienteId, Pageable pageable);

    //  derived query filtro per stato fattura
    Page<Fattura> findByStatoFatturaId(Long statoFatturaId, Pageable pageable);

    //  derived query filtro per data fattura
    Page<Fattura> findByDataFattura(LocalDate data, Pageable pageable);

    // filtro per anno jpql poichè non posso estrapolare solo l'anno in una derived query
    @Query("SELECT f FROM Fattura f WHERE YEAR(f.dataFattura) = :anno")
    Page<Fattura> findByAnno(@Param("anno") int anno, Pageable pageable);

    //  derived query per filtro per range di importi
    Page<Fattura> findByImportoBetween(Double importoMin, Double importoMax, Pageable pageable);
}