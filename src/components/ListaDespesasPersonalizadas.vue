<style scoped>
.container {
    padding: 24px 0;
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
}

.box-paginacao {
    display: flex;
    justify-content: center;
    gap: 12px;
    margin: 1rem 0;
}

.box-paginacao span {
    width: 52px;
}
</style>
<template>
    <el-row justify="center" class="container">
        <el-col :span="22">
            <el-table row-key="id" :data="listaDespesas" border default-expand-all
                v-if="listaDespesas.length >= 1 && getLargura">
                <el-table-column prop="data" label="Data" align="center" sortable />
                <el-table-column prop="descricao" label="Descriçao" class="coluna-descricao" align="center" sortable />
                <el-table-column prop="tipoDespesa.nome" label="Tipo" align="center" sortable />
                <el-table-column prop="valor" label="Valor(R$)" align="center" sortable />
            </el-table>
            <div class="despesa-item" v-for="despesa in listaDespesas" v-else>
                <h5>{{ despesa.data }} </h5>
                <h4>{{ despesa.tipoDespesa.nome }}</h4>
                <p> {{ despesa.descricao }} - R${{ despesa.valor }} </p>
            </div>
            <div class="box-paginacao">
                <span @click="voltarPagina()" v-if="indexPagina > 1" style="cursor: pointer;">Voltar</span>
                <span v-else></span>
                {{ listaDespesas.length >= 1 ? indexPagina : "" }}
                <span @click="passarPagina()"
                    v-if="despesaStore.showProxPagePersonalizada"
                    style="cursor: pointer;">Passar</span>
                <span v-else></span>

            </div>
        </el-col>
    </el-row>
</template>
<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
import { usedespesaStore } from '../store/despesa';

const despesaStore = usedespesaStore();

const listaDespesas = computed(() => despesaStore.showListaDespesasPersonalizada)

const props = defineProps({
    parametro: Object
});

let indexPagina = ref(1);
const burlaUndefined = ref(0)

const emit = defineEmits("pagina")


const voltarPagina = () => {
    if (indexPagina.value <= 1) return

    indexPagina.value--;
    return emit("pagina", indexPagina.value);
}

const passarPagina = () => {
    indexPagina.value++
    return emit("pagina", indexPagina.value)
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