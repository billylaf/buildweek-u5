package team4.buildweek_u5.services;

import org.springframework.core.io.Resource;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import team4.buildweek_u5.entities.Provincia;
import team4.buildweek_u5.repositories.ProvinciaRepository;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;

@Service
@RequiredArgsConstructor
public class ProvinceService {
    private final ProvinciaRepository provinciaRepository;

    public void importaProvince(Resource file) throws Exception {

        try (BufferedReader reader = new BufferedReader(
                new InputStreamReader(file.getInputStream(), StandardCharsets.UTF_8))) {

            reader.readLine();

            String line;
            while ((line = reader.readLine()) != null) {

                String[] colonna = line.split(";");

                String sigla   = colonna[0].trim();
                String nome    = colonna[1].trim();
                String regione = colonna[2].trim();

                Provincia provincia = provinciaRepository.findBySigla(sigla)
                        .orElse(new Provincia());

                provincia.setSigla(sigla);
                provincia.setNome(nome);
                provincia.setRegione(regione);

                provinciaRepository.save(provincia);
            }
        }

        if (provinciaRepository.findByNome("Sud Sardegna").isEmpty()) {
            Provincia sudSardegna = new Provincia();
            sudSardegna.setSigla("SU");
            sudSardegna.setNome("Sud Sardegna");
            sudSardegna.setRegione("Sardegna");
            provinciaRepository.save(sudSardegna);
        }
    }
}