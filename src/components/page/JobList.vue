<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>CICD</el-breadcrumb-item>
                <el-breadcrumb-item>工程列表</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-button type="primary" icon="el-icon-delete" class="handle-del mr10" @click="delAll">批量删除</el-button>
                <el-input v-model="select_word" placeholder="按工程名称搜索" class="handle-input mr10"></el-input>
                <el-button type="primary" icon="el-icon-search" @click="search">搜索</el-button>
            </div>
            <el-table :data="tableData" border class="table" ref="multipleTable"
                @selection-change="handleSelectionChange" stripe>
                <el-table-column type="selection" width="55" align="center"></el-table-column>

                <el-table-column type="index" label="序号" width="55" align="center"></el-table-column>

                <el-table-column prop="name" label="工程名称" width="250">
                </el-table-column>

                <el-table-column prop="git" label="git仓库" width="250">
                </el-table-column>

                <el-table-column prop="server" label="服务地址" width="250">
                </el-table-column>

                <el-table-column prop="type" label="工程类型" width="100" align="center">
                </el-table-column>

                <el-table-column prop="send" label="是否发送通知" width="100" align="center">
                </el-table-column>

                <el-table-column prop="address" label="企业微信地址" width="100" align="center">
                </el-table-column>


                <el-table-column label="操作" align="center">
                    <template slot-scope="scope">
                        <el-button v-if="normal" type="text" icon="el-icon-refresh-right"
                            @click="handleBuild(scope.$index, scope.row)">构建</el-button>
                        <el-button v-if="build" type="text" @click="handleBuild(scope.$index, scope.row)"><i
                                class="el-icon-loading"></i>构建</el-button>
                        <el-button type="text" icon="el-icon-share" @click="deploy(scope.row)">部署</el-button>
                        <el-button type="text" icon="el-icon-edit" @click="linkTo(scope.row.id)">编辑</el-button>
                        <el-button type="text" icon="el-icon-view" @click="views">详情</el-button>
                        <!--            <el-button type="text" icon="el-icon-close" @click="clears">清除构建</el-button>-->
                        <el-button type="text" icon="el-icon-delete" class="red"
                            @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                        <el-dialog title="构建流程" :visible.sync="dialogVisible" width="80%" :before-close="handleClose">
                            <el-steps align-center>
                                <el-step :status="scope.row.status.git_status1" :title="scope.row.status.git"
                                    icon="el-icon-loading" :description="scope.row.status.git_description"></el-step>
                                <el-step :status="scope.row.status.build_before_status2"
                                    :title="scope.row.status.build_before" icon="el-icon-loading"
                                    :description="scope.row.status.build_before_description"></el-step>
                                <el-step :status="scope.row.status.build_after_status4"
                                    :title="scope.row.status.build_after" icon="el-icon-loading"
                                    :description="scope.row.status.build_after_description"></el-step>
                            </el-steps>
                            <span slot="footer" class="dialog-footer">
                            </span>
                        </el-dialog>

                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination">
                <el-pagination background @current-change="handleCurrentChange" @size-change="handleSizeChange"
                    :page-sizes="[4, 5, 8, 10, 20]" layout="total, sizes, prev, pager, next, jumper" :total="total_nums"
                    :page-size="page_size">
                </el-pagination>
            </div>
        </div>

        <!-- 删除提示框 -->
        <el-dialog title="删除接口" :visible.sync="delVisible" width="300px" center>
            <div class="del-dialog-cnt">删除不可恢复，是否确定删除？</div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="delVisible = false">取 消</el-button>
                <el-button type="primary" @click="deleteRow">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 部署项目 -->
        <el-dialog title="部署项目" :visible.sync="runVisible" width="30%" center>
            <el-form ref="form" :model="form" label-width="120px">
                <el-form-item label="选择镜像">

                    <el-select v-model="harbor_name" clearable placeholder="请选择">
                        <el-option v-for="item in harbor_id_names" :key="item.id" :label="item.name" :value="item.name">
                        </el-option>
                    </el-select>

                </el-form-item>

            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button>取 消</el-button>
                <el-button type="primary" @click="openFullScreen1"
                    v-loading.fullscreen.lock="fullscreenLoading">运行</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
export default {

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
.el-icon-loading{
  color: red;
  margin-right: 5px;
}
</style>