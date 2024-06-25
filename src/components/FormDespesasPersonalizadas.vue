<style scoped>
.el-button {
    margin-top: 20px;
    margin-left: auto;
    display: flex;
}

.container {
    padding: 24px 0;
}



@media(max-width: 425px) {

    .el-checkbox-group {
        gap: 12px;
        display: flex;
        flex-wrap: wrap;
    }

    /* .el-checkbox-button:first-child .el-checkbox-button__inner{border: none !important;} */
    .el-checkbox-button span,
    .el-checkbox-button__inner {
        border: none !important;
        border-left-color: unset !important
    }

    .el-checkbox-button {
        border-left-color: unset !important
    }
}
</style>
<template>
    <el-row justify='center' class="container">
        <el-col :span="22">
            <h1>Consulta personalizada</h1>
            <p>Selecione duas datas, tipo de despesas e a quantidade de itens por página para ver o que foi gasto no
                periodo determinado</p>
            <el-form :model="formulario" ref="consultaForm">
                <el-form-item prop="datas" :rules="dataRules" style="display: grid;">
                    <label for="datas">Periodo das despesas</label>
                    <el-date-picker v-model="formulario.datas" type="daterange" start-placeholder="Data inicial"
                        end-placeholder="Data Final" format="DD/MM/YYYY" value-format="YYYY-MM-DD" style="width: 100%;"
                        class="teste" />
                </el-form-item>

                <el-form-item prop="itens_paginacao" :rules="itensPagicanaoRules" style="display: grid;">
                    <label for="itens_paginacao">Qtd. Itens por página</label>
                    <el-select v-model="formulario.itens_paginacao" style="width: 100%;">
                        <el-option label="2" :value=2>2 itens</el-option>
                        <el-option label="5" :value=5>5 itens</el-option>
                        <el-option label="10" :value=10>10 itens</el-option>
                        <el-option label="15" :value=15>15 itens</el-option>
                    </el-select>
                </el-form-item>
                <el-form-item prop="tipo-despesa" class="tipos-checkbox" :rules="tipoRules" style="display: grid;">
                    <label for="tipo-despesa">Periodo</label>
                    <el-checkbox-group v-model="formulario.checkbox" size="default" style="width: 100%;">
                        <el-checkbox-button v-for="tipo in despesaStore.tipos_despesas" :key="tipo.id" :label="tipo"
                            :model-value="tipo.id" style="border: none!important">{{ tipo.nome }}</el-checkbox-button>
                    </el-checkbox-group>
                </el-form-item>

                <el-button @click="consultar(consultaForm)">Consultar</el-button>
            </el-form>
        </el-col>
    </el-row>
</template>
<script setup>
import axios from 'axios';
import { ref, onMounted, watch } from 'vue'

import { usedespesaStore } from '../store/despesa';

const despesaStore = usedespesaStore();

onMounted(async () => {
    await despesaStore.getPerfil()
    await despesaStore.getTiposDespesa();
})

const formulario = ref({})
const consultaForm = ref({})

const emit = defineEmits("searchForm")



const dataRules = { required: true, message: "Por favor preencha a data", trigger: "blur" };

const tipoRules = {
    validator: (rule, value, callback) => {
        if (!formulario.value.checkbox.length)
            callback(new Error("Por favor preencha o valor corretamente"));
        else
            callback()
    }
}

const itensPagicanaoRules = { required: true, message: "Por favor preencha a quantidade de itens por página", trigger: "blur" };

const consultar = (form) => {

    form.validate((valid) => {
        if (valid) return emit("searchForm", { ...formulario.value })

        return alert("nao salvou pq deu erro")
    });

}
</script>