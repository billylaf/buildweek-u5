package team4.buildweek_u5.controllers;

import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import team4.buildweek_u5.entities.Fattura;
import team4.buildweek_u5.recordsDTO.FatturaDTO;
import team4.buildweek_u5.services.FatturaService;

import java.time.LocalDate;

@RestController
@RequestMapping("/fatture")
public class FatturaController {

    private final FatturaService fatturaService;

    public FatturaController(FatturaService fatturaService) {
        this.fatturaService = fatturaService;
    }

    // POST /fatture
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Fattura save(@RequestBody @Valid FatturaDTO body) {
        return fatturaService.save(body);
    }

    // GET /fatture paginata con ordinamento
    @GetMapping
    public Page<Fattura> getAll(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sortBy) {
        return fatturaService.findAll(page, size, sortBy);
    }

    // GET /fatture/{id} findbyid
    @GetMapping("/{id}")
    public Fattura getById(@PathVariable Long id) {
        return fatturaService.findById(id);
    }

    // PUT /fatture/{id} modifica fattura
    @PutMapping("/{id}")
    public Fattura update(@PathVariable Long id, @RequestBody @Valid FatturaDTO body) {
        return fatturaService.update(id, body);
    }

    // PATCH /fatture/{id}/stato?statoId=2 cambia solo lo stato della fattura
    @PatchMapping("/{id}/stato")
    public Fattura patchStato(@PathVariable Long id, @RequestParam Long statoId) {
        return fatturaService.patchStatoFattura(id, statoId);
    }

    // DELETE /fatture/{id} deletebyid
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        fatturaService.delete(id);
    }

    // --------------------------ENDPOINT PER I FILTRI DELLE FATTURE CUSTOM

    // GET /fatture/filtro-cliente?clienteId=1
    @GetMapping("/filtro-cliente")
    public Page<Fattura> filterByCliente(
            @RequestParam Long clienteId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return fatturaService.filterByCliente(clienteId, page, size);
    }

    // GET /fatture/filtro-stato?statoId=2
    @GetMapping("/filtro-stato")
    public Page<Fattura> filterByStato(
            @RequestParam Long statoId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return fatturaService.filterByStato(statoId, page, size);
    }

    // GET /fatture/filtro-data?data=2026-05-10
    @GetMapping("/filtro-data")
    public Page<Fattura> filterByData(
            @RequestParam LocalDate data,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return fatturaService.filterByData(data, page, size);
    }

    // GET /fatture/filtro-anno?anno=2026
    @GetMapping("/filtro-anno")
    public Page<Fattura> filterByAnno(
            @RequestParam int anno,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return fatturaService.filterByAnno(anno, page, size);
    }

    // GET /fatture/filtro-importi?min=100.0&max=5000.0
    @GetMapping("/filtro-importi")
    public Page<Fattura> filterByRangeImporti(
            @RequestParam Double min,
            @RequestParam Double max,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return fatturaService.filterByRangeImporti(min, max, page, size);
    }
}