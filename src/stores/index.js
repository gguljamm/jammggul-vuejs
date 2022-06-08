import { defineStore } from "pinia";

export const useStore = defineStore("counter", {
  state: () => ({
    isLoading: false,
    firebaseError: null,
  }),
  actions: {
    setLoading(v) {
      this.isLoading = v;
    },
    setFirebaseError(e) {
      if (e?.code === 'resource-exhausted') {
        firebaseError
      }
    }
  },
  getters: {
    // doubleCount(state) {
    //   return state.count * 2;
    // }
  }
});
