<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>环境管理</el-breadcrumb-item>
                <el-breadcrumb-item>环境列表</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-button type="primary" icon="el-icon-delete" class="handle-del mr10" @click="batchDelete">批量删除</el-button>
                <el-input v-model="search_env_name" placeholder="按环境名称搜索" class="handle-input mr10"></el-input>
                <el-input v-model="search_env_base_url" placeholder="按环境base_url搜索" class="handle-input mr10"></el-input>
                <el-input v-model="search_env_desc" placeholder="按环境描述搜索" class="handle-input mr10"></el-input>
                <el-button type="primary" icon="el-icon-search" @click="getData">搜索</el-button>
                <el-button type="primary" icon="el-icon-refresh-left" @click="reset">重置</el-button>
            </div>
            <el-table ref="multipleTable" :data="tableData" style="width: 100%"
                @selection-change="handleSelectionChange" stripe border>

                <el-table-column type="selection" width="55">
                </el-table-column>

                <el-table-column type="index" label="序号" width="55">
                </el-table-column>

                <el-table-column prop="name" label="环境名称" width="250">
                </el-table-column>

                <el-table-column prop="base_url" label="base_url" width="250">
                </el-table-column>

                <el-table-column prop="desc" label="环境描述">
                </el-table-column>

                <el-table-column label="操作" align="center">
                    <template slot-scope="scope">
                        <el-button type="text" icon="el-icon-edit"
                            @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                        <el-button type="text" icon="el-icon-delete" @click="handleDelete(scope.$index, scope.row)"
                            class="red">删除</el-button>
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

        <el-dialog title="编辑环境" :visible.sync="editVisible" width="30%">
            <el-form :model="form" status-icon :rules="rules" ref="form" label-width="100px">
                <el-form-item label="环境名称" prop="name">
                    <el-input v-model="form.name" clearable placeholder="请输入环境名称"></el-input>
                </el-form-item>
                <el-form-item label="base_url" prop="base_url">
                    <el-input v-model="form.base_url" clearable placeholder="请输入环境base_url"></el-input>
                </el-form-item>
                <el-form-item label="环境描述" prop="desc">
                    <el-input v-model="form.desc" clearable placeholder="请输入环境描述"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveEdit">确 定</el-button>
            </span>
        </el-dialog>

        <el-dialog title="删除环境" :visible.sync="delVisible" width="20%">
            <div class="del-dialog-cnt">删除不可恢复，是否确定删除？</div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="delVisible = false">取 消</el-button>
                <el-button type="primary" @click="deleteRow">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import api from '@/api/env'

export default {
    data() {
        return {
            tableData: [],
            
            cur_page: 1,
            page_size: 10,
            total_nums: 1,

            search_env_name: '',
            search_env_base_url: '',
            search_env_desc: '',
            del_list: [],

            env_idx: '',
            evn_id: '',
            form: {},
            editVisible: false,
            delVisible: false,
        }
    },

    created() {
        this.getData();
    },

    methods: {
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
        handleCurrentChange(val) {
          this.cur_page = val;
          this.getData();
        },
        handleSizeChange(val) {
          this.page_size = val;
          this.getData();
        },

        getData() {
            api.getList({
                page: this.cur_page,
                size: this.page_size,
                name: this.search_env_name,
                base_url: this.search_env_base_url,
                desc: this.search_env_desc,
            })
            .then(response => {
                this.tableData = response.data.results;
                this.cur_page = response.data.current_page_num;
                this.total_nums = response.data.count;
            })
            .catch(error => {
                this.$message.error('服务器错误');
            })
        },
        
        reset() {
            this.search_env_name = '';
            this.search_env_base_url = '';
            this.search_env_desc = '';
        },

        batchDelete() {
            api.batchDelete({
                ids: this.del_list,
            })
            .then(response => {
                this.$message.success('删除成功');
                this.getData();
            })
            .catch(error => {
                this.$message.error('服务器错误');
            })
        },

        handleEdit(index, row) {
            this.env_idx = index;
            this.evn_id = row.id;
            this.form = {...row};
            this.editVisible = true;
        },
        handleDelete(index, row) {
            this.env_idx = index;
            this.evn_id = row.id;
            this.delVisible = true;
        },
        saveEdit() {
            api.editEnv(this.evn_id, this.form)
            .then(response => {
                if (response.status === 200) {
                    this.$message.success('编辑环境成功');
                    this.editVisible = false;
                    this.getData();
                }
                else if (response.status === 400) {
                    if (response.data.hasOwnProperty('name')) {
                        this.$message.error(response.data.name[0]);
                    }
                    else if (response.data.hasOwnProperty('base_url')) {
                        this.$message.error(response.data.base_url[0]);
                    }
                }
            })
            .catch(error => {
                this.$message.error('服务器错误');
                this.delVisible = false;
            })
        },
        deleteRow() {
            api.delEnv(this.evn_id)
            .then(response => {
                if (response.status === 204) {
                    this.$message.success('删除环境成功');
                    this.delVisible = false;
                    this.getData();
                }
            })
            .catch(error => {
                this.$message.error('服务器错误');
                this.delVisible = false;
            })
        },
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