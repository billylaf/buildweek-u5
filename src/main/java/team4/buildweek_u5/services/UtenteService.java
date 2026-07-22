package team4.buildweek_u5.services;

import org.springframework.stereotype.Service;
import team4.buildweek_u5.repositories.UtenteRepository;

@Service
public class UtenteService {

    private final UtenteRepository utenteRepository;

    public UtenteService(UtenteRepository utenteRepository) {
        this.utenteRepository = utenteRepository;
    }
    

}
