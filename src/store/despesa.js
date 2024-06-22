import { defineStore } from 'pinia'
import axios from "axios";
import { format, lastDayOfMonth, startOfMonth, getMonth } from 'date-fns';


export const usedespesaStore = defineStore("home", {
    state: () => ({
        meses: ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'],
        tipos_despesas: [],
        perfil: {},
        despesa_edicao: {},
        despesa_editada: {},
        gastos_tipos_despesa: [],
        primeiro_dia_mes: '',
        ultimo_dia_mes: '',
        mes_atual: '',
        editandoDespesa: false
    }),
    actions: {  
        async getPerfil() {
            await axios.get(`${import.meta.env.VITE_API_URL}/usuario/me`, {
                headers: { 'Authorization': `Bearer ${localStorage.getItem("token")}` }
            })
                .then(response => {
                    this.perfil = response.data
                })
                .catch(() => {
                    alert("erro ao carregar usuario")
                })
        },
        async getTiposDespesa() {
            await axios
                .get(`${import.meta.env.VITE_API_URL}/tipo_despesa/listar`, {
                    headers: { 'Authorization': `Bearer ${localStorage.getItem("token")}` }
                })
                .then(response => {
                    this.tipos_despesas = response.data;

                })
                .catch(() => {
                    alert("erro ao carregar tipos de despesa")
                })
        },
        getDiasMes() {
            const hoje = new Date()
            const numMes = getMonth(hoje)

            this.primeiro_dia_mes = format(startOfMonth(hoje), 'yyyy-MM-dd')
            this.ultimo_dia_mes = format(lastDayOfMonth(hoje), 'yyyy-MM-dd')
            this.mes_atual = this.meses[numMes]
        },
        /*handleEditando() {
            return this.editandoDespesa = !this.editandoDespesa
        },
        despesaEdicao(despesa) {
            this.despesa_edicao = despesa;
            this.despesa_editada = JSON.parse(JSON.stringify(this.despesa_edicao))
        }*/
    },
    getters: {
        showPerfilId() { return this.perfil.id },
        showPerfil() { return this.perfil },
        showTiposDespesas() { return this.tipos_despesas },
        showPrimeiroDiaMes() { return this.primeiro_dia_mes },
        showUltimoDiaMes() { return this.ultimo_dia_mes },
        showDespesaEdicao() { return this.despesa_edicao },
        showDespesaEditada() { return this.despesa_editada },
        estaEditando() { return this.editandoDespesa },
        showTiposDespesa() { return this.tipos_despesas },
        showMesAtual() { return this.mes_atual }
    }
})