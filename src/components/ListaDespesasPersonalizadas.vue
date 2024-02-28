<style scoped>
.container {
    padding: 24px 0;
}

h5, h4, p{
    margin: 0;
}
.container {
    padding: 24px 0;
}
h4, p{
    text-transform: capitalize;
}
.despesa-item{
    border-bottom: 1px solid var(--el-border-color-hover);
    margin-bottom: 12px;
}
</style>
<template>
    <el-row justify="center" class="container">
        <el-col :span="22">
            <el-table row-key="id" :data="listaDespesas" border default-expand-all
                v-if="(listaDespesas.length > 0 || burlaUndefined > 1) && getLargura ">
                <el-table-column prop="data" label="Data" align="center" sortable />
                <el-table-column prop="descricao" label="Descriçao" class="coluna-descricao" align="center" sortable />
                <el-table-column prop="tipoDespesa.nome" label="Tipo" align="center" sortable />
                <el-table-column prop="valor" label="Valor(R$)" align="center" sortable />
            </el-table>
            <div class="despesa-item" v-for="despesa in listaDespesas" v-else>
                <h5>{{ despesa.data }} </h5>
                <h4>{{ despesa.tipoDespesa.nome }}</h4>
                <p> {{ despesa.descricao }} - R${{ despesa.valor }} </p>
            </div>
            <div v-if="listaDespesas.length > 0 || burlaUndefined > 1">
                <span @click="voltarPagina()">Voltar</span>
                {{ indexPagina }}
                <span @click="passarPagina()">passar</span>
            </div>
        </el-col>
    </el-row>
</template>
<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
import { usedespesaStore } from '../store/despesa';

const despesaStore = usedespesaStore();

const listaDespesas = computed(()=> despesaStore.showListaDespesasPersonalizada)

const props = defineProps({
    parametro: Object
});

let indexPagina = ref(1);
const burlaUndefined = ref(0)

const emit = defineEmits("pagina")


const voltarPagina = () => {
    if (indexPagina.value <= 1)
        return;

    indexPagina.value--

    despesaStore.listarDespesasPersonalizada(
        props.parametro.perfilId,
        props.parametro.data_inicial,
        props.parametro.data_final,
        props.parametro.tiposId,
        props.parametro.itens_pagina,
        indexPagina.value)

}

const passarPagina = () => {
    if (!despesaStore.showItensProximaPaginaPersonalizada)
        return;

    indexPagina.value++

    despesaStore.listarDespesasPersonalizada(
        props.parametro.perfilId,
        props.parametro.data_inicial,
        props.parametro.data_final,
        props.parametro.tiposId,
        props.parametro.itens_pagina,
        indexPagina.value)

}

const getLargura = ref(window.innerWidth >= 768)

const handleResize = () => {
    getLargura.value = window.innerWidth >= 768;
};


onMounted(() => {
  window.addEventListener('resize', handleResize);
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize);
});
</script>