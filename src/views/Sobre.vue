<template>
    <Header />

    <el-row justify="center" class="container">
        <el-col :span="22">
            <h1>Sobre o Projeto</h1>
            <p>
                O Finanças em Ordem é um portifólio/projeto de lançamento de despesas que visa
                uma melhor gerenciamento do consumo sobre o poder aquisitivo do usuário.
            </p>
            <p>
                A base do projeto está no modelo de divisao por tipos e seus percentuais sobre o total ganho pelo usuário.
                Ao todo sao 6 tipos de tipos de despesa:
            </p>
            <ol>
                <li> <b>Viver:</b>  Despesas relacionadas a necessidades básicas, como moradia, alimentação e transporte. Corresponde
                    a 50% do salário </li>
                <li> <b>Lazer:</b>  Gastos associados a atividades recreativas e entretenimento. Corresponde a 10% do salário.</li>
                <li> <b>Saúde:</b>  Despesas com cuidados médicos, medicamentos e bem-estar.  Corresponde a 10% do salário.</li>
                <li> <b>Doação:</b>  Gastos destinados a doações e contribuições para causas sociais.  Corresponde a 10% do salário.</li>
                <li> <b>Investimento:</b>  Despesas relacionadas a investimentos para o futuro financeiro. Corresponde a 10% do salário.</li>
                <li> <b>Educaçao:</b>  Gastos destinados para adiquirir conhecimento que impacte nos seus ganhos.  Corresponde a 10% do salário.</li>
            </ol>
            <p>
                As tecnologias utilizadas neste projeto na parte de frontend VueJS e no backend NestJS. Atualmente tanto a API quanto 
                a parte visual do projeto estao hospedadas no Vercel.
            </p>
            <p>Para análise mais técnica segue o link da organizaçao criado no <a href="https://github.com/orgs/Financas-em-Ordem/repositories" target="_blank">Github</a>  e seus respectivos repositorios</p>
            <p>Para ter acesso ao sistema <span @click="router.push('/cadastro')">Clique aqui</span> e crie ou acesse uma conta</p>
            <h2>Sobre Mim</h2>
            <p>
                Meu nome é <a href="https://www.linkedin.com/in/augusto-ferreira-965a96288/" _blank class="link-perfil">Augusto Ferreira de Abreu</a> e sou natural de Campo Grande, Mato Grosso do Sul. Tenho 20 anos, 
                recentemente me graduei em Análise e Desenvolvimento de Sistemas pela Universidade Católica Dom Bosco (UCDB).
                Atualmente, estou em busca da minha primeira oportunidade de emprego como desenvolvedor junior fullstack. 
            </p>
            <p>
                Minhas skills técnicas estão focadas na parte de frontend web mais especificamente <b>HTML, CSS, JavaScript e VueJS.</b> 
                Na parte de backend minhas skills sao concentradas em maior parte <b>NestJS e Express</b> e menor parte <b>PHP e Java</b>
            </p>
        </el-col>
    </el-row>
</template>
<script setup>
import Header from '../components/Header.vue'

import { useRouter } from 'vue-router'

const router = useRouter();
</script>
<style scoped>
.container {
    padding: 24px 0;
}
.link-perfil{
    font-weight: bold;
}
span{
    font-size: 14px;
    font-weight: bolder;
    cursor: pointer;
}
p, li{
    text-align: justify;
}

@media (max-width: 576px){
    p, li{
        font-size: 15.5px;
    }
}

@media (max-width: 425px){
    p, li{
        font-size: 14.5px;
    }
}
</style>