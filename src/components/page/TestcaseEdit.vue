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
                    <div class="form-box">
                        <el-form label-position="left" label-width="80px">
                            <el-row :gutter="20">
                                <el-col :span="24">
                                    <el-form-item label="选择项目">
                                        <!-- <el-select v-model="selected_project_id" placeholder="请选择项目"
                                            @change="getInterfacesByProjectID(selected_project_id)">
                                            <el-option v-for="(item, key) in project_list" :key="key" :label="item.name"
                                                :value="item.id">
                                            </el-option>
                                        </el-select> -->
                                        <el-autocomplete class="inline-input" v-model="project_name"
                                            :fetch-suggestions="querySearchProject" placeholder="请输入选择项目"
                                            @select="handleSelectProject" value-key="name" clearable>
                                        </el-autocomplete>
                                    </el-form-item>
                                </el-col>
                            </el-row>

                            <el-row :gutter="20">
                                <el-col :span="12">
                                    <el-form-item label="选择接口">
                                        <!-- <el-select v-model="selected_interface_id" placeholder="请选择"
                                            @change="getConfTestcaseByInterfaceID(selected_interface_id)">
                                            <el-option v-for="(item, key) in interfaces" :key="key" :label="item.name"
                                                :value="item.id">
                                            </el-option>
                                        </el-select> -->
                                        <el-autocomplete class="inline-input" v-model="interface_name"
                                            :fetch-suggestions="querySearchInterface" placeholder="请输入选择接口"
                                            @select="handleSelectInterface" value-key="name" clearable>
                                        </el-autocomplete>
                                    </el-form-item>
                                </el-col>

                                <el-col :span="12">
                                    <el-form-item label="选择配置">
                                        <!-- <el-select v-model="selected_configure_id" placeholder="请选择" clearable>
                                            <el-option v-for="(item, key) in configures" :key="key" :label="item.name"
                                                :value="item.id">
                                            </el-option>
                                        </el-select> -->
                                        <el-autocomplete class="inline-input" v-model="configure_name"
                                            :fetch-suggestions="querySearchConfigure" placeholder="请输入选择配置"
                                            @select="handleSelectConfigure" value-key="name" clearable>
                                        </el-autocomplete>
                                    </el-form-item>
                                </el-col>

                            </el-row>

                            <el-row :gutter="100">
                                <el-col :span="12">
                                    <div class="drag-box-item">
                                        <div class="item-title">待选前置用例</div>
                                        <draggable v-model="unselected" :options="dragOptions"
                                            @change="unchangeResult()">
                                            <transition-group tag="div" class="item-ul">
                                                <div v-for="item in unselected" class="drag-list" :key="item.id"
                                                    :value="item.id">
                                                    {{ item.name }}
                                                </div>
                                            </transition-group>
                                        </draggable>
                                    </div>
                                </el-col>

                                <el-col :span="12">
                                    <div class="drag-box-item">
                                        <div class="item-title">已选前置用例</div>
                                        <draggable v-model="selected" :options="dragOptions" @change="changeResult()">
                                            <transition-group tag="div" class="item-ul">
                                                <div v-for="item in selected" class="drag-list" :key="item.id"
                                                    :value="item.id">
                                                    {{ item.name }}
                                                </div>
                                            </transition-group>
                                        </draggable>
                                    </div>
                                </el-col>
                            </el-row>

                        </el-form>
                    </div>
                </el-tab-pane>

                <!-- <el-tab-pane label="请求信息">
                    <el-form style="margin: 0 0 0 10px">
                        <el-form-item>
                            <el-input placeholder="Enter request URL" v-model="apiMsgData.url" class="input-with-select"
                                style="width: 80%;margin-right: 5px">
                                <el-select v-model="apiMsgData.method" size="medium" style="width: 100px" slot="prepend"
                                    placeholder="选择请求方式">
                                    <el-option v-for="item in methods" :key="item" :value="item" :label="item">
                                    </el-option>
                                </el-select>
                                <el-button slot="append" type="primary" @click="ParamViewStatus = !ParamViewStatus">
                                    Params
                                </el-button>
                            </el-input>
                        </el-form-item>
                    </el-form>

                    <el-table :data="apiMsgData.param" :row-style="{ 'background-color': 'rgb(250, 250, 250)' }"
                        style="width:98.2%;margin-top:-20px;left: 10px;" size="mini" :show-header="false"
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

                    <el-tabs style="margin: 0 0 0 10px" v-model="bodyShow">
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
                        <el-tab-pane label="Body" name="second" :disabled="apiMsgData.method === 'GET'">
                            <el-form :inline="true" class="demo-form-inline" style="margin-top: 10px">
                                <el-radio-group v-model="apiMsgData.choiceType">
                                    <el-radio label="data">form-data</el-radio>
                                    <el-radio label="json">json</el-radio>
                                </el-radio-group>
                                <el-button type="primary" size="mini" v-show="apiMsgData.choiceType === 'json'"
                                    style="margin-left:20px" @click="formatData()">格式化

                                </el-button>
                            </el-form>
                            <hr style="height:1px;border:none;border-top:1px solid rgb(241, 215, 215);" />

                            <div v-if="apiMsgData.choiceType === 'json'">
                                <div style="border:1px solid rgb(234, 234, 234) ">
                                    <el-container>
                                        <editor v-contextmenu:contextmenu style="font-size: 15px"
                                            v-model="apiMsgData.jsonVariable" @init="editorInit" lang="json"
                                            theme="chrome" width="100%" height="575px" :options="{}">
                                        </editor>
                                    </el-container>

                                </div>
                            </div>
                            <el-table :data="apiMsgData.variable" size="mini" stripe :show-header="false" height="500"
                                style="background-color: rgb(250, 250, 250)" v-if="apiMsgData.choiceType === 'data'"
                                :row-style="{ 'background-color': 'rgb(250, 250, 250)' }">
                                <el-table-column label="Key" header-align="center" minWidth="100">
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
                                <el-table-column label="Value" header-align="center" minWidth="200">
                                    <template slot-scope="scope">
                                        <div>
                                            <el-input v-model="scope.row.value" :id="'data_input' + scope.$index"
                                                type="textarea" rows=1 @focus="showLine('data_input', scope.$index)"
                                                @input="changeLine()" @blur="resetLine()" size="mini" resize="none"
                                                placeholder="value">
                                            </el-input>
                                        </div>

                                    </template>
                                </el-table-column>

                                <el-table-column property="value" label="操作" header-align="center" width="80">
                                    <template slot-scope="scope">
                                        <el-button type="danger" icon="el-icon-delete" size="mini"
                                            @click.native="delTableRow('variable', scope.$index)">
                                        </el-button>
                                    </template>
                                </el-table-column>
                            </el-table>
                        </el-tab-pane>
                        <el-tab-pane label="Extract" name="third">
                            <el-table :data="apiMsgData.extract" size="mini" stripe :show-header="false"
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
                                            @click.native="delTableRow('extract', scope.$index)">
                                        </el-button>
                                    </template>
                                </el-table-column>
                            </el-table>
                        </el-tab-pane>
                        <el-tab-pane label="Assert" name="fourth">
                            <el-table :data="apiMsgData.validate" size="mini" stripe :show-header="false"
                                class="h-b-e-a-style" :row-style="{ 'background-color': 'rgb(250, 250, 250)' }">

                                <el-table-column property="key" label="Key" header-align="center" minWidth="100">
                                    <template slot-scope="scope">
                                        <el-input v-model="scope.row.key" size="mini" placeholder="check">
                                        </el-input>
                                    </template>
                                </el-table-column>
                                <el-table-column label="Comparator" header-align="center" width="200">
                                    <template slot-scope="scope">
                                        <el-autocomplete class="inline-input" v-model="scope.row.comparator"
                                            :fetch-suggestions="querySearch" placeholder="请选择"
                                            size="mini"></el-autocomplete>
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
                                        <el-input v-model="scope.row.value" size="mini" placeholder="expect">
                                        </el-input>
                                    </template>
                                </el-table-column>
                                <el-table-column property="value" label="操作" header-align="center" width="80">
                                    <template slot-scope="scope">
                                        <el-button type="danger" icon="el-icon-delete" size="mini"
                                            @click.native="delTableRow('validate', scope.$index)">
                                        </el-button>
                                    </template>
                                </el-table-column>
                            </el-table>
                        </el-tab-pane>
                    </el-tabs>

                </el-tab-pane>

                <el-tab-pane label="环境变量|参数化|请求钩子">

                    <el-tabs style="margin: 0 0 0 10px" v-model="otherShow">
                        <el-tab-pane label="环境变量" name="first">
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
                        <el-tab-pane label="参数化" name="second">
                            <el-table :data="apiMsgData.parameterized" size="mini" stripe :show-header="false"
                                class="h-b-e-a-style" :row-style="{ 'background-color': 'rgb(250, 250, 250)' }">
                                <el-table-column property="key" label="Key" header-align="center" minWidth="100">
                                    <template slot-scope="scope">
                                        <el-input v-model="scope.row.key" size="mini"
                                            placeholder="key 或者 key1-key2-key3">
                                        </el-input>
                                    </template>
                                </el-table-column>

                                <el-table-column property="value" label="Value" header-align="center" minWidth="200">
                                    <template slot-scope="scope">
                                        <el-input v-model="scope.row.value" size="mini"
                                            placeholder='["value1", "value2] 或者 [["v1", "v2", "v3"],["v11","v22", "v33"]] 或者 ${函数名(参数, 参数, ...)}'>
                                        </el-input>
                                    </template>
                                </el-table-column>
                                <el-table-column property="value" label="操作" header-align="center" width="80">
                                    <template slot-scope="scope">
                                        <el-button type="danger" icon="el-icon-delete" size="mini"
                                            @click.native="delTableRow('parameterized', scope.$index)">
                                        </el-button>
                                    </template>
                                </el-table-column>
                            </el-table>
                        </el-tab-pane>
                        <el-tab-pane label="setup_hooks" name="third">
                            <el-table :data="apiMsgData.setupHooks" size="mini" stripe :show-header="false"
                                class="h-b-e-a-style" :row-style="{ 'background-color': 'rgb(250, 250, 250)' }">
                                <el-table-column property="key" label="Key" header-align="center" minWidth="100">
                                    <template slot-scope="scope">
                                        <el-input v-model="scope.row.key" size="mini" placeholder="key">
                                        </el-input>
                                    </template>
                                </el-table-column>
                                <el-table-column property="value" label="操作" header-align="center" width="80">
                                    <template slot-scope="scope">
                                        <el-button type="danger" icon="el-icon-delete" size="mini"
                                            @click.native="delTableRow('setupHooks', scope.$index)">
                                        </el-button>
                                    </template>
                                </el-table-column>
                            </el-table>
                        </el-tab-pane>
                        <el-tab-pane label="teardown_hooks" name="fourth">
                            <el-table :data="apiMsgData.teardownHooks" size="mini" stripe :show-header="false"
                                class="h-b-e-a-style" :row-style="{ 'background-color': 'rgb(250, 250, 250)' }">
                                <el-table-column property="key" label="Key" header-align="center" minWidth="100">
                                    <template slot-scope="scope">
                                        <el-input v-model="scope.row.key" size="mini" placeholder="key">
                                        </el-input>
                                    </template>
                                </el-table-column>
                                <el-table-column property="value" label="操作" header-align="center" width="80">
                                    <template slot-scope="scope">
                                        <el-button type="danger" icon="el-icon-delete" size="mini"
                                            @click.native="delTableRow('teardownHooks', scope.$index)">
                                        </el-button>
                                    </template>
                                </el-table-column>
                            </el-table>
                        </el-tab-pane>
                    </el-tabs>

                </el-tab-pane> -->
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
import api_project from '@/api/project'
import api_interface from '@/api/interface'

export default {
    data() {
        return {
            project_name: "",
            project_id: "",
            project_list: [],
            interface_name: "",
            interface_id: "",
            interface_list: [],
            configure_name: "",
            configure_id: "",
            configure_list: [],
        }
    },
    created() {
        this.getProjectNames();
    },
    methods: {
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