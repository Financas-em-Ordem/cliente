<template>
    <el-row justify="center" class="container">
        <el-col :span="20">
            <h1>Suas despesas no mês de {{ despesaStore.showMesAtual }} </h1>
            <el-table :data="despesas" row-key="id" border default-expand-all v-if="getLargura">
                <el-table-column prop="data" label="Data" align="center" :width="100" sortable />
                <el-table-column prop="descricao" label="Descriçao" class="coluna-descricao" align="center" sortable
                    style="">

                </el-table-column>
                <el-table-column prop="tipoDespesa.nome" label="Tipo" class="coluna-descricao"
                    :width="larguraValue <= 1200 ? 112 : ''" align="center" sortable />
                <el-table-column prop="valor" label="Valor(R$)" :width="larguraValue <= 1200 ? 112 : ''" align="center"
                    sortable />
                <el-table-column prop="percentual" label="%" :width="68" align="center" sortable />
                <el-table-column align="center" label="Ações" :width="larguraValue <= 992 ? 100 : 150">
                    <template #default="scope">
                        <div class="despesa-buttons">
                            <el-button size="small" @click="handleOpenEdicao(scope.row)">Editar</el-button>
                            <el-button size="small" type="danger"
                                @click="excluirDespesa(scope.row.id)">Deletar</el-button>
                        </div>
                    </template>
                </el-table-column>
            </el-table>
            <div class="despesa-item" v-for="despesa in despesas" v-else>
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
                <span v-if="pagina > 1" @click="voltarPagina()" style="cursor: pointer;">Voltar</span>
                <span v-else></span>

                {{ pagina == 1 && proxPagina == false ? "" : pagina }}
                <span v-if="proxPagina" @click="passarPagina()" style="cursor: pointer;">Avançar</span>
                <span v-else></span>

            </div>
        </el-col>

    </el-row>
</template>
<script setup>
import axios from 'axios';
import { addDays, format } from 'date-fns';

import { ref, onMounted, onBeforeUnmount } from 'vue';
import { usedespesaStore } from '../store/despesa';

const despesaStore = usedespesaStore();

onMounted(async () => {
    despesaStore.getDiasMes()
    await despesaStore.getPerfil()
    await fetchDespesas()
});

const despesas = ref([]);
const proxPagina = ref(false);

const pagina = ref(1)



const fetchDespesas = async () => {
    despesas.value = [];

    await axios.post(`${import.meta.env.VITE_API_URL}/despesa/listar-periodo/${despesaStore.showPerfilId}`, {
        "data_inicial": despesaStore.showPrimeiroDiaMes,
        "data_final": despesaStore.showUltimoDiaMes,
        "pagina": pagina.value,
        "itens_pagina": 5
    }, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem("token")}` }
    })
        .then(response => {

            despesas.value = response.data.despesas
            proxPagina.value = response.data.itensProxPagina

            despesas.value.map(despesa => {
                const data = format(addDays(new Date(despesa.data), 1), 'dd/MM/yyyy');

                const calcPercentual = (despesa.valor / despesaStore.showPerfil.salario) * 100;
                const percentual = calcPercentual.toFixed(2);

                despesa.data = data;
                despesa.percentual = percentual;

                return despesa
            })

        })
        .catch(error => {
            alert("erro ao carregar despesas")
        })
}
const excluirDespesa = async (id) => {
    await axios
        .delete(`${import.meta.env.VITE_API_URL}/despesa/deletar/${id}`, {
            headers: { 'Authorization': `Bearer ${localStorage.getItem("token")}` }
        })
        .then(response => {
            alert("despesa excluida")
            window.location.reload()
        })
        .catch(error => {
            alert("deu ruim")
        })
}

const voltarPagina = async () => {
    if (pagina.value <= 1) return

    pagina.value--;

    await fetchDespesas();
}

const passarPagina = async () => {
    if (proxPagina.value == false) return

    pagina.value++;

    await fetchDespesas();
}

const emit = defineEmits(["isEditando", "despesa"])

const handleOpenEdicao = (despesa) => {
    emit("isEditando", true)
    emit("despesa", despesa)
    // despesaStore.handleEditando();

    // return despesaStore.despesaEdicao(despesa)
}

const getLargura = ref(window.innerWidth >= 768)

const larguraValue = ref(window.innerWidth)

const handleResize = () => {
    getLargura.value = window.innerWidth >= 768;
    larguraValue.value = window.innerWidth
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

.coluna-descricao td {
    border: 1px solid !important;
    display: flex;
}

.despesa-item {
    border-bottom: 1px solid var(--el-border-color-hover);
    margin-bottom: 12px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
}

.despesa-item .acoes {
    display: grid;
    place-items: center;
}

.el-button+.el-button {
    margin: 0;
}

.despesa-item .acoes .el-button {
    width: 3rem;
}

.box-paginacao {
    width: fit-content;
    margin: auto;
    margin-top: 8px;
}

.cell .despesa-buttons {
    justify-content: center;
    display: flex;
    gap: 12px;
}

.box-paginacao {
    display: flex;
    justify-content: center;
    gap: 12px;
    margin: 1rem auto;
}

.box-paginacao span {
    width: 52px;
}

@media(max-width: 992px) {
    .cell .despesa-buttons {
        flex-direction: column;
    }

    .cell .despesa-buttons button {
        width: fit-content;
        margin: auto
    }
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