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
    justify-content: center;
    display: flex
}
</style>
<template>
    <el-row justify="center" class="container">
        <el-col :span="22">
            <el-table row-key="id" :data="despesas" border default-expand-all v-if="despesas.length >= 1 && getLargura">
                <el-table-column prop="data" label="Data" align="center" sortable />
                <el-table-column prop="descricao" label="Descriçao" class="coluna-descricao" align="center" sortable />
                <el-table-column prop="tipoDespesa.nome" label="Tipo" align="center" sortable />
                <el-table-column prop="valor" label="Valor(R$)" align="center" sortable />
            </el-table>
            <div class="despesa-item" v-for="despesa in despesas" v-else>
                <h5>{{ despesa.data }} </h5>
                <h4>{{ despesa.tipoDespesa.nome }}</h4>
                <p> {{ despesa.descricao }} - R${{ despesa.valor }} </p>
            </div>
            <div class="box-paginacao" v-show="despesas.length >= 1">
                <span @click="voltarPagina()" v-if="pagina > 1" style="cursor: pointer;">Voltar</span>
                <span v-else></span>
                {{ pagina == 1 && proxPagina == false ?  "" : pagina}}
                <span @click="passarPagina()" v-if="proxPagina" style="cursor: pointer;">Passar</span>
                <span v-else></span>

            </div>
        </el-col>
    </el-row>
</template>
<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';

const props = defineProps({
    despesas: Array,
    proxPagina: Boolean,
    pagina: Number,
});



const emit = defineEmits("pagina")

const voltarPagina = () => {
    if (props.pagina <= 1) return

    return emit("pagina", 'voltar');
}

const passarPagina = () => {
    return emit("pagina", 'passar')
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