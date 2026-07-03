package com.ecotel.quanlytaisan.seed;

import com.ecotel.quanlytaisan.model.LyLichTemplate;
import com.ecotel.quanlytaisan.repository.LyLichTemplateRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor
public class TemplateLyLichSeeder implements CommandLineRunner {
    private final LyLichTemplateRepository lyLichTemplateRepository;

    @Override
    public void run(String... args) throws Exception {
        List<LyLichTemplate> seeds = List.of(
                buildLyLichTemplate("LL01", "Lý lịch phương tiện vận tải"),
                buildLyLichTemplate("LL02", "Lý lịch máy móc")
        );

        for (LyLichTemplate seed : seeds) {
            lyLichTemplateRepository.findByMaLyLich(seed.getMaLyLich())
                    .ifPresentOrElse(
                            existing -> {
                                existing.setTenLyLich(seed.getTenLyLich());
                                lyLichTemplateRepository.save(existing);
                            },
                            () -> lyLichTemplateRepository.save(seed)
                    );
        }
    }
    private LyLichTemplate buildLyLichTemplate(String maLyLich, String tenLyLich) {
        return LyLichTemplate.builder()
                .maLyLich(maLyLich)
                .tenLyLich(tenLyLich)
                .hieuLuc(true)
                .build();
    }
}
