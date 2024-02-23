<template>
    {{ form }}
    <el-form :model="form" ref="cadastroForm" class="box-cadastro">
        <el-form-item prop="email" :rules="emailRules">
            <label for="email">Email</label>
            <el-input type="text" v-model="form.email" placeholder="digite o email" />
        </el-form-item>

        <el-form-item prop="nome_completo" :rules="nomeRules">
            <label for="nome_completo">Nome Completo</label>
            <el-input type="text" v-model="form.nome_completo" placeholder="digite o nome completo" />
        </el-form-item>

        <el-form-item prop="data_nascimento" :rules="dataDeNascimentoRules" style="display: grid;">
            <label for="data_nascimento">Data de Nascimento</label>
            <el-date-picker class="data-nascimento" v-model="form.data_nascimento" type="date"
                placeholder="Selecione a data" format="DD/MM/YYYY" value-format="DD/MM/YYYY" style="width: 100%;">
            </el-date-picker>
        </el-form-item>

        <el-form-item prop="cpf" :rules="cpfRules">
            <label for="cpf">CPF</label>
            <el-input type="text" v-model="form.cpf" v-mask="'###.###.###-##'" placeholder="digite o cpf" />
        </el-form-item>

        <el-form-item prop="senha" :rules="senhaRules">
            <label for="senha">Senha</label>
            <el-input type="password" v-model="form.senha" placeholder="digite a senha" />
        </el-form-item>

        <el-form-item prop="confirmarSenha" :rules="confirmarSenhaRules">
            <label for="confirmarSenha">Confirmar Senha</label>
            <el-input type="password" v-model="form.confirmarSenha" placeholder="digite novamente a mesma senha" />
        </el-form-item>

        <el-button @click="cadastrar(cadastroForm)">Cadastrar</el-button>
    </el-form>

</template>
<script setup>
import axios from 'axios';
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router';

const router = useRouter()

const form = ref({})
const cadastroForm = ref(null)

const emailRules = [
    { required: true, message: "Por favor digite o email", trigger: "blur" },
    /*{
        type: "email",
        message: "Por favor digite um email válido",
        trigger: "blur",
    },
    */
];

const nomeRules = { required: true, message: "Por favor digite seu nome", trigger: "blur" };

const senhaRules = [
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

const cpfRules = [
    { required: true, message: "Por favor digite o CPF", trigger: "blur" },
    {
        validator: (rule, value, callback) => {
            const cpfRegex = /^\d{3}\.\d{3}\.\d{3}\-\d{2}$/;

            if (cpfRegex.test(value)) {
                callback();
            } else {
                callback(new Error("Por favor digite um CPF válido"));
            }
        },
        trigger: "blur",
    },
];

const confirmarSenhaRules = [
    {
        required: true,
        message: "Por favor confirme a sua senha",
        trigger: "blur",
    },
    {
        validator: (rule, value, callback) => {
            if (value !== form.value.senha) {
                callback(new Error("Senhas diferentes"));
            } else {
                callback();
            }
        },
        trigger: "blur",
    },
];

const cadastrar = (formCadastro) => {
        formCadastro.validate(async (valid) =>{
            if(valid){
                await axios
                .post("http://3.137.212.158:3000/usuario", {
                    "email": form.value.email,
                    "nome_completo": form.value.nome_completo,
                    "data_nascimento": form.value.data_nascimento,
                    "cpf": form.value.cpf,
                    "senha": form.value.senha
                })
                .then(response => {
                    alert("cadastro realizado com sucesso");
                    router.push("/login")
                })
                .catch(error => {
                    alert("cadastro deu erro. tente novamente");
                    console.log(error)
                })
            }
        })
}
</script>
<style scoped>
.box-cadastro {
    margin: auto !important;
    width: 350px;
    border: 1px solid;
    padding: 8px 12px;
    border: 1px solid var(--el-border-color-hover);
    border-radius: 4px;
}
.data-nascimento{
    display: none!important;
}

.el-button{
    display: flex;
    margin: auto;
}

@media(min-height: 560px){
    .box-cadastro {
    position: absolute;
    left: calc(50% - 175px);
    top: calc(50% - 275px);
    padding: 8px 12px;
    border-radius: 4px;
}
}
</style>