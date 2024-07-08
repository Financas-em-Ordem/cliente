<template>
    <el-row justify="center">
        <el-col :span="22">
            <h1>Despesas do mês de {{ despesaStore.showMesAtual }} </h1>

            <p>
                O total gasto desse mês até agora é de R${{ calcTotalGasto() }}
            </p>

            <el-collapse v-model="idAccordion" v-show="accordionDespesas" accordion>
                <el-collapse-item v-for="(despesa) in accordionDespesas" :name="despesa.tipoDespesa"
                    @click="async () => { await carregarListaDespesasTipo(despesa.tipoDespesa) }">
                    <template #title>
                        {{ despesa.nome }} (%{{ calcPercentualTipo(despesa) }} -

                        %{{ percentualDespesa(despesa) }})
                        <el-icon class="header-icon">
                            <info-filled />
                        </el-icon>
                    </template>

                    <p>
                        Até o momento com as despesas de {{ despesa.nome }} foram gastos R${{ despesa.total_despesa }}.
                        O ideal é que seja gasto R${{ calcGastoIdeal(despesa) }}
                    </p>
                    <el-table v-if="listaDespesas.length && getLargura" :data="listaDespesas"
                        style="width: fit-content">
                        <el-table-column prop="data" label="Data" align="center" width=150 />
                        <el-table-column prop="descricao" label="Descriçao" align="center" width="200" />
                        <el-table-column prop="valor" label="Valor" align="center" />
                    </el-table>

                    <div class="despesa-item" v-for="despesa in listaDespesas" v-else>
                        <h5>{{ despesa.data }} </h5>
                        <p> {{ despesa.descricao }} - R${{ despesa.valor }} </p>
                    </div>

                    <p>Para ver o resto das despesas desse tipo no mês vá nas despesas personalizadas</p>
                </el-collapse-item>

            </el-collapse>
        </el-col>
    </el-row>
</template>

<script setup>
import { onMounted, computed, ref, onBeforeUnmount } from 'vue';
import { usedespesaStore } from '../store/despesa';

import { format } from 'date-fns'
import axios from 'axios'

const despesaStore = usedespesaStore();

const accordionDespesas = ref([])
const tiposDespesa = computed(() => despesaStore.showTiposDespesa);
const perfil = computed(() => despesaStore.showPerfil)

const idAccordion = ref('1')

let listaDespesas = ref([])

onMounted(async () => {
    despesaStore.getDiasMes();
    await despesaStore.getPerfil();
    await despesaStore.getTiposDespesa();
    await fetchAccordion();
    calcTotalGasto()
});

const fetchAccordion = async () => {
    return await axios
        .get(`${import.meta.env.VITE_API_URL}/despesa/despesas-tipo`, {
            headers: { 'Authorization': `Bearer ${localStorage.getItem("token")}` }
        })
        .then(response => {
            accordionDespesas.value = response.data

            const tiposDespesasEdited = JSON.parse(JSON.stringify(despesaStore.showTiposDespesas))

            accordionDespesas.value.map(tipo => {
                tipo.nome = tiposDespesasEdited[tipo.tipoDespesa - 1].nome;

                return tipo
            })
        })
        .catch(erro => {
            alert("erro ao realizar comando")
        })
}

const carregarListaDespesasTipo = async (tipoId) => {
    listaDespesas.value = [];

    return await axios
        .get(`${import.meta.env.VITE_API_URL}/despesa/listar-tipo/${tipoId}`, {
            headers: { 'Authorization': `Bearer ${localStorage.getItem("token")}` }
        })
        .then(response => {
            listaDespesas.value = response.data;

            listaDespesas.value.map(despesa => {
                despesa.data = format(despesa.data, "dd/MM/yyyy");

                return despesa
            })

            return listaDespesas
        })
        .catch(() => { alert("erro ao realizar comando") })
}

const percentualDespesa = (despesa) => {
    const { percentual_salario } = tiposDespesa.value.find(element => element.id == despesa.tipoDespesa)

    return percentual_salario;
}

const calcPercentualTipo = (despesa) => {
    const resultado = (despesa.total_despesa / perfil.value.salario) * 100;

    return resultado.toFixed(2)
}

const calcGastoIdeal = (despesa) => {
    return (percentualDespesa(despesa) / 100) * perfil.value.salario;
}

const calcTotalGasto = () => {
    let totalGasto = 0;

    accordionDespesas.value.map(despesa => totalGasto += parseFloat(despesa.total_despesa))

    return totalGasto.toFixed(2)
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
.despesa-item h5,
.despesa-item h4,
.despesa-item p {
    margin: 0;
    text-transform: capitalize;
}

.despesa-item {
    border-bottom: 1px solid var(--el-border-color-hover);
    margin-top: 12px;
}
</style>