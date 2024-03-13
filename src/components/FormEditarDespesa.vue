<template>
    <el-dialog v-model="despesaStore.editandoDespesa" title="Edite a despesa" @close="fecharForm(despesaForm)" width="500" draggable>
        <el-form :model="despesaStore.showDespesaEditada" ref="despesaForm">
            <el-form-item prop="descricao" :rules="descricaoRules">
                <label for="descricao">Descrição</label>
                <el-input type="text" v-model="despesaStore.showDespesaEditada.descricao" />
            </el-form-item>

            <el-form-item prop="data" :rules="dataRules" style="display: grid;">
                <label for="data">Data</label>
                <el-date-picker class="data" v-model="despesaStore.showDespesaEditada.data" type="date" format="DD/MM/YYYY"
                    value-format="DD/MM/YYYY" style="width: 100%;">
                </el-date-picker>
            </el-form-item>

            <el-form-item prop="valor" :rules="valorRules">
                <label for="valor">Valor</label>
                <el-input type="number" v-model="despesaStore.showDespesaEditada.valor" />
                <Money3Component v-model="despesaStore.showDespesaEditada.valor" v-bind="money" style="display: none;">
                </Money3Component>
            </el-form-item>


            <el-form-item prop="tipo_despesa"  style="display: grid;">
                <label for="tipo_despesa">Tipo Despeas</label>
                <el-select v-model="despesaStore.showDespesaEditada.tipoDespesa.nome" style="width: 100%;">
                    <el-option v-for="tipo in despesaStore.tipos_despesas" :label="tipo.nome" :value="tipo.id" />
                </el-select>
            </el-form-item>
        </el-form>
        <template #footer>
            <div class="dialog-footer">
                <el-button type="primary" @click="salvar(despesaForm)">Salvar Despesa</el-button>
            </div>
        </template>
    </el-dialog>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { usedespesaStore } from '../store/despesa';

import axios from 'axios';
import { add, addDays, format } from 'date-fns';

const despesaStore = usedespesaStore();

const fecharForm = (form) => {
    form.clearValidate()
    return despesaStore.handleEditando()
}

const despesaForm = ref({})

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

// const tipoDespesaRules = { required: true, message: "Por favor preencha o tipo da despesa", trigger: "blur" };

const salvar = (form) => {
    form.validate(valid => {
        if (valid) {
            if (!(despesaStore.showDespesaEditada.descricao == despesaStore.showDespesaEdicao.descricao
                && despesaStore.showDespesaEditada.data == despesaStore.showDespesaEdicao.data
                && despesaStore.showDespesaEditada.valor == despesaStore.showDespesaEdicao.valor
                && despesaStore.showDespesaEditada.tipoDespesa.nome == despesaStore.showDespesaEdicao.tipoDespesa.nome)
                ) {

                let formatData = despesaStore.showDespesaEditada.data.split("/");
                formatData = `${formatData[2]}-${formatData[1]}-${formatData[0]}`

                console.log(formatData)
                console.log(despesaStore.showDespesaEditada.data)
                axios
                    .patch(`https://backend-production-4d2f.up.railway.app/despesa/atualizar/`, {
                        "id": despesaStore.showDespesaEditada.id,
                        "descricao": despesaStore.showDespesaEditada.descricao,
                        "data": formatData,
                        "valor": parseFloat(despesaStore.showDespesaEditada.valor),
                        "tipoDespesaId": despesaStore.showDespesaEditada.tipoDespesa.id,
                        "usuarioId": despesaStore.showPerfilId
                    }, {
                        headers: {
                            'Authorization': `Bearer ${localStorage.getItem("token")}`
                        }
                    })
                    .then(response => {
                        alert("atualizou a despesa");
                        despesaStore.handleEditando();

                        window.location.reload();
                    })
                    .catch(erro => {
                        alert("deu erro");
                    })

            } else {
               alert("Altere um campo pelo menos para poder atualizar")
            }
        }
    })
}


onMounted(async () => {
    await despesaStore.getTiposDespesa()
})
</script>