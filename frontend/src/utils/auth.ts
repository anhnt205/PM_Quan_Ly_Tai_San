/**
 * Decode JWT token to object payload.
 */
export function decodeJwt(token: string): any {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join(""),
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error("Failed to decode JWT token:", error);
    return null;
  }
}

/**
 * Check if the JWT token is valid and not expired.
 */
export function isTokenValid(token: string | null): boolean {
  if (!token) return false;
  const payload = decodeJwt(token);
  if (!payload || typeof payload.exp !== "number") return false;
  // payload.exp is in seconds, Date.now() is in milliseconds
  return payload.exp > Math.floor(Date.now() / 1000);
}

/**
 * Mapping permissions from Portal to roles for local frontend components/routes check.
 * Original allowed roles in App.tsx:
 * ["NHANVIEN", "PHONGBAN", "DUAN", "NGUONVON", "TAISAN", "BANGIAO_TAISAN", "DIEUDONG_TAISAN", "CCDCVT", "DIEUDONG_CCDC", "BANGIAO_CCDC", "BAOCAO"]
 */
export function mapPortalPermissionsToRoles(
  permissions: Record<string, any>,
): Array<{ permissionCode: string }> {
  const roles: Array<{ permissionCode: string }> = [];
  if (!permissions) return roles;

  const keys = Object.keys(permissions);
  const hasKey = (pattern: string) =>
    keys.some((k) => k.toLowerCase().includes(pattern));

  if (hasKey("nhan-vien") || hasKey("nhanvien"))
    roles.push({ permissionCode: "NHANVIEN" });
  if (hasKey("phong-ban") || hasKey("phongban"))
    roles.push({ permissionCode: "PHONGBAN" });
  if (hasKey("du-an") || hasKey("duan")) roles.push({ permissionCode: "DUAN" });
  if (hasKey("nguon-von") || hasKey("nguonvon") || hasKey("nguon-kinh-phi"))
    roles.push({ permissionCode: "NGUONVON" });

  // Tài sản
  if (hasKey("tai-san") || hasKey("taisan")) {
    roles.push({ permissionCode: "TAISAN" });
  }
  if (
    hasKey("ban-giao-tai-san") ||
    hasKey("bangiaotaisan") ||
    hasKey("ban-giao")
  ) {
    roles.push({ permissionCode: "BANGIAO_TAISAN" });
  }
  if (
    hasKey("dieu-dong-tai-san") ||
    hasKey("dieudongtaisan") ||
    hasKey("dieu-dong")
  ) {
    roles.push({ permissionCode: "DIEUDONG_TAISAN" });
  }

  // CCDC VT
  if (hasKey("ccdc") || hasKey("vat-tu") || hasKey("vattu")) {
    roles.push({ permissionCode: "CCDCVT" });
  }
  if (hasKey("dieu-dong-ccdc") || hasKey("dieudongccdc")) {
    roles.push({ permissionCode: "DIEUDONG_CCDC" });
  }
  if (hasKey("ban-giao-ccdc") || hasKey("bangiaoccdc")) {
    roles.push({ permissionCode: "BANGIAO_CCDC" });
  }

  if (hasKey("bao-cao") || hasKey("baocao"))
    roles.push({ permissionCode: "BAOCAO" });

  // Fallback: nếu portal trả về permissions nhưng không khớp patterns trên, cấp full các quyền cơ bản
  if (roles.length === 0 && keys.length > 0) {
    return [
      { permissionCode: "TAISAN" },
      { permissionCode: "CCDCVT" },
      { permissionCode: "NHANVIEN" },
      { permissionCode: "PHONGBAN" },
      { permissionCode: "BANGIAO_TAISAN" },
      { permissionCode: "DIEUDONG_TAISAN" },
      { permissionCode: "DIEUDONG_CCDC" },
      { permissionCode: "BANGIAO_CCDC" },
      { permissionCode: "BAOCAO" },
    ];
  }

  return roles;
}
