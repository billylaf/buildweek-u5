package team4.buildweek_u5.services;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import team4.buildweek_u5.entities.Utente;
import team4.buildweek_u5.exceptions.UnauthorizedException;
import team4.buildweek_u5.recordsDTO.LoginPayloadDTO;
import team4.buildweek_u5.security.JWTTools;

@Service
public class AuthService {

    private final UtenteService utenteService;
    private final JWTTools jwtTools;
    private final PasswordEncoder passwordEncoder;

    public AuthService(UtenteService utenteService, JWTTools jwtTools, PasswordEncoder passwordEncoder) {
        this.utenteService = utenteService;
        this.jwtTools = jwtTools;
        this.passwordEncoder = passwordEncoder;
    }

    public String controllaCredenzialiEGeneraToken(LoginPayloadDTO body) {
        // cerco l'utente con l'email inserita
        Utente utente = utenteService.findByEmail(body.email());

        //confronto se la pssw dell'utente matchi quella brcryptata
        if (passwordEncoder.matches(body.password(), utente.getPassword())) {
            // se passa genero il token
            return jwtTools.createToken(utente);
        } else {
            throw new UnauthorizedException("Credenziali non valide!");
        }
    }
}