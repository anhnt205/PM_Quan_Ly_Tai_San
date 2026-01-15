import React from "react";
import { useQuery } from "@tanstack/react-query";
import api from "../../../config/api.config";

// API functions
const fetchStatistics = async () => {
  const response = await api.get("/dashboard/statistics");
  return response.data;
};

const fetchTongQuan = async () => {
  const response = await api.get("/dashboard/tong-quan");
  return response.data;
};

const fetchTaiSanTheoNhom = async () => {
  const response = await api.get("/dashboard/tai-san-theo-nhom-phan-tram");
  return response.data;
};

const fetchCCDCTheoNhom = async () => {
  const response = await api.get("/dashboard/ccdc-theo-nhom-phan-tram");
  return response.data;
};

const fetchTaiSanTheoLoai = async (nhomId?: string) => {
  const response = await api.get("/dashboard/tai-san-theo-loai-con-phan-tram", {
    params: nhomId ? { nhomId } : {},
  });
  return response.data;
};

const fetchCCDCTheoLoai = async (nhomId?: string) => {
  const response = await api.get("/dashboard/ccdc-theo-loai-phan-tram", {
    params: nhomId ? { nhomId } : {},
  });
  return response.data;
};

// Lấy danh sách nhóm CCDC
const fetchNhomCCDCList = async () => {
  const response = await api.get("/nhomccdc", {
    params: { idcongty: "ct001" },
  });
  return response.data;
};

// Lấy danh sách nhóm tài sản
const fetchNhomTaiSanList = async () => {
  const response = await api.get("/nhomtaisan", {
    params: { idcongty: "ct001" },
  });
  return response.data;
};

// Lấy danh sách CCDC để extract nhóm unique (từ dữ liệu thực tế)
const fetchAllCCDC = async () => {
  const response = await api.get("/ccdcvattu/paged", {
    params: { idcongty: "ct001", page: 0, size: 1000 },
  });
  return response.data;
};

// Lấy danh sách loại CCDC
const fetchAllLoaiCCDC = async () => {
  const response = await api.get("/loaiccdccon", {
    params: { idcongty: "ct001" },
  });
  return response.data;
};

// Lấy danh sách tài sản
const fetchAllTaiSan = async () => {
  const response = await api.get("/taisan/paged", {
    params: { idcongty: "ct001", page: 0, size: 10000 },
  });
  return response.data;
};

const fetchTaiSanTheoThang = async (nam: number) => {
  const response = await api.get("/dashboard/tai-san-theo-thang", {
    params: { nam },
  });
  return response.data;
};

const fetchCCDCTheoThang = async (nam: number) => {
  const response = await api.get("/dashboard/ccdc-theo-thang", {
    params: { nam },
  });
  return response.data;
};

// Custom hook
export const useDashboardMutation = (
  selectedNhomTaiSan?: string,
  selectedNhomCCDC?: string,
  namTaiSan: number = new Date().getFullYear(),
  namCCDC: number = new Date().getFullYear()
) => {
  // Query for statistics
  const { data: statistics, isLoading: isLoadingStatistics } = useQuery({
    queryKey: ["dashboard-statistics"],
    queryFn: fetchStatistics,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Query for tong quan
  const { data: tongQuan, isLoading: isLoadingTongQuan } = useQuery({
    queryKey: ["dashboard-tong-quan"],
    queryFn: fetchTongQuan,
    staleTime: 5 * 60 * 1000,
  });

  // Query for tai san theo nhom
  const { data: taiSanTheoNhom, isLoading: isLoadingTaiSanTheoNhom } = useQuery(
    {
      queryKey: ["dashboard-tai-san-theo-nhom"],
      queryFn: fetchTaiSanTheoNhom,
      staleTime: 5 * 60 * 1000,
    }
  );

  // Query for CCDC theo nhom
  const { data: ccdcTheoNhom, isLoading: isLoadingCCDCTheoNhom } = useQuery({
    queryKey: ["dashboard-ccdc-theo-nhom"],
    queryFn: fetchCCDCTheoNhom,
    staleTime: 5 * 60 * 1000,
  });

  // Query for danh sách nhóm CCDC (cho dropdown)
  const { data: nhomCCDCList, isLoading: isLoadingNhomCCDCList } = useQuery({
    queryKey: ["nhom-ccdc-list"],
    queryFn: fetchNhomCCDCList,
    staleTime: 5 * 60 * 1000,
  });

  // Query lấy tất cả CCDC để extract nhóm unique
  const { data: allCCDCData, isLoading: isLoadingAllCCDC } = useQuery({
    queryKey: ["all-ccdc-for-dropdown"],
    queryFn: fetchAllCCDC,
    staleTime: 5 * 60 * 1000,
  });

  // Query lấy tất cả loại CCDC để join với dữ liệu CCDC
  const { data: allLoaiCCDC, isLoading: isLoadingAllLoaiCCDC } = useQuery({
    queryKey: ["all-loai-ccdc"],
    queryFn: fetchAllLoaiCCDC,
    staleTime: 5 * 60 * 1000,
  });

  // Query lấy tất cả tài sản
  const { data: allTaiSanData, isLoading: isLoadingAllTaiSan } = useQuery({
    queryKey: ["all-tai-san-for-dashboard"],
    queryFn: fetchAllTaiSan,
    staleTime: 5 * 60 * 1000,
  });

  // Tạo map nhóm CCDC theo id để join
  const nhomCCDCMap = React.useMemo(() => {
    const map = new Map();
    const nhomList = Array.isArray(nhomCCDCList)
      ? nhomCCDCList
      : nhomCCDCList?.data || [];
    nhomList.forEach((nhom: any) => {
      // NhomCCDC table có field 'ten' hoặc 'tenNhom'
      // normalize key as string to avoid number/string mismatches
      const key =
        nhom.id !== undefined && nhom.id !== null ? String(nhom.id).trim() : "";
      map.set(key, nhom.ten || nhom.tenNhom);
    });
    return map;
  }, [nhomCCDCList]);

  // Tạo map loại CCDC theo id
  const loaiCCDCMap = React.useMemo(() => {
    const map = new Map();
    // allLoaiCCDC có thể là array trực tiếp hoặc có .data
    const loaiList = Array.isArray(allLoaiCCDC)
      ? allLoaiCCDC
      : allLoaiCCDC?.data || [];
    loaiList.forEach((loai: any) => {
      // normalize key as string
      const key =
        loai.id !== undefined && loai.id !== null ? String(loai.id).trim() : "";
      map.set(key, loai.tenLoai);
    });
    return map;
  }, [allLoaiCCDC]);

  // Helper function để extract items từ response data
  const extractCCDCItems = React.useCallback((data: any) => {
    if (!data) return [];
    // Thử các cấu trúc khác nhau của response
    if (data?.data?.items) return data.data.items;
    if (data?.items) return data.items;
    if (data?.data?.content) return data.data.content;
    if (data?.content) return data.content;
    if (Array.isArray(data?.data)) return data.data;
    if (Array.isArray(data)) return data;
    return [];
  }, []);

  // Helper: Lấy đúng giá trị thực tế cột "Nhóm CCDC" (text).
  // Logic:
  // 1) Nếu item có trực tiếp cột hiển thị từ ToolManager (ví dụ: "Nhóm CCDC" hoặc các biến thể) -> dùng luôn giá trị đó.
  // 2) Nếu có idNhomCCDC và map chứa tên -> trả tên đó.
  // 3) Thử các trường phổ biến khác và ánh xạ qua map nếu cần.
  // 4) Nếu không có giá trị trả về "Chưa xác định".
  const getGroupValue = React.useCallback(
    (item: any) => {
      if (!item) return "Chưa xác định";

      // 1) Kiểm tra trực tiếp các tên cột có thể xuất hiện trong ToolManager (bao gồm khoảng trắng và không)
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
          if (v !== undefined && v !== null && String(v).trim() !== "") {
            return String(v).trim();
          }
        }
      }

      // 2) Nếu có idNhomCCDC và map chứa tên -> trả tên đó
      const idNhomRaw =
        item.idNhomCCDC !== undefined && item.idNhomCCDC !== null
          ? String(item.idNhomCCDC).trim()
          : "";
      if (idNhomRaw) {
        if (nhomCCDCMap.has(idNhomRaw)) {
          return nhomCCDCMap.get(idNhomRaw);
        }
        // If there's an id but no mapping, return the raw id string
        // This ensures dropdown shows values like "2" (raw group value)
        if (process.env.NODE_ENV !== "production") {
          console.debug(
            "[Dashboard] getGroupValue: unmapped idNhomCCDC, returning raw:",
            idNhomRaw
          );
        }
        return idNhomRaw;
      }

      // 3) Thử các trường khác và ánh xạ nếu là id
      let fallback =
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

      // 4) Không tìm được gì
      return "Chưa xác định";
    },
    [nhomCCDCMap]
  );

  // Extract unique nhóm CCDC từ dữ liệu thực tế (join idNhomCCDC với nhomCCDCMap)
  const uniqueNhomCCDC = React.useMemo(() => {
    const items = extractCCDCItems(allCCDCData);
    if (process.env.NODE_ENV !== "production") {
      console.debug(
        "[Dashboard] sample allCCDCData items:",
        items.slice(0, 10)
      );
      console.debug(
        "[Dashboard] nhomCCDCMap keys:",
        Array.from(nhomCCDCMap.keys()).slice(0, 20)
      );
    }
    const nhomSet = new Map();
    items.forEach((item: any) => {
      // Lấy giá trị nhóm thực tế (text) từ item
      const tenNhom = getGroupValue(item);
      // Dùng chính giá trị text làm key để giữ đúng nhóm như trên trang Quản lý CCDC
      if (!nhomSet.has(tenNhom)) {
        nhomSet.set(tenNhom, {
          id: tenNhom,
          tenNhom: tenNhom,
        });
      }
    });
    return Array.from(nhomSet.values());
  }, [allCCDCData, extractCCDCItems, getGroupValue]);

  // Tính số lượng CCDC theo nhóm (lấy đúng giá trị thực tế của cột "Nhóm CCDC" trong dữ liệu)
  const ccdcTheoNhomByData = React.useMemo(() => {
    const items = extractCCDCItems(allCCDCData);
    if (items.length === 0) {
      if (process.env.NODE_ENV !== "production")
        console.debug("[Dashboard] no CCDC items found from allCCDCData");
      return [];
    }

    // Đếm theo giá trị nhóm thực tế, dùng getGroupValue để đảm bảo bắt đúng cột
    const nhomCountMap = new Map<string, number>();
    items.forEach((item: any) => {
      const tenNhom = getGroupValue(item);
      const current = nhomCountMap.get(tenNhom) || 0;
      nhomCountMap.set(tenNhom, current + 1);
    });

    const totalItems = items.length;
    if (process.env.NODE_ENV !== "production") {
      console.debug("[Dashboard] total CCDC items:", totalItems);
      console.debug(
        "[Dashboard] nhomCountMap entries:",
        Array.from(nhomCountMap.entries())
      );
    }
    return Array.from(nhomCountMap.entries()).map(([ten, soLuong]) => ({
      ten,
      soLuong,
      phanTram: totalItems > 0 ? (soLuong / totalItems) * 100 : 0,
    }));
  }, [allCCDCData, extractCCDCItems, getGroupValue]);

  // Tính tổng số CCDC và tổng giá trị từ dữ liệu thực tế
  const { tongCCDC, tongGiaTriCCDC } = React.useMemo(() => {
    const items = extractCCDCItems(allCCDCData);
    const tongCCDC = items.length;
    const tongGiaTriCCDC = items.reduce(
      (sum: number, item: any) => sum + (item.giaTri || item.thanhTien || 0),
      0
    );
    return { tongCCDC, tongGiaTriCCDC };
  }, [allCCDCData, extractCCDCItems]);

  // Tính số lượng CCDC theo loại dựa trên nhóm đã chọn
  // NOTE: selectedNhomCCDC coming from the dropdown is a text value (group name)
  // so compare against the resolved group text via `getGroupValue(item)` instead
  // of matching `idNhomCCDC` which may be numeric/id and not equal to the dropdown value.
  const ccdcTheoLoaiByNhom = React.useMemo(() => {
    if (!selectedNhomCCDC) return [];

    const items = extractCCDCItems(allCCDCData);
    // Filter by resolved group text (uses same logic as uniqueNhomCCDC)
    const filteredItems = items.filter((item: any) => {
      const tenNhom = getGroupValue(item);
      return tenNhom === selectedNhomCCDC;
    });

    // Đếm số lượng theo loại CCDC
    const loaiCountMap = new Map();
    filteredItems.forEach((item: any) => {
      // Lấy tên loại CCDC từ map (join theo idLoaiCCDCCon)
      let tenLoai = loaiCCDCMap.get(item.idLoaiCCDCCon) || item.tenLoaiCCDC;
      if (!tenLoai || tenLoai === "UNKNOW") {
        tenLoai = "Chưa xác định loại";
      }
      const currentCount = loaiCountMap.get(tenLoai) || 0;
      loaiCountMap.set(tenLoai, currentCount + 1);
    });

    // Chuyển thành array cho biểu đồ
    return Array.from(loaiCountMap.entries()).map(([label, value]) => ({
      label,
      value,
    }));
  }, [
    allCCDCData,
    selectedNhomCCDC,
    loaiCCDCMap,
    extractCCDCItems,
    getGroupValue,
  ]);

  // Tính số lượng CCDC tăng mới theo tháng dựa trên ngayNhap
  const ccdcTheoThangByNgayNhap = React.useMemo(() => {
    const items = extractCCDCItems(allCCDCData);

    // Đếm số lượng theo tháng/năm
    const thangMap = new Map();
    items.forEach((item: any) => {
      if (item.ngayNhap) {
        const date = new Date(item.ngayNhap);
        const thang = date.getMonth() + 1; // 1-12
        const nam = date.getFullYear();
        const key = `${nam}-${thang}`;
        const currentCount = thangMap.get(key) || 0;
        thangMap.set(key, currentCount + 1);
      }
    });

    // Chuyển thành array với thông tin tháng và năm
    return Array.from(thangMap.entries())
      .map(([key, soLuong]) => {
        const [nam, thang] = key.split("-").map(Number);
        return { thang, nam, soLuong };
      })
      .sort((a, b) => {
        // Sắp xếp theo năm rồi tháng
        if (a.nam !== b.nam) return a.nam - b.nam;
        return a.thang - b.thang;
      });
  }, [allCCDCData, extractCCDCItems]);

  // Helper function để extract items từ tài sản response data
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

  // Tính số lượng tài sản tăng mới theo tháng dựa trên ngayVaoSo
  const taiSanTheoThangByNgayVaoSo = React.useMemo(() => {
    const items = extractTaiSanItems(allTaiSanData);

    // Đếm số lượng theo tháng/năm
    const thangMap = new Map();
    items.forEach((item: any) => {
      if (item.ngayVaoSo) {
        const date = new Date(item.ngayVaoSo);
        const thang = date.getMonth() + 1; // 1-12
        const nam = date.getFullYear();
        const key = `${nam}-${thang}`;
        const currentCount = thangMap.get(key) || 0;
        thangMap.set(key, currentCount + 1);
      }
    });

    // Chuyển thành array với thông tin tháng và năm
    return Array.from(thangMap.entries())
      .map(([key, soLuong]) => {
        const [nam, thang] = key.split("-").map(Number);
        return { thang, nam, soLuong };
      })
      .sort((a, b) => {
        // Sắp xếp theo năm rồi tháng
        if (a.nam !== b.nam) return a.nam - b.nam;
        return a.thang - b.thang;
      });
  }, [allTaiSanData, extractTaiSanItems]);

  // Query for danh sách nhóm tài sản (cho dropdown)
  const { data: nhomTaiSanList, isLoading: isLoadingNhomTaiSanList } = useQuery(
    {
      queryKey: ["nhom-tai-san-list"],
      queryFn: fetchNhomTaiSanList,
      staleTime: 5 * 60 * 1000,
    }
  );

  // Query for tai san theo loai (filtered by nhom)
  const { data: taiSanTheoLoai, isLoading: isLoadingTaiSanTheoLoai } = useQuery(
    {
      queryKey: ["dashboard-tai-san-theo-loai", selectedNhomTaiSan],
      queryFn: () => fetchTaiSanTheoLoai(selectedNhomTaiSan),
      staleTime: 5 * 60 * 1000,
      enabled: !!selectedNhomTaiSan,
    }
  );

  // Query for CCDC theo loai (filtered by nhom)
  const { data: ccdcTheoLoai, isLoading: isLoadingCCDCTheoLoai } = useQuery({
    queryKey: ["dashboard-ccdc-theo-loai", selectedNhomCCDC],
    queryFn: () => fetchCCDCTheoLoai(selectedNhomCCDC),
    staleTime: 5 * 60 * 1000,
    enabled: !!selectedNhomCCDC,
  });

  // Query for tai san theo thang
  const { data: taiSanTheoThang, isLoading: isLoadingTaiSanTheoThang } =
    useQuery({
      queryKey: ["dashboard-tai-san-theo-thang", namTaiSan],
      queryFn: () => fetchTaiSanTheoThang(namTaiSan),
      staleTime: 5 * 60 * 1000,
    });

  // Query for CCDC theo thang
  const { data: ccdcTheoThang, isLoading: isLoadingCCDCTheoThang } = useQuery({
    queryKey: ["dashboard-ccdc-theo-thang", namCCDC],
    queryFn: () => fetchCCDCTheoThang(namCCDC),
    staleTime: 5 * 60 * 1000,
  });

  return {
    statistics: statistics?.data,
    tongQuan: tongQuan?.data,
    taiSanTheoNhom: taiSanTheoNhom?.data || [],
    ccdcTheoNhom: ccdcTheoNhom?.data || [],
    nhomCCDCList: nhomCCDCList || [],
    nhomTaiSanList: nhomTaiSanList || [],
    uniqueNhomCCDC,
    ccdcTheoNhomByData,
    tongCCDC,
    tongGiaTriCCDC,
    ccdcTheoLoaiByNhom,
    ccdcTheoThangByNgayNhap,
    taiSanTheoThangByNgayVaoSo,
    taiSanTheoLoai: taiSanTheoLoai?.data || [],
    ccdcTheoLoai: ccdcTheoLoai?.data || [],
    taiSanTheoThang: taiSanTheoThang?.data || [],
    ccdcTheoThang: ccdcTheoThang?.data || [],
    isLoading:
      isLoadingStatistics ||
      isLoadingTongQuan ||
      isLoadingTaiSanTheoNhom ||
      isLoadingCCDCTheoNhom ||
      isLoadingNhomCCDCList ||
      isLoadingNhomTaiSanList ||
      isLoadingAllCCDC ||
      isLoadingAllLoaiCCDC ||
      isLoadingAllTaiSan ||
      isLoadingTaiSanTheoLoai ||
      isLoadingCCDCTheoLoai ||
      isLoadingTaiSanTheoThang ||
      isLoadingCCDCTheoThang,
  };
};
