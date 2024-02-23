<template>
    <el-row justify="center">
        <el-col :span="22">
            <h1>Despesas do mês de {{ despesaStore.showMesAtual }} </h1>

            <p>
                O total gasto desse mês até agora é de R${{ calcTotalGasto() }}
            </p>
            <el-collapse accordion>
                <el-collapse-item v-for="(despesa, i) in accordionDespesas" :name="despesa.tipoDespesa"
                    @click="carregarListaDespesasTipo(despesaStore.showPerfilId, despesaStore.showPrimeiroDiaMes, despesaStore.showUltimoDiaMes, 1, 5, despesa.tipoDespesa)">
                    <template #title>
                        {{ despesa.nome }} (%{{ ((despesa.total_despesa / perfil.salario) * 100).toFixed(2) }} - %{{
                            tiposDespesa[i].percentual_salario }})<el-icon class="header-icon">
                            <info-filled />
                        </el-icon>
                    </template>
                    <p>
                        Até o momento com as despesas de {{ despesa.nome }} foram gastos R${{ despesa.total_despesa }}.
                        O ideal é que seja gasto R${{ (tiposDespesa[i].percentual_salario / 100) * perfil.salario }}
                    </p>
                    <el-table v-if="listaDespesas.length" :data="listaDespesas" style="width: fit-content">
                        <el-table-column prop="data" label="Data" align="center" width=150 />
                        <el-table-column prop="descricao" label="Descriçao" align="center" width="200" />
                        <el-table-column prop="valor" label="Valor" align="center" />
                    </el-table>
                </el-collapse-item>

            </el-collapse>
        </el-col>
    </el-row>
</template>

<script setup>
import { onMounted, computed, ref } from 'vue';
import { usedespesaStore } from '../store/despesa';

import { format } from 'date-fns'
import axios from 'axios'

const despesaStore = usedespesaStore();

const accordionDespesas = computed(() => despesaStore.gastos_tipos_despesa)
const tiposDespesa = computed(() => despesaStore.showTiposDespesa);
const perfil = computed(() => despesaStore.showPerfil)
let listaDespesas = ref([])
const pagina = ref(1);


onMounted(async () => {
    despesaStore.getDiasMes();
    await despesaStore.getPerfil();
    await despesaStore.getTiposDespesa();
    await despesaStore.getPercentualPorTipo(despesaStore.showPerfilId, despesaStore.showPrimeiroDiaMes, despesaStore.showUltimoDiaMes);
    calcTotalGasto()
})

const carregarListaDespesasTipo = async (perfilId, dataAtual, dataDiasAtras, pagina, itensPagina, tipoId) => {
    await axios
        .post(`http://3.137.212.158:3000/despesa/listar-tipo/${perfilId}`, {
            "tipoId": tipoId,
            "data_inicial": dataAtual,
            "data_final": dataDiasAtras,
            "pagina": pagina,
            "itens_pagina": itensPagina
        }, {
            headers: { 'Authorization': `Bearer ${sessionStorage.getItem("token")}` }
        })
        .then(response => {
            console.log(response.data.despesas)
            listaDespesas.value = response.data.despesas;

            listaDespesas.value.map(despesa => {
                despesa.data = format(despesa.data, "dd/MM/yyyy");

                return despesa
            })

            return listaDespesas
        })
        .catch(() => {
            alert("deu merda")
        })
}
const calcTotalGasto = () => {
    let totalGasto = 0;

    accordionDespesas.value.forEach(despesa => {
        const valor = parseFloat(despesa.total_despesa);

        totalGasto += valor
    })

    return totalGasto.toFixed(2)
}
</script>