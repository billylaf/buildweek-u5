package team4.buildweek_u5.controllers;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import team4.buildweek_u5.entities.Indirizzo;
import team4.buildweek_u5.recordsDTO.IndirizzoDTO;
import team4.buildweek_u5.services.IndirizzoService;

import java.util.List;

@RestController
@RequestMapping("/indirizzi")
public class IndirizzoController {

    private final IndirizzoService indirizzoService;

    public IndirizzoController(IndirizzoService indirizzoService) {
        this.indirizzoService = indirizzoService;
    }

    @GetMapping
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_USER')")  // ← Aggiunto ROLE_
    public List<Indirizzo> getAllIndirizzi() {
        return this.indirizzoService.getAllIndirizzi();
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_USER')")  // ← Aggiunto ROLE_
    public Indirizzo getIndirizzoById(@PathVariable Long id) {
        return this.indirizzoService.getIndirizzoById(id);
    }

    @GetMapping("/cliente/{clienteId}")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_USER')")  // ← Aggiunto ROLE_
    public List<Indirizzo> getIndirizziByCliente(@PathVariable Long clienteId) {
        return this.indirizzoService.getIndirizziByCliente(clienteId);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")  // ← Aggiunto ROLE_
    public Indirizzo createIndirizzo(@RequestBody @Valid IndirizzoDTO body) {
        return this.indirizzoService.saveIndirizzo(body);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")  // ← Aggiunto ROLE_
    public Indirizzo updateIndirizzo(@PathVariable Long id,
                                     @RequestBody @Valid IndirizzoDTO body) {
        return this.indirizzoService.updateIndirizzo(id, body);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")  // ← Aggiunto ROLE_
    public void deleteIndirizzo(@PathVariable Long id) {
        this.indirizzoService.deleteIndirizzo(id);
    }

    @DeleteMapping("/cliente/{clienteId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")  // ← Aggiunto ROLE_
    public void deleteIndirizziByCliente(@PathVariable Long clienteId) {
        this.indirizzoService.deleteIndirizziByCliente(clienteId);
    }
}