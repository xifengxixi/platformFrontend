<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>套件管理</el-breadcrumb-item>
                <el-breadcrumb-item>套件新增</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="form-box">
                <el-form ref="form" :rules="rules" :model="form" label-width="100px">
                    <el-form-item label="套件名称" prop="name">
                        <el-input v-model="form.name" suffix-icon="el-icon-menu" @focus="clearValidate('name')"
                            clearable></el-input>
                    </el-form-item>

                    <el-form-item label="选择项目" prop="project_id">
                        <el-select v-model="form.project_id" placeholder="请选择"
                            @change="getInterfacesByProjectID(form.project_id)">
                            <el-option v-for="(item, key) in project_list" :key="key" :label="item.name"
                                :value="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item>

                    <el-form-item label="选择接口" prop="include">
                        <div class="drag-box">
                            <div class="drag-box-item">
                                <div class="item-title">待选接口</div>
                                <draggable v-model="unselected" :options="dragOptions" @change="unchangeResult()">
                                    <transition-group tag="div" class="item-ul">
                                        <div v-for="item in unselected" class="drag-list" :key="item.id">
                                            {{ item.name }}
                                        </div>
                                    </transition-group>
                                </draggable>
                            </div>

                            <div class="drag-box-item">
                                <div class="item-title">已选接口</div>
                                <draggable v-model="selected" :options="dragOptions" @change="changeResult()">
                                    <transition-group tag="div" class="item-ul">
                                        <div v-for="item in selected" class="drag-list" :key="item.id">
                                            {{ item.name }}
                                        </div>
                                    </transition-group>
                                </draggable>
                            </div>
                        </div>
                    </el-form-item>

                    <el-form-item>
                        <el-button type="primary" @click="onSubmit('form')">提交</el-button>
                        <el-button @click="resetForm('form')">取消</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </div>

    </div>
</template>

<script>
import draggable from 'vuedraggable'
import api from '@/api/testsuit'
import api_project from '@/api/project'

export default {
    data: function(){
        return {
            form: {
                name: '',           // 套件名称
                project_id: '',    // 项目ID
                include: ''
            },

            rules: {
                name: [
                    { required: true, message: '请输入套件名称', trigger: 'blur' }
                ],
                project_id: [
                    { required: true, message: '请选择所属项目', trigger: 'blur' }
                ],
            },
            project_list: [],
            dragOptions:{
                animation: 120,
                scroll: true,
                group: 'sortlist',
                ghostClass: 'ghost-style'
            },
            unselected: [],
            selected: [],
            selected_ids: [],
            unselected_ids: []
        }
    },

    components:{
        draggable
    },

    created() {
        this.getProjectNames();
    },

    methods: {
        onSubmit(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    let that = this;
                    let includes = this.selected_ids;
                    this.form.include = JSON.stringify(includes)
                    api.addTestSuit(this.form)
                    .then((response)=> {
                        this.$message.success('新增套件成功！');

                        setTimeout(function () {
                            that.$router.go();
                        }, 1000);

                    })
                    .catch(error => {
                        if (error.response.data.hasOwnProperty('name')) {
                            this.$message.error('套件名称已存在');
                        } else {
                            this.$message.error('服务器错误');
                        }
                        
                    });
                            
                } else {
                    this.$message.error('参数有误');
                    return false;
                }
            });
        },
        clearValidate(prop_value) {
            this.$refs['form'].clearValidate(prop_value);
        },
        resetForm(formName) {
            this.$refs[formName].resetFields();   // 清空表单
        },
        getProjectNames() {
            api_project.names()
            .then((response)=> {
                this.project_list = response.data;
            })
            .catch(error => {
                that.$message.error('服务器错误');
            });
        },
        getInterfacesByProjectID(pro_id){
            api_project.interfaces(pro_id)
            .then((response)=> {
                this.unselected = response.data;
            })
            .catch(error => {
                that.$message.error('服务器错误');
            });
        },
        changeResult() {
            var len = this.selected.length;
            var text = "[";
            for (var i = 0; i < len; i++) {
                if (i === len - 1) {
                    text += this.selected[i].id + "]";
                }
                else {
                    text += this.selected[i].id + ", ";
                }

            }
            if (len === 0) {
                text = "[]";
            }
            this.selected_ids = JSON.parse(text);
        },
        unchangeResult() {
            var len = this.unselected.length;
            var text = "[";
            for (var i = 0; i < len; i++) {
                if (i === len - 1) {
                    text += this.unselected[i].id + "]";
                }
                else {
                    text += this.unselected[i].id + ", ";
                }

            }
            if (len === 0) {
                text = "[]";
            }
            this.unselected_ids = JSON.parse(text);
        },
    }
}
</script>

<style>
.drag-box{
    display: flex;
    user-select: none;
}
.drag-box-item {
    flex: 1;
    max-width: 330px;
    min-width: 300px;
    background-color: #eff1f5;
    margin-right: 16px;
    border-radius: 6px;
    border: 1px #e1e4e8 solid;
}
.item-title{
    padding: 8px 8px 8px 12px;
    font-size: 14px;
    line-height: 1.5;
    color: #24292e;
    font-weight: 600;
}
.item-ul{
    padding: 0 8px 8px;
    /*height: 500px;*/
    height: 400px;
    overflow-y: scroll;
}
.item-ul::-webkit-scrollbar{
    width: 0;
}
.drag-list {
    border: 1px #e1e4e8 solid;
    padding: 10px;
    margin: 5px 0 10px;
    list-style: none;
    background-color: #fff;
    border-radius: 6px;
    cursor: pointer;
    -webkit-transition: border .3s ease-in;
    transition: border .3s ease-in;
}
.drag-list:hover {
    border: 1px solid #20a0ff;
}
.drag-title {
    font-weight: 400;
    line-height: 25px;
    margin: 10px 0;
    font-size: 22px;
    color: #1f2f3d;
}
.ghost-style{
    display: block;
    color: transparent;
    border-style: dashed
}
</style>