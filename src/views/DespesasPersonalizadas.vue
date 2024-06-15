<template>
    <Header></Header>
    <FormDespesasPersonalizadas @searchForm="showFormSeacrh" />
    <ListaDespesasPersonalizadas @pagina="showPagina" />
</template>
<script setup>
import { ref } from 'vue'
import { usedespesaStore } from '../store/despesa';

import Header from '../components/Header.vue';
import FormDespesasPersonalizadas from '../components/FormDespesasPersonalizadas.vue';
import ListaDespesasPersonalizadas from '../components/ListaDespesasPersonalizadas.vue';

const parametroConsulta = ref({});

const despesaStore = usedespesaStore();

const showFormSeacrh = (parametro) => {
    console.log(parametro)
    parametroConsulta.value = { ...parametro, pagina: 1 }
    despesaStore.listarDespesasPersonalizada(parametroConsulta.value)
}

const showPagina = (pagina) => {
    parametroConsulta.value = { ...parametroConsulta.value, pagina: pagina }
    despesaStore.listarDespesasPersonalizada(parametroConsulta.value)
}

</script>