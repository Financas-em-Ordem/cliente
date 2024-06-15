import { defineStore } from 'pinia'
import axios from "axios";
import { add, addDays, format, lastDayOfMonth, startOfMonth, getMonth } from 'date-fns';
import { collapseItemProps } from 'element-plus';


export const usedespesaStore = defineStore("home", {
    state: () => ({
        meses: ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'],
        tipos_despesas: [],
        lista_despesas: [],
        lista_despesas_periodo: [],
        lista_despesas_home: [],
        lista_despesas_personalizada: [],
        perfil: {},
        despesa_edicao: {},
        despesa_editada: {},
        gastos_tipos_despesa: [],
        total_gasto_tipos_despesa: [],
        primeiro_dia_mes: '',
        ultimo_dia_mes: '',
        mes_atual: '',
        pagina: 1,
        totalGasto: 0,
        itensProxPagina: true,
        proxPagePersonalizada: false,
        editandoDespesa: false
    }),
    actions: {
        async getPerfil() {
            await axios
                .get(`${import.meta.env.VITE_API_URL}/usuario/me`, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem("token")}`,
                        'Access-Control-Allow-Origin': '*'

                    }
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
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem("token")}`,
                        'Access-Control-Allow-Origin': '*'

                    }
                })
                .then(response => {
                    this.tipos_despesas = response.data;

                })
                .catch(() => {
                    alert("erro ao carregar tipos de despesa")
                })
        },
        async listarDespesasPerfil(id) {
            await axios
                .get(`${import.meta.env.VITE_API_URL}/despesa/usuario/${id}`, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem("token")}`,
                        'Access-Control-Allow-Origin': '*'

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
                    alert("erro ao carregar despesas")
                })
        },
        async listarDespesasHome(id) {
            await axios
                .get(`${import.meta.env.VITE_API_URL}/despesa/listar-dez-ultimas/${id}`, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem("token")}`,
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
                    alert("erro ao carregar despesas")
                })
        },
        async listarDespesasPorPeriodo(usuarioId, pagina, itensPagina) {
            await axios
                .post(`${import.meta.env.VITE_API_URL}/despesa/listar-periodo/${usuarioId}`, {
                    "data_inicial": this.primeiro_dia_mes,
                    "data_final": this.ultimo_dia_mes,
                    "pagina": pagina,
                    "itens_pagina": itensPagina
                }, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem("token")}`,
                        'Access-Control-Allow-Origin': '*'

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
                .catch(error => {
                    alert("erro ao carregar despesas")
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
        },
        async getPercentualPorTipo(dataInicial, dataFinal) {
            await axios
                .post(`${import.meta.env.VITE_API_URL}/despesa/despesas-tipo/${this.perfil.id}`, {
                    "data_inicial": dataInicial,
                    "data_final": dataFinal,
                }, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem("token")}`
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
                .catch(erro => {
                    alert(JSON.stringify(erro.data))

                    alert("erro ao realizar comando")
                })
        },
        async listarDespesasPersonalizada(form) {
            await axios
                .post(`${import.meta.env.VITE_API_URL}/despesa/listagem-personalizada/${this.perfil.id}`, {
                    "data_inicial": form.datas[0],
                    "data_final": form.datas[1],
                    "tiposId": form.checkbox.map(item => item.id),
                    "itens_pagina": form.itens_paginacao,
                    "pagina": form.pagina
                }, {
                    headers: { 'Authorization': `Bearer ${localStorage.getItem("token")}` }
                })
                .then((response) => {
                    if (!response.data.despesas.length) return alert("Nao há despesas com esses filtros. Tente novamente")

                    this.lista_despesas_personalizada = response.data.despesas
                    this.proxPagePersonalizada = response.data.itensProxPagina

                    this.lista_despesas_personalizada.map(despesa => {
                        despesa.data = format(addDays(despesa.data, 1), 'dd/MM/yyyy');

                        return despesa
                    })
                })
                .catch(() => alert("deu ruim"))
        }
    },
    getters: {
        showPerfilId() { return this.perfil.id },
        showPerfil() { return this.perfil },
        showListaDespesas() { return this.lista_despesas },
        showPrimeiroDiaMes() { return this.primeiro_dia_mes },
        showUltimoDiaMes() { return this.ultimo_dia_mes },
        showListaDespesasPeriodo() { return this.lista_despesas_periodo },
        showListaDespesasPersonalizada() { return this.lista_despesas_personalizada },
        showIndicePagina() { return this.pagina },
        showItensProximaPagina() { return this.itensProxPagina },
        showProxPagePersonalizada() { return this.proxPagePersonalizada },
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