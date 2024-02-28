<style scoped>
.el-button {
    margin-top: 20px;
    margin-left: auto;
    display: flex;
}

.container {
    padding: 24px 0;
}
.el-date-range-picker__content{}
</style>
<template>
    <el-row justify='center' class="container">
        <el-col :span="22">
            <h1>Consulta personalizada</h1>
            <p>Selecione duas datas, tipo de despesas e a quantidade de itens por página para ver o que foi gasto no periodo determinado</p>
            <el-form :model="formulario" ref="consultaForm">
                <el-form-item prop="datas" :rules="dataRules" style="display: grid;">
                    <label for="datas">Periodo das despesas</label>
                    <el-date-picker v-model="formulario.datas" type="daterange" start-placeholder="Data inicial"
                        end-placeholder="Data Final" format="DD/MM/YYYY" value-format="YYYY-MM-DD" style="width: 100%;" />
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
                            :model-value="tipo.id">{{ tipo.nome }}</el-checkbox-button>
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

const emit = defineEmits("parametroConsulta")



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
    form.validate(async (valid) => {
        if (valid) {
            const listaTipos = [];

            formulario.value.checkbox.forEach(tipo => {
                listaTipos.push(tipo.id)
            });

            despesaStore.listarDespesasPersonalizada(
                despesaStore.showPerfilId, 
                formulario.value.datas[0], 
                formulario.value.datas[1], 
                listaTipos, 
                formulario.value.itens_paginacao,
                1)

                emit("parametroConsulta", {
                    perfilId: despesaStore.showPerfilId,
                    data_inicial: formulario.value.datas[0],
                    data_final: formulario.value.datas[1],
                    tiposId: listaTipos,
                    itens_pagina: formulario.value.itens_paginacao,
                })


        } else {
            alert("nao salvou pq deu erro")
        }
    })
}


</script>