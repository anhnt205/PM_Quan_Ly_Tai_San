package com.ecotel.quanlytaisan.seed;

import com.ecotel.quanlytaisan.model.LyLich;
import com.ecotel.quanlytaisan.repository.LyLichRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import static org.hibernate.engine.internal.Versioning.seed;

@Component
@RequiredArgsConstructor
public class LyLichSeeder implements CommandLineRunner {
    private final LyLichRepository lyLichRepository;

    @Override
    public void run(String... args) throws Exception {
        seed(
                "LL01",
                "test1"
        );

        seed(
                "LL02",
                "test2"
        );
    }

    private void seed(String maLyLich, String tenLyLich) {
        if (!lyLichRepository.existsByMaLyLich(maLyLich)) {

            lyLichRepository.save(
                    LyLich.builder()
                            .maLyLich(maLyLich)
                            .tenLyLich(tenLyLich)
                            .hieuLuc(true)
                            .build()
            );
        }
    }
}
