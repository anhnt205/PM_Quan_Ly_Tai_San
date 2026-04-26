import { useState, useCallback } from 'react';

export interface SignItem {
  id: string;
  status: 'pending' | 'success' | 'error';
  errorMessage?: string;
  originalStatus?: string;
}

export interface UseSignBatchReturn {
  isOpen: boolean;
  items: SignItem[];
  isProcessing: boolean;
  openModal: (selectedItems: any[]) => void;
  closeModal: () => void;
  confirmSign: (signFn: (ids: string[]) => Promise<void> | void) => Promise<void>;
  updateItemStatus: (id: string, status: 'success' | 'error', errorMessage?: string) => void;
  reset: () => void;
}

export const useSignBatch = (): UseSignBatchReturn => {
  const [isOpen, setIsOpen] = useState(false);
  const [items, setItems] = useState<SignItem[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const openModal = useCallback((selectedItems: any[]) => {
    setItems(
      selectedItems.map(item => ({
        id: item.id,
        status: 'pending' as const,
        originalStatus: item.status,
      }))
    );
    setIsOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsOpen(false);
    // Reset sau khi đóng modal
    setTimeout(() => {
      setItems([]);
      setIsProcessing(false);
    }, 300);
  }, []);

  const updateItemStatus = useCallback(
    (id: string, status: 'success' | 'error', errorMessage?: string) => {
      setItems(prev =>
        prev.map(item =>
          item.id === id ? { ...item, status, errorMessage } : item
        )
      );
    },
    []
  );

  const confirmSign = useCallback(
    async (signFn: (ids: string[]) => Promise<void> | void) => {
      setIsProcessing(true);
      try {
        const ids = items.map(item => item.id);
        // Call signing function
        await Promise.resolve(signFn(ids));

        // Update từng item với delay nhỏ để có animation effect
        for (const item of items) {
          await new Promise(resolve => setTimeout(resolve, 150));
          updateItemStatus(item.id, 'success');
        }
      } catch (error) {
        console.error('Error signing batch:', error);
        // Cập nhật tất cả status thành error
        const errorMsg = error instanceof Error ? error.message : 'Lỗi ký biên bản';
        items.forEach(item => {
          updateItemStatus(item.id, 'error', errorMsg);
        });
      } finally {
        setIsProcessing(false);
      }
    },
    [items, updateItemStatus]
  );

  const reset = useCallback(() => {
    setItems([]);
    setIsOpen(false);
    setIsProcessing(false);
  }, []);

  return {
    isOpen,
    items,
    isProcessing,
    openModal,
    closeModal,
    confirmSign,
    updateItemStatus,
    reset,
  };
};