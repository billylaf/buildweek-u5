package team4.buildweek_u5.controllers;

import org.springframework.http.HttpStatus;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import team4.buildweek_u5.recordsDTO.RegistrazioneDTO;
import team4.buildweek_u5.recordsDTO.RegistrazioneResponseDTO;
import team4.buildweek_u5.services.UtenteService;

import java.util.List;

@RestController
@RequestMapping("/utenti")
public class UtenteController {

    private final UtenteService utenteService;

    public UtenteController(UtenteService utenteService) {

        this.utenteService = utenteService;
    }


    @PostMapping("/register")
    @ResponseStatus(HttpStatus.CREATED)
    public RegistrazioneResponseDTO createAccount(@RequestBody @Validated RegistrazioneDTO body) {

        return new RegistrazioneResponseDTO(this.utenteService.saveUtente(body)
                .getId());
    }

}
