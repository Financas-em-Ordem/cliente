<template>
    <Header></Header>
    <FormDespesasPersonalizadas @searchForm="showFormSeacrh" />
    <ListaDespesasPersonalizadas @pagina="showPagina" :despesas="despesas" :proxPagina="proxPagina"
        :pagina="indexPagina" />
</template>
<script setup>
import { ref } from 'vue'
import { usedespesaStore } from '../store/despesa';
import { add, addDays, format, lastDayOfMonth, startOfMonth, getMonth } from 'date-fns';
import axios from 'axios';

import Header from '../components/Header.vue';
import FormDespesasPersonalizadas from '../components/FormDespesasPersonalizadas.vue';
import ListaDespesasPersonalizadas from '../components/ListaDespesasPersonalizadas.vue';

const parametroConsulta = ref({});

const despesaStore = usedespesaStore();

const despesas = ref([]);
const proxPagina = ref(false)
const indexPagina = ref(1)


const fetchDespesas = async (form) => {
    await axios.post(`${import.meta.env.VITE_API_URL}/despesa/listagem-personalizada/${despesaStore.showPerfilId}`, {
        "data_inicial": form.datas[0],
        "data_final": form.datas[1],
        "tiposId": form.checkbox.map(item => item.id),
        "itens_pagina": form.itens_paginacao,
        "pagina": form.pagina
    }, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem("token")}` }
    })
        .then((response) => {
            console.log(response.data)
            despesas.value = response.data.despesas
            proxPagina.value = response.data.itensProxPagina

            despesas.value.map(despesa => {
                despesa.data = format(addDays(despesa.data, 1), 'dd/MM/yyyy');

                return despesa
            })

            if (!response.data.despesas.length) return alert("Nao há despesas com esses filtros. Tente novamente")
        })
        .catch(() => alert("deu ruim"))
}

const showFormSeacrh = (parametro) => {
    despesas.value = [];
    proxPagina.value = false;
    indexPagina.value = 1;

    parametroConsulta.value = { ...parametro, pagina: indexPagina.value }
    fetchDespesas(parametroConsulta.value)
}

const showPagina = (acao) => {
    despesas.value = [];

    if(acao == 'passar') indexPagina.value++;
    else indexPagina.value--
    parametroConsulta.value = { ...parametroConsulta.value, pagina: indexPagina }
    fetchDespesas(parametroConsulta.value)
}

</script>