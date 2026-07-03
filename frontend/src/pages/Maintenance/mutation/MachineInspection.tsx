
// --- GIÁM ĐỊNH Máy Móc ---

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Action, CongTy } from "../../../utils/const";
import api from "../../../config/api.config";
import { InspectionAdapter } from "../Adapter";
import dayjs from "dayjs";
import { useSelector } from "react-redux";
import { InspectionRecordData } from "../types";
import { showErrorAlert, showSuccessAlert } from "../../../components/Alert";

export const useMaintenanceInspectionPageQuery = (
  page?: number,
  pageSize?: number,
  searchValue?: string,
  trangThai?: number,
  idDonViGiao?: string,
  userid?: string,
  isSign?: boolean,
  dateFrom?: string,
  dateTo?: string,
  enabled = true,
) => {
  return useQuery({
    queryKey: [
      "inspectionPage",
      page,
      pageSize,
      searchValue,
      trangThai,
      idDonViGiao,
      userid,
      isSign,
      dateFrom,
      dateTo,
    ],
    queryFn: async () => {
      const res = await api.get("/giamdinh-maymoc/paged", {
        params: {
          page: page,
          size: pageSize,
          idCongTy: CongTy.CT001,
          search: searchValue,
          trangThai: trangThai,
          userid: userid,
          isSign: isSign,
          dateFrom: dateFrom,
          dateTo: dateTo,
        },
      });
      return res.data.data || res.data;
    },
    placeholderData: (previousData) => previousData,
    enabled,
  });
};

export const useMaintenanceInspectionByBienBanQuery = (
  idBienBan?: string,
  enabled: boolean = true,
) => {
  return useQuery({
    queryKey: ["inspectionByBienBan", idBienBan],
    queryFn: async () => {
      const res = await api.get(`/giamdinh-maymoc/bienban/${idBienBan}`);
      const data = (res.data.data || res.data || []).map((item: any) =>
        InspectionAdapter(item),
      );
      return data;
    },
    enabled: !!idBienBan && enabled,
  });
};

export const useMaintenanceInspectionMutation = () => {
  const queryClient = useQueryClient();
  const now = dayjs(new Date()).format("YYYY-MM-DD HH:mm:ss");
  const { user } = useSelector((state: any) => state.user);

  // --- API CHI TIẾT ---
  const createChiTietManyMutation = useMutation({
    mutationFn: async (data: any[]) => {
      return (
        await api.post(
          "/giamdinh-maymoc-chitiet/batch",
          data.map((i: any) => ({
            ...i,
            nguoiTao: user?.taiKhoan?.tenDangNhap,
            ngayTao: now,
          })),
        )
      ).data;
    },
  });

  const updateChiTietManyMutation = useMutation({
    mutationFn: async (data: any[]) => {
      return (
        await api.put(
          `/giamdinh-maymoc-chitiet/batch`,
          data.map((i: any) => ({
            ...i,
            ngayCapNhat: now,
            nguoiCapNhat: user?.taiKhoan?.tenDangNhap,
          })),
        )
      ).data;
    },
  });

  const deleteChiTietManyMutation = useMutation({
    mutationFn: async (ids: string[]) => {
      return (await api.delete(`/giamdinh-maymoc-chitiet/batch`, { data: ids }))
        .data;
    },
  });

  // --- API VẬT TƯ THEO TÀI SẢN ---
  const batchInsertVatTuMutation = useMutation({
    mutationFn: async (data: any[]) => {
      return (await api.post("/giamdinh-maymoc-chitiet/vattu/batch", data))
        .data;
    },
  });

  const deleteVatTuBatchMutation = useMutation({
    mutationFn: async (ids: string[]) => {
      return (
        await api.delete("/giamdinh-maymoc-chitiet/vattu/batch", { data: ids })
      ).data;
    },
  });

  const handleUpdate = (
    response: InspectionRecordData | any,
    variables: InspectionRecordData,
  ) => {
    const giamDinhId = response?.id || response?.data?.id;
    if (!giamDinhId) return;

    if (variables.danhSachChiTiet && variables.danhSachChiTiet.length > 0) {
      const details = variables.danhSachChiTiet;
      const createItems = details.filter(
        (i: any) => i.action === Action.CREATE || !i.id,
      );
      const updateItems = details.filter(
        (i: any) => i.action === Action.UPDATE && i.id,
      );
      const deleteItems = details.filter(
        (i: any) => i.action === Action.DELETE && i.id,
      );

      // 1. Tạo mới tài sản chi tiết
      if (createItems.length > 0) {
        createChiTietManyMutation.mutate(
          createItems.map((i: any) => ({ ...i, idGiamDinhMayMoc: giamDinhId })),
        );

        // Thu thập tất cả vật tư của tài sản mới để lưu
        const newVatTu = createItems.reduce((acc: any[], item: any) => {
          if (item.danhSachVatTu && item.danhSachVatTu.length > 0) {
            const mapped = item.danhSachVatTu.map((vt: any) => ({
              ...vt,
              idChiTietGiamDinhMayMoc: item.id,
            }));
            return [...acc, ...mapped];
          }
          return acc;
        }, []);

        if (newVatTu.length > 0) {
          batchInsertVatTuMutation.mutate(newVatTu);
        }
      }

      // 2. Cập nhật tài sản chi tiết cũ
      if (updateItems.length > 0) {
        updateChiTietManyMutation.mutate(
          updateItems.map((i: any) => ({ ...i, idGiamDinhMayMoc: giamDinhId })),
        );

        // Xử lý lưu/sửa/xóa danh sách vật tư lồng bên dưới từng tài sản cũ
        updateItems.forEach((item: any) => {
          if (item.danhSachVatTu && item.danhSachVatTu.length > 0) {
            const vtCreate = item.danhSachVatTu.filter(
              (v: any) => v.action === Action.CREATE || !v.id,
            );
            const vtUpdate = item.danhSachVatTu.filter(
              (v: any) => v.action === Action.UPDATE && v.id,
            );
            const vtDelete = item.danhSachVatTu.filter(
              (v: any) => v.action === Action.DELETE && v.id,
            );

            if (vtCreate.length > 0) {
              batchInsertVatTuMutation.mutate(
                vtCreate.map((v: any) => ({
                  ...v,
                  idChiTietGiamDinhMayMoc: item.id,
                })),
              );
            }
            if (vtUpdate.length > 0) {
              vtUpdate.forEach((v: any) => {
                api
                  .put(`/giamdinh-maymoc-chitiet/vattu/${v.id}`, v)
                  .catch(console.error);
              });
            }
            if (vtDelete.length > 0) {
              deleteVatTuBatchMutation.mutate(vtDelete.map((v: any) => v.id));
            }
          }
        });
      }

      // 3. Xóa tài sản chi tiết
      if (deleteItems.length > 0) {
        deleteChiTietManyMutation.mutate(deleteItems.map((i: any) => i.id));
      }
    }

    if (variables.nguoiKyList && variables.nguoiKyList.length > 0) {
      updateSignerMutation.mutate({
        idTaiLieu: giamDinhId,
        data: variables.nguoiKyList.map((item) => ({
          ...item,
          idTaiLieu: giamDinhId,
        })),
      });
    }
  };

  const updateSignerMutation = useMutation({
    mutationFn: async ({
      idTaiLieu,
      data,
    }: {
      idTaiLieu: string;
      data: any[];
    }) => {
      const res = await api.put(`/chuky/nguoi-ky/update/${idTaiLieu}`, data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inspectionByRepair"] });
    },
  });

  const deleteSignerMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await api.delete(`/chuky/${id}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inspectionByRepair"] });
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: InspectionRecordData) => {
      return (
        await api.post("/giamdinh-maymoc", {
          ...data,
          nguoiTao: user?.taiKhoan?.tenDangNhap,
          ngayTao: now,
        })
      ).data;
    },
    onSuccess: async (response, variables) => {
      if (response.success || response.id) {
        handleUpdate(response, variables);
        queryClient.invalidateQueries({ queryKey: ["repairByPlan"] });
        queryClient.invalidateQueries({ queryKey: ["inspectionByBienBan"] });
        queryClient.invalidateQueries({
          queryKey: ["incidentInspectionBySuCo"],
        });
        queryClient.invalidateQueries({
          queryKey: ["incidentDetailByIncident"],
        });
        queryClient.invalidateQueries({
          queryKey: ["maintenancePlanningDetailsByMonth"],
        });

        showSuccessAlert("Tạo biên bản giám định thành công");
      } else {
        showErrorAlert(response.message || "Tạo biên bản giám định thất bại");
      }
    },
    onError: (error: any) => {
      showErrorAlert(
        error.response?.data?.message || "Tạo biên bản giám định thất bại",
      );
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (data: InspectionRecordData) => {
      return (
        await api.put(`/giamdinh-maymoc/${data.id}`, {
          ...data,
          ngayCapNhat: now,
          nguoiCapNhat: user?.taiKhoan?.tenDangNhap,
        })
      ).data;
    },
    onSuccess: async (response, variables) => {
      if (response.success || response.id) {
        handleUpdate(response, variables);
        queryClient.invalidateQueries({ queryKey: ["inspectionByRepair"] });
        queryClient.invalidateQueries({ queryKey: ["inspectionByBienBan"] });
        queryClient.invalidateQueries({
          queryKey: ["incidentInspectionBySuCo"],
        });
        showSuccessAlert("Cập nhật biên bản giám định thành công");
      } else {
        showErrorAlert(
          response.message || "Cập nhật biên bản giám định thất bại",
        );
      }
    },
    onError: (error: any) => {
      showErrorAlert(
        error.response?.data?.message || "Cập nhật biên bản giám định thất bại",
      );
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return (await api.delete(`/giamdinh-maymoc/${id}`)).data;
    },
    onSuccess: (res: any) => {
      if (res.success || res.id) {
        queryClient.invalidateQueries({ queryKey: ["repairByPlan"] });
        queryClient.invalidateQueries({ queryKey: ["inspectionByBienBan"] });
        showSuccessAlert("Xóa biên bản giám định thành công");
      } else {
        showErrorAlert(res.message || "Xóa biên bản giám định thất bại");
      }
    },
    onError: (error: any) => {
      showErrorAlert(
        error.response?.data?.message || "Xóa biên bản giám định thất bại",
      );
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, userId }: { id: string; userId: string }) => {
      return (
        await api.post(
          `/giamdinh-maymoc/capnhattrangthai?id=${id}&userId=${userId}`,
        )
      ).data;
    },
    onSuccess: (res: any) => {
      if (res.success || res.id || res > 0) {
        queryClient.invalidateQueries({ queryKey: ["inspectionByRepair"] });
        showSuccessAlert("Cập nhật trạng thái thành công");
      } else {
        showErrorAlert(res.message || "Cập nhật trạng thái thất bại");
      }
    },
    onError: (error: any) => {
      showErrorAlert(
        error.response?.data?.message || "Cập nhật trạng thái thất bại",
      );
    },
  });

  const cancelMutation = useMutation({
    mutationFn: async (id: string) => {
      return (await api.post(`/giamdinh-maymoc/huy?id=${id}`)).data;
    },
    onSuccess: (res: any) => {
      if (res.success || res.id || res > 0) {
        queryClient.invalidateQueries({ queryKey: ["inspectionByRepair"] });
        showSuccessAlert("Hủy biên bản thành công");
      } else {
        showErrorAlert(res.message || "Hủy biên bản thất bại");
      }
    },
    onError: (error: any) => {
      showErrorAlert(error.response?.data?.message || "Hủy biên bản thất bại");
    },
  });

  const updateManyMutation = useMutation({
    mutationFn: async (data: InspectionRecordData[]) => {
      return (
        await api.put(
          `/giamdinh-maymoc/batch`,
          data.map((i) => ({
            ...i,
            ngayCapNhat: now,
            nguoiCapNhat: user?.taiKhoan?.tenDangNhap,
          })),
        )
      ).data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inspectionByRepair"] });
      showSuccessAlert("Cập nhật danh sách thành công");
    },
    onError: (error: any) => {
      showErrorAlert(
        error.response?.data?.message || "Cập nhật danh sách thất bại",
      );
    },
  });

  return {
    createMutation,
    updateMutation,
    deleteMutation,
    updateStatusMutation,
    cancelMutation,
    updateManyMutation,
  };
};
