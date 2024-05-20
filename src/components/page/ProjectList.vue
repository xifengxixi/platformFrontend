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
          <template slot-scope="scope">
            <el-popover trigger="hover" placement="top">
              <router-link to="/interfaces_list/" class="register_link">
                <p>接口数：{{ scope.row.interfaces }}</p>
              </router-link>
              <router-link to="/testsuits_list/" class="register_link">
                <p>套件数：{{ scope.row.testsuits }}</p>
              </router-link>
              <router-link to="/testcases_list/" class="register_link">
                <p>用例数：{{ scope.row.testcases }}</p>
              </router-link>
              <router-link to="/configures_list/" class="register_link">
                <p>配置数：{{ scope.row.configures }}</p>
              </router-link>
              <div slot="reference" class="name-wrapper">
                <el-tag size="medium">{{ scope.row.name }}</el-tag>
              </div>
            </el-popover>
          </template>
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
          <template slot-scope="scope">
            <el-button type="text" icon="el-icon-video-play" @click="handleRun(scope.$index, scope.row)">运行</el-button>
            <el-button type="text" icon="el-icon-edit" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
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
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="cur_page"
          :page-sizes="[5, 10, 15, 20]" :page-size="page_size" layout="total, sizes, prev, pager, next, jumper"
          :total="total_nums">
        </el-pagination>
      </div>
    </div>

    <!-- 运行弹出框 -->
    <el-dialog title="运行项目" :visible.sync="runVisible" width="30%" center>
      <span>需要注意的是内容是默认不居中的</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="runVisible = false">取 消</el-button>
        <el-button type="primary" @click="runVisible = false">确 定</el-button>
      </span>
    </el-dialog>
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

          project_idx: -1,  // 在tableData数组中的索引值
          project_id: -1,   // 在数据库中的真实索引值
          form: {},

          runVisible: false,  // 运行项目弹窗是否显示标识
          editVisible: false, // 编辑项目弹窗是否显示标识
          delVisible: false,  // 删除项目弹窗是否显示标识

          env_id: '',
          env_names: [],  // 返回的环境变量数据
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

        handleRun(index, row) {
          this.project_idx = index; // 当前运行的数据，在tableData数组中的索引值
          this.project_id = row.id; // 当前运行的数据在数据库中的真实索引值
          this.form = row;
          this.runVisible = true;
        },
        handleEdit(index, row) {
          this.project_idx = index; // 当前编辑的数据，在tableData数组中的索引值
          this.project_id = row.id; // 当前编辑的数据在数据库中的真实索引值
          this.form = {...row};
          this.editVisible = true;
        },
        handleDelete(index, row) {
          this.project_idx = index;
          this.project_id = row.id;
          this.delVisible = true;
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