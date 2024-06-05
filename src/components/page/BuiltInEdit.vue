<template>
    <div>
        <el-row>
            <editor style="font-size: 15px" v-model="content" @init="editorInit" lang="python" theme="monokai"
                width="100%" height="600px" :options="{
                    enableSnippets: true, enableBasicAutocompletion: true, enableLiveAutocompletion: true
                }">
            </editor>
        </el-row>

        <el-row class="btn_class">
            <el-button type="primary" class="handle-box mr10" @click="saveBuiltin">保存</el-button>
            <el-button type="danger" class="handle-box mr10" @click="clearBuiltin">清空</el-button>
        </el-row>

    </div>
</template>

<script>
import api from '@/api/debugtalk'

export default {
    beforeRouteEnter (to, from, next) {
        next(vm => {
            vm.debugtalk_id = vm.$route.params.id;
            vm.getCode();
        });
        next()
    },
    beforeRouteLeave (to, from, next) {
        this.leaveAndSave(next);
    },

    components: {
        editor: require('vue2-ace-editor'),
    },

    data() {
        return {
            content: '',
            debugtalk_id: null,
        }
    },

    methods: {
        editorInit() {
            require('brace/ext/language_tools');
            require('brace/mode/python');
            require('brace/theme/monokai');
            require('brace/snippets/python');
        },

        // 获取内置函数源码
        getCode() {
            api.funcDetail(this.debugtalk_id)
            .then(response => {
                if (response.status === 200) {
                    this.content = response.data.debugtalk;
                }
            })
            .catch(error => {
                this.$message('服务器错误');
            })
        },

        saveBuiltin() {
            api.funcEdit(this.debugtalk_id, {debugtalk: this.content})
            .then(response => {
                if (response.status === 200) {
                    this.$message.success('更新成功');
                }
                else if (response.status === 400) {
                    if (response.data.hasOwnProperty('debugtalk')) {
                        this.$message.error('debugtalk：' + response.data.debugtalk[0]);
                    }
                }
            })
            .catch(error => {
                this.$message.error('服务器错误');
            })
        },

        clearBuiltin() {
            this.$confirm('是否清空当前内置函数文件？', '确认信息', {
                distinguishCancelAndClose: true,
                confirmButtonText: '确定',
                cancelButtonText: '取消'
            })
            .then(() => {
                this.$message.success('清空成功');
                this.content = '';
            })
        },

        async leaveAndSave(nextFn) {
            let response = await api.funcDetail(this.debugtalk_id);
            let current_content = response.data.debugtalk;
            if (current_content === this.content) {
                nextFn();
            }
            else {
                this.$confirm('当前内容未保存，是否离开？', '确认信息', {
                    distinguishCancelAndClose: true,
                    confirmButtonText: '保存并离开',
                    cancelButtonText: '放弃修改'
                })
                .then((action) => {
                    if (action === 'confirm') {
                        this.saveBuiltin();
                    }
                    nextFn();
                })
                .catch(() => {
                    nextFn();
                })
            }
        }
    },

}
</script>

<style>
.btn_class{
    margin-top: 10px;
}
.handle-box {
  margin-bottom: 20px;
}
.mr10{
  margin-right: 10px;
}
</style>