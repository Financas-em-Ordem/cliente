<template>
    <el-row justify="center" class="container">
        <el-col :span="22">
            <h1>Suas despesas no mês de {{ despesaStore.showMesAtual }}</h1>
            <el-table :data="listaDespesas" row-key="id" border default-expand-all v-if="getLargura">
                <el-table-column prop="data" label="Data" align="center" sortable />
                <el-table-column prop="descricao" label="Descriçao" class="coluna-descricao" align="center" sortable />
                <el-table-column prop="tipoDespesa.nome" label="Tipo" class="coluna-descricao" align="center" sortable />
                <el-table-column prop="valor" label="Valor(R$)" align="center" sortable />
                <el-table-column prop="percentual" label="Percentual(%)" align="center" sortable />
                <el-table-column align="center" label="Ações">
                    <template #default="scope">
                        <el-button size="small" @click="handleOpenEdicao(scope.row)">Editar</el-button>
                        <el-button size="small" type="danger" @click="excluirDespesa(scope.row.id)">Deletar</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="despesa-item" v-for="despesa in listaDespesas" v-else>
                <div>
                    <h5>{{ despesa.data }} </h5>
                    <h4>{{ despesa.tipoDespesa.nome }}</h4>
                    <p> {{ despesa.descricao }} - R${{ despesa.valor }} </p>
                </div>
                <div class="acoes">
                    <el-button size="small" @click="handleOpenEdicao(despesa)">Editar</el-button>
                    <el-button size="small" type="danger" @click="excluirDespesa(despesa.id)">Deletar</el-button>
                </div>
            </div>
            <div class="box-paginacao">
                <span v-if="despesaStore.showIndicePagina > 1" @click="handleVoltarPagina()">Voltar</span>
                <span> {{ despesaStore.showIndicePagina }}</span>
                <span v-if="despesaStore.showItensProximaPagina" @click="handleAvancarPagina()">Avançar</span>
            </div>
        </el-col>

    </el-row>
</template>
<script setup>
import axios from 'axios';

import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
import { usedespesaStore } from '../store/despesa';


const despesaStore = usedespesaStore();

const listaDespesas = computed(() => despesaStore.showListaDespesasPeriodo)
onMounted(async () => {
    await despesaStore.getPerfil()
    await despesaStore.listarDespesasPerfil(despesaStore.showPerfilId)
    despesaStore.getDiasMes()
    await despesaStore.listarDespesasPorPeriodo(despesaStore.showPerfilId, despesaStore.showIndicePagina, 10)
})

const handleVoltarPagina = () => {
    if (despesaStore.showIndicePagina <= 1)
        return

    despesaStore.voltarPagina()
    return despesaStore.listarDespesasPorPeriodo(despesaStore.showPerfilId, despesaStore.showIndicePagina, 1)
}

const handleAvancarPagina = () => {

    if (!despesaStore.showItensProximaPagina)
        return

    despesaStore.avancarPagina()

    return despesaStore.listarDespesasPorPeriodo(despesaStore.showPerfilId, despesaStore.showIndicePagina, 1)
}

const excluirDespesa = async (id) => {
    await axios
        .delete(`https://backend-production-4d2f.up.railway.app/despesa/deletar/${id}`, {
            headers: { 'Authorization': `Bearer ${localStorage.getItem("token")}` }
        })
        .then(response => {
            alert("despesa excluida")
            console.log(response.data)
            window.location.reload()
        })
        .catch(error => {
            alert("deu ruim")
        })
}

const emits = defineEmits('despesaClicada');

const handleOpenEdicao = (despesa) => {
    despesaStore.handleEditando();

    return despesaStore.despesaEdicao(despesa)
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
h1 {
    margin-bottom: 2rem;
}

span {
    cursor: pointer;
}

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
    display: flex;
    flex-direction: row;
    justify-content: space-between;
}

.despesa-item .acoes{
    display: grid;
    place-items: center;
}
.el-button+.el-button{
    margin: 0;
}
.despesa-item .acoes .el-button{
    width: 3rem;
}
.box-paginacao {
    width: fit-content;
    margin: auto;
    margin-top: 8px;
}

@media (max-width: 576px) {
    h1 {
        font-size: 1.75rem;
    }
}

@media (max-width: 425px) {
    h1 {
        font-size: 1.5rem;
    }
}
</style>