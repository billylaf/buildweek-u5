package team4.buildweek_u5.controllers;

import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
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
    public Cliente save(@RequestBody @Valid ClienteDTO body) {
        return clienteService.save(body);
    }

    // GET /clienti?page=0&size=10&sortBy=sedeLegale.provincia&sortOrder=asc
    @GetMapping
    public Page<Cliente> getAll(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "ragioneSociale") String sortBy,
            @RequestParam(defaultValue = "asc") String sortOrder) {
        return clienteService.findAll(page, size, sortBy, sortOrder);
    }

    // GET /clienti/{id} findbyid
    @GetMapping("/{id}")
    public Cliente getById(@PathVariable Long id) {
        return clienteService.findById(id);
    }

    //  PUT /clienti/{id} modifica cliente
    @PutMapping("/{id}")
    public Cliente update(@PathVariable Long id, @RequestBody @Valid ClienteDTO body) {
        return clienteService.update(id, body);
    }

    // PATCH /clienti/{id}/ultimo-contatto?data=2026-07-21
    @PatchMapping("/{id}/ultimo-contatto")
    public Cliente patchUltimoContatto(@PathVariable Long id, @RequestParam LocalDate data) {
        return clienteService.patchUltimoContatto(id, data);
    }

    // PATCH /clienti/{id}/logo?url=http://...
    @PatchMapping("/{id}/logo")
    public Cliente patchLogo(@PathVariable Long id, @RequestParam String url) {
        return clienteService.patchLogo(id, url);
    }

    // DELETE /clienti/{id} deletebyid
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        clienteService.delete(id);
    }

    // ------------------ENDPOINT PER I FILTRI CUSTOM

    // GET /clienti/filtro-fatturato?minFatturato=50000
    @GetMapping("/filtro-fatturato")
    public Page<Cliente> filterByFatturato(
            @RequestParam Double minFatturato,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return clienteService.filterByFatturato(minFatturato, page, size);
    }

    // GET /clienti/filtro-data-inserimento?data=2026-01-15
    @GetMapping("/filtro-data-inserimento")
    public Page<Cliente> filterByDataInserimento(
            @RequestParam LocalDate data,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return clienteService.filterByDataInserimento(data, page, size);
    }

    // GET /clienti/filtro-data-ultimo-contatto?data=2026-03-20
    @GetMapping("/filtro-data-ultimo-contatto")
    public Page<Cliente> filterByDataUltimoContatto(
            @RequestParam LocalDate data,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return clienteService.filterByDataUltimoContatto(data, page, size);
    }

    // GET /clienti/filtro-nome?nome=Anto
    @GetMapping("/filtro-nome")
    public Page<Cliente> filterByParteNome(
            @RequestParam String nome,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return clienteService.filterByParteNome(nome, page, size);
    }
}