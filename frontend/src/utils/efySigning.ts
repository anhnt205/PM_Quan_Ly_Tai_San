import axios from "axios";
import { generateSha256 } from "./helpers";

export const handleLogin = async () => {
  const url = "https://rms.efy.com.vn/clients/login";
  const payload = {
    username: "rp_test",
    password: "rp_test",
    rpCode: "RP_TEST",
  };
  try {
    const response = await axios.post(url, payload, {
      headers: { "Content-Type": "application/json" },
    });
    return response.data.token;
  } catch (error) {
    console.log("Đăng nhập thất bại!", error);
    return null;
  }
};

export const handleSigning = async (idNguoiKy: string, idTaiLieu: string) => {
  const value = idNguoiKy + idTaiLieu;
  const hash = generateSha256(value);
  const token = await handleLogin();
  if (!token) {
    return null;
  }
  const url = "https://rms.efy.com.vn/signing/hash";
  const payload = {
    agreementUUID: "02e80096-912a-4b30-a38e-334ddc110a1e",
    authMode: "EXPLICIT/PIN",
    authorizeCode: "efyvn@123",
    encryption: "RSA",
    hash: hash,
    hashAlgorithm: "SHA-256",
    mimeType: "application/sha256-binary",
  };
  try {
    const result = await axios.post(url, payload, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    return result.data.signatureValue;
  } catch (error) {
    return null;
  }
};
