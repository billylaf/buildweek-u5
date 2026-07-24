package team4.buildweek_u5.services;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import jakarta.transaction.Transactional;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import team4.buildweek_u5.entities.Ruolo;
import team4.buildweek_u5.entities.Utente;
import team4.buildweek_u5.exceptions.BadRequestException;
import team4.buildweek_u5.exceptions.NotFoundException;
import team4.buildweek_u5.exceptions.UnauthorizedException;
import team4.buildweek_u5.recordsDTO.LoginPayloadDTO;
import team4.buildweek_u5.recordsDTO.ModificaRuoliDTO;
import team4.buildweek_u5.recordsDTO.RegistrazioneDTO;
import team4.buildweek_u5.repositories.RuoloRepository;
import team4.buildweek_u5.repositories.UtenteRepository;

import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.Objects;

@Service
public class UtenteService {

    private final UtenteRepository utenteRepository;
    private final RuoloRepository ruoloRepository;
    private final PasswordEncoder bCrypt;
    private final Cloudinary fileUploader;

    public UtenteService(UtenteRepository utenteRepository, RuoloRepository ruoloRepository, PasswordEncoder bCrypt,
                         Cloudinary fileUploader) {
        this.utenteRepository = utenteRepository;
        this.ruoloRepository = ruoloRepository;
        this.bCrypt = bCrypt;
        this.fileUploader = fileUploader;
    }

    @Transactional
    public Utente registraUtente(RegistrazioneDTO body) {
        if (utenteRepository.existsByUsername(body.username())) {
            throw new RuntimeException("Username già in uso!");
        }

        Ruolo ruoloUser = ruoloRepository.findByRuolo("ROLE_USER")
                .orElseGet(() -> {
                    Ruolo nuovoRuolo = new Ruolo("ROLE_USER");
                    return ruoloRepository.save(nuovoRuolo);
                });

        Ruolo ruoloAdmin = ruoloRepository.findByRuolo("ROLE_ADMIN")
                .orElseGet(() -> {
                    Ruolo nuovoRuolo = new Ruolo("ROLE_ADMIN");
                    return ruoloRepository.save(nuovoRuolo);
                });

        Utente nuovoUtente = new Utente(
                body.username(),
                body.nome(),
                body.cognome(),
                body.email(),
                bCrypt.encode(body.password())
        );

        String ruoloRichiesto = body.ruolo();
        if (ruoloRichiesto != null && ruoloRichiesto.equalsIgnoreCase("ROLE_ADMIN")) {
            // Solo ADMIN, non USER
            nuovoUtente.addRuolo(ruoloAdmin);
        } else {
            // Solo USER
            nuovoUtente.addRuolo(ruoloUser);
        }

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

    public void updateAvatar(String username, MultipartFile file) {
        if (file.getSize() >= 10485760) throw new BadRequestException("File size can't be more than 10MB");
        if (!(Objects.equals(file.getContentType(), "image/jpeg") || Objects.equals(file.getContentType(),
                "image/gif") || Objects.equals(file.getContentType(), "image/png") || Objects.equals(
                file.getContentType(), "image/webp")))
            throw new BadRequestException("File must be an img");

        Utente utenteFromDB = findById(username);

        try {
            Map result = fileUploader.uploader()
                    .upload(file.getBytes(), ObjectUtils.emptyMap());
            String url = (String) result.get("secure_url");
            utenteFromDB.setAvatar(url);
            this.utenteRepository.save(utenteFromDB);
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }
}