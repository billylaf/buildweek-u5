package team4.buildweek_u5.services;


import jakarta.transaction.Transactional;
import jakarta.validation.ValidationException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import team4.buildweek_u5.entities.Cliente;
import team4.buildweek_u5.entities.Comune;
import team4.buildweek_u5.entities.Indirizzo;
import team4.buildweek_u5.exceptions.BadRequestException;
import team4.buildweek_u5.repositories.IndirizzoRepository;

import java.util.List;

@Slf4j
@Service
public class IndirizzoService {

    private final IndirizzoRepository indirizzoRepository;
    private final ClienteService clienteService;
    private final ComuneService comuneService;

    public IndirizzoService(IndirizzoRepository indirizzoRepository, ClienteService clienteService, ComuneService comuneService) {
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
    public Indirizzo saveIndirizzo(Indirizzo indirizzo) {

        Cliente cliente = clienteService.findById(indirizzo.getCliente().getId());
        if (cliente == null) {
            throw new BadRequestException("Cliente non trovato con ID: " + indirizzo.getCliente().getId());
        }

        Comune comune = comuneService.getComuneById(indirizzo.getComune().getId());
        if (comune == null) {
            throw new BadRequestException("Comune non trovato con ID: " + indirizzo.getComune().getId());
        }

        boolean exists = indirizzoRepository.existsByClienteIdAndTipoIndirizzo(
                cliente.getId(),
                indirizzo.getTipoIndirizzo()
        );
        if (exists) {
            throw new BadRequestException("Il cliente ha già un indirizzo di tipo " + indirizzo.getTipoIndirizzo());
        }

        return indirizzoRepository.save(indirizzo);
    }

    @Transactional
    public void deleteIndirizziByCliente(Long clienteId) {
        clienteService.findById(clienteId);
        indirizzoRepository.deleteByClienteId(clienteId);
    }

    @Transactional
    public void deleteIndirizzo(Long id) {
        if (!indirizzoRepository.existsById(id)) {
            throw new BadRequestException("Indirizzo non trovato con ID: " + id);
        }
        indirizzoRepository.deleteById(id);
    }


    @Transactional
    public Indirizzo updateIndirizzo(Long id, Indirizzo indirizzoAggiornato) {

        Indirizzo indirizzo = getIndirizzoById(id);

        Cliente cliente = clienteService.findById(indirizzoAggiornato.getCliente().getId());
        if (cliente == null) {
            throw new BadRequestException("Cliente non trovato con ID: " + indirizzoAggiornato.getCliente().getId());
        }

        Comune comune = comuneService.getComuneById(indirizzoAggiornato.getComune().getId());
        if (comune == null) {
            throw new BadRequestException("Comune non trovato con ID: " + indirizzoAggiornato.getComune().getId());
        }

        if (indirizzo.getTipoIndirizzo() != indirizzoAggiornato.getTipoIndirizzo()) {
            boolean exists = indirizzoRepository.existsByClienteIdAndTipoIndirizzo(
                    cliente.getId(),
                    indirizzoAggiornato.getTipoIndirizzo()
            );
            if (exists) {
                throw new ValidationException("Il cliente ha già un indirizzo di tipo " + indirizzoAggiornato.getTipoIndirizzo());
            }
        }

        indirizzo.setVia(indirizzoAggiornato.getVia());
        indirizzo.setCivico(indirizzoAggiornato.getCivico());
        indirizzo.setLocalita(indirizzoAggiornato.getLocalita());
        indirizzo.setCap(indirizzoAggiornato.getCap());
        indirizzo.setTipoIndirizzo(indirizzoAggiornato.getTipoIndirizzo());
        indirizzo.setCliente(cliente);
        indirizzo.setComune(comune);

        return indirizzoRepository.save(indirizzo);
    }

}
