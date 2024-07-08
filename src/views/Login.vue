<template>
    <div class="box-login">
        <el-form :model="form" ref="loginForm">
            <el-form-item prop="email" :rules="emailRules" style="display: grid;">
                <label for="email">Email</label>
                <el-input type="text" v-model="form.email" placeholder="digite o email" style="width: 100%;" />
            </el-form-item>

            <el-form-item prop="senha" :rules="passwordRules" style="display: grid;">
                <label for="senha">Senha</label>
                <el-input type="password" v-model="form.senha" placeholder="digite a senha" style="width: 100%;" />
            </el-form-item>

            <el-button @click="login(loginForm)">Entrar</el-button>
        </el-form>
        <span @click="router.push('/cadastro')">Não possui conta? Faça seu cadastro </span>
    </div>
</template>
<script setup>
import { ref } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router';

const router = useRouter()

const form = ref({})
const loginForm = ref(null)

const emailRules = [
    { required: true, message: "Por favor digite o email", trigger: "blur" },
    {
        type: "email",
        message: "Por favor digite um email válido",
        trigger: "blur",
    }
];

const passwordRules = [
    { required: true, message: "Por favor digite a senha", trigger: "blur" },
];

const login = (formLogin) => {
    formLogin.validate(async (valid) => {
        if (valid) {
            await axios
                .post(`${import.meta.env.VITE_API_URL}/login`, {
                    "email": form.value.email,
                    "password": form.value.senha
                })
                .then(response => {
                    alert("logado com sucesso")

                    localStorage.setItem("token", response.data.access_token)
                    router.push('/home')
                })
                .catch(error => {
                    alert("erro ao logar")
                })
        }
    })
}

</script>
<style scoped>
body {
    min-height: 100vh;
    display: flex;
    align-content: center;
}

label {
    font-size: 14px;
    color: var(--preto);
}

.box-login {
    position: fixed;
    top: calc(50% - 125px);
    left: calc(50% - 175px);
}

.box-login .el-form {
    width: 300px;
    height: 200px;
    border: 1px solid var(--el-border-color-hover);
    border-radius: 4px;
    padding: 1.5rem;
}

.box-login .el-button {
    display: flex;
    margin: auto;
}

.box-login .el-form-item {
    flex-direction: column;
}

.box-login .el-form-item__label label {
    display: none;
}

.box-login span {
    float: right;
    font-size: 13.5px;
    cursor: pointer;
}
</style>