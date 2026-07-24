package team4.buildweek_u5.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import team4.buildweek_u5.entities.StatoFattura;

import java.util.Optional;

public interface StatoFatturaRepository extends JpaRepository<StatoFattura, Long> {
    // derived query utile per verificare se esiste già uno stato con il nome prima di crearlo
    Optional<StatoFattura> findByNomeIgnoreCase(String nome); // ignorecase ignora se min o maiusc
}
