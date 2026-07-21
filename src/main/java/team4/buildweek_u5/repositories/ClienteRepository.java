package team4.buildweek_u5.repositories;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import team4.buildweek_u5.entities.Cliente;

import java.time.LocalDate;

public interface ClienteRepository extends JpaRepository<Cliente, Long> {

    // derived query per filtrare per fatturato annuale
    Page<Cliente> findByFatturatoAnnualeGreaterThanEqual(Double fatturato, Pageable pageable);

    // derived query per filtrare per data di inserimento
    Page<Cliente> findByDataInserimento(LocalDate data, Pageable pageable);

    // derived query per filtrare per data ultimo contatto
    Page<Cliente> findByDataUltimoContatto(LocalDate data, Pageable pageable);

    // derived query per filtrare per parte del nome di ragione sociale
    Page<Cliente> findByRagioneSocialeContainingIgnoreCase(String nome, Pageable pageable);
}
