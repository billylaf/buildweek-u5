package team4.buildweek_u5.runners;

import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Component;
import team4.buildweek_u5.services.ComuniService;
import team4.buildweek_u5.services.ProvinceService;

@Component
@RequiredArgsConstructor
public class CsvRunner implements CommandLineRunner {

    private final ProvinceService ProvinceService;
    private final ComuniService ComuniService;

    @Override
    public void run(String... args) throws Exception {

        Resource provinceCsv = new FileSystemResource("src/main/resources/public/province-italiane.csv");
        Resource comuniCsv   = new FileSystemResource("src/main/resources/public/comuni-italiani.csv");

        ProvinceService.importaProvince(provinceCsv);
        ComuniService.importaComuni(comuniCsv);

        System.out.println("importazione completata");
    }
}