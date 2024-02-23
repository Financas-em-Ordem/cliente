<template>
    <el-header>
        <el-row justify="center">
            <el-col :span="22">
                <div class="paginas">
                    <span @click="router.push('/home')">Home</span>
                    <span @click="router.push('/despesas')">Despesas</span>
                    <span @click="router.push('/percentuais')">Total Gasto</span>
                    <span>Despesas personalizadas</span>
                    <span>Sobre nós</span>
                </div>
                <span>Sair</span>
            </el-col>
        </el-row>
    </el-header>
</template>
<script setup>
import {useRouter} from 'vue-router'

const router = useRouter();


</script>
<style scoped>
.el-header {
    border-bottom: 1px solid var(--el-border-color-hover);
    padding: 1rem 0;
}

.el-col {
    display: flex;
    justify-content: space-between;
}

span {
    margin: 0 10px;
    cursor: pointer;
}
span:first-child{
    margin-left: 0;
}
span:last-child {
    margin-right: 0;
}
</style>