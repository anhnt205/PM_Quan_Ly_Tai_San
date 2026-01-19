export const findById = (array: any[], id: any) => {
  return array.find((item) => item.id?.toString() === id?.toString());
};
export const generateCode=(prefix: string)=>{
  const now = new Date();

  const yyyy = now.getFullYear();
  const MM = String(now.getMonth() + 1).padStart(2, "0");
  const dd = String(now.getDate()).padStart(2, "0");
  const HH = String(now.getHours()).padStart(2, "0");
  const mm = String(now.getMinutes()).padStart(2, "0");
  const ss = String(now.getSeconds()).padStart(2, "0");

  const random = Math.random().toString(36).substring(2, 4).toUpperCase();

  return `${prefix}${yyyy}${MM}${dd}-${HH}${mm}${ss}-${random}`;
}

export const getPermissionSigning = (data: any, user?: any, allStaffs = []) => {
  const signatureFlow: any[] = [];
  if (data?.nguoiLapPhieuKyNhay === true) {
    console.log(findById(allStaffs, data.idNguoiKyNhay));
    signatureFlow.push({
      id: data.idNguoiKyNhay,
      signed: data.trangThaiKyNhay === true,
      label: `Người lập phiếu: ${
        findById(allStaffs, data.idNguoiKyNhay)?.hoTen ?? ""
      }`,
    });
  }

  signatureFlow.push({
    id: data?.idTrinhDuyetCapPhong,
    signed: data?.trinhDuyetCapPhongXacNhan === true,
    label: `Người duyệt: ${data?.tenTrinhDuyetCapPhong ?? ""}`,
  });

  const listLen = data?.listSignatory?.length ?? 0;
  for (let i = 0; i < listLen; i++) {
    const item = data.listSignatory[i];
    signatureFlow.push({
      id: item?.idNguoiKy,
      signed: item?.trangThai === 1,
      label: `Người ký ${i + 1}: ${item?.tenNguoiKy ?? ""}`,
    });
  }

  signatureFlow.push({
    id: data?.idTrinhDuyetGiamDoc,
    signed: data?.trinhDuyetGiamDocXacNhan === true,
    label: `Người phê duyệt: ${data?.tenTrinhDuyetGiamDoc ?? ""}`,
  });
  const filtered = signatureFlow.filter(
    (step) => step.id != null && String(step.id).trim() !== "",
  );

  const currentIndex = filtered.findIndex(
    (s) => s.id === user?.taiKhoan?.tenDangNhap,
  );

  if (currentIndex === -1) return 2;

  if (
    data?.nguoiTao === user?.taiKhoan?.tenDangNhap &&
    filtered[currentIndex].signed !== -1
  ) {
    return filtered[currentIndex].signed === true ? 4 : 5;
  }

  if (filtered[currentIndex].signed === true) return 3;

  const previousNotSigned = filtered
    .slice(0, currentIndex)
    .find((s) => s.signed === false);
  if (previousNotSigned) return 1;
  return 0;
};

export const s = (v: any, fallback: string = ""): string => {
  const str = v?.toString().trim();
  return str || fallback;
};

export const b = (v: any, fallback: boolean = false): boolean => {
  if (v === null || v === undefined) return fallback;

  if (typeof v === "boolean") return v;

  if (typeof v === "number") return v !== 0;

  const str = v.toString().trim().toLowerCase();
  if (str.length === 0) return fallback;

  return str === "true" || str === "1" || str === "yes" || str === "y";
};

export const formatDateTime = (v: any) => {
  const dateStr = v ? v.toString() : new Date().toISOString();
  return dateStr.replace("T", " ").replace("Z", "").split(".")[0];
};
