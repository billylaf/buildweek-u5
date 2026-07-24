package team4.buildweek_u5.controllers;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import team4.buildweek_u5.entities.Provincia;
import team4.buildweek_u5.recordsDTO.ProvinciaDTO;
import team4.buildweek_u5.services.ProvinciaService;

import java.util.List;

@RestController
@RequestMapping("/province")
public class ProvinciaController {

    private final ProvinciaService provinciaService;

    public ProvinciaController(ProvinciaService provinciaService) {
        this.provinciaService = provinciaService;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Provincia createProvincia(@RequestBody ProvinciaDTO body) {
        return provinciaService.createProvincia(body.sigla(), body.nome(), body.regione());
    }

    @GetMapping
    public List<Provincia> getAllProvince() {
        return provinciaService.getAllProvince();
    }

    @GetMapping("/{id}")
    public Provincia getProvinciaById(@PathVariable Long id) {
        return provinciaService.getProvinciaById(id);
    }

    @PutMapping("/{id}")
    public Provincia updateProvincia(@PathVariable Long id, @RequestBody ProvinciaDTO body) {
        return provinciaService.updateProvincia(id, body.sigla(), body.nome(), body.regione());
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteProvincia(@PathVariable Long id) {
        provinciaService.deleteProvincia(id);
    }
}