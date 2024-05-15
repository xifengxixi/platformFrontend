<template>
  <div>
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>项目管理</el-breadcrumb-item>
        <el-breadcrumb-item>项目列表</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container">
      <div class="handle-box">
        <el-button type="primary" icon="el-icon-delete" class="handle-del mr10" @click="delAll">批量删除</el-button>
        <el-input v-model="search_project" placeholder="按项目名称搜索" class="handle-input mr10"></el-input>
        <el-input v-model="search_leader" placeholder="按项目负责人搜索" class="handle-input mr10"></el-input>
        <el-button type="primary" icon="el-icon-search" @click="search">搜索</el-button>
        <el-button type="primary" icon="el-icon-refresh-left" @click="reset">重置</el-button>
      </div>
      <el-table ref="multipleTable" :data="tableData" tooltip-effect="dark" style="width: 100%"
        @selection-change="handleSelectionChange" border stripe>

        <el-table-column type="selection" width="55">
        </el-table-column>

        <!-- <el-table-column label="日期" width="120">
        <template slot-scope="scope">{{ scope.row.date }}</template>
      </el-table-column> -->

        <el-table-column prop="id" label="序号" width="55">
        </el-table-column>

        <el-table-column prop="name" label="项目名称" width="250">
        </el-table-column>

        <el-table-column prop="leader" label="项目负责人" width="100">
        </el-table-column>

        <el-table-column prop="publish_app" label="应用名称" width="250">
        </el-table-column>

        <el-table-column prop="tester" label="测试人员" width="100">
        </el-table-column>

        <el-table-column prop="create_time" label="创建时间" sortable align="center">
        </el-table-column>

        <el-table-column label="操作" align="center">
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
  </div>
</template>

<script>
  import api from '@/api/project';

    export default {
      name: 'ProjectList',

      data() {
        return {
          tableData: [],
          
          del_list: [],
          search_project: '',
          search_leader: '',

          cur_page: 1,      // 当前页码
          page_size: 10,    // 每页显示的数量
          total_nums: 1,    // 总条数
        }
      },

      mounted() {
        this.getData();
      },

      methods: {
        getData() {
          api.projectList({
            'page': this.cur_page,
            'size': this.page_size
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
            // 项目删除成功
            this.$message.success('删除成功');
            this.getData();
          }).catch(error => {
            this.$message.error('服务器错误');
          })
        },

        search() {
          api.getList({
            name: this.search_project,
            leader: this.search_leader,
          }).then((response) => {
            this.tableData = response.data.results
            this.cur_page = response.data.current_page_num || 1;
            this.total_nums = response.data.count || 1;
          })
        },

        reset() {
          this.search_project = '';
          this.search_leader = '';
        },

        handleCurrentChange(val) {
          this.cur_page = val;
          console.log(val)
          this.getData();
        },
        handleSizeChange(val) {
          this.page_size = val;
          this.getData();
        },
      }
    }
</script>

<style scoped>
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