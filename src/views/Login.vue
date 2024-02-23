<template>
    <el-form class="box-login" :model="form" ref="loginForm">
        <el-form-item prop="email" :rules="emailRules">
            <label for="email">Email</label>
            <el-input type="text" v-model="form.email" placeholder="digite o email" />
        </el-form-item>

        <el-form-item prop="senha" :rules="passwordRules">
            <label for="senha">Senha</label>
            <el-input type="password" v-model="form.senha" placeholder="digite a senha" />
        </el-form-item>

        <el-button @click="login(loginForm)">Entrar</el-button>
    </el-form>
</template>
<script setup>
import { ref } from 'vue'
import axios from 'axios'
import { useRouter, useRoute } from 'vue-router';

const router = useRouter()

const form = ref({})
const loginForm = ref(null)

const emailRules = [
    { required: true, message: "Por favor digite o email", trigger: "blur" },
    /*{
        type: "email",
        message: "Por favor digite um email válido",
        trigger: "blur",
    },
    */
];

const passwordRules = [
    { required: true, message: "Por favor digite a senha", trigger: "blur" },
    /*{
        validator: (rule, value, callback) => {
            const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&]).{6,}$/;
            if (!regex.test(value)) {
                callback(
                    new Error(
                        "A senha deve ter ao menos 6 caracteres, uma letra maiúscula, uma letra minúscula e um caracter especial"
                    )
                );
            } else {
                callback();
            }
        },
        trigger: "blur",
    },*/
];

const login = (formLogin) => {
    formLogin.validate(async (valid) => {
        if (valid) {
            await axios
                .post("http://3.137.212.158:3000/login", {
                    "email": form.value.email,
                    "senha": form.value.senha
                })
                .then(response => {
                    alert("logado com sucesso")
    
                    sessionStorage.setItem("token", response.data.access_token)
                    router.push('/home')
                })
                .catch(error => {
                    alert("erro ao logar")
                    console.log(error)
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
    width: 350px;
    height: 200px;
    border: 1px solid var(--el-border-color-hover);
    border-radius: 4px;
    padding: 1rem;
    position: fixed;
    top: calc(50% - 125px);
    left: calc(50% - 175px);
    place-items: center;
    display: grid;

}

.form-field {
    width: 100%;
}

.el-form-item {
    flex-direction: column;
}

.el-form-item__label label {
    display: none;
}
</style>