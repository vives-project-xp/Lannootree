import { defineStore } from 'pinia';

export const useToastStore = defineStore({
  id: 'toastStore',
  state: () => ({
    successToastShown: false,
    uploadToastShown: false,
  }),
  actions: {
    setSuccessToastShown(value) {
      this.successToastShown = value;
    },
    getSuccessToastShown() {
      return this.successToastShown;
    },
    setUploadToastShown(value) {
        this.uploadToastShown = value;
    },
    getUploadToastShown() {
    return this.uploadToastShown;
    },
  },
});
