<template>
    <el-row justify="center" class="container">
        <el-col :span="22">
            <h1>Formulário de Despesa</h1>
            <el-form :model="formulario" ref="despesaForm">
                <el-form-item prop="descricao" :rules="descricaoRules">
                    <label for="descricao">Descrição</label>
                    <el-input type="text" v-model="formulario.descricao" placeholder="digite a descrição" />
                </el-form-item>

                <el-form-item prop="data" :rules="dataRules" style="display: grid;">
                    <label for="data">Data</label>
                    <el-date-picker class="data" v-model="formulario.data" type="date" placeholder="Selecione a data"
                        format="DD/MM/YYYY" value-format="YYYY-MM-DD" style="width: 100%;">
                    </el-date-picker>
                </el-form-item>

                <el-form-item prop="valor" :rules="valorRules">
                    <label for="valor">Valor</label>
                    <el-input type="number" v-model="formulario.valor" placeholder="digite o valor da despesa" />
                    <Money3Component v-model="formulario.valor" v-bind="money" style="display: none;"></Money3Component>
                </el-form-item>


                <el-form-item prop="tipo_despesa" :rules="tipoDespesaRules" style="display: grid;">
                    <label for="tipo_despesa">Tipo Despeas</label>
                    <el-select v-model="formulario.tipo_despesa" placeholder="Selecione o tipo da despesa"
                        style="width: 100%;">
                        <el-option v-for="tipo in tiposDespesa" :label="tipo.nome" :value="tipo.id" />
                    </el-select>
                </el-form-item>

                <el-button @click="salvar(despesaForm)">Salvar Despesa</el-button>
            </el-form>
        </el-col>
    </el-row>
</template>
<script setup>
import axios from 'axios';
import { ref, computed, onMounted, reactive } from 'vue';
import { Money3Component } from 'v-money3';
import { usedespesaStore } from '../store/despesa';

const despesaStore = usedespesaStore();
const tiposDespesa = computed(() => despesaStore.tipos_despesas);

onMounted(async () => {
    await despesaStore.getPerfil();
    await despesaStore.getTiposDespesa();
})

const formulario = ref({})
const despesaForm = ref(null)

const descricaoRules = { required: true, message: "Por favor digite a descrição", trigger: "blur" };
const dataRules = { required: true, message: "Por favor preencha a data", trigger: "blur" };
const valorRules = {
    validator: (rule, value, callback) => {
        if (value == 0)
            callback(new Error("Por favor preencha o valor corretamente"));
        else
            callback()
    },
    trigger: "blur",
}

const tipoDespesaRules = { required: true, message: "Por favor preencha o tipo da despesa", trigger: "blur" };
const money = {
    decimal: ',',
    thousands: '.',
    prefix: 'R$ ',
    suffix: ' ',
    precision: 2,
    masked: false
}

const salvar = (formDespesa) => {
    formDespesa.validate(async (valid) => {
        if (valid) {
            const formatValor = parseFloat(formulario.value.valor)
            await axios
                .post(`${import.meta.env.VITE_API_URL}/despesa/salvar`,
                    {
                        "descricao": formulario.value.descricao,
                        "data": formulario.value.data,
                        "valor": formatValor,
                        "tipoDespesaId": formulario.value.tipo_despesa,
                        "usuarioId": despesaStore.perfil.id
                    },
                    { headers: { 'Authorization': `Bearer ${localStorage.getItem("token")}` } }
                )
                .then(response => {
                    alert("salvo com sucesso");
                    window.location.reload();
                })
                .catch(error => {
                    alert("deu erro")
                })
        }
    })
}
</script>
<style scoped>
.container {
    padding: 24px 0;
}

@media (max-width: 576px) {
    h1 {
        font-size: 1.75rem;
    }
}
</style>