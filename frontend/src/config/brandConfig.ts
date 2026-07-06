import logoUB from "../assets/images/logo_ub.png";
import logoCP from "../assets/images/logo_cp.png";
import backgroundImageUB from "../assets/images/background_ub.jpg";
import backgroundImageCP from "../assets/images/background_cp.jpg";
export interface BrandConfig {
  brandCode: string;
  title: string;
  company: string;
  primaryColor: string;
  primaryHoverColor: string;
  primaryColor100: string;
  phone: string;
  email: string;
  logo: string;
  backgroundImage: string;
}

export const brandConfigs: Record<string, BrandConfig> = {
  UB: {
    brandCode: "UB",
    title: "Quản lý tài sản - Uông Bí",
    company: "CÔNG TY THAN UÔNG BÍ - TKV",
    primaryColor: "#04b46eff",
    primaryHoverColor: "#05c578ff", // slightly lighter/darker
    primaryColor100: "#f0fdf4",
    phone: "02033.854491", // Placeholder, user can change
    email: "ctythanub@gmail.com", // Placeholder, user can change
    logo: logoUB,
    backgroundImage: backgroundImageUB,
  },
  CP: {
    brandCode: "CP",
    title: "Quản lý tài sản - Cẩm Phả",
    company: "CÔNG TY KHO VẬN VÀ CẢNG CẨM PHẢ - VINACOMIN",
    primaryColor: "#0273a3",
    primaryHoverColor: "#3b8aa7ff", // standard MUI primary dark
    primaryColor100: "#e1f1f8ff",
    phone: "+84 203 3865045", // Placeholder, user can change
    email: "Vanphongkvcp@gmail.com", // Placeholder, user can change
    logo: logoCP,
    backgroundImage: backgroundImageCP,
  },
};

const currentBrand = import.meta.env.VITE_BRAND || "UB"; // Default to UB
export const currentBrandConfig =
  brandConfigs[currentBrand] || brandConfigs["UB"];
