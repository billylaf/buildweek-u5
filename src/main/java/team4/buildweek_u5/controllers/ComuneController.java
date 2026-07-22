package team4.buildweek_u5.controllers;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import team4.buildweek_u5.entities.Comune;
import team4.buildweek_u5.recordsDTO.ComuneDTO;
import team4.buildweek_u5.services.ComuneService;

import java.util.List;

@RestController
@RequestMapping("/comuni")
public class ComuneController {

    private final ComuneService comuneService;

    public ComuneController(ComuneService comuneService) {
        this.comuneService = comuneService;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Comune createComune(@RequestBody ComuneDTO body) {
        return comuneService.createComune(body.nome(), body.provinciaId());
    }

    @GetMapping
    public List<Comune> getAllComuni() {
        return comuneService.getAllComuni();
    }

    @GetMapping("/{id}")
    public Comune getComuneById(@PathVariable Long id) {
        return comuneService.getComuneById(id);
    }

    @PutMapping("/{id}")
    public Comune updateComune(@PathVariable Long id, @RequestBody ComuneDTO body) {
        return comuneService.updateComune(id, body.nome(), body.provinciaId());
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteComune(@PathVariable Long id) {
        comuneService.deleteComune(id);
    }
}