package team4.buildweek_u5.services;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import team4.buildweek_u5.entities.StatoFattura;
import team4.buildweek_u5.exceptions.BadRequestException;
import team4.buildweek_u5.exceptions.NotFoundException;
import team4.buildweek_u5.recordsDTO.StatoFatturaDTO;
import team4.buildweek_u5.repositories.StatoFatturaRepository;

import java.util.List;

@Service
public class StatoFatturaService {

    private final StatoFatturaRepository statoFatturaRepository;


    public StatoFatturaService(StatoFatturaRepository statoFatturaRepository) {
        this.statoFatturaRepository = statoFatturaRepository;
    }

    // salvataggio a db con controllo duplicato
    public StatoFattura save(StatoFatturaDTO body) {
        statoFatturaRepository.findByNomeIgnoreCase(body.nome()).ifPresent(s -> {
            throw new BadRequestException("Lo stato fattura '" + body.nome() + "' esiste già a sistema!");
        });

        StatoFattura nuovoStato = new StatoFattura(body.nome());
        return statoFatturaRepository.save(nuovoStato);
    }

    // get all paginata
    public Page<StatoFattura> findAll(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return statoFatturaRepository.findAll(pageable);
    }

    // get all lista
    public List<StatoFattura> findAllList() {
        return statoFatturaRepository.findAll();
    }

    // find by id
    public StatoFattura findById(Long id) {
        return statoFatturaRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Stato fattura non trovato con ID: " + id));
    }

    // put modifica stato
    public StatoFattura update(Long id, StatoFatturaDTO body) {
        StatoFattura stato = findById(id);

        // verifico che il nuovo nome di stato non sia già occupato da un altro id
        statoFatturaRepository.findByNomeIgnoreCase(body.nome()).ifPresent(s -> {
            if (!s.getId().equals(id)) {
                throw new BadRequestException("Lo stato fattura '" + body.nome() + "' esiste già a sistema!");
            }
        });

        stato.setNome(body.nome());
        return statoFatturaRepository.save(stato);
    }

    // eliminazione by id
    public void delete(Long id) {
        StatoFattura stato = findById(id);
        statoFatturaRepository.delete(stato);
    }
}