<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>用例管理</el-breadcrumb-item>
                <el-breadcrumb-item>用例编辑</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <el-tabs type="border-card">
                <el-tab-pane label="基本信息">
                    <div class="form-box" style="width: 1000px;">
                        <el-form label-position="left" label-width="80px">
                            <el-row :gutter="20">
                                <el-col :span="24">
                                    <el-form-item label="选择项目">
                                        <el-autocomplete class="inline-input" v-model="project_name"
                                            :fetch-suggestions="querySearchProject" placeholder="请输入选择项目"
                                            @select="handleSelectProject" value-key="name" clearable>
                                        </el-autocomplete>
                                    </el-form-item>
                                </el-col>
                            </el-row>

                            <el-row :gutter="20">
                                <el-col :span="12" style="width: 40%">
                                    <el-form-item label="选择接口">
                                        <el-autocomplete class="inline-input" v-model="interface_name"
                                            :fetch-suggestions="querySearchInterface" placeholder="请输入选择接口"
                                            @select="handleSelectInterface" value-key="name" clearable>
                                        </el-autocomplete>
                                    </el-form-item>
                                </el-col>

                                <el-col :span="12">
                                    <el-form-item label="选择配置">
                                        <el-autocomplete class="inline-input" v-model="configure_name"
                                            :fetch-suggestions="querySearchConfigure" placeholder="请输入选择配置"
                                            @select="handleSelectConfigure" value-key="name" clearable>
                                        </el-autocomplete>
                                    </el-form-item>
                                </el-col>

                            </el-row>

                            <el-row :gutter="100">
                                <el-col :span="24">
                                    <div style="text-align: left">
                                        <el-transfer style="text-align: left; display: inline-block;"
                                            :render-content="renderFunc" v-model="selected_testcase_id" filterable
                                            :titles="['待选前置用例', '已选前置用例']"
                                            :format="{noChecked: '${total}', hasChecked: '${checked}/${total}'}"
                                            :props="{key: 'id', label: 'name',}" @change="handleChange"
                                            :data="testcase_list">

                                            <span slot-scope="{ option }">{{ option.name }}</span>

                                            <el-button class="transfer-footer" slot="left-footer"
                                                style="margin-left: 10px;" size="small"
                                                @click="resetSorting">重置排序</el-button>

                                            <el-button class="transfer-footer" slot="right-footer"
                                                style="margin-left: 10px;" size="small"
                                                @click="resetSorting">重置排序</el-button>
                                        </el-transfer>
                                    </div>
                                </el-col>
                            </el-row>
                        </el-form>
                    </div>
                </el-tab-pane>

                <el-tab-pane label="请求信息">

                    <el-form style="margin: 0 0 0 10px">
                        <el-form-item>
                            <el-input placeholder="请输入请求URL" v-model="apiMsgData.url" class="input-with-select"
                                style="width:80%; margin-right:5px">
                                <el-select v-model="apiMsgData.method" size="medium" style="width: 100px"
                                    slot="prepend">
                                    <el-option v-for="item in methods" :key="item" :value="item"
                                        :label="item"></el-option>
                                </el-select>
                                <el-button slot="append" type="primary"
                                    @click="ParamViewStatus = !ParamViewStatus">Params</el-button>
                            </el-input>
                        </el-form-item>
                    </el-form>

                    <el-table :data="apiMsgData.param" :row-style="{ 'background-color': 'rgb(250, 250, 250)' }"
                        style="width:98%; margin-top:-20px; left:10px;" size="mini" :show-header="false"
                        v-show="this.ParamViewStatus">
                        <el-table-column property="key" label="Key" header-align="center" min-width="80">
                            <template slot-scope="scope">
                                <el-input v-model="scope.row.key" size="mini" placeholder="key">
                                </el-input>
                            </template>
                        </el-table-column>
                        <el-table-column property="value" label="Value" header-align="center" min-width="200">
                            <template slot-scope="scope">
                                <el-input v-model="scope.row.value" size="mini" placeholder="value"
                                    :id="'param_input' + scope.$index" type="textarea" rows=1
                                    @focus="showLine('param_input', scope.$index)" @input="changeLine()"
                                    @blur="resetLine(scope.$index)" resize="none">
                                </el-input>
                            </template>
                        </el-table-column>
                        <el-table-column property="value" label="操作" header-align="center" width="60">
                            <template slot-scope="scope">
                                <el-button type="danger" icon="el-icon-delete" size="mini"
                                    @click.native="delTableRow('param', scope.$index)">
                                </el-button>
                            </template>
                        </el-table-column>
                    </el-table>

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
    </div>
</template>


<script>
import api from '@/api/testcase'
import api_project from '@/api/project'
import api_interface from '@/api/interface'

export default {
    data() {
        return {
            // 基本信息
            project_name: "",
            project_id: "",
            project_list: [],
            interface_name: "",
            interface_id: "",
            interface_list: [],
            configure_name: "",
            configure_id: "",
            configure_list: [],

            testcase_list: [],
            testcase_list_copy: [],
            subBtnDisable: true,
            testcase_list_right: [],
            testcase_list_left: [],
            selected_testcase_id: [],
            formIndex: -1,
            formOption: null,

            // 请求信息
            methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
            ParamViewStatus: false,
            apiMsgData: {
                id: null,
                method: 'POST',
                name: "",
                url: '',
                choiceType: 'json',
                param: [{key: null, value: null}],
                header: [{key: null, value: null}],
                variable: [{key: null, value: null, param_type: 'string'}],
                jsonVariable: '',
                extract: [{key: null, value: null}],
                validate: [{key: null, value: null, comparator: 'equals', param_type: 'string'}],

                globalVar: [{key: null, value: null, param_type: 'string'}],
                parameterized: [{key: null, value: null}],
                setupHooks: [{key: null}],
                teardownHooks: [{key: null}],
            },
        }
    },
    created() {
        this.getProjectNames();
    },
    methods: {
        renderFunc(h, option) {
            let temp = `${option.name}`
            return h('span', {
                on: {
                    'dragstart': ($event) => {
                        this.formIndex = $event.target.__vue__.option.weight - 1
                        this.formOption = $event.target.__vue__.option
                    },
                    'dragover': ($event) => {
                        $event.preventDefault();
                        $event.dataTransfer.effectAllowed = "move";

                    },
                    'drop': ($event) => {
                        let targetIndex = $event.target.__vue__.option.weight - 1;

                        // 如果拖拽至当前元素之前，则减一处理
                        if (this.formIndex < targetIndex) {
                            targetIndex--;
                        }

                        // 将拖动的元素插入到目标位置
                        let movedItem = this.testcase_list.splice(this.formIndex, 1)[0];
                        this.testcase_list.splice(targetIndex, 0, movedItem);


                        // 重新设置 weight 值
                        this.testcase_list.forEach((item, index) => {
                            item.weight = index + 1;
                        });

                        // 通过 weight 值对 selected_testcase_id 进行排序
                        this.selected_testcase_id.sort((a, b) => {
                            let a_index = this.testcase_list.findIndex(item => item.id === a);
                            let b_index = this.testcase_list.findIndex(item => item.id === b);
                            return a_index - b_index;
                        });

                        this.subBtnDisable = false;
                        console.log(this.selected_testcase_id);
                    }
                },
                attrs: {
                    draggable: true
                }
            }, temp)
        },
        resetSorting() {
            this.testcase_list = JSON.parse(JSON.stringify(this.testcase_list_copy)); // 还原原始数据

            this.testcase_list.sort((a, b) => a.weight - b.weight);
            this.testcase_list.forEach((item, index) => {
                item.weight = index + 1;
            });
            // 通过 weight 值对 selected_testcase_id 进行排序
            this.selected_testcase_id.sort((a, b) => {
                let a_index = this.testcase_list.findIndex(item => item.id === a);
                let b_index = this.testcase_list.findIndex(item => item.id === b);
                return a_index - b_index;
            });
            console.log(this.selected_testcase_id);

            this.subBtnDisable = true; // 标记未做修改状态
        },
        toggleSelection(action, side) {
            const target = side === 'left' ? this.testcase_list_left : this.testcase_list_right;
            console.log(target);
            if (action === 'Invert') {
                target.forEach(item => {
                    item.selected = !item.selected;
                });
            } else if (action === 'Cancel') {
                target.forEach(item => {
                    item.selected = false;
                });
            }
        },

        handleChange(value, direction, movedKeys){
            let result_item_right = [];
            let result_item_left = [];
            this.testcase_list.forEach(item => {
                if (value.includes(item.id)) {
                    result_item_right.push(item);
                } else {
                    result_item_left.push(item);
                }
            });
            this.testcase_list_right = result_item_right;
            this.testcase_list_left = result_item_left;
        },

        getProjectNames() {
            api_project.names()
            .then(response => {
                this.project_list = response.data
            })
            .catch(error => {
                this.$message.error('服务器错误')
            })
        },

        getInterfaceNames() {
            api_project.interfaces(this.project_id)
            .then(response => {
                this.interface_list = response.data
            })
            .catch(error => {
                this.$message.error('服务器错误')
            })
        },

        getConfigureNames() {
            api_interface.configures(this.interface_id)
            .then(response => {
                if (response.status === 200) {
                    this.configure_list = response.data
                }
                else if (response.status === 404) {
                    this.$message.error('当前接口下没有配置')
                }
            })
            .catch(error => {
                this.$message.error('服务器错误')
            })
        },

        createFilter(queryString) {
            return (item) => {
                return (item.name.toLowerCase().includes(queryString.toLowerCase()));
            };
        },

        querySearchProject(queryString, cb) {
            var project_list = this.project_list;
            var results = queryString ? project_list.filter(this.createFilter(queryString)) : project_list;
            cb(results);
        },
        handleSelectProject(item) {
            this.project_name = item.name;
            this.project_id = item.id;
            this.getInterfaceNames();
        },

        querySearchInterface(queryString, cb) {
            // this.getInterfaceNames();
            var interface_list = this.interface_list;
            var results = queryString ? interface_list.filter(this.createFilter(queryString)) : interface_list;
            cb(results);
        },
        handleSelectInterface(item) {
            this.interface_name = item.name;
            this.interface_id = item.id;
            this.getConfigureNames();
            this.getTestcasesByInterfaceId();
        },

        querySearchConfigure(queryString, cb) {
            // this.getConfigureNames();
            var configure_list = this.configure_list;
            var results = queryString ? interface_list.filter(this.createFilter(queryString)) : configure_list;
            cb(results);
        },
        handleSelectConfigure(item) {
            this.configure_name = item.name;
            this.configure_id = item.id;
        },

        getTestcasesByInterfaceId() {
            api.names({'interface_id': this.interface_id})
            .then(response => {
                this.testcase_list = response.data;
                this.testcase_list = this.formatTestcaseList(this.testcase_list);
                this.testcase_list_copy = JSON.parse(JSON.stringify(this.testcase_list)); // 备份原始数据
                this.testcase_list_left = this.testcase_list;
            })
            .catch(error => {
                this.$message.error('服务器错误');
            })
        },

        formatTestcaseList(list) {
            let weight = 1;
            return list.map(item => (
                    {
                        weight: weight++,
                        id: item.id,
                        name: item.name,
                    }
                )
            )
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

.el-transfer-panel {
  width: 300px;
}
</style>