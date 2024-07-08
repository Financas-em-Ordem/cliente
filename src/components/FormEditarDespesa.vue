<style scoped>

</style>
<template>

    <el-dialog v-model="props.openModal" title="Edite a despesa"  @close="fecharForm(despesaForm)" :width="getLargura > 576 ? 500 : 300" draggable>
        <el-form :model="despesaEdit" ref="despesaForm">
            <el-form-item prop="descricao" :rules="descricaoRules">
                <label for="descricao">Descrição</label>
                <el-input type="text" v-model="despesaEdit.descricao" />
            </el-form-item>

            <el-form-item prop="data" :rules="dataRules" style="display: grid;">
                <label for="data">Data</label>
                <el-date-picker class="data" v-model="despesaEdit.data" type="date" format="DD/MM/YYYY"
                    value-format="DD/MM/YYYY" style="width: 100%;">
                </el-date-picker>
            </el-form-item>

            <el-form-item prop="valor" :rules="valorRules">
                <label for="valor">Valor</label>
                <el-input type="number" v-model="despesaEdit.valor" />
                <Money3Component v-model="despesaEdit.valor" v-bind="money" style="display: none;">
                </Money3Component>
            </el-form-item>


            <el-form-item prop="tipo_despesa" style="display: grid;">
                <label for="tipo_despesa">Tipo Despeas</label>
                <el-select v-model="despesaEdit.tipoDespesa.id" :label="despesaEdit.tipoDespesa.nome"
                    style="width: 100%;">
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
import { ref, onMounted,  onBeforeUnmount } from 'vue';
import { usedespesaStore } from '../store/despesa';

import axios from 'axios';
import { add, addDays, format } from 'date-fns';

const props = defineProps({
    openModal: Boolean,
    despesa: Object,
    despesaEdit: Object
})

const emit = defineEmits("fechaModal")

const despesaStore = usedespesaStore();

onMounted(async () => {
    window.addEventListener('resize', handleResize);

    await despesaStore.getTiposDespesa();
})

const getLargura = ref(window.innerWidth)

const handleResize = () => {
    getLargura.value = window.innerWidth;
};

onBeforeUnmount(() => {
    window.removeEventListener('resize', handleResize);
});

const fecharForm = (form) => {
    emit("fechaModal", false)
    form.clearValidate()
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


const salvar = (form) => {
    form.validate(valid => {
        console.log(new Date(props.despesaEdit.data))
        if (!(props.despesaEdit.descricao == props.despesa.descricao
            && props.despesaEdit.data == props.despesa.data
            && props.despesaEdit.valor == props.despesa.valor
            && props.despesaEdit.tipoDespesa.id == props.despesa.tipoDespesa.id
        )) {
            axios
                .patch(`${import.meta.env.VITE_API_URL}/despesa/atualizar/`, {
                    "id": props.despesaEdit.id,
                    "descricao": props.despesaEdit.descricao,
                    "data": format(addDays(new Date(props.despesaEdit.data), 1), 'dd/MM/yyyy'),
                    "valor": parseFloat(props.despesaEdit.valor),
                    "tipoDespesaId": props.despesaEdit.tipoDespesa.id,
                    "usuarioId": despesaStore.showPerfil.id
                }, {
                    headers: { 'Authorization': `Bearer ${localStorage.getItem("token")}` }
                })
                .then(response => {
                    alert("atualizou a despesa");
                    despesaStore.handleEditando();

                    window.location.reload();
                })
                .catch(erro => {
                    alert("deu erro");
                })

        }
        console.log("nao pode salvar")
    })
}
</script>