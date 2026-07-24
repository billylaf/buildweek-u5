package team4.buildweek_u5.runners;

import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import team4.buildweek_u5.entities.StatoFattura;
import team4.buildweek_u5.repositories.StatoFatturaRepository;

@Component
public class StatiFatturaRunner implements CommandLineRunner {

    private final StatoFatturaRepository statoFatturaRepository;

    public StatiFatturaRunner(StatoFatturaRepository statoFatturaRepository) {
        this.statoFatturaRepository = statoFatturaRepository;
    }

    @Override
    public void run(String... args) {
        // Salva lo stato solo se non è già presente nel DB
        creaStatoSeNonEsiste("PAGATA");
        creaStatoSeNonEsiste("NON_PAGATA");
        creaStatoSeNonEsiste("IN_ATTESA");
    }

    // Metodo di supporto per non essere ripetere lo stesso codice
    private void creaStatoSeNonEsiste(String nomeStato) {
        if (statoFatturaRepository.findByNomeIgnoreCase(nomeStato).isEmpty()) {
            StatoFattura nuovoStato = new StatoFattura();
            nuovoStato.setNome(nomeStato);
            statoFatturaRepository.save(nuovoStato);
        }
    }
}