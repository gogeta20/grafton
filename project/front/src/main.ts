import './assets/main.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import piniaPluginPersistedstate from "pinia-plugin-persistedstate";
import { PiniaSharedState } from "pinia-shared-state";

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

const app = createApp(App)

const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);
pinia.use(
  PiniaSharedState({
    // Enables the plugin for all stores. Defaults to true.
    enable: false,
    // If set to true this tab tries to immediately recover the shared state from another tab. Defaults to true.
    initialize: true,
    // Enforce a type. One of native, idb, localstorage or node. Defaults to native.
    type: "localstorage",
  })
);

app.use(pinia);
app.use(router)

app.mount('#app')
