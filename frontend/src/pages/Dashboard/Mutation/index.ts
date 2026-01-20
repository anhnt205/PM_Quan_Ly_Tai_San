import React from "react";
import { useQuery } from "@tanstack/react-query";
import api from "../../../config/api.config";

const fetchStatistics = async () => {
  const res = await api.get("/dashboard/statistics");
  return res.data;
};

const fetchTaiSanSapHetHan = async () => {
  const res = await api.get("/dashboard/tai-san-sap-het-han-khau-hao");
  return res.data;
};

const fetchTaiSanTheoNhom = async () => {
  const res = await api.get("/dashboard/tai-san-theo-nhom-phan-tram-chi-tiet");
  return res.data;
};

const fetchCCDCTheoNhom = async (nam: number) => {
  const res = await api.get("/dashboard/ccdc-theo-nhom-phan-tram-chi-tiet", {
    params: { idcongty: "ct001", nam },
  });
  return res.data;
};

const fetchNhomCCDCList = async () => {
  const res = await api.get("/nhomccdc", { params: { idcongty: "ct001" } });
  return res.data;
};

const fetchAllCCDC = async () => {
  const res = await api.get("/ccdcvattu/paged", {
    params: { idcongty: "ct001", page: 0, size: 1000 },
  });
  return res.data;
};

const fetchAllLoaiCCDC = async () => {
  const res = await api.get("/loaiccdccon", { params: { idcongty: "ct001" } });
  return res.data;
};

const fetchAllTaiSan = async () => {
  const res = await api.get("/taisan/paged", {
    params: { idcongty: "ct001", page: 0, size: 10000 },
  });
  return res.data;
};

const fetchTaiSanTheoLoai = async (nhomId?: string) => {
  const res = await api.get("/dashboard/tai-san-theo-nhom-loai-con-phan-tram", {
    params: nhomId ? { nhomId } : {},
  });
  return res.data;
};

const fetchCCDCTheoLoai = async (nhomId?: string) => {
  const res = await api.get("/dashboard/ccdc-theo-nhom-loai-con-phan-tram", {
    params: nhomId ? { nhomId } : {},
  });
  return res.data.data;
};

export const useDashboardMutation = (
  selectedNhomTaiSan?: string,
  selectedNhomCCDC?: string,
  namTaiSan: number = new Date().getFullYear(),
  namCCDC: number = new Date().getFullYear(),
) => {
  // queries
  const { data: statistics, isLoading: isLoadingStatistics } = useQuery({
    queryKey: ["dashboard-statistics"],
    queryFn: fetchStatistics,
    staleTime: 5 * 60 * 1000,
  });

  const { data: taiSanSapHet, isLoading: isLoadingTaiSanSapHet } = useQuery({
    queryKey: ["dashboard-tai-san-sap-het"],
    queryFn: fetchTaiSanSapHetHan,
    staleTime: 5 * 60 * 1000,
  });

  const { data: taiSanTheoNhom, isLoading: isLoadingTaiSanTheoNhom } = useQuery(
    {
      queryKey: ["dashboard-tai-san-theo-nhom"],
      queryFn: fetchTaiSanTheoNhom,
      staleTime: 5 * 60 * 1000,
    },
  );

  const { data: ccdcTheoNhom, isLoading: isLoadingCCDCTheoNhom } = useQuery({
    queryKey: ["dashboard-ccdc-theo-nhom", namCCDC],
    queryFn: () => fetchCCDCTheoNhom(namCCDC),
    staleTime: 5 * 60 * 1000,
  });

  const { data: nhomCCDCList, isLoading: isLoadingNhomCCDCList } = useQuery({
    queryKey: ["nhom-ccdc-list"],
    queryFn: fetchNhomCCDCList,
    staleTime: 5 * 60 * 1000,
  });

  const { data: allCCDCData, isLoading: isLoadingAllCCDC } = useQuery({
    queryKey: ["all-ccdc-for-dropdown"],
    queryFn: fetchAllCCDC,
    staleTime: 5 * 60 * 1000,
  });

  const { data: allLoaiCCDC, isLoading: isLoadingAllLoaiCCDC } = useQuery({
    queryKey: ["all-loai-ccdc"],
    queryFn: fetchAllLoaiCCDC,
    staleTime: 5 * 60 * 1000,
  });

  const { data: allTaiSanData, isLoading: isLoadingAllTaiSan } = useQuery({
    queryKey: ["all-tai-san-for-dashboard"],
    queryFn: fetchAllTaiSan,
    staleTime: 5 * 60 * 1000,
  });

  const { data: taiSanTheoLoai, isLoading: isLoadingTaiSanTheoLoai } = useQuery(
    {
      queryKey: ["dashboard-tai-san-theo-loai", selectedNhomTaiSan],
      queryFn: () => fetchTaiSanTheoLoai(selectedNhomTaiSan),
      staleTime: 5 * 60 * 1000,
      enabled: !!selectedNhomTaiSan,
    },
  );

  const { data: ccdcTheoLoai = [], isLoading: isLoadingCCDCTheoLoai } =
    useQuery({
      queryKey: ["dashboard-ccdc-theo-loai", selectedNhomCCDC],
      queryFn: () => fetchCCDCTheoLoai(selectedNhomCCDC),
      staleTime: 5 * 60 * 1000,
      enabled: !!selectedNhomCCDC,
    });

  const taiSanTheoThangFromStats = React.useMemo(() => {
    if (!statistics || !statistics.data) return [];
    return (
      statistics.data.taiSanTangMoiTheoThang ||
      statistics.data.taiSanTheoThang ||
      []
    );
  }, [statistics]);

  const ccdcTheoThangFromStats = React.useMemo(() => {
    if (!statistics || !statistics.data) return [];
    return (
      statistics.data.ccdcTangMoiTheoThang ||
      statistics.data.ccdcTheoThang ||
      []
    );
  }, [statistics]);

  const top5TaiSanFromStats = React.useMemo(() => {
    if (!statistics || !statistics.data) return [];
    return (
      statistics.data.top5TaiSan ||
      statistics.data.top5 ||
      statistics.data.top5TaiSanGiaTri ||
      statistics.data.top5TaiSanGiaTriCao ||
      []
    );
  }, [statistics]);

  // helpers
  const nhomCCDCMap = React.useMemo(() => {
    const map = new Map<string, any>();
    const nhomList = Array.isArray(nhomCCDCList)
      ? nhomCCDCList
      : nhomCCDCList?.data || [];
    nhomList.forEach((nhom: any) => {
      const key =
        nhom?.id !== undefined && nhom?.id !== null
          ? String(nhom.id).trim()
          : "";
      map.set(key, nhom.ten || nhom.tenNhom);
    });
    return map;
  }, [nhomCCDCList]);

  const loaiCCDCMap = React.useMemo(() => {
    const map = new Map<string, any>();
    const loaiList = Array.isArray(allLoaiCCDC)
      ? allLoaiCCDC
      : allLoaiCCDC?.data || [];
    loaiList.forEach((loai: any) => {
      const key =
        loai?.id !== undefined && loai?.id !== null
          ? String(loai.id).trim()
          : "";
      map.set(key, loai.tenLoai);
    });
    return map;
  }, [allLoaiCCDC]);

  const extractCCDCItems = React.useCallback((data: any) => {
    if (!data) return [];
    if (data?.data?.items) return data.data.items;
    if (data?.items) return data.items;
    if (data?.data?.content) return data.data.content;
    if (data?.content) return data.content;
    if (Array.isArray(data?.data)) return data.data;
    if (Array.isArray(data)) return data;
    return [];
  }, []);

  const getGroupValue = React.useCallback(
    (item: any) => {
      if (!item) return "Chưa xác định";
      const possibleKeys = [
        "Nhóm CCDC",
        "Nhom CCDC",
        "nhom CCDC",
        "nhomCCDC",
        "NhomCCDC",
        "tenNhomCCDC",
        "tenNhom",
        "nhom",
        "Nhóm",
      ];
      for (const key of possibleKeys) {
        if (Object.prototype.hasOwnProperty.call(item, key)) {
          const v = item[key];
          if (v !== undefined && v !== null && String(v).trim() !== "")
            return String(v).trim();
        }
      }
      const idNhomRaw =
        item.idNhomCCDC !== undefined && item.idNhomCCDC !== null
          ? String(item.idNhomCCDC).trim()
          : "";
      if (idNhomRaw) {
        if (nhomCCDCMap.has(idNhomRaw)) return nhomCCDCMap.get(idNhomRaw);
        return idNhomRaw;
      }
      const fallback =
        item.tenNhomCCDC || item.nhomCCDC || item.nhom || item.tenNhom;
      const strVal =
        fallback !== undefined && fallback !== null
          ? String(fallback).trim()
          : "";
      if (strVal) {
        const strKey = String(strVal).trim();
        if (nhomCCDCMap.has(strKey)) return nhomCCDCMap.get(strKey);
        return strVal;
      }
      return "Chưa xác định";
    },
    [nhomCCDCMap],
  );

  const nhomCCDCListNormalized = React.useMemo(() => {
    if (!nhomCCDCList) return [];
    return Array.isArray(nhomCCDCList) ? nhomCCDCList : nhomCCDCList.data || [];
  }, [nhomCCDCList]);

  const normalizeGroupItems = (items: any[]): any[] => {
    if (!items || !Array.isArray(items)) return [];
    const mapped = items.map((it: any) => {
      const idRaw =
        it.id !== undefined && it.id !== null
          ? String(it.id).trim()
          : it.Id !== undefined && it.Id !== null
            ? String(it.Id).trim()
            : it.idNhomCCDC !== undefined && it.idNhomCCDC !== null
              ? String(it.idNhomCCDC).trim()
              : it.IdNhomCCDC !== undefined && it.IdNhomCCDC !== null
                ? String(it.IdNhomCCDC).trim()
                : it.idNhom !== undefined && it.idNhom !== null
                  ? String(it.idNhom).trim()
                  : "";
      const ten =
        it.tenNhom ||
        it.TenNhom ||
        it.ten ||
        it.Ten ||
        it.nhom ||
        it.tenGroup ||
        it.name ||
        "";
      const id = idRaw || (ten ? String(ten).trim() : "");
      const soLuongRaw =
        it.soLuong ??
        it.SoLuong ??
        it.count ??
        it.so_luong ??
        it.sl ??
        it.value ??
        0;
      const soLuong =
        typeof soLuongRaw === "string"
          ? Number(String(soLuongRaw).replace(/[^0-9.-]+/g, ""))
          : Number(soLuongRaw || 0);
      const phanTramRaw =
        it.phanTram ??
        it.phan_tram ??
        it.percent ??
        it.tiLe ??
        it.TiLePhanTram ??
        it.TiLe ??
        null;
      const phanTram = phanTramRaw != null ? Number(phanTramRaw) : null;
      return { ...it, id, ten, soLuong, phanTram };
    });

    const anyHasPercent = mapped.some(
      (m) => m.phanTram != null && !Number.isNaN(m.phanTram),
    );
    if (!anyHasPercent) {
      const total =
        mapped.reduce((s, m) => s + (Number(m.soLuong) || 0), 0) || 1;
      mapped.forEach((m) => {
        m.phanTram = total > 0 ? (Number(m.soLuong) / total) * 100 : 0;
      });
    }

    return mapped;
  };

  const ccdcTheoNhomNormalized = normalizeGroupItems(
    ccdcTheoNhom?.data || ccdcTheoNhom || [],
  );
  const taiSanTheoNhomNormalized = normalizeGroupItems(
    taiSanTheoNhom?.data || taiSanTheoNhom || [],
  );

  const uniqueNhomCCDC = React.useMemo(() => {
    if (ccdcTheoNhomNormalized && ccdcTheoNhomNormalized.length > 0) {
      return ccdcTheoNhomNormalized.map((n: any) => ({
        id: n.id || n.ten,
        tenNhom: n.ten,
      }));
    }
    if (nhomCCDCListNormalized.length > 0) {
      return nhomCCDCListNormalized.map((n: any) => ({
        id: n.id,
        tenNhom: n.ten || n.tenNhom,
      }));
    }
    return [];
  }, [ccdcTheoNhomNormalized, nhomCCDCListNormalized]);

  const ccdcTheoNhomByData = React.useMemo(() => {
    const items = extractCCDCItems(allCCDCData);
    if (items.length === 0) return [];
    const nhomCountMap = new Map<string, number>();
    let validItemsCount = 0;
    items.forEach((item: any) => {
      const tenNhom = getGroupValue(item);
      if (tenNhom !== "Chưa xác định") {
        const cur = nhomCountMap.get(tenNhom) || 0;
        nhomCountMap.set(tenNhom, cur + 1);
        validItemsCount++;
      }
    });
    if (validItemsCount === 0) return [];
    return Array.from(nhomCountMap.entries()).map(([ten, soLuong]) => ({
      ten,
      soLuong,
      phanTram: validItemsCount > 0 ? (soLuong / validItemsCount) * 100 : 0,
    }));
  }, [allCCDCData, extractCCDCItems, getGroupValue]);

  const { tongCCDC, tongGiaTriCCDC } = React.useMemo(() => {
    const items = extractCCDCItems(allCCDCData);
    const tong = items.length;
    const tongGiaTri = items.reduce(
      (sum: number, item: any) => sum + (item.giaTri || item.thanhTien || 0),
      0,
    );
    return { tongCCDC: tong, tongGiaTriCCDC: tongGiaTri };
  }, [allCCDCData, extractCCDCItems]);

  const ccdcTheoThangByNgayNhap = React.useMemo(() => {
    const items = extractCCDCItems(allCCDCData);
    const thangMap = new Map<string, number>();
    items.forEach((item: any) => {
      if (item.ngayNhap) {
        const date = new Date(item.ngayNhap);
        const thang = date.getMonth() + 1;
        const nam = date.getFullYear();
        const key = `${nam}-${thang}`;
        const cur = thangMap.get(key) || 0;
        thangMap.set(key, cur + 1);
      }
    });
    return Array.from(thangMap.entries())
      .map(([key, soLuong]) => {
        const [nam, thang] = key.split("-").map(Number);
        return { thang, nam, soLuong };
      })
      .sort((a, b) => (a.nam !== b.nam ? a.nam - b.nam : a.thang - b.thang));
  }, [allCCDCData, extractCCDCItems]);

  const extractTaiSanItems = React.useCallback((data: any) => {
    if (!data) return [];
    if (data?.data?.items) return data.data.items;
    if (data?.items) return data.items;
    if (data?.data?.content) return data.data.content;
    if (data?.content) return data.content;
    if (Array.isArray(data?.data)) return data.data;
    if (Array.isArray(data)) return data;
    return [];
  }, []);

  const taiSanTheoThangByNgayVaoSo = React.useMemo(() => {
    const items = extractTaiSanItems(allTaiSanData);
    const thangMap = new Map<string, number>();
    items.forEach((item: any) => {
      if (item.ngayVaoSo) {
        const date = new Date(item.ngayVaoSo);
        const thang = date.getMonth() + 1;
        const nam = date.getFullYear();
        const key = `${nam}-${thang}`;
        const cur = thangMap.get(key) || 0;
        thangMap.set(key, cur + 1);
      }
    });
    return Array.from(thangMap.entries())
      .map(([key, soLuong]) => {
        const [nam, thang] = key.split("-").map(Number);
        return { thang, nam, soLuong };
      })
      .sort((a, b) => (a.nam !== b.nam ? a.nam - b.nam : a.thang - b.thang));
  }, [allTaiSanData, extractTaiSanItems]);

  const nhomTaiSanList = [] as any[];

  const isLoading =
    isLoadingStatistics ||
    isLoadingTaiSanSapHet ||
    isLoadingTaiSanTheoNhom ||
    isLoadingCCDCTheoNhom ||
    isLoadingNhomCCDCList ||
    isLoadingAllCCDC ||
    isLoadingAllLoaiCCDC ||
    isLoadingAllTaiSan ||
    isLoadingTaiSanTheoLoai ||
    isLoadingCCDCTheoLoai;

  let rawCcdcLoai: any[] = [];
  if (ccdcTheoLoai && Array.isArray(ccdcTheoLoai)) {
    rawCcdcLoai = ccdcTheoLoai;
  } else if (ccdcTheoLoai && typeof ccdcTheoLoai === "object") {
    let resolvedKey: string | undefined = undefined;
    if (selectedNhomCCDC) {
      const byId = (ccdcTheoNhomNormalized || []).find(
        (g: any) =>
          String(g.id) === String(selectedNhomCCDC) ||
          String(g.ten) === String(selectedNhomCCDC),
      );
      if (byId) resolvedKey = byId.ten;
      if (!resolvedKey) {
        const byList = (nhomCCDCListNormalized || []).find(
          (g: any) =>
            String(g.id) === String(selectedNhomCCDC) ||
            String(g.ten) === String(selectedNhomCCDC) ||
            String(g.tenNhom) === String(selectedNhomCCDC),
        );
        if (byList) resolvedKey = byList.ten || byList.tenNhom;
      }
    }

    const key = resolvedKey || Object.keys(ccdcTheoLoai)[0];
    const arr = ccdcTheoLoai[key] || ccdcTheoLoai[String(key)] || [];
    if (Array.isArray(arr)) rawCcdcLoai = arr;
  } else if (ccdcTheoLoai?.data && typeof ccdcTheoLoai.data === "object") {
    let resolvedKey: string | undefined = undefined;
    if (selectedNhomCCDC) {
      const byId = (ccdcTheoNhomNormalized || []).find(
        (g: any) =>
          String(g.id) === String(selectedNhomCCDC) ||
          String(g.ten) === String(selectedNhomCCDC),
      );
      if (byId) resolvedKey = byId.ten;
      if (!resolvedKey) {
        const byList = (nhomCCDCListNormalized || []).find(
          (g: any) =>
            String(g.id) === String(selectedNhomCCDC) ||
            String(g.ten) === String(selectedNhomCCDC) ||
            String(g.tenNhom) === String(selectedNhomCCDC),
        );
        if (byList) resolvedKey = byList.ten || byList.tenNhom;
      }
    }
    const key = resolvedKey || Object.keys(ccdcTheoLoai.data)[0];
    const arr = ccdcTheoLoai.data[key] || [];
    if (Array.isArray(arr)) rawCcdcLoai = arr;
  }

  const ccdcTheoLoaiNormalized = (rawCcdcLoai || []).map((it: any) => {
    const label =
      it.tenLoai || it.TenLoai || it.ten || it.Ten || it.label || "";
    const valueRaw =
      it.soLuong ?? it.SoLuong ?? it.count ?? it.value ?? it.sl ?? 0;
    const value =
      typeof valueRaw === "string"
        ? Number(String(valueRaw).replace(/[^0-9.-]+/g, ""))
        : Number(valueRaw || 0);
    return { label, value };
  });

  return {
    statistics: statistics?.data || null,
    tongQuan: null,
    taiSanSapHet: taiSanSapHet?.data || [],
    taiSanTheoNhom: taiSanTheoNhomNormalized || [],
    ccdcTheoNhom: ccdcTheoNhomNormalized || [],
    nhomCCDCList: nhomCCDCList || [],
    nhomTaiSanList: nhomTaiSanList || [],
    uniqueNhomCCDC,
    ccdcTheoNhomByData,
    tongCCDC,
    tongGiaTriCCDC,
    ccdcTheoThangByNgayNhap,
    taiSanTheoThangByNgayVaoSo,
    taiSanTheoLoai: taiSanTheoLoai?.data || [],
    ccdcTheoLoai: ccdcTheoLoaiNormalized || [],
    taiSanTheoThang: taiSanTheoThangFromStats || [],
    ccdcTheoThang: ccdcTheoThangFromStats || [],
    top5TaiSan: top5TaiSanFromStats || [],
    isLoading,
  } as const;
};
