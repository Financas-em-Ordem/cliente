import { createRouter, createWebHistory } from 'vue-router';
import Home from './views/Home.vue';
import Login from './views/Login.vue'
import Cadastro from './views/Cadastro.vue'
import Despesas from './views/Despesas.vue'
import Teste from './views/Teste.vue'
import Percentuais from './views/Percentuais.vue'
import DespesasPersonalizadas from './views/DespesasPersonalizadas.vue'
import Sobre from './views/Sobre.vue'

const routes = [
    {path: '/', component: Home, meta:{authAccess: true}, name: Home},
    { path: '/home', component: Home, meta: { authAccess: true }, name: Home },
    { path: '/percentuais', component: Percentuais, meta: { authAccess: true }, name: Percentuais },
    { path: '/login', component: Login, meta: { authAccess: false }, name: Login },
    { path: '/cadastro', component: Cadastro, meta: { authAccess: false }, name: Cadastro },
    { path: '/teste', component: Teste, meta: { authAccess: true }, name: Teste },
    { path: '/despesas', component: Despesas, meta: {authAccess: true}, name: Despesas},
    { path: '/despesas-personalizadas', component: DespesasPersonalizadas, meta: {authAccess: true}, name: DespesasPersonalizadas},
    { path: '/sobre', component: Sobre,  name: Sobre}
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

router.beforeEach((to, from, next) => {
    //com flag de autenticaçao igual true e sem token de autenticaçao cai no login
    if(to.meta.authAccess && !localStorage.getItem("token"))
        next({name: Login})
    //com flag de autenticaçao igual false so segue
    else if(!to.meta.authAccess)
        next()
    //so segue
    else 
    next()
})

export default router;