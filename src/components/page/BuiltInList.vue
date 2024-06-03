<template>
  <div>
    <div class="crumbs">
        <el-breadcrumb separator="/">
            <el-breadcrumb-item>内置函数</el-breadcrumb-item>
            <el-breadcrumb-item>函数列表</el-breadcrumb-item>
        </el-breadcrumb>
    </div>
    <div class="container">
            <div class="handle-box">
                <el-input v-model="search_project_name" placeholder="按项目名称搜索" class="handle-input mr10"></el-input>
                <el-button type="primary" icon="el-icon-search" @click="getData">搜索</el-button>
                <el-button type="primary" icon="el-icon-refresh-left" @click="reset">重置</el-button>
            </div>
            <el-table ref="multipleTable" :data="tableData" style="width: 100%"
                @selection-change="handleSelectionChange" stripe border>

                <el-table-column type="selection" width="55">
                </el-table-column>

                <el-table-column type="index" label="序号" width="55">
                </el-table-column>

                <el-table-column prop="name" label="函数名称">
                    <template slot-scope="scope">
                        <el-link type="primary" @click="linkTo(scope.row.id)">{{ scope.row.name }}</el-link>
                    </template>
                </el-table-column>

                <el-table-column prop="project" label="项目名称">
                </el-table-column>

            </el-table>

            <div class="pagination">
                <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                    :current-page="cur_page" :page-sizes="[5, 10, 15, 20]" :page-size="page_size"
                    layout="total, sizes, prev, pager, next, jumper" :total="total_nums">
                </el-pagination>
            </div>
        </div>
  </div>
</template>

<script>
import api from '@/api/debugtalk'

export default {
    data() {
        return {
            tableData: [],
            
            cur_page: 1,
            page_size: 10,
            total_nums: 1,

            search_project_name: '',
            del_list: [],

        }
    },

    created() {
        this.getData();
    },

    methods: {
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
                project: this.search_project_name
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
            this.search_project_name = '';
        },

        linkTo(id) {
            this.$router.push({ path: `/builtIn_edit/${id}` });
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