import { defineStore } from "pinia";

export const useStore = defineStore("counter", {
  state: () => ({ isLoading: false }),
  actions: {
    setLoading(v) {
      this.isLoading = v;
    }
  },
  getters: {
    // doubleCount(state) {
    //   return state.count * 2;
    // }
  }
});
