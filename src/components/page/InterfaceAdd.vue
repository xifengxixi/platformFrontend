<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>接口管理</el-breadcrumb-item>
                <el-breadcrumb-item>接口新增</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <el-form :model="form" status-icon :rules="rules" ref="form" label-width="100px">

                <el-form-item label="接口名称" prop="name">
                    <el-input v-model="form.name" clearable @focus="clearValidate('name')"></el-input>
                </el-form-item>
                <el-form-item label="所属项目" prop="project">
                    <el-autocomplete class="inline-input" v-model="form.project" :fetch-suggestions="querySearch"
                        placeholder="请输入选择项目名称" @select="handleSelect" value-key="name" clearable
                        @focus="clearValidate('project')"></el-autocomplete>
                </el-form-item>
                <el-form-item label="测试人员" prop="tester">
                    <el-input v-model="form.tester" clearable @focus="clearValidate('tester')"></el-input>
                </el-form-item>
                <el-form-item label="简要描述" prop="desc">
                    <el-input type="textarea" rows="4" v-model="form.desc" clearable
                        @focus="clearValidate('desc')"></el-input>
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
import api from '@/api/interface'
import api_project from '@/api/project'

export default {
    data() {
        var validateInterfaceName = (rule, value, callback) => {
            var len = value.length;
            if (len === 0) {
                callback(new Error('请输入接口名称'));
            } else if (len > 20) {
                callback(new Error('接口名称不能超过20个字符'));
            } else {
                callback()
            }
        };
        return {
            form: {
                name: '',
                project: '',
                project_id: '',
                tester: '',
                desc: '',
            },
            rules: {
                name: [
                    { validator: validateInterfaceName, trigger: 'blur', required: true }
                ],
                project: [
                    { message: '请选择所属项目', trigger: 'change', required: true }
                ],
                tester: [
                    { message: '请输入测试人员', trigger: 'blur', required: true }
                ],
                desc: [
                    { message: '请输入简要描述', trigger: 'blur', required: true }
                ],
            },
            project_list: [],
        };
    },

    methods: {
        submitForm(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    let that = this
                    let formCopy = JSON.parse(JSON.stringify(this.form));
                    delete formCopy.project;
                    api.createInterface(formCopy)
                    .then(response => {
                        if (response.status === 201) {
                            this.$message.success('新增接口成功！');
                            // 1秒后重置
                            // setTimeout(function () {
                            //     // that.$router.go();
                            //     that.resetForm('form');
                            // }, 1000);
                        }
                        else if (response.status === 400) {
                            if (response.data.hasOwnProperty('name')) {
                                this.$message.error(response.data.name[0]);
                            }
                        }
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
        },

        getProjectList() {
            api_project.names()
            .then(response => {
                this.project_list = response.data;
            })
            .catch(error => {
                this.$message.error('服务器错误');
            })
        },

        querySearch(queryString, cb) {
            var project_list = this.project_list;
            var results = queryString ? project_list.filter(this.createFilter(queryString)) : project_list;
            // results = results.map((item) => {
            //     return {id: item.id, value: item.name};
            // })
            cb(results);
        },
        createFilter(queryString) {
            return (project_item) => {
                return (project_item.name.toLowerCase().includes(queryString.toLowerCase()));
            };
        },
        handleSelect(item) {
            this.form.project = item.name;
            this.form.project_id = item.id;
        },
    },

    mounted() {
        this.getProjectList();
    },
}
</script>

<style>
.inline-input {
    width: 40%;
}
</style>