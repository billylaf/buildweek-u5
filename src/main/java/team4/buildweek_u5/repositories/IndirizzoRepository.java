package team4.buildweek_u5.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import team4.buildweek_u5.entities.Indirizzo;
import team4.buildweek_u5.enums.TipoIndirizzo;

import java.util.List;
import java.util.Optional;

public interface IndirizzoRepository extends JpaRepository<Indirizzo, Long> {

    List<Indirizzo> findbyClienteId(long clienteId);

    Optional<Indirizzo> findByClienteIdAndTipoIndirizzo(Long clienteId, TipoIndirizzo tipo);

    void deleteByClienteId(Long clienteId);

    boolean existsByClienteIdAndTipoIndirizzo(Long clienteId, TipoIndirizzo tipo);


}
