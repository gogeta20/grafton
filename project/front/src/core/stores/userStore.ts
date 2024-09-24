import type { rootConfig } from "@/core/config/config";
import { defineStore } from "pinia";
import type { PersistedStateOptions } from "pinia-plugin-persistedstate";


export const userStore = defineStore("userStore", {
  state: () => {
    return {
      data: {
        userId: "",
        nombre: "",
        email: "",
        isAuthenticated: false,
        token: "",
      },
    };
  },
  actions: {
    async check() {
    },
    async authResolve(p: string) {
    },
    async checkTicket(ticket: string) {
    },
    clearData() {
    }
  },
  persist: <PersistedStateOptions>{
    key: "#user",
    storage: window.sessionStorage,
    paths: ["data"],
    overwrite: true,
  },
});
