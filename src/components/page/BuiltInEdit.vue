<template>
    <div>
        <el-row>
            <editor style="font-size: 15px" v-model="content" @init="editorInit" lang="python" theme="monokai"
                width="100%" height="600px" :options="{
                    enableSnippets: true,
                    enableBasicAutocompletion: true,
                    enableLiveAutocompletion: true
                }">
            </editor>
        </el-row>

        <el-row class="btn_class">
            <el-button type="primary" size="medium" style="margin-right: 10px;" @click="saveBuiltin">保存</el-button>
            <el-button type="danger" size="medium" @click="toIndexPage">回到主页</el-button>
        </el-row>

        <template>
            <el-button type="text" @click="open"></el-button>
        </template>
    </div>
</template>

<script>
import api from '@/api/debugtalk'

export default {
    beforeRouteEnter (to, from, next) {
        next(vm => {
            vm.debugtalk_id = vm.$router.params.id;
            vm.getCode();
        });
        next()
    },


}
</script>

<style>
.btn_class{
    margin-top: 10px;
}
</style>