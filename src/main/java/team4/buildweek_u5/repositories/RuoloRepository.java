package team4.buildweek_u5.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import team4.buildweek_u5.entities.Ruolo;

import javax.swing.text.html.Option;
import java.util.Optional;

public interface RuoloRepository extends JpaRepository<Ruolo, Long> {
    Optional<Ruolo> findByRuolo(String ruolo);
}
