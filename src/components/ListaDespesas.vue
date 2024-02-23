<template>
    <el-row justify="center" class="container">
        <el-col :span="22">
            <h1>Suas despesas no mês de {{ despesaStore.showMesAtual }}</h1>
            <el-table :data="despesaStore.showListaDespesasPeriodo" row-key="id" border default-expand-all>
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
            <div class="box-paginacao">
                <span v-if="despesaStore.showIndicePagina > 1" @click="handleVoltarPagina()">Voltar</span>
                <span> {{ despesaStore.showIndicePagina }}</span>
                <span v-if="despesaStore.showItensProximaPagina" @click="handleAvancarPagina()">Avançar</span>
            </div>
        </el-col>
        <el-col>
        </el-col>
    </el-row>
</template>
<script setup>
import axios from 'axios';

import { ref, computed, onMounted} from 'vue';
import { usedespesaStore } from '../store/despesa';


const despesaStore = usedespesaStore();

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
        .delete(`http://3.137.212.158:3000/despesa/deletar/${id}`, {
            headers: { 'Authorization': `Bearer ${sessionStorage.getItem("token")}` }
        })
        .then(response => {
            alert("despesa excluida")
            console.log(response.data)
            window.location.reload()
        })
        .catch(error => {
            alert("deu ruim")
            console.log(error.data)
        })
}

const emits = defineEmits('despesaClicada');

const handleOpenEdicao = (despesa) => {    
    despesaStore.handleEditando();

    return despesaStore.despesaEdicao(despesa)
}
</script>
<style scoped>
span {
    cursor: pointer;
}

.container {
    padding: 24px 0;
}

.box-paginacao{
    
    width: fit-content;
    margin: auto;
    margin-top: 8px;
}
</style>