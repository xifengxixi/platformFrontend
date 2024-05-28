<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>环境管理</el-breadcrumb-item>
                <el-breadcrumb-item>环境新增</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <el-form :model="form" status-icon :rules="rules" ref="form" label-width="100px">
                <el-form-item label="环境名称" prop="name" label-width="120px">
                    <el-input v-model="form.name" clearable @focus="clearValidate('name')"></el-input>
                </el-form-item>
                <el-form-item label="请求base_url" prop="base_url" label-width="120px">
                    <el-input v-model="form.base_url" clearable @focus="clearValidate('base_url')"></el-input>
                </el-form-item>
                <el-form-item label="简要描述" prop="desc" label-width="120px">
                    <el-input v-model="form.desc" clearable @focus="clearValidate('desc')"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="submitForm('form')">提交</el-button>
                    <el-button @click="resetForm('form')">重置</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script>
import api from '@/api/env'

export default {
    data() {
        var validateEnvName = (rule, value, callback) => {
            var len = value.length
            if ( len === 0 ) {
                return callback(new Error('请输入环境名称'));
            }
            else if (len > 20) {
                return callback(new Error('环境名称不能超过20个字符'));
            }
            else {
                callback();
            }
        }
        return {
            form: {
                name: '',
                base_url: '',
                desc: ''
            },
            rules: {
                name: [
                    { validator: validateEnvName, trigger: 'blur', required: true }
                ],
                base_url: [
                    { message: '请输入环境base_url', trigger: 'blur', required: true }
                ],
                desc: [
                    { trigger: 'blur', required: true }
                ]
            }
        };
    },
    methods: {
        submitForm(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    let that = this;
                    api.createEnv(this.form)
                    .then(response => {
                        this.$message.success('新建环境成功');
                        setInterval(function() {
                            that.resetForm('form');
                        }, 1000)
                    })
                    .catch(error => {
                        this.$message.error('服务器错误');
                    })
                } else {
                    this.$message.error('参数有误')
                    return false;
                }
            });
        },
        resetForm(formName) {
            this.$refs[formName].resetFields();
        },
        clearValidate(prop) {
            this.$refs['form'].clearValidate(prop);
        }
    }
}
</script>

<style>

</style>