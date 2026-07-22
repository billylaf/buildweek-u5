package team4.buildweek_u5.runners;

import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import team4.buildweek_u5.entities.Ruolo;
import team4.buildweek_u5.repositories.RuoloRepository;

@Component
public class RuoliRunner implements CommandLineRunner {

    private final RuoloRepository ruoloRepository;

    public RuoliRunner(RuoloRepository ruoloRepository) {
        this.ruoloRepository = ruoloRepository;
    }

    @Override
    public void run(String... args) {
        if (ruoloRepository.findByRuolo("ROLE_USER").isEmpty()) {
            ruoloRepository.save(new Ruolo("ROLE_USER"));
        }

        if (ruoloRepository.findByRuolo("ROLE_ADMIN").isEmpty()) {
            ruoloRepository.save(new Ruolo("ROLE_ADMIN"));
        }
    }
}
