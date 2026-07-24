package team4.buildweek_u5.controllers;

import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import team4.buildweek_u5.entities.Cliente;
import team4.buildweek_u5.recordsDTO.ClienteDTO;
import team4.buildweek_u5.services.ClienteService;

import java.time.LocalDate;

@RestController
@RequestMapping("/clienti")
public class ClienteController {

    private final ClienteService clienteService;

    public ClienteController(ClienteService clienteService) {
        this.clienteService = clienteService;
    }

    // POST /clienti salva nuovo cliente
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_USER')")
    public Cliente save(@RequestBody @Valid ClienteDTO body) {
        return clienteService.save(body);
    }

    // GET UNICA /clienti con filtri paginazione e ordinamento opzionali
    // GET /clienti
    // I parametri con @RequestParam(required = false) dicono a Spring:
    // "L'utente può passare questo parametro nell'URL, ma se non lo mette, lascia il valore a null".
    @GetMapping
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_USER')")
    public Page<Cliente> getAll(
            @RequestParam(required = false) Double minFatturato,        // es. /clienti?minFatturato=50000
            @RequestParam(required = false) LocalDate dataInserimento,  // es. /clienti?dataInserimento=2026-01-15
            @RequestParam(required = false) LocalDate dataUltimoContatto,
            @RequestParam(required = false) String nome,                // es. /clienti?nome=Tech
            @RequestParam(defaultValue = "0") int page,                // Numero di pagina (parte da 0)
            @RequestParam(defaultValue = "10") int size,               // Quanti elementi mostrare per pagina
            @RequestParam(defaultValue = "ragioneSociale") String sortBy, // Campo su cui ordinare (es. sedeLegale.provincia)
            @RequestParam(defaultValue = "asc") String sortOrder) {    // Direzione: "asc" o "desc"

        // Passiamo tutti i parametri ricevuti al Service che costruirà la query
        return clienteService.findAll(minFatturato, dataInserimento, dataUltimoContatto, nome, page, size, sortBy, sortOrder);
    }

    // GET /clienti/{id} findbyid
    @GetMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_USER')")
    public Cliente getById(@PathVariable Long id) {
        return clienteService.findById(id);
    }

    //  PUT /clienti/{id} modifica cliente
    @PutMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN')")
    public Cliente update(@PathVariable Long id, @RequestBody @Valid ClienteDTO body) {
        return clienteService.update(id, body);
    }

    // PATCH /clienti/{id}/ultimo-contatto?data=2026-07-21
    @PatchMapping("/{id}/ultimo-contatto")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN')")
    public Cliente patchUltimoContatto(@PathVariable Long id, @RequestParam LocalDate data) {
        return clienteService.patchUltimoContatto(id, data);
    }

    // PATCH /clienti/{id}/logo?url=http://...
    @PatchMapping("/{id}/logo")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN')")
    public Cliente patchLogo(@PathVariable Long id, @RequestParam String url) {
        return clienteService.patchLogo(id, url);
    }

    // DELETE /clienti/{id} deletebyid
    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN')")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        clienteService.delete(id);
    }

    //SOSTITUITO CON UN UNICA GET ALL CON PARAMETRI OPZIONALI
//    // ------------------ENDPOINT PER I FILTRI CUSTOM
//
//    // GET /clienti/filtro-fatturato?minFatturato=50000
//    @GetMapping("/filtro-fatturato")
//    public Page<Cliente> filterByFatturato(
//            @RequestParam Double minFatturato,
//            @RequestParam(defaultValue = "0") int page,
//            @RequestParam(defaultValue = "10") int size) {
//        return clienteService.filterByFatturato(minFatturato, page, size);
//    }
//
//    // GET /clienti/filtro-data-inserimento?data=2026-01-15
//    @GetMapping("/filtro-data-inserimento")
//    public Page<Cliente> filterByDataInserimento(
//            @RequestParam LocalDate data,
//            @RequestParam(defaultValue = "0") int page,
//            @RequestParam(defaultValue = "10") int size) {
//        return clienteService.filterByDataInserimento(data, page, size);
//    }
//
//    // GET /clienti/filtro-data-ultimo-contatto?data=2026-03-20
//    @GetMapping("/filtro-data-ultimo-contatto")
//    public Page<Cliente> filterByDataUltimoContatto(
//            @RequestParam LocalDate data,
//            @RequestParam(defaultValue = "0") int page,
//            @RequestParam(defaultValue = "10") int size) {
//        return clienteService.filterByDataUltimoContatto(data, page, size);
//    }
//
//    // GET /clienti/filtro-nome?nome=Anto
//    @GetMapping("/filtro-nome")
//    public Page<Cliente> filterByParteNome(
//            @RequestParam String nome,
//            @RequestParam(defaultValue = "0") int page,
//            @RequestParam(defaultValue = "10") int size) {
//        return clienteService.filterByParteNome(nome, page, size);
//    }
}