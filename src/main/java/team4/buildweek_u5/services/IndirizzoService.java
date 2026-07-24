package team4.buildweek_u5.services;

import jakarta.transaction.Transactional;
import jakarta.validation.ValidationException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import team4.buildweek_u5.entities.Cliente;
import team4.buildweek_u5.entities.Comune;
import team4.buildweek_u5.entities.Indirizzo;
import team4.buildweek_u5.exceptions.BadRequestException;
import team4.buildweek_u5.recordsDTO.IndirizzoDTO;
import team4.buildweek_u5.repositories.IndirizzoRepository;

import java.util.List;

@Slf4j
@Service
public class IndirizzoService {

    private final IndirizzoRepository indirizzoRepository;
    private final ClienteService clienteService;
    private final ComuneService comuneService;

    public IndirizzoService(IndirizzoRepository indirizzoRepository,
                            ClienteService clienteService,
                            ComuneService comuneService) {
        this.indirizzoRepository = indirizzoRepository;
        this.clienteService = clienteService;
        this.comuneService = comuneService;
    }

    public List<Indirizzo> getAllIndirizzi() {
        return indirizzoRepository.findAll();
    }

    public Indirizzo getIndirizzoById(Long id) {
        return indirizzoRepository.findById(id)
                .orElseThrow(() -> new BadRequestException("Indirizzo non trovato con ID: " + id));
    }

    public List<Indirizzo> getIndirizziByCliente(Long clienteId) {
        clienteService.findById(clienteId);
        return indirizzoRepository.findByClienteId(clienteId);
    }

    @Transactional
    public Indirizzo saveIndirizzo(IndirizzoDTO dto) {

        // 1. Recupera il cliente dal database
        Cliente cliente = clienteService.findById(dto.getClienteId());
        if (cliente == null) {
            throw new BadRequestException("Cliente non trovato con ID: " + dto.getClienteId());
        }

        // 2. Recupera il comune dal database
        Comune comune = comuneService.getComuneById(dto.getComuneId());
        if (comune == null) {
            throw new BadRequestException("Comune non trovato con ID: " + dto.getComuneId());
        }

        // 3. Verifica se il cliente ha già un indirizzo di questo tipo
        boolean exists = indirizzoRepository.existsByClienteIdAndTipoIndirizzo(
                cliente.getId(),
                dto.getTipoIndirizzo()
        );
        if (exists) {
            throw new BadRequestException("Il cliente ha già un indirizzo di tipo " + dto.getTipoIndirizzo());
        }

        // 4. Crea il nuovo indirizzo usando il costruttore
        Indirizzo indirizzo = new Indirizzo(
                dto.getVia(),
                dto.getCivico(),
                dto.getLocalita(),
                dto.getCap(),
                dto.getTipoIndirizzo(),
                cliente,
                comune
        );

        // 5. Salva
        return indirizzoRepository.save(indirizzo);
    }

    @Transactional
    public Indirizzo updateIndirizzo(Long id, IndirizzoDTO dto) {
        // 1. Recupera l'indirizzo esistente
        Indirizzo indirizzo = getIndirizzoById(id);

        // 2. Recupera il cliente dal database
        Cliente cliente = clienteService.findById(dto.getClienteId());
        if (cliente == null) {
            throw new BadRequestException("Cliente non trovato con ID: " + dto.getClienteId());
        }

        // 3. Recupera il comune dal database
        Comune comune = comuneService.getComuneById(dto.getComuneId());
        if (comune == null) {
            throw new BadRequestException("Comune non trovato con ID: " + dto.getComuneId());
        }

        // 4. Verifica se il nuovo tipo è diverso da quello attuale
        if (indirizzo.getTipoIndirizzo() != dto.getTipoIndirizzo()) {
            boolean exists = indirizzoRepository.existsByClienteIdAndTipoIndirizzo(
                    cliente.getId(),
                    dto.getTipoIndirizzo()
            );
            if (exists) {
                throw new ValidationException("Il cliente ha già un indirizzo di tipo " + dto.getTipoIndirizzo());
            }
        }

        // 5. Aggiorna i campi
        indirizzo.setVia(dto.getVia());
        indirizzo.setCivico(dto.getCivico());
        indirizzo.setLocalita(dto.getLocalita());
        indirizzo.setCap(dto.getCap());
        indirizzo.setTipoIndirizzo(dto.getTipoIndirizzo());
        indirizzo.setCliente(cliente);
        indirizzo.setComune(comune);

        // 6. Salva
        return indirizzoRepository.save(indirizzo);
    }

    @Transactional
    public void deleteIndirizzo(Long id) {
        if (!indirizzoRepository.existsById(id)) {
            throw new BadRequestException("Indirizzo non trovato con ID: " + id);
        }
        indirizzoRepository.deleteById(id);
    }

    @Transactional
    public void deleteIndirizziByCliente(Long clienteId) {
        clienteService.findById(clienteId);
        indirizzoRepository.deleteByClienteId(clienteId);
    }
}