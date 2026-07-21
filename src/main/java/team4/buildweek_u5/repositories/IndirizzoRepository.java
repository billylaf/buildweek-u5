package team4.buildweek_u5.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import team4.buildweek_u5.entities.Indirizzo;
import team4.buildweek_u5.enums.TipoIndirizzo;

import java.util.List;
import java.util.Optional;

public interface IndirizzoRepository extends JpaRepository<Indirizzo, Long> {

    List<Indirizzo> findbyClienteId(long clienteId);

    Optional<Indirizzo> findByClienteIdAndTipoIndirizzo(Long clienteId, TipoIndirizzo tipo);

    long countByClienteId(Long clienteId);

    void deleteByClienteId(Long clienteId);

    @Query("SELECT COUNT(i) FROM Indirizzo i WHERE i.cliente.id = :clienteId")
    long countIndirizziByClienteId(@Param("clienteId") Long clienteId);

}
