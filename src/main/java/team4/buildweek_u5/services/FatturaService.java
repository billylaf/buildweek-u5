package team4.buildweek_u5.services;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import team4.buildweek_u5.entities.Cliente;
import team4.buildweek_u5.entities.Fattura;
import team4.buildweek_u5.entities.StatoFattura;
import team4.buildweek_u5.exceptions.BadRequestException;
import team4.buildweek_u5.exceptions.NotFoundException;
import team4.buildweek_u5.recordsDTO.FatturaDTO;
import team4.buildweek_u5.repositories.FatturaRepository;

import java.time.LocalDate;

@Service
public class FatturaService {

    private final FatturaRepository fatturaRepository;
    private final ClienteService clienteService;
    private final StatoFatturaService statoFatturaService;

    public FatturaService(FatturaRepository fatturaRepository,
                          ClienteService clienteService,
                          StatoFatturaService statoFatturaService) {
        this.fatturaRepository = fatturaRepository;
        this.clienteService = clienteService;
        this.statoFatturaService = statoFatturaService;
    }

    // save di una nuova fattura
    public Fattura save(FatturaDTO body) {
        // riutilizzo i findbyid in modo tale da poter lanciere il notfound in caso non siano presenti a db
        Cliente cliente = clienteService.findById(body.clienteId());
        StatoFattura statoFattura = statoFatturaService.findById(body.statoFatturaId());

        Fattura fattura = new Fattura();
        fattura.setDataFattura(body.dataFattura());
        fattura.setImporto(body.importo());
        fattura.setNumeroFattura(body.numeroFattura());
        fattura.setCliente(cliente);
        fattura.setStatoFattura(statoFattura);

        return fatturaRepository.save(fattura);
    }

    // find all paginata ed ordinata
    public Page<Fattura> findAll(int page, int size, String sortBy) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(sortBy));
        return fatturaRepository.findAll(pageable);
    }

    // findbyid
    public Fattura findById(Long id) {
        return fatturaRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Fattura non trovata con ID: " + id));
    }

    // put per update fattura
    public Fattura update(Long id, FatturaDTO body) {
        Fattura fattura = findById(id);
        Cliente cliente = clienteService.findById(body.clienteId());
        StatoFattura statoFattura = statoFatturaService.findById(body.statoFatturaId());

        fattura.setDataFattura(body.dataFattura());
        fattura.setImporto(body.importo());
        fattura.setNumeroFattura(body.numeroFattura());
        fattura.setCliente(cliente);
        fattura.setStatoFattura(statoFattura);

        return fatturaRepository.save(fattura);
    }

    // patch per aggiornare solo lo stato della fattura
    public Fattura patchStatoFattura(Long id, Long nuovoStatoId) {
        Fattura fattura = findById(id);
        StatoFattura nuovoStato = statoFatturaService.findById(nuovoStatoId);
        fattura.setStatoFattura(nuovoStato);
        return fatturaRepository.save(fattura);
    }

    // delete by id di una fattura
    public void delete(Long id) {
        Fattura fattura = findById(id);
        fatturaRepository.delete(fattura);
    }

    // DERIVED QUERY PER METODI DI FILTRO SPECIFICI -----------------

    public Page<Fattura> filterByCliente(Long clienteId, int page, int size) {
        clienteService.findById(clienteId); // verifico prima se il cliente esiste
        return fatturaRepository.findByClienteId(clienteId, PageRequest.of(page, size));
    }

    public Page<Fattura> filterByStato(Long statoId, int page, int size) {
        statoFatturaService.findById(statoId); // verifico prima se lo stato esiste
        return fatturaRepository.findByStatoFatturaId(statoId, PageRequest.of(page, size));
    }

    public Page<Fattura> filterByData(LocalDate data, int page, int size) {
        return fatturaRepository.findByDataFattura(data, PageRequest.of(page, size));
    }

    public Page<Fattura> filterByAnno(int anno, int page, int size) {
        return fatturaRepository.findByAnno(anno, PageRequest.of(page, size));
    }

    // filtro per range importi con controllo di validità
    public Page<Fattura> filterByRangeImporti(Double min, Double max, int page, int size) {
        if (min > max) {
            throw new BadRequestException("L'importo minimo non può essere maggiore di quello massimo!"); // errore se importo min > max nella ricerca
        }
        return fatturaRepository.findByImportoBetween(min, max, PageRequest.of(page, size));
    }
}