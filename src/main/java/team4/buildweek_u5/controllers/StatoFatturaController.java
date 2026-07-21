package team4.buildweek_u5.controllers;

import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import team4.buildweek_u5.entities.StatoFattura;
import team4.buildweek_u5.recordsDTO.StatoFatturaDTO;
import team4.buildweek_u5.services.StatoFatturaService;

import java.util.List;

@RestController
@RequestMapping("/stati-fattura")
public class StatoFatturaController {

    private final StatoFatturaService statoFatturaService;

    public StatoFatturaController(StatoFatturaService statoFatturaService) {
        this.statoFatturaService = statoFatturaService;
    }

    // POST /stati-fattura
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public StatoFattura create(@RequestBody @Valid StatoFatturaDTO body) {
        return statoFatturaService.save(body);
    }

    // GET /stati-fattura paginata
    @GetMapping
    public Page<StatoFattura> getAll(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return statoFatturaService.findAll(page, size);
    }

    // GET /stati-fattura/all-list lista non paginata
    @GetMapping("/all-list")
    public List<StatoFattura> getAllList() {
        return statoFatturaService.findAllList();
    }

    // GET /stati-fattura/{id} findbyid
    @GetMapping("/{id}")
    public StatoFattura getById(@PathVariable Long id) {
        return statoFatturaService.findById(id);
    }

    // PUT /stati-fattura/{id} put di modifica stato
    @PutMapping("/{id}")
    public StatoFattura update(@PathVariable Long id, @RequestBody @Valid StatoFatturaDTO body) {
        return statoFatturaService.update(id, body);
    }

    // DELETE /stati-fattura/{id} deletebyid
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        statoFatturaService.delete(id);
    }
}