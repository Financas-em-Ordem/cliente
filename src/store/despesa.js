import { defineStore } from 'pinia'
import axios from "axios";
import { getMonth } from 'date-fns';


export const usedespesaStore = defineStore("home", {
    state: () => ({
        meses: ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'],
        tipos_despesas: [],
        perfil: {},
        gastos_tipos_despesa: [],
        mes_atual: '',
    }),
    actions: {
        async getPerfil() {
            await axios
                .get(`${import.meta.env.VITE_API_URL}/usuario/me`, {
                    headers: { 'Authorization': `Bearer ${localStorage.getItem("token")}` }
                })
                .then(response => this.perfil = response.data)
                .catch(() => alert("erro ao carregar usuario"))
        },
        async getTiposDespesa() {
            await axios
                .get(`${import.meta.env.VITE_API_URL}/tipo_despesa/listar`, {
                    headers: { 'Authorization': `Bearer ${localStorage.getItem("token")}` }
                })
                .then(response => this.tipos_despesas = response.data)
                .catch(() => alert("erro ao carregar tipos de despesa"))
        },
        getDiasMes() {
            const numMes = getMonth(new Date())
            this.mes_atual = this.meses[numMes]
        },
    },
    getters: {
        showPerfil() { return this.perfil },
        showTiposDespesas() { return this.tipos_despesas },
        showMesAtual() { return this.mes_atual }
    }
})