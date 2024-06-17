<template>
    <el-row justify="center">
        <el-col :span="22">
            <el-form>
                <el-date-picker v-model="mes" type="month" placeholder="Pick a month" format="DD/MM/YYYY"
                    value-format="YYYY-MM-DD" />
            </el-form>

            <el-button @click="datas(mes)">clique</el-button>
        </el-col>
    </el-row>
</template>
<script setup>
import { ref } from 'vue';
import { endOfMonth, startOfMonth, format, addMonths } from 'date-fns'

const mes = ref("")

const teste = () => {
    const inicioMes = endOfMonth(addMonths('2024-12-01', 1));


    return format(inicioMes, 'yyyy-MM-dd')

}
const fomartarData = (data) => {return format(data, 'yyyy-MM-dd')}

const datas = (data) => {
    const inicioMes = startOfMonth(addMonths(data, 1));
    const finalMes = endOfMonth(addMonths(data, 1));

}

</script>