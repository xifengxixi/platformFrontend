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
        <el-button type="primary" icon="el-icon-delete" @click="delAll">批量删除</el-button>
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

        <el-table-column prop="update_time" label="更新时间" sortable align="center">
        </el-table-column>

        <el-table-column label="操作" align="center">
        </el-table-column>

      </el-table>
      <div style="margin-top: 20px">
        <el-button @click="toggleSelection('Invert')">反选</el-button>
        <el-button @click="toggleSelection('Cancel')">取消选择</el-button>
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
          cur_page: 1,      // 当前页码
          page_size: 10,    // 每页显示的数量
          total_nums: 1,    // 总条数

          del_list: [],
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
          api.batch_delete()
        }
      }
    }
</script>

<style scoped>
.handle-box {
  margin-bottom: 20px;
}
</style>