package team4.buildweek_u5.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import team4.buildweek_u5.entities.Comune;
import team4.buildweek_u5.entities.Provincia;

import java.util.List;
import java.util.Optional;

public interface ComuneRepository extends JpaRepository<Comune, Long> {
    Optional<Comune> findByNome(String nome);
    List<Comune> findByProvincia(Provincia provincia);
}

