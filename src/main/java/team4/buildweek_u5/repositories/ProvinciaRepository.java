package team4.buildweek_u5.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import team4.buildweek_u5.entities.Provincia;

import java.util.Optional;

public interface ProvinciaRepository extends JpaRepository<Provincia, Long> {
    Optional<Provincia> findBySigla(String sigla);
    Optional<Provincia> findByNome(String nome);
}

