import './assets/main.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import piniaPluginPersistedstate from "pinia-plugin-persistedstate";
import { PiniaSharedState } from "pinia-shared-state";
import ToastService from "primevue/toastservice";
import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

const app = createApp(App)

const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);
pinia.use(
  PiniaSharedState({
    enable: false,
    initialize: true,
    type: "localstorage",
  })
);
app.use(ToastService);
app.use(pinia);
app.use(router)

app.mount('#app')
