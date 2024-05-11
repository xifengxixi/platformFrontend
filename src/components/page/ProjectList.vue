<template>
  <div>
    <div>
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>项目管理</el-breadcrumb-item>
        <el-breadcrumb-item>活动详情</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container">
      <el-table ref="multipleTable" :data="tableData" tooltip-effect="dark" style="width: 100%"
        @selection-change="handleSelectionChange">

        <el-table-column type="selection" width="55">
        </el-table-column>

        <!-- <el-table-column label="日期" width="120">
        <template slot-scope="scope">{{ scope.row.date }}</template>
      </el-table-column> -->

        <el-table-column prop="index" label="序号" width="120">
        </el-table-column>

        <el-table-column prop="projectName" label="项目名称" width="120">
        </el-table-column>

        <el-table-column prop="leader" label="项目负责人" width="120">
        </el-table-column>

        <el-table-column prop="appName" label="应用名称" width="120">
        </el-table-column>

        <el-table-column prop="test" label="测试人员" width="120">
        </el-table-column>

        <el-table-column prop="createTime" label="创建时间" width="120">
        </el-table-column>

        <el-table-column prop="updateTime" label="更新时间" width="120">
        </el-table-column>

        <el-table-column prop="operation" label="操作" width="120">
        </el-table-column>

      </el-table>
      <div style="margin-top: 20px">
        <el-button @click="toggleSelection([tableData[1], tableData[2]])">切换第二、第三行的选中状态</el-button>
        <el-button @click="toggleSelection()">取消选择</el-button>
      </div>
    </div>
  </div>
</template>

<script>
    export default {
      name: ProjectList,

      methods: {
        toggleSelection(rows) {
          if (rows) {
            rows.forEach(row => {
              this.$refs.multipleTable.toggleRowSelection(row);
            });
          } else {
            this.$refs.multipleTable.clearSelection();
          }
        },
        handleSelectionChange(val) {
          this.multipleSelection = val;
        }
      }
    }
</script>

<style scoped>

</style>