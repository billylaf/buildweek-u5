package team4.buildweek_u5.services;

import jakarta.transaction.Transactional;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import team4.buildweek_u5.entities.Ruolo;
import team4.buildweek_u5.entities.Utente;
import team4.buildweek_u5.exceptions.NotFoundException;
import team4.buildweek_u5.exceptions.UnauthorizedException;
import team4.buildweek_u5.recordsDTO.LoginPayloadDTO;
import team4.buildweek_u5.recordsDTO.ModificaRuoliDTO;
import team4.buildweek_u5.recordsDTO.RegistrazioneDTO;
import team4.buildweek_u5.repositories.RuoloRepository;
import team4.buildweek_u5.repositories.UtenteRepository;

import javax.naming.AuthenticationException;
import java.util.List;

@Service
public class UtenteService {

    private final UtenteRepository utenteRepository;
    private final RuoloRepository ruoloRepository;
    private final PasswordEncoder bCrypt;

    public UtenteService(UtenteRepository utenteRepository, RuoloRepository ruoloRepository, PasswordEncoder bCrypt) {
        this.utenteRepository = utenteRepository;
        this.ruoloRepository = ruoloRepository;
        this.bCrypt = bCrypt;
    }

    @Transactional
    public Utente registraUtente(RegistrazioneDTO body) {
        if (utenteRepository.existsByUsername(body.username())) {
            throw new RuntimeException("Username già in uso!");
        }

        Utente nuovoUtente = new Utente(body.username(),
                body.nome(),
                body.cognome(),
                body.email(),
                bCrypt.encode(body.password()));

        Ruolo ruoloUser = ruoloRepository.findByRuolo("ROLE_USER")
                .orElseThrow(() -> new RuntimeException("Errore: Ruolo ROLE_USER non trovato nel Database!"));

        nuovoUtente.addRuolo(ruoloUser);

        return utenteRepository.save(nuovoUtente);
    }

    @Transactional
    public Utente aggiungiRuoloAdUtente(String username, String nomeRuolo) {
        Utente utente = utenteRepository.findById(username)
                .orElseThrow(() -> new NotFoundException("Utente non trovato con username: " + username));

        Ruolo ruoloDaAggiungere = ruoloRepository.findByRuolo(nomeRuolo)
                .orElseThrow(() -> new RuntimeException("Ruolo " + nomeRuolo + " non trovato!"));

        utente.addRuolo(ruoloDaAggiungere);

        return utenteRepository.save(utente);
    }

    public Utente verificaCredenziali(LoginPayloadDTO body) {
        Utente utente = utenteRepository.findByEmail(body.email())
                .orElseThrow(() -> new NotFoundException(
                        "Utente non trovato"));

        if (!bCrypt.matches(body.password(), utente.getPassword())) {
            throw new UnauthorizedException("Credenziali non valide!");
        }

        return utente;
    }

    public Utente findById(String id) {
        return this.utenteRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Utente con id " + id + " non trovato"));
    }

    public Utente findByEmail(String email) {
        return this.utenteRepository.findByEmail(email)
                .orElseThrow(() -> new NotFoundException("Utente con email: " + email + " non trovato"));
    }

    public List<Utente> getAllUtenti() {
        return utenteRepository.findAll();
    }

    public Utente getMyProfile(String currentUsername) {
        return utenteRepository.findById(currentUsername)
                .orElseThrow(() -> new RuntimeException("Utente non trovato con username: " + currentUsername));
    }

    @Transactional
    public Utente updateUtente(String username, RegistrazioneDTO body) {
        Utente utente = utenteRepository.findById(username)
                .orElseThrow(() -> new RuntimeException("Utente non trovato con username: " + username));

        utente.setNome(body.nome());
        utente.setCognome(body.cognome());
        utente.setEmail(body.email());

        return utenteRepository.save(utente);
    }

    @Transactional
    public void deleteUtente(String username) {
        Utente utente = utenteRepository.findById(username)
                .orElseThrow(() -> new RuntimeException(
                        "Impossibile eliminare: Utente non trovato con username: " + username));
        utenteRepository.delete(utente);
    }

    @Transactional
    public Utente aggiornaRuoliUtente(String username, ModificaRuoliDTO body) {
        Utente utente = utenteRepository.findById(username)
                .orElseThrow(() -> new RuntimeException("Utente non trovato con username: " + username));

        utente.getRuoli()
                .clear();

        for (String nomeRuolo : body.ruoli()) {
            Ruolo ruolo = ruoloRepository.findByRuolo(nomeRuolo)
                    .orElseThrow(() -> new RuntimeException("Ruolo " + nomeRuolo + " non trovato nel database!"));

            utente.addRuolo(ruolo);
        }

        return utenteRepository.save(utente);
    }
}
