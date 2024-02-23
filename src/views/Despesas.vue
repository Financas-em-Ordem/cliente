<template>
    <!-- <FormDespesas/> -->
    <Header/>
    <ListaDespesas></ListaDespesas>
    <FormEdicao/>

</template>
<script setup>
import axios from 'axios'
import { ref, onMounted } from 'vue'

import Header from '../components/Header.vue'
import ListaDespesas from '../components/ListaDespesas.vue';
import FormEdicao from '../components/FormEditarDespesa.vue'

</script>