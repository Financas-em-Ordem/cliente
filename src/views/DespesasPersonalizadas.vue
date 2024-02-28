<template>
    <Header></Header>
    <FormDespesasPersonalizadas @parametroConsulta="showParametroConsulta" :pagina="indexPagina"/>
    <ListaDespesasPersonalizadas @pagina="showPagina" :parametro="parametroConsulta"/>
</template>
<script setup>
import {ref} from 'vue'

import Header from '../components/Header.vue';
import FormDespesasPersonalizadas from '../components/FormDespesasPersonalizadas.vue';
import ListaDespesasPersonalizadas from '../components/ListaDespesasPersonalizadas.vue';

const parametroConsulta = ref({});
const indexPagina = ref(0)

 const showParametroConsulta = (parametro) => {
     parametroConsulta.value = parametro
 }

const showPagina = (pagina) =>{
    indexPagina.value = pagina
}
</script>