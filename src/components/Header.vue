<template>
    <el-row justify="center">
        <el-col :span="22">
            <el-menu mode="horizontal">

                    <el-menu-item @click="router.push('/home')">Home</el-menu-item>
                    <el-menu-item @click="router.push('/despesas')">Despesas</el-menu-item>
                    <el-menu-item @click="router.push('/percentuais')">Total Gasto</el-menu-item>
                    <el-menu-item @click="router.push('/despesas-personalizadas')">Despesas personalizadas</el-menu-item>
                    <el-menu-item @click="router.push('/sobre')">Sobre</el-menu-item>
                    <div class="acoes">
                        <el-menu-item v-if="isSessao()" @click="sair()">Sair</el-menu-item>
                        <div v-else style="display: flex;">
                            <el-menu-item @click="router.push('/login')">Login</el-menu-item>
                            <el-menu-item @click="router.push('/cadastro')">Cadastro</el-menu-item>
                        </div>
                    </div>
            </el-menu>
        </el-col>
    </el-row>
</template>
<script setup>
import { useRouter } from 'vue-router'

const router = useRouter();

const sair = () => {
    localStorage.removeItem("token");

    return router.push("/login")
}

const isSessao = () => {
    return localStorage.getItem('token')
}

</script>
<style scoped>

.el-menu{
    border: none
}
.el-row{
    border-bottom: 1px solid var(--el-border-color-hover);

}
.acoes{
    display: flex;
    margin-left: auto;
}
</style>