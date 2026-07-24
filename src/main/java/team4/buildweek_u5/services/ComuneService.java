package team4.buildweek_u5.services;

import org.springframework.core.io.Resource;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import team4.buildweek_u5.entities.Comune;
import team4.buildweek_u5.entities.Provincia;
import team4.buildweek_u5.exceptions.BadRequestException;
import team4.buildweek_u5.exceptions.NotFoundException;
import team4.buildweek_u5.repositories.ComuneRepository;
import team4.buildweek_u5.repositories.ProvinciaRepository;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class ComuneService {
    private final ComuneRepository comuneRepository;
    private final ProvinciaRepository provinciaRepository;

    public Comune createComune(String nome, Long provinciaId) {

        if (comuneRepository.existsByNome(nome))
            throw new BadRequestException("esiste gia un comune con questo nome");

        Provincia provincia = provinciaRepository.findById(provinciaId)
                .orElseThrow(() -> new NotFoundException("provincia non trovata " + provinciaId));

        Comune comune = new Comune();
        comune.setNome(nome);
        comune.setProvincia(provincia);

        return comuneRepository.save(comune);
    }

    public List<Comune> getAllComuni() {
        return comuneRepository.findAll();
    }
    public Comune getComuneById(Long id) {
        return comuneRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Comune non trovato: " + id));
    }

    public Comune updateComune(Long id, String nome, Long provinciaId) {

        Comune comune = getComuneById(id);

        Provincia provincia = provinciaRepository.findById(provinciaId)
                .orElseThrow(() -> new NotFoundException("provincia non trovata " + provinciaId));

        comune.setNome(nome);
        comune.setProvincia(provincia);

        return comuneRepository.save(comune);
    }


    public void deleteComune(Long id) {
        Comune comune = getComuneById(id);
        comuneRepository.delete(comune);
    }
    private static final Map<String, String> ALIAS_PROVINCIA = Map.ofEntries(
            Map.entry("Ascoli Piceno", "Ascoli-Piceno"),
            Map.entry("Bolzano/Bozen", "Bolzano"),
            Map.entry("Forlì-Cesena", "Forli-Cesena"),
            Map.entry("La Spezia", "La-Spezia"),
            Map.entry("Monza e della Brianza", "Monza-Brianza"),
            Map.entry("Pesaro e Urbino", "Pesaro-Urbino"),
            Map.entry("Reggio Calabria", "Reggio-Calabria"),
            Map.entry("Reggio nell'Emilia", "Reggio-Emilia"),
            Map.entry("Valle d'Aosta/Vallée d'Aoste", "Aosta"),
            Map.entry("Verbano-Cusio-Ossola", "Verbania"),
            Map.entry("Vibo Valentia", "Vibo-Valentia")

    );

    public void importaComuni(Resource file) throws Exception {

        try (BufferedReader reader = new BufferedReader(
                new InputStreamReader(file.getInputStream(), StandardCharsets.UTF_8))) {
            reader.readLine();
            String line;
            while ((line = reader.readLine()) != null) {

                String[] colonna = line.split(";");

                String nomeComune    = colonna[2].trim();
                String nomeProvincia = colonna[3].trim();

                String nomeProvinciaCercato = ALIAS_PROVINCIA.getOrDefault(nomeProvincia, nomeProvincia);

                Provincia provincia = provinciaRepository.findByNome(nomeProvinciaCercato)
                        .orElseThrow(() -> new NotFoundException("provincia non trovata " + nomeProvincia));


                Comune comune = comuneRepository.findByNome(nomeComune)
                        .orElse(new Comune());

                comune.setNome(nomeComune);
                comune.setProvincia(provincia);

                comuneRepository.save(comune);
            }
        }
    }
}