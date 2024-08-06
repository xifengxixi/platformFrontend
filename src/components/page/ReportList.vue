<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>报告管理</el-breadcrumb-item>
                <el-breadcrumb-item>报告列表</el-breadcrumb-item>
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

                <el-table-column prop="name" label="报告名称" width="350">
                </el-table-column>

                <el-table-column prop="result" label="执行结果" width="80">
                </el-table-column>

                <el-table-column prop="count" label="用例总数" width="80">
                </el-table-column>

                <el-table-column prop="success" label="成功总数" width="80">
                </el-table-column>

                <el-table-column prop="failed" label="失败总数" width="80">
                </el-table-column>

                <el-table-column prop="create_time" label="创建时间" sortable align="center">
                </el-table-column>

                <el-table-column label="操作" align="center">
                    <template slot-scope="scope">
                        <el-button type="text" icon="el-icon-view"
                            @click="handleOpen(scope.$index, scope.row)">打开</el-button>
                        <el-button type="text" icon="el-icon-download"
                            @click="handleDownload(scope.$index, scope.row)">下载</el-button>
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
        
        <!-- <div v-if="reportType" v-html="htmlContent" width="auto" height="auto" scrolling="yes"
            style="position:absolute;top:80px;left: 30px;">
        </div> -->
    </div>

</template>

<script>
import api from '@/api/report'

export default {
    // beforeRouteEnter (to, from, next) {
    //     // 在路由跳转页面实例化之前被调用, 此时还没有this实例, 但是可以通过next的回调中获取实例的引用
    //     next(vm => {
    //         vm.getData();
    //     });
    //     next()
    // },

    data() {
        return {
            tableData: [],
            cur_page: 1,  
            page_size: 10, 
            total_nums: 1, 

            multipleSelection: [],
            select_word: '',
            del_list: [],
            delVisible: false,
            form: {},

            idx: -1,   // 在tableData数组中的索引值
            id: -1,    // 在数据库中的真实索引值

            env_id: '',
            env_list: [],  // 返回的环境变量数据
            html: false,
            htmlContent: '',
            reportType: true
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
            api.reportList({
                'page': this.cur_page,
                'size': this.page_size,
                'search': this.select_word,
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
        handleDelete(index, row) {
            this.idx = index;
            this.id = row.id;
            this.delVisible = true;
        },
        handleDownload(index, row) {
            this.idx = index;
            this.id = row.id;
            let full_filename = row.name + '.html';
            api.downloadReport(this.id)
                .then(response => {
                    const url = window.URL.createObjectURL(new Blob([response.data]));
                    const link = document.createElement('a');
                    link.href = url;
                    link.setAttribute('download', full_filename);
                    document.body.appendChild(link);
                    link.click();
                    link.remove();
                })
                .catch(error => {
                    this.$message.error('服务器错误');
                })
        },
        handleOpen(index, row) {
            this.idx = index;
            this.id = row.id;
            this.$router.push({ path: `/reports_view/${this.id}`})
        },

        delAll() {
            api.batchDeleteReport({
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
        handleSelectionChange(val) {
            this.del_list = val.map(item => item.id);
        },
        toggleSelection(type) {
            if (type === 'Invert') {
                this.tableData.map(row => this.$refs.multipleTable.toggleRowSelection(row));
            } else {
                this.$refs.multipleTable.clearSelection();
            }
        },
        deleteRow() {
            api.deleteReport(this.id)
            .then(response => {
                this.$message.success('删除成功');
                this.delVisible = false;
                this.getData();
            })
            .catch(error => {
                this.$message.error('服务器错误');
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

.del-dialog-cnt {
    font-size: 16px;
    text-align: center
}

.table {
    width: 100%;
    font-size: 14px;
}

.red {
    color: #ff0000;
}

.mr10 {
    margin-right: 10px;
}
</style>
