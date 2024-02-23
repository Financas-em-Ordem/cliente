<template>
    <el-row justify="center" class="container">
        <el-col :span="22">
            <h2>Suas últimas 10 despesas lançadas</h2>
            <el-table :data="despesaStore.showListaDespesaHome" row-key="id" border default-expand-all>
                <el-table-column prop="data" label="Data" align="center" sortable />
                <el-table-column prop="descricao" label="Descriçao" class="coluna-descricao" align="center" sortable />
                <el-table-column prop="tipoDespesa.nome" label="Tipo Despesa" align="center" sortable />
                <el-table-column prop="valor" label="Valor(R$)" align="center" sortable />
            </el-table>
        </el-col>
    </el-row>
</template>
<script setup>
import axios from 'axios';

import { ref, computed, onMounted, reactive } from 'vue';
import { usedespesaStore } from '../store/despesa';

const despesaStore = usedespesaStore();

onMounted(async () => {
    await despesaStore.getPerfil()
    await despesaStore.listarDespesasPerfil(despesaStore.showPerfilId)
    await despesaStore.listarDespesasHome(despesaStore.showPerfilId)
})


</script>
<style scoped>
.container {
    padding: 24px 0;
}
</style>