package team4.buildweek_u5.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import team4.buildweek_u5.entities.Utente;

@Repository
public interface UtenteRepository extends JpaRepository<Utente, Long> {
}
