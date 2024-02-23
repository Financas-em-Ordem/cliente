import { createApp, markRaw } from 'vue'
import { createPinia } from 'pinia'
import './style.css'
import App from './App.vue'
import ElementPlus from 'element-plus'
import VueTheMask from 'vue-the-mask';
import 'element-plus/dist/index.css' 
import money from 'v-money3'
import router from './routes'


const app = createApp(App);
const pinia = createPinia();

pinia.use(({ store }) => {
    store.router = markRaw(router)
})


app.use(money)
app.use(pinia);
app.use(ElementPlus);
app.use(VueTheMask);
app.use(router); 

app.mount('#app')