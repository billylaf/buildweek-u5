package team4.buildweek_u5.controllers;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import team4.buildweek_u5.entities.Utente;
import team4.buildweek_u5.recordsDTO.*;
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
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @ResponseStatus(HttpStatus.CREATED)
    public RegistrazioneResponseDTO createAccount(@RequestBody @Validated RegistrazioneDTO body) {
        return new RegistrazioneResponseDTO(this.utenteService.registraUtente(body)
                .getUsername());
    }

    @GetMapping
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public List<Utente> getAllUtenti() {
        return utenteService.getAllUtenti();
    }

    @GetMapping("/me")
    public Utente getMyProfile(@AuthenticationPrincipal Utente currentUtente) {
        return currentUtente;
    }

    @PutMapping("/{username}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public Utente updateUtenteByAdmin(
            @PathVariable String username,
            @RequestBody @Valid RegistrazioneDTO body) {

        return utenteService.updateUtente(username, body);
    }

    @DeleteMapping("/{username}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteUtenteByAdmin(@PathVariable String username) {
        utenteService.deleteUtente(username);
    }

    @PutMapping("/{username}/ruoli")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public Utente aggiornaRuoliUtente(
            @PathVariable String username,
            @RequestBody @Valid ModificaRuoliDTO body) {

        return utenteService.aggiornaRuoliUtente(username, body);
    }

    @PatchMapping("/me/avatar")
    public void updateAvatar(@AuthenticationPrincipal Utente currentUtente,
                             @RequestParam("avatar") MultipartFile file) {
        this.utenteService.updateAvatar(currentUtente.getUsername(), file);
    }

//    @PostMapping("/invio-email")
//    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
//    @ResponseStatus(HttpStatus.OK)
//    public void inviaEmailAdUtente(@RequestBody @Valid EmailRequestDTO body) {
//        this.emailSender.sendEmail(body.emailDestinatario(), body.oggetto(), body.messaggio());
//    }

}
