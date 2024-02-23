import { defineStore } from 'pinia'
import axios from "axios";
import { add, addDays, format, lastDayOfMonth, startOfMonth, getMonth } from 'date-fns';


export const usedespesaStore = defineStore("home", {
    state: () => ({
        meses: ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'],
        tipos_despesas: [],
        lista_despesas: [],
        lista_despesas_periodo: [],
        lista_despesas_home: [],
        perfil: {},
        despesa_edicao: {},
        despesa_editada: {},
        gastos_tipos_despesa: [],
        total_gasto_tipos_despesa: [],
        primeiro_dia_mes: '',
        ultimo_dia_mes: '',
        mes_atual: '' ,
        pagina: 1,
        totalGasto: 0,
        itensProxPagina: true,
        editandoDespesa: false
    }),
    actions: {
        async getPerfil() {
            await axios
                .get("http://3.137.212.158:3000/usuario/me", {
                    headers: {
                        'Authorization': `Bearer ${sessionStorage.getItem("token")}`
                    }
                })
                .then(response => {
                    this.perfil = response.data
                })
        },
        async getTiposDespesa() {
            await axios
                .get("http://3.137.212.158:3000/tipo_despesa/listar", {
                    headers: {
                        'Authorization': `Bearer ${sessionStorage.getItem("token")}`
                    }
                })
                .then(response => {
                    this.tipos_despesas = response.data;

                })
        },
        async listarDespesasPerfil(id) {
            await axios
                .get(`http://3.137.212.158:3000/despesa/usuario/${id}`, {
                    headers: {
                        'Authorization': `Bearer ${sessionStorage.getItem("token")}`
                    }
                })
                .then(response => {

                    response.data.map(despesa => {
                        const calcPercentual = (despesa.valor / this.perfil.salario) * 100
                        const percentual = calcPercentual.toFixed(2);

                        return this.lista_despesas.push({ ...despesa, percentual })
                    })
                })
                .catch(error => {
                    console.log(error)
                })
        },
        async listarDespesasHome(id) {
            await axios
                .get(`http://3.137.212.158:3000/despesa/listar-dez-ultimas/${id}`, {
                    headers: {
                        'Authorization': `Bearer ${sessionStorage.getItem("token")}`
                    }
                })
                .then(response => {
                    this.lista_despesas_home = response.data;

                    this.lista_despesas_home.map(despesa => {
                        const data = format(addDays(new Date(despesa.data), 1), 'dd/MM/yyyy')
                        despesa.data = data

                        return despesa
                    })
                })
                .catch(error => {
                    console.log(error)
                })
        },
        async listarDespesasPorPeriodo(usuarioId,  pagina, itensPagina) {
            await axios
                .post(`http://3.137.212.158:3000/despesa/listar-periodo/${usuarioId}`, {
                    "data_inicial": this.primeiro_dia_mes,
                    "data_final": this.ultimo_dia_mes,
                    "pagina": pagina,
                    "itens_pagina": itensPagina
                }, {
                    headers: {
                        'Authorization': `Bearer ${sessionStorage.getItem("token")}`
                    }
                })
                .then(response => {
                    this.lista_despesas_periodo = response.data.despesas;
                    this.itensProxPagina = response.data.itensProxPagina;

                    this.lista_despesas_periodo.map(despesa => {
                        const data = format(addDays(new Date(despesa.data), 1), 'dd/MM/yyyy');

                        const calcPercentual = (despesa.valor / this.perfil.salario) * 100;
                        const percentual = calcPercentual.toFixed(2);

                        despesa.data = data;
                        despesa.percentual = percentual;

                        return despesa
                    })
                })
        },
        getDiasMes() {
            const hoje = new Date()
            const numMes = getMonth(hoje)
            
            this.primeiro_dia_mes = format(startOfMonth(hoje), 'yyyy-MM-dd')
            this.ultimo_dia_mes = format(lastDayOfMonth(hoje), 'yyyy-MM-dd')
            this.mes_atual = this.meses[numMes]
        },
        avancarPagina() {
            if (!this.itensProxPagina)
                return

            return this.pagina++
        },
        voltarPagina() {
            if (this.pagina <= 1)
                return

            return this.pagina--
        },
        handleEditando() {
            return this.editandoDespesa = !this.editandoDespesa
        },
        despesaEdicao(despesa) {
            this.despesa_edicao = despesa;
            this.despesa_editada = JSON.parse(JSON.stringify(this.despesa_edicao))
            console.log(this.despesa_editada)
        },
        async getPercentualPorTipo(usuarioId, dataInicial, dataFinal) {
            await axios
                .post(`http://3.137.212.158:3000/despesa/despesas-tipo/${usuarioId}`, {
                    "data_inicial": dataInicial,
                    "data_final": dataFinal,
                }, {
                    headers: {
                        'Authorization': `Bearer ${sessionStorage.getItem("token")}`
                    }
                })
                .then(response => {
                    this.gastos_tipos_despesa = response.data

                    this.tipos_despesa_formated = JSON.parse(JSON.stringify(this.tipos_despesas))

                    this.gastos_tipos_despesa.map(tipo => {
                        tipo.nome = this.tipos_despesa_formated[tipo.tipoDespesa - 1].nome;

                        return tipo
                    })
                })
                .catch(erro =>{
                    alert(JSON.stringify(erro.data))

                    alert("deu merda")
                })
        }
    },
    getters: {
        showPerfilId() { return this.perfil.id },
        showPerfil() { return this.perfil },
        showListaDespesas() { return this.lista_despesas },
        showPrimeiroDiaMes() { return this.primeiro_dia_mes },
        showUltimoDiaMes() { return this.ultimo_dia_mes },
        showListaDespesasPeriodo() { return this.lista_despesas_periodo },
        showIndicePagina() { return this.pagina },
        showItensProximaPagina() { return this.itensProxPagina },
        showListaDespesaHome() { return this.lista_despesas_home },
        showDespesaEdicao() { return this.despesa_edicao },
        showDespesaEditada() { return this.despesa_editada },
        estaEditando() { return this.editandoDespesa },
        showTiposDespesa() { return this.tipos_despesas },
        showPercentualTiposDespesa() { return this.total_gasto_tipos_despesa },
        showTotalGastoSalario() { return this.totalGasto },
        showMesAtual() { return this.mes_atual }
    }
})