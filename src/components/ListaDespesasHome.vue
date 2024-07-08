<template>
    <el-row justify="center" class="container">
        <el-col :span="22">
            <h2>Suas últimas 10 despesas lançadas</h2>
            <el-table :data="despesas" row-key="id" border default-expand-all
                v-if="getLargura">
                <el-table-column prop="data" label="Data" align="center" sortable width="100" />
                <el-table-column prop="descricao" label="Descriçao" class="coluna-descricao" align="center" sortable
                    width="400" />
                <el-table-column prop="tipoDespesa.nome" label="Tipo" align="center" sortable />
                <el-table-column prop="valor" label="Valor(R$)" align="center" sortable />
            </el-table>

            <div class="despesa-item" v-for="despesa in despesas" v-else>
                <h5>{{ despesa.data }} </h5>
                <h4>{{ despesa.tipoDespesa.nome }}</h4>
                <p> {{ despesa.descricao }} - R${{ despesa.valor }} </p>
            </div>
        </el-col>
    </el-row>
</template>
<script setup>
import axios from 'axios';
import {  addDays, format } from 'date-fns';

import { ref, onMounted, onBeforeUnmount } from 'vue';
import { usedespesaStore } from '../store/despesa';

const despesaStore = usedespesaStore();

const despesas = ref([]);

onMounted(async () => {
    await despesaStore.getPerfil()
    await fetchDespesas()
})

const fetchDespesas = async () => {
    await axios
        .get(`${import.meta.env.VITE_API_URL}/despesa/listar-dez-ultimas`, {
            headers: { 'Authorization': `Bearer ${localStorage.getItem("token")}` }
        })
        .then(response => {
            despesas.value = response.data;

            despesas.value.map(despesa => {
                const data = format(addDays(new Date(despesa.data), 1), 'dd/MM/yyyy')
                despesa.data = data

                return despesa
            })
        })
        .catch(error => {
            alert("erro ao carregar despesas")
        })
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
<style scoped>
h5,
h4,
p {
    margin: 0;
}

.container {
    padding: 24px 0;
}

h4,
p {
    text-transform: capitalize;
}

.despesa-item {
    border-bottom: 1px solid var(--el-border-color-hover);
    margin-bottom: 12px;
}

@media (max-width: 576px) {
    h2 {
        font-size: 1.2rem;
    }
}
</style>