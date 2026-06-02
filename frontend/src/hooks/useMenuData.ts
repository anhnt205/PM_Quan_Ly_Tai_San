import { useMenuDataContext } from "../context/MenuDataContext";

export const useMenuData = () => {
  return useMenuDataContext();
};
