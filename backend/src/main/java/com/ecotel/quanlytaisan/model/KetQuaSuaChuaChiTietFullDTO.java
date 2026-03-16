package com.ecotel.quanlytaisan.model;

import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;
import java.util.List;

@Data
@Getter
@Setter
@EqualsAndHashCode(callSuper = true)
public class KetQuaSuaChuaChiTietFullDTO extends KetQuaSuaChuaChiTietDTO {
    private List<KetQuaSuaChuaChiTietVatTuDTO> vatTuList;
}