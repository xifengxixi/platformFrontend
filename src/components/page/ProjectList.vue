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
        <el-button type="primary" icon="el-icon-search" @click="getData">搜索</el-button>
        <el-button type="primary" icon="el-icon-refresh-left" @click="reset">重置</el-button>
      </div>
      <el-table ref="multipleTable" :data="tableData" tooltip-effect="dark" style="width: 100%"
        @selection-change="handleSelectionChange" border stripe>

        <el-table-column type="selection" width="55">
        </el-table-column>

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

        <el-table-column prop="programmer" label="开发人员" width="100">
        </el-table-column>

        <el-table-column prop="tester" label="测试人员" width="100">
        </el-table-column>

        <el-table-column prop="create_time" label="创建时间" sortable align="center">
        </el-table-column>

        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button type="text" icon="el-icon-video-play" @click="handleRun(scope.$index, scope.row)">运行</el-button>
            <el-button type="text" icon="el-icon-edit" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
            <el-button type="text" icon="el-icon-delete" @click="handleDelete(scope.$index, scope.row)" class="red">删除</el-button>
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
      <el-form ref="form" :model="form" label-width="100px">
        <el-form-item label="运行环境">
          <el-select v-model="env_id" placeholder="请选择运行环境">
            <el-option v-for="item in env_names" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="runVisible = false">取 消</el-button>
        <el-button type="primary" @click="openFullScreen" v-loading.fullscreen.lock="fullscreenLoading">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 编辑弹出框 -->
    <el-dialog title="编辑项目" :visible.sync="editVisible" width="40%" center>
      <el-form ref="form" :model="form" label-width="100px">
        <el-form-item label="项目名称">
          <el-input v-model="form.name" clearable placeholder="请输入项目名称"></el-input>
        </el-form-item>
        <el-form-item label="项目负责人">
          <el-input v-model="form.leader" clearable placeholder="请输入项目负责人"></el-input>
        </el-form-item>
        <el-form-item label="应用名称">
          <el-input v-model="form.publish_app" clearable placeholder="请输入应用名称"></el-input>
        </el-form-item>
        <el-form-item label="开发人员">
          <el-input v-model="form.programmer" clearable placeholder="请输入测试人员"></el-input>
        </el-form-item>
        <el-form-item label="测试人员">
          <el-input v-model="form.tester" clearable placeholder="请输入测试人员"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveEdit">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 删除提示框 -->
    <el-dialog title="删除项目" :visible.sync="delVisible" width="30%" center>
      <div class="del-dialog-cnt">删除不可恢复，是否确定删除？</div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="delVisible = false">取 消</el-button>
        <el-button type="primary" @click="deleteRow">确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
  import api from '@/api/project';
  import api_env from '@/api/env';

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
            name: this.search_project,
            leader: this.search_leader,
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

        reset() {
          this.search_project = '';
          this.search_leader = '';
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
            this.runVisible = false;
            this.fullscreenLoading = true;
            let response = await api.runProject(this.project_id, {env_id: this.env_id})
            // console.log(response)
            if (response.data.detail === '此项目下无接口，无法运行！'){
              this.fullscreenLoading = false;
              this.$message.error('此项目下无接口，无法运行！');
              return
            }
            if (response.status === 201) {
              this.fullscreenLoading = false;
              this.$message.info('运行成功');
            }
            else {
              this.fullscreenLoading = false;
              this.$message.error('运行失败');
            }
          }
        },

        saveEdit() {
          api.editProject(this.project_id, this.form)
          .then(response => {
            this.editVisible = false;
            this.$message.success('编辑成功');
            this.getData();
          })
          .catcn(error => {
            this.editVisible = false;
            this.$message.error('服务器错误');
          })
        },

        deleteRow() {
          api.deleteProject(this.project_id)
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