import { create } from 'zustand';

const useAlertModal = create((set) => ({
  isOpen: false,
  title: '',
  content: '',
  setTitle: (text) => set({ title: text }),
  setContent: (text) => set({ content: text }),
  clearModal: () => set({ isOpen: false, title: '', content: '' }),
  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false }),
}));

export default useAlertModal;
