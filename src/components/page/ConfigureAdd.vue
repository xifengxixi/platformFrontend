<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>配置管理</el-breadcrumb-item>
                <el-breadcrumb-item>配置新增</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <el-tabs type="border-card">

                <el-tab-pane label="请求头|全局变量">
                    <el-tabs style="margin: 0 0 0 10px" v-model="otherShow">
                        <el-tab-pane label="Headers" name="first">
                            <el-table :data="apiMsgData.header" size="mini" stripe :show-header="false"
                                class="h-b-e-a-style" :row-style="{ 'background-color': 'rgb(250, 250, 250)' }">

                                <el-table-column property="key" label="Key" header-align="center" minWidth="100">
                                    <template slot-scope="scope">
                                        <el-input v-model="scope.row.key" size="mini" placeholder="key">
                                        </el-input>
                                    </template>
                                </el-table-column>

                                <el-table-column property="value" label="Value" header-align="center" minWidth="200">
                                    <template slot-scope="scope">
                                        <el-input v-model="scope.row.value" size="mini" placeholder="value">
                                        </el-input>
                                    </template>
                                </el-table-column>

                                <el-table-column property="value" label="操作" header-align="center" width="80">
                                    <template slot-scope="scope">
                                        <el-button type="danger" icon="el-icon-delete" size="mini"
                                            @click.native="delTableRow('header', scope.$index)">
                                        </el-button>
                                    </template>
                                </el-table-column>
                            </el-table>
                        </el-tab-pane>

                        <el-tab-pane label="全局变量" name="second">
                            <el-table :data="apiMsgData.globalVar" size="mini" stripe :show-header="false"
                                class="h-b-e-a-style" :row-style="{ 'background-color': 'rgb(250, 250, 250)' }">

                                <el-table-column property="key" label="Key" header-align="center" minWidth="100">
                                    <template slot-scope="scope">
                                        <el-input v-model="scope.row.key" size="mini" placeholder="key">
                                        </el-input>
                                    </template>
                                </el-table-column>

                                <el-table-column label="type" header-align="center" width="100">
                                    <template slot-scope="scope">
                                        <el-select v-model="scope.row.param_type" size="mini">
                                            <el-option v-for="item in paramTypes" :key="item" :value="item">
                                            </el-option>
                                        </el-select>
                                    </template>
                                </el-table-column>

                                <el-table-column property="value" label="Value" header-align="center" minWidth="200">
                                    <template slot-scope="scope">
                                        <el-input v-model="scope.row.value" size="mini" placeholder="value">
                                        </el-input>
                                    </template>
                                </el-table-column>

                                <el-table-column property="value" label="操作" header-align="center" width="80">
                                    <template slot-scope="scope">
                                        <el-button type="danger" icon="el-icon-delete" size="mini"
                                            @click.native="delTableRow('globalVar', scope.$index)">
                                        </el-button>
                                    </template>
                                </el-table-column>
                            </el-table>
                        </el-tab-pane>
                    </el-tabs>

                </el-tab-pane>

            </el-tabs>

            <el-row>
                <el-col :span="2">
                    <el-button type="primary" @click="onSubmit()">提交</el-button>
                </el-col>
                <el-col :span="2">
                    <el-button @click="resetForm('form')">取消</el-button>
                </el-col>
            </el-row>
        </div>

        <!-- 新增弹出框 -->
        <el-dialog title="创建配置" :visible.sync="addVisible" width="28%" center>
            <el-form label-width="80px">
                <el-form-item label="配置名称" required>
                    <el-input v-model="configure_name" clearable></el-input>
                </el-form-item>

                <el-form-item label="编写人员" required>
                    <el-input v-model="author" clearable></el-input>
                </el-form-item>

                <el-form-item label="选择项目" required>
                    <el-select v-model="selected_project_id" placeholder="请选择" style="width: 100%"
                        @change="getInterfacesByProjectID(selected_project_id)">
                        <el-option v-for="(item, key) in project_list" :key="key" :label="item.name" :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="选择接口" required>
                    <el-select v-model="selected_interface_id" placeholder="请选择" style="width: 100%">
                        <el-option v-for="(item, key) in interface_list" :key="key" :label="item.name" :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>

            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="saveAdd">确 定</el-button>
                <el-button @click="addVisible = false">取 消</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import api from '@/api/configure';
import api_project from '@/api/project';

export default {
    data: function () {
        return {
            addVisible: false,   // 新增配置弹框是否显示标识
            apiMsgData: {
                id: null,
                name: "",
                header: [{ key: null, value: null }],
                globalVar: [{ key: null, value: null, param_type: 'string' }],
            },
            bodyShow: 'second',
            otherShow: 'first',
            paramTypes: ['string', 'int', 'float', 'boolean'],
            cell: Object(),
            selected_project_id: null,
            selected_interface_id: null,
            selected_configure_id: null,
            configure_name: null,  
            author: '',     
            project_list: [],
            interface_list: [],
        }
    },

    created () {
        this.getProjectNames();
    },

    methods: {
        onSubmit() {
            this.selected_project_id = null;
            this.selected_interface_id = null;
            this.addVisible = true;
        },

        // 处理数据1, 有param_type, 返回js数组
        handleData1(request_data, msg) {
            let data_arr = [];
            for (let i = 0; i < request_data.length; i++) {
                let key = request_data[i].key;
                if (!key) {
                    this.$message.error(msg + '的key为空!');
                    return []
                }
                let param_type = request_data[i].param_type;
                let value = request_data[i].value;
                if (param_type === 'int') {
                    //数字开头数字结尾
                    if (/^\d+$/.test(value)) {
                        value = Number(value);
                    }
                    else {
                        this.$message.error(key + '不是整数int类型!');
                        return []
                    }
                }
                else if (param_type === 'float') {
                    if (/^[+-]?\d+(\.\d+)?$/.test(value)) {
                        value = Number(value);
                    }
                    else {
                        this.$message.error(key + '不是小数float类型!');
                        return []
                    }
                }
                else if (param_type === 'boolean') {
                    if (/^(true|True|TRUE|1)$/.test(value)) {
                        value = true;
                    }
                    else if (/^(false|False|FALSE|0)$/.test(value)) {
                        value = false;
                    }
                    else {
                        this.$message.error(key + '不是布尔boolean类型!');
                        return []
                    }
                }
                let one_data = {};
                one_data[key] = value;
                data_arr.push(one_data)
            }
            return data_arr
        },

        // 处理数据2, 无param_type, 返回js对象
        handleData2(request_data, msg) {
            let one_data = {};
            for (let i = 0; i < request_data.length; i++) {
                let key = request_data[i].key;
                if (!key) {
                    this.$message.error(msg);
                    return []
                }
                one_data[key] = request_data[i].value;
            }
            return one_data
        },

        // 保存编辑
        saveAdd() {
            if (this.configure_name === null) {
                this.$message.error('配置名称不能为空!');
                return
            }

            if (this.author === '') {
                this.$message.error('编写人员名称不能为空!');
                return
            }

            if (this.selected_project_id === null || this.selected_interface_id === null) {
                this.$message.error('未选择所属项目或者接口!');
                return
            }

            let datas = {
                "name": this.configure_name,           // 配置名称
                "interface": {
                    "pid": this.selected_project_id,      // 项目ID
                    "iid": this.selected_interface_id,      // 接口ID
                },
                "author": this.author,         // 配置编写人员
                "request": {          // 请求信息
                    "config": {
                        "name": this.configure_name,
                        "request": {
                        }
                    }
                },
            };

            // variables处理
            let variables = this.apiMsgData.globalVar;
            variables.splice(-1, 1);
            if (variables.length !== 0) {
                let new_data = this.handleData1(variables, '全局变量key值不能为空，请检查参数');
                if (new_data.length === 0) {
                    return
                }
                datas.request.config['variables'] = new_data;
            }

            // headers处理
            let headers = this.apiMsgData.header;
            headers.splice(-1, 1);
            if (headers.length !== 0) {
                let new_data = this.handleData2(headers, '请求头header');
                if (new_data.length === 0) {
                    return
                }
                datas.request.config.request['headers'] = new_data;
            }

            // datas.include = JSON.stringify(datas.include);
            datas.request = JSON.stringify(datas.request);
            api.createConfig(datas)
                .then(response => {

                    let that = this;
                    if (response.status === 201) {
                        this.addVisible = false;
                        this.$message.success(`新增配置成功`);
                        // 1秒钟之后, 执行刷新
                        setInterval(function () {
                            that.$router.go();
                        }, 1000);
                    }
                    else if (response.status === 400) {
                        if (response.data.hasOwnProperty('name')) {
                            this.$message.error('配置名称已存在');
                        } else {
                            this.$message.error('参数错误');
                        }
                    }
                    else {
                        this.$message.error(`服务器错误`);
                    }

                })
                .catch(error => {
                    //debugger;
                    this.addVisible = false;
                    this.$message.error('服务器错误');
                })

        },
        getProjectNames() {
            api_project.names()
                .then((response) => {
                    this.project_list = response.data;
                })
                .catch(error => {
                    that.$message.error('服务器错误');
                });
        },
        getInterfacesByProjectID(pro_id) {
            api_project.interfaces(pro_id)
                .then((response) => {
                    this.interface_list = response.data;
                })
                .catch(error => {
                    that.$message.error('服务器错误');
                });
        },
        delTableRow(type, i) {
            if (type === 'variable') {
                this.apiMsgData.variable.splice(i, 1);
            }
            else if (type === 'header') {
                console.log(this.apiMsgData.header)
                this.apiMsgData.header.splice(i, 1);
            }
            else if (type === 'param') {
                this.apiMsgData.param.splice(i, 1);
            }
            else if (type === 'globalVar') {
                this.apiMsgData.globalVar.splice(i, 1);
            }
            else if (type === 'parameterized') {
                this.apiMsgData.parameterized.splice(i, 1);
            }
            else if (type === 'setupHooks') {
                this.apiMsgData.setupHooks.splice(i, 1);
            }
            else if (type === 'teardownHooks') {
                this.apiMsgData.teardownHooks.splice(i, 1);
            }
        },
        addTableRow(type) {
            if (type === 'variable') {
                this.apiMsgData.variable.push({ key: null, value: null, param_type: 'string' });
            }
            else if (type === 'header') {
                this.apiMsgData.header.push({ key: null, value: null });
            }
            else if (type === 'param') {
                this.apiMsgData.param.push({ key: null, value: null });
            }
            else if (type === 'globalVar') {
                this.apiMsgData.globalVar.push({ key: null, value: null, param_type: 'string' });
            }
            else if (type === 'parameterized') {
                this.apiMsgData.parameterized.push({ key: null, value: null });
            }
            else if (type === 'setupHooks') {
                this.apiMsgData.setupHooks.push({ key: null });
            }
            else if (type === 'teardownHooks') {
                this.apiMsgData.teardownHooks.push({ key: null });
            }
        },
        tempNum(i) {
            this.temp_num = i;
        },
        resetLine() {
            //  重置单元格高度
            this.cell.style.height = '18px';
        },
        showLine(prefix, n) {
            //  获取单元格的滚动条高度，并使单元格为该高度
            this.cell = document.getElementById(prefix + n);
            this.cell.style.height = this.cell.scrollHeight + 'px';
        },
        changeLine() {
            //  当单元格高度和滚动条高度不一致时，改变单元格高度
            if (this.cell.style.height !== this.cell.scrollHeight + 'px') {
                let i = parseInt(this.cell.style.height.substring(0, this.cell.style.height.length - 2));
                if (i - this.cell.scrollHeight === 2) {
                    //  为true时，为减少高度操作
                    this.cell.style.height = (i - 18) + 'px'
                }
                else {
                    this.cell.style.height = this.cell.scrollHeight + 'px';
                }

            }
        },
    },

    computed: {
        monitorHeader() {
            return this.apiMsgData.header;
        },

        monitorGlobalVar() {
            return this.apiMsgData.globalVar;
        },

    },

    watch: {
        monitorHeader: {
            handler: function () {
                if (this.apiMsgData.header.length === 0) {
                    this.addTableRow('header')
                }
                if (this.apiMsgData.header[this.apiMsgData.header.length - 1]['key'] || this.apiMsgData.header[this.apiMsgData.header.length - 1]['value']) {
                    this.addTableRow('header')
                }
            },
            deep: true
        },
        monitorGlobalVar: {
            handler: function () {
                if (this.apiMsgData.globalVar.length === 0) {
                    this.addTableRow('globalVar')
                }
                if (this.apiMsgData.globalVar[this.apiMsgData.globalVar.length - 1]['key'] ||
                    this.apiMsgData.globalVar[this.apiMsgData.globalVar.length - 1]['value']) {
                    this.addTableRow('globalVar')
                }
            },
            deep: true
        },

    },
}
</script>

<style>
.drag-box {
  display: flex;
  user-select: none;
}

.drag-box-item {
  flex: 1;
  /* height: 300px; */
  max-width: 330px;
  min-width: 300px;
  background-color: #eff1f5;
  margin-right: 16px;
  border-radius: 6px;
  border: 1px #e1e4e8 solid;
}

.item-title {
  padding: 8px 8px 8px 12px;
  font-size: 14px;
  line-height: 1.5;
  color: #24292e;
  font-weight: 600;
}

.item-ul {
  padding: 0 8px 8px;
  height: 300px;
  overflow-y: scroll;
}

.item-ul::-webkit-scrollbar {
  width: 0;
}

.drag-list {
  border: 1px #e1e4e8 solid;
  padding: 10px;
  margin: 5px 0 10px;
  list-style: none;
  background-color: #fff;
  border-radius: 6px;
  cursor: pointer;
  -webkit-transition: border .3s ease-in;
  transition: border .3s ease-in;
}

.drag-list:hover {
  border: 1px solid #20a0ff;
}

.drag-title {
  font-weight: 400;
  line-height: 25px;
  margin: 10px 0;
  font-size: 22px;
  color: #1f2f3d;
}

.ghost-style {
  display: block;
  color: transparent;
  border-style: dashed
}

.el-row {
  margin-bottom: 20px;
  margin-top: 20px
}

.el-col {
  border-radius: 4px;
}

.h-b-e-a-style {
  background-color: rgb(250, 250, 250);
  /*min-height: 430px;*/
}
</style>