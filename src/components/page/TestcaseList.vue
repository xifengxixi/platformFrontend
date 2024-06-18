<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>用例管理</el-breadcrumb-item>
                <el-breadcrumb-item>用例列表</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-button type="primary" icon="el-icon-delete" class="handle-del mr10" @click="delAll">批量删除</el-button>
                <el-input v-model="search_testcase" placeholder="请输入用例名称" class="handle-input mr10"></el-input>
                <el-input v-model="search_project" placeholder="请输入项目名称" class="handle-input mr10"></el-input>
                <el-input v-model="search_interface" placeholder="请输入接口名称" class="handle-input mr10"></el-input>
                <el-button type="primary" icon="el-icon-search" @click="getData">搜索</el-button>
                <el-button type="primary" icon="el-icon-refresh-left" @click="reset">重置</el-button>
            </div>
            <el-table :data="tableData" border class="table" ref="multipleTable"
                @selection-change="handleSelectionChange" stripe>
                <el-table-column type="selection" width="55" align="center"></el-table-column>

                <el-table-column type="index" label="序号" width="55" align="center"></el-table-column>

                <el-table-column prop="name" label="用例名称" width="250">
                </el-table-column>

                <el-table-column prop="interface.project" label="所属项目" width="250">
                </el-table-column>

                <el-table-column prop="interface.name" label="所属接口" width="250">
                </el-table-column>

                <el-table-column prop="author" label="编写人员" width="100" align="center">
                </el-table-column>

                <el-table-column label="操作" align="center">
                    <template slot-scope="scope">
                        <el-button type="text" icon="el-icon-video-play"
                            @click="handleRun(scope.$index, scope.row)">运行</el-button>
                        <el-button type="text" icon="el-icon-edit" @click="linkTo(scope.row.id)">编辑</el-button>
                        <el-button type="text" icon="el-icon-delete" class="red"
                            @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>

            <div style="margin-top: 20px">
                <el-button @click="toggleSelection('Invert')">反选</el-button>
                <el-button @click="toggleSelection('Cancel')">取消选择</el-button>
            </div>
            <div class="pagination">
                <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                    :current-page="cur_page" :page-sizes="[5, 10, 15, 20]" :page-size="page_size"
                    layout="total, sizes, prev, pager, next, jumper" :total="total_nums">
                </el-pagination>
            </div>

        </div>

        <!-- 删除提示框 -->
        <el-dialog title="删除用例" :visible.sync="delVisible" width="300px" center>
            <div class="del-dialog-cnt">删除不可恢复，是否确定删除？</div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="delVisible = false">取 消</el-button>
                <el-button type="primary" @click="deleteRow">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 运行项目弹出框 -->
        <el-dialog title="运行用例" :visible.sync="runVisible" width="30%" center>
            <el-form ref="form" :model="form" label-width="120px">
                <el-form-item label="运行环境">
                    <el-select v-model="env_id" placeholder="请选择运行环境">
                        <el-option v-for="item in env_names" :key="item.id" :label="item.name"
                            :value="item.id"></el-option>
                    </el-select>
                </el-form-item>

            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="runVisible = false">取 消</el-button>
                <el-button type="primary" @click="openFullScreen"
                    v-loading.fullscreen.lock="fullscreenLoading">运行</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import api from '@/api/testcase'
import api_env from '@/api/env'

export default {
    data() {
        return {
            tableData: [],

            del_list: [],
            search_testcase: '',
            search_project: '',
            search_interface: '',

            cur_page: 1,      
            page_size: 10,    
            total_nums: 1,    

            testcase_idx: -1,  
            testcase_id: -1,   
            form: {},

            runVisible: false,  
            editVisible: false, 
            delVisible: false,  

            env_id: '',
            env_names: [],  
            fullscreenLoading: false,
        }
    },

    created() {
        this.getData();
        this.getEnvNames();
    },

    methods: {
        getData() {
            api.getList({
                page: this.cur_page,
                size: this.page_size,
                name: this.search_testcase,
                project: this.search_project,
                interface: this.search_interface,
            }).then(response => {
                this.tableData = response.data.results;
                this.cur_page = response.data.current_page_num || 1;
                this.total_nums = response.data.count || 1;
            })
        },

        toggleSelection(type) {
            if (type === 'Invert') {
                this.tableData.map(row => this.$refs.multipleTable.toggleRowSelection(row));
            } else {
                this.$refs.multipleTable.clearSelection();
            }
        },
        handleSelectionChange(val) {
            this.del_list = val.map(item => item.id);
        },

        delAll() {
            api.batchDelete({
                ids: this.del_list
            }).then(response => {
                if (response.status === 204) {
                    this.$message.success('删除成功');
                    this.getData();
                }
                else if (response.status === 400) {
                    this.$message.error('参数错误');
                } 
                else if (response.status === 500) {
                    this.$message.error('服务器错误');
                }
            }).catch(error => {
                this.$message.error('服务器错误');
            })
        },

        reset() {
            this.search_testcase = '';
            this.search_project = '';
            this.search_interface = '';
        },

        handleCurrentChange(val) {
            this.cur_page = val;
            this.getData();
        },
        handleSizeChange(val) {
            this.page_size = val;
            this.getData();
        },

        handleRun(index, row) {
            this.testcase_idx = index; 
            this.testcase_id = row.id; 
            this.form = row;
            this.runVisible = true;
        },
        handleEdit(index, row) {
            this.testcase_idx = index; 
            this.testcase_id = row.id;  
            this.form = { ...row };
            this.editVisible = true;
        },
        handleDelete(index, row) {
            this.testcase_idx = index; 
            this.testcase_id = row.id; 
            this.delVisible = true;
        },

        getEnvNames() {
            api_env.envNames()
                .then(response => {
                    this.env_names = response.data;
                })
                .catch(error => {
                    this.$message.error('服务器错误');
                })
        },

        async openFullScreen() {
            if (this.env_id === '') {
                this.$message.error('请选择运行环境')
            }
            else {
                this.runVisible = false
                this.fullscreenLoading = true;
                let response = await run_by_testcase({ iid: this.id, env_id: this.env_id })
                if (response.status === 201) {
                    this.fullscreenLoading = false
                    this.open(response)
                }
                else {
                    this.fullscreenLoading = false
                    this.open(response)
                }
            }
        },

        saveEdit() {
            api.editTestcase(this.testcase_id, this.form)
                .then(response => {
                    this.editVisible = false;
                    this.$message.success('编辑成功');
                    this.getData();
                })
                .catch(error => {
                    this.editVisible = false;
                    this.$message.error('服务器错误');
                })
        },

        deleteRow() {
            api.deleteTestcase(this.testcase_id)
                .then(response => {
                    this.$message.success('删除成功')
                    this.delVisible = false;
                    this.getData();
                })
                .catch(error => {
                    this.delVisible = false;
                    this.$message.error('服务器错误')
                })
        }
    }
}
</script>

<style>
.handle-box {
    margin-bottom: 20px;
}

.handle-select {
    width: 120px;
}

.handle-input {
    width: 200px;
    display: inline-block;
}

.del-dialog-cnt {
    font-size: 16px;
    text-align: center
}

.table {
    width: 100%;
    font-size: 14px;
}

.red {
    color: #ff0000;
}

.mr10 {
    margin-right: 10px;
}
</style>