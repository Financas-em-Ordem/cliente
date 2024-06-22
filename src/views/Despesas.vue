<template>
    <Header />
    <ListaDespesas @isEditando="handleEdicao" @despesa="handleDespesa"></ListaDespesas>
    <FormEdicao :openModal="isEditando" :despesa="despesaAtual" :despesaEdit="despesaEdit" @fechaModal="handleEdicao" />
    {{ isEditando }}
</template>
<script setup>
import { ref } from 'vue'

import Header from '../components/Header.vue'
import ListaDespesas from '../components/ListaDespesas.vue';
import FormEdicao from '../components/FormEditarDespesa.vue'

const isEditando = ref(false);

const despesaEdit = ref({});
const despesaAtual = ref({})

const handleEdicao = (flag) => { return isEditando.value = flag }

const handleDespesa = (despesa) => {
    despesaAtual.value = despesa
    despesaEdit.value = JSON.parse(JSON.stringify(despesa))
}
</script>