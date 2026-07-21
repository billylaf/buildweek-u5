package team4.buildweek_u5.services;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import team4.buildweek_u5.entities.Cliente;
import team4.buildweek_u5.exceptions.NotFoundException;
import team4.buildweek_u5.recordsDTO.ClienteDTO;
import team4.buildweek_u5.repositories.ClienteRepository;

import java.time.LocalDate;

@Service
public class ClienteService {

    private final ClienteRepository clienteRepository;

    public ClienteService(ClienteRepository clienteRepository) {
        this.clienteRepository = clienteRepository;
    }

    // salvataggio nuovo cliente
    public Cliente save(ClienteDTO body) {
        Cliente cliente = new Cliente();
        mappaDtoSuEntita(cliente, body);
        cliente.setDataInserimento(LocalDate.now()); // data di inserimento ad oggi
        return clienteRepository.save(cliente);
    }

    // ricerca impaginata con ordinamento
    public Page<Cliente> findAll(int page, int size, String sortBy, String sortOrder) {
        Sort sort = sortOrder.equalsIgnoreCase("desc")
                ? Sort.by(sortBy).descending()
                : Sort.by(sortBy).ascending();

        Pageable pageable = PageRequest.of(page, size, sort);
        return clienteRepository.findAll(pageable);
    }

    // find by id
    public Cliente findById(Long id) {
        return clienteRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Cliente non trovato con ID: " + id));
    }

    // put per update cliente
    public Cliente update(Long id, ClienteDTO body) {
        Cliente cliente = findById(id); // notFoundException se id non è presente a db
        mappaDtoSuEntita(cliente, body);
        return clienteRepository.save(cliente);
    }

    // patch aggiorna solo la data di ultimo contatto
    public Cliente patchUltimoContatto(Long id, LocalDate data) {
        Cliente cliente = findById(id);
        cliente.setDataUltimoContatto(data);
        return clienteRepository.save(cliente);
    }

    // patch aggiorna solo il logo aziendale
    public Cliente patchLogo(Long id, String urlLogo) {
        Cliente cliente = findById(id);
        cliente.setLogoAziendale(urlLogo);
        return clienteRepository.save(cliente);
    }

    // delete by id
    public void delete(Long id) {
        Cliente cliente = findById(id); // notFoundException se id non è presente a db
        clienteRepository.delete(cliente);
    }

    // DERIVED QUERY PER METODI DI FILTRO SPECIFICI -----------------

    public Page<Cliente> filterByFatturato(Double fatturato, int page, int size) {
        return clienteRepository.findByFatturatoAnnualeGreaterThanEqual(fatturato, PageRequest.of(page, size));
    }

    public Page<Cliente> filterByDataInserimento(LocalDate data, int page, int size) {
        return clienteRepository.findByDataInserimento(data, PageRequest.of(page, size));
    }

    public Page<Cliente> filterByDataUltimoContatto(LocalDate data, int page, int size) {
        return clienteRepository.findByDataUltimoContatto(data, PageRequest.of(page, size));
    }

    public Page<Cliente> filterByParteNome(String nome, int page, int size) {
        return clienteRepository.findByRagioneSocialeContainingIgnoreCase(nome, PageRequest.of(page, size));
    }

    // Metodo di utility helper per la mappatura dei campi
    private void mappaDtoSuEntita(Cliente cliente, ClienteDTO body) {
        cliente.setRagioneSociale(body.ragioneSociale());
        cliente.setPartitaIva(body.partitaIva());
        cliente.setEmail(body.email());
        cliente.setDataUltimoContatto(body.dataUltimoContatto());
        cliente.setFatturatoAnnuale(body.fatturatoAnnuale());
        cliente.setPec(body.pec());
        cliente.setTelefono(body.telefono());
        cliente.setEmailContatto(body.emailContatto());
        cliente.setNomeContatto(body.nomeContatto());
        cliente.setCognomeContatto(body.cognomeContatto());
        cliente.setTelefonoContatto(body.telefonoContatto());
        cliente.setLogoAziendale(body.logoAziendale());
        cliente.setTipoCliente(body.tipoCliente());
    }
}