import { useAppDispatch, useAppSelector } from "./store";
import { clearTabFormData, setTabFormOpen, updateTabFormData } from "./tabsSlice";


export function useTabForm<T extends Record<string, any>>(tabPath: string) {
  const dispatch = useAppDispatch();

  const tab = useAppSelector((state) =>
    state.tabs.tabs.find((t) => t.path === tabPath)
  );

  const formData = (tab?.formData ?? {}) as Partial<T>;
  const isFormOpen = tab?.isFormOpen ?? false;

  // Cập nhật 1 hoặc nhiều field
  const setField = (data: Partial<T>) => {
    dispatch(updateTabFormData({ path: tabPath, data }));
  };

  // Mở form
  const openForm = () => {
    dispatch(setTabFormOpen({ path: tabPath, isOpen: true }));
  };

  // Đóng form + clear data
  const closeForm = () => {
    dispatch(setTabFormOpen({ path: tabPath, isOpen: false }));
  };

  // Chỉ clear data, không đóng form
  const resetForm = () => {
    dispatch(clearTabFormData(tabPath));
    dispatch(setTabFormOpen({ path: tabPath, isOpen: true }));
  };

  return { formData, isFormOpen, setField, openForm, closeForm, resetForm };
}