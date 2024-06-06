<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>接口管理</el-breadcrumb-item>
                <el-breadcrumb-item>接口列表</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-button type="primary" icon="el-icon-delete" class="handle-del mr10" @click="batchDelete">批量删除</el-button>
                <el-input v-model="search_api" placeholder="按接口名称搜索" class="handle-input mr10"></el-input>
                <el-button type="primary" icon="el-icon-search" @click="getData">搜索</el-button>
                <el-button type="primary" icon="el-icon-refresh-left" @click="reset">重置</el-button>
            </div>
            <el-table ref="multipleTable" :data="tableData" tooltip-effect="dark" style="width: 100%"
                @selection-change="handleSelectionChange" border stripe>

                <el-table-column type="selection" width="55" align="center"></el-table-column>

                <el-table-column type="index" label="序号" width="55" align="center"></el-table-column>

                <el-table-column prop="name" label="接口名称" width="250">
                    <template slot-scope="scope">
                        <el-popover trigger="hover" placement="top">
                            <p>接口名: {{ scope.row.name }}</p>
                            <p>用例数: {{ scope.row.testcases }}</p>
                            <p>配置数: {{ scope.row.configures }}</p>
                            <div slot="reference" class="name-wrapper">
                                <el-tag size="medium">{{ scope.row.name }}</el-tag>
                            </div>
                        </el-popover>
                    </template>
                </el-table-column>

                <el-table-column prop="project" label="所属项目" width="250">
                </el-table-column>

                <el-table-column prop="tester" label="测试人员" width="100" align="center">
                </el-table-column>

                <el-table-column prop="desc" label="简要描述" width="100" align="center">
                </el-table-column>

                <el-table-column prop="create_time" label="创建时间" sortable align="center">
                </el-table-column>

                <el-table-column label="操作" align="center">
                    <template slot-scope="scope">
                        <el-button type="text" icon="el-icon-video-play" @click="handleRun(scope.$index, scope.row)">运行</el-button>
                        <el-button type="text" icon="el-icon-edit" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                        <el-button type="text" icon="el-icon-delete" class="red" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>

            <div style="margin-top: 20px">
                <el-button @click="toggleSelection('Invert')">反选</el-button>
                <el-button @click="toggleSelection('Cancel')">取消选择</el-button>
            </div>
            <div class="pagination">
                <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="cur_page"
                :page-sizes="[5, 10, 15, 20]" :page-size="page_size" layout="total, sizes, prev, pager, next, jumper"
                :total="total_nums">
                </el-pagination>
            </div>
        </div>

        <!-- 编辑弹出框 -->
        <el-dialog title="编辑接口" :visible.sync="editVisible" width="30%" center>
            <el-form ref="form" :model="form" label-width="120px">
                <el-form-item label="接口名称">
                    <el-input v-model="form.name" clearable></el-input>
                </el-form-item>

                <el-form-item label="测试人员">
                    <el-input v-model="form.tester" clearable></el-input>
                </el-form-item>

                <el-form-item label="所属项目">
                    <el-input v-model="form.project" disabled></el-input>
                </el-form-item>

                <el-form-item label="简要描述">
                    <el-input v-model="form.desc" clearable></el-input>
                </el-form-item>

            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveEdit">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 删除提示框 -->
        <el-dialog title="删除接口" :visible.sync="delVisible" width="300px" center>
            <div class="del-dialog-cnt">删除不可恢复，是否确定删除？</div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="delVisible = false">取 消</el-button>
                <el-button type="primary" @click="deleteRow">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 运行项目弹出框 -->
        <el-dialog title="运行接口" :visible.sync="runVisible" width="30%" center>
            <el-form ref="form" :model="form" label-width="120px">
                <el-form-item label="运行环境">
                    <el-select v-model="env_id" placeholder="请选择运行环境">
                        <el-option v-for="item in env_names" :key="item.id" :label="item.name" :value="item.id"></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="runVisible = false">取 消</el-button>
                <el-button type="primary" @click="openFullScreen" v-loading.fullscreen.lock="fullscreenLoading">运行</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import api from '@/api/interface'
import api_env from '@/api/env'

export default {
    data() {
        return {
            tableData: [],

            del_list: [],
            search_api: '',

            cur_page: 1,      
            page_size: 10,    
            total_nums: 1,    

            api_idx: -1,  
            api_id: -1,   
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
                name: this.search_api,
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

        batchDelete() {
            api.batchDelete({
                ids: this.del_list
            }).then(response => {
                this.$message.success('删除成功');
                this.getData();
            }).catch(error => {
                this.$message.error('服务器错误');
            })
        },

        reset() {
            this.search_api = '';
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
            this.api_idx = index; 
            this.api_id = row.id; 
            this.form = row;
            this.runVisible = true;
        },
        handleEdit(index, row) {
            this.api_idx = index; 
            this.api_id = row.id;
            this.form = { ...row };
            this.editVisible = true;
        },
        handleDelete(index, row) {
            this.api_idx = index; 
            this.api_id = row.id;
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
                let response = await run_by_interface({ iid: this.id, env_id: this.env_id })
                console.log(response)
                if (response.data.message === '当前接口不存在用例无法运行') {
                    console.log('xxxxxxxxxxxxxx')
                    this.fullscreenLoading = false
                    this.$message.error('当前接口未添加用例无法执行')
                    return
                }
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
            api.editInterface(this.api_id, this.form)
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
            api.deleteInterface(this.api_id)
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
  width: 300px;
  display: inline-block;
}
.del-dialog-cnt{
  font-size: 16px;
  text-align: center
}
.table{
  width: 100%;
  font-size: 14px;
}
.red{
  color: #ff0000;
}
.mr10{
  margin-right: 10px;
}</style>