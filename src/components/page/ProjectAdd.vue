<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>项目管理</el-breadcrumb-item>
                <el-breadcrumb-item>项目新增</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <el-form :model="form" status-icon :rules="rules" ref="form" label-width="100px">
                <el-form-item label="项目名称" prop="name">
                    <el-input v-model="form.name" clearable @focus="clearValidate('name')"></el-input>
                </el-form-item>
                <el-form-item label="负责人" prop="leader">
                    <el-input v-model="form.leader" clearable @focus="clearValidate('leader')"></el-input>
                </el-form-item>
                <el-form-item label="开发人员" prop="programmer">
                    <el-input v-model="form.programmer" clearable @focus="clearValidate('programmer')"></el-input>
                </el-form-item>
                <el-form-item label="测试人员" prop="tester">
                    <el-input v-model="form.tester" clearable @focus="clearValidate('tester')"></el-input>
                </el-form-item>
                <el-form-item label="应用名称" prop="publish_app">
                    <el-input v-model="form.publish_app" clearable @focus="clearValidate('publish_app')"></el-input>
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
import api from '@/api/project';

export default {
    data() {
        var validateProjectName = (rule, value, callback) => {
            console.log(value);
            console.log(value.length);
            var len = value.length;
            if (len === 0) {
                callback(new Error('请输入项目名称'));
            } else if (len > 20) {
                callback(new Error('项目名称不能超过20个字符'));
            } else {
                callback()
            }
        };
        return {
            form: {
                name: '',
                leader: '',
                programmer: '',
                tester: '',
                publish_app: ''
            },
            rules: {
                name: [
                    { validator: validateProjectName, trigger: 'blur', required: true }
                ],
                leader: [
                    { message: '请输入项目负责人', trigger: 'blur', required: true }
                ],
                programmer: [
                    { message: '请输入开发人员', trigger: 'blur', required: true }
                ],
                tester: [
                    { message: '请输入测试人员', trigger: 'blur', required: true }
                ],
                publish_app: [
                    { message: '请输入应用名称', trigger: 'blur', required: true }
                ],
            }
        };
    },
    methods: {
        submitForm(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    let that = this
                    api.createProject(this.form)
                    .then(response => {
                        this.$message.success('新增项目成功！');
                        // 1秒后刷新
                        setInterval(function () {
                            // that.$router.go();
                            that.resetForm('form');
                        }, 1000);
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