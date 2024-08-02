<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>套件管理</el-breadcrumb-item>
                <el-breadcrumb-item>套件列表</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-button type="primary" icon="el-icon-delete" class="handle-del mr10" @click="delAll">批量删除</el-button>
                <el-input v-model="select_word" placeholder="输入筛选关键词" class="handle-input mr10"></el-input>
                <el-button type="primary" icon="el-icon-search" @click="search">搜索</el-button>
                <el-button type="primary" icon="el-icon-refresh-left" @click="reset">重置</el-button>
            </div>
            <el-table :data="tableData" border class="table" ref="multipleTable"
                @selection-change="handleSelectionChange" stripe>
                <el-table-column type="selection" width="55" align="center"></el-table-column>

                <el-table-column type="index" label="序号" width="55" align="center"></el-table-column>

                <el-table-column prop="name" label="套件名称" width="250">
                </el-table-column>

                <el-table-column prop="project" label="所属项目" width="250">
                </el-table-column>

                <el-table-column prop="create_time" label="创建时间" sortable align="center">
                </el-table-column>

                <el-table-column prop="update_time" label="更新时间" sortable align="center">
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
        <el-dialog title="删除套件" :visible.sync="delVisible" width="300px" center>
            <div class="del-dialog-cnt">删除不可恢复，是否确定删除？</div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="delVisible = false">取 消</el-button>
                <el-button type="primary" @click="deleteRow">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 运行项目弹出框 -->
        <el-dialog title="运行套件" :visible.sync="runVisible" width="30%" center>
            <el-form ref="form" :model="form" label-width="100px">
                <el-form-item label="运行环境">

                    <el-select v-model="env_id" clearable placeholder="请选择">
                        <el-option v-for="item in env_list" :key="item.id" :label="item.name" :value="item.id">
                        </el-option>
                    </el-select>

                </el-form-item>

            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="runVisible = false">取 消</el-button>
                <el-button type="primary" @click="confirmRun">运 行</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import api from '@/api/testsuit';
import api_env from '@/api/env';

export default {
    data() {
        return {
            tableData: [],
            cur_page: 1,    
            page_size: 10,  
            total_nums: 1, 

            select_word: '',
            del_list: [],
            editVisible: false,
            delVisible: false,
            runVisible: false,
            form: {},

            idx: -1,   // 在tableData数组中的索引值 
            id: -1,    // 在数据库中的真实索引值
            
            env_id: '',
            env_list: [],  // 返回的环境变量数据
        }
    },
    
    created() {
        this.getData();
        this.getEnvsIdNames();
    },

    methods: {
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
        getData() {
            api.getList({
                page: this.cur_page,
                size: this.page_size,
                search: this.select_word,
            }).then(response => {
                this.tableData = response.data.results;
                this.cur_page = response.data.current_page_num || 1;
                this.total_nums = response.data.count || 1;
            }).catch(error => {
                this.$message.error('服务器错误');
            })
        },

        search() {
            this.cur_page = 1;
            this.getData();
        },
        reset() {
            this.select_word = '';
        },

        handleCurrentChange(val) {
            this.cur_page = val;
            this.getData();
        },
        handleSizeChange(val) {
            this.page_size = val;
            this.getData();
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
        handleRun(index, row) {
            this.idx = index;   
            this.id = row.id;   
            this.form = row;
            this.runVisible = true;
        },
        linkTo(id) {
            this.$router.push({ path: `/testsuits_edit/${id}` });
        },
        handleDelete(index, row) {
            this.idx = index;
            this.id = row.id;
            this.delVisible = true;
        },
        getEnvsIdNames(){
            api_env.envNames()
            .then(response => {
                this.env_list = response.data;
            })
            .catch(error => {
                this.$message.error('服务器错误');
            })
        },
        deleteRow(){
            api.deleteTestSuit(this.id)
            .then(response => {
                this.$message.success('删除成功');
                this.delVisible = false;
                this.getData();
            })
            .catch(error => {
                this.$message.error('服务器错误');
            })
        },
        confirmRun() {
            api.runTestSuit(this.id, {env_id: this.env_id})
            .then(response => {
                this.message.success('运行成功');
            })
            .catch(error => {
                if (typeof error === 'object' && error.hasOwnProperty('msg')) {
                    this.$message.error(error.msg);
                } else {
                    this.$message.error('服务器错误');
                }
            })
        },
    },
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
}
</style>