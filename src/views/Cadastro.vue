<template>
    <div class="box-cadastro">
        <el-form :model="form" ref="cadastroForm">
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

            <el-form-item prop="salario" :rules="salarioRules" class="dale" style="display: flex;">
                <label for="salario">Salario</label>
                <div class="el-input">
                    <div class="el-input-wrapper">  
                        <Money3Component v-model="form.salario" v-bind="money" class="el-input__wrapper"  style="width: 100%;"/>
                    </div>
                </div>
            </el-form-item>

            <el-form-item prop="senha" :rules="senhaRules">
                <label for="senha">Senha</label>
                <el-input type="password" v-model="form.senha" placeholder="digite a senha" />
            </el-form-item>

            <el-form-item prop="confirmarSenha" :rules="confirmarSenhaRules">
                <label for="confirmarSenha">Confirmar Senha</label>
                <el-input type="password" v-model="form.confirmarSenha" placeholder="digite novamente a senha" />
            </el-form-item>

            <el-button @click="cadastrar(cadastroForm)">Cadastrar</el-button>
        </el-form>
        <span @click="router.push('/login')">Já possui cadastro? Faça o login</span>
    </div>
</template>
<script setup>
import axios from 'axios';
import { Money3Component } from 'v-money3';

import { ref } from 'vue'
import { useRouter } from 'vue-router';

const router = useRouter()

const form = ref({})
const cadastroForm = ref(null)

const emailRules = [
    { required: true, message: "Por favor digite o email", trigger: "blur" },
    {
        type: "email",
        message: "Por favor digite um email válido",
        trigger: "blur",
    },
    
];

const nomeRules = { required: true, message: "Por favor digite seu nome", trigger: "blur" };

const salarioRules = {
    validator: (rule, value, callback) => {
        if (value == 0)
            callback(new Error("Por favor preencha o valor corretamente"));
        else
            callback()
    },
    trigger: "blur",
}
const dataDeNascimentoRules = { required: true, message: "Por favor preencha a data", trigger: "blur" };


const senhaRules = [
    { required: true, message: "Por favor digite a senha", trigger: "blur" },
    {
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
    },
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

const money = {
    decimal: ',',
    thousands: '.',
    prefix: 'R$ ',
    suffix: ' ',
    precision: 2,
    masked: false
}

const cadastrar = (formCadastro) => {
    formCadastro.validate(async (valid) => {
        if (valid) {
            await axios
                .post("https://fincancas-ordem-api.onrender.com/usuario", {
                    "email": form.value.email,
                    "nome_completo": form.value.nome_completo,
                    "data_nascimento": form.value.data_nascimento,
                    "cpf": form.value.cpf,
                    "salario": parseFloat(form.value.salario),
                    "senha": form.value.senha
                })
                .then(response => {
                    alert("cadastro realizado com sucesso. Realize o login");
                    router.push("/login")
                })
                .catch(error => {
                    alert(error.response.data.error);
                })
        }
    })
}
</script>
<style scoped>
.box-cadastro {
    padding: 24px 0;
    margin: auto;
    width: 360px;
}

.box-cadastro .el-form {

    border: 1px solid;
    padding: 8px 12px;
    border: 1px solid var(--el-border-color-hover);
    border-radius: 4px;
    padding: 1rem
}

.box-cadastro span{
    float: right;
    font-size: 13.5px;
    cursor: pointer;
}

.el-button {
    display: flex;
    margin: auto;
}

.v-money3{
    padding: 7px 11px;
    background-color: var(--el-input-bg-color, var(--el-fill-color-blank));
    border: unset;
    /* color: var(--el-input-text-color, var(--el-text-color-regular)); */
    border-radius: 4px;
    height: var(--el-input-inner-height);
    width: 100% !important;
}
.v-money3 input{
    width: 100% !important;
    color: var(--el-input-text-color, var(--el-text-color-regular));
}
.v-money3:focus{
    outline: none;
    box-shadow: 0 0 0 1px var(--el-input-focus-border-color);
}
.dale .el-input{
    width: 100%;
    display: flex;
}

.dale .el-input-wrapper{
    display: flex;
    width: 100%;
}
</style>