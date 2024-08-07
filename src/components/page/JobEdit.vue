<template>
    <div>
        <el-tabs type="border-card">
            <el-tab-pane label="仓库信息">
                <div class="container">
                    <div class="form-box">
                        <el-form ref="form" :rules="rules" :model="form" label-width="100px">

                            <el-form-item label="git仓库地址" prop="git">
                                <el-input v-model="form.git" suffix-icon="el-icon-menu" @focus="clearValidate('git')"
                                    clearable></el-input>
                            </el-form-item>

                            <el-form-item label="工程名称" prop="name">
                                <el-input v-model="form.name" suffix-icon="el-icon-user-solid"
                                    @focus="clearValidate('name')" clearable></el-input>
                            </el-form-item>

                            <el-form-item label="服务器地址" prop="server">
                                <el-input v-model="form.server" suffix-icon="el-icon-user-solid"
                                    @focus="clearValidate('server')" clearable></el-input>
                            </el-form-item>

                            <el-form-item label="工程类型" prop="type">
                                <el-radio-group v-model="form.type" size="medium" clearable>
                                    <el-radio border label="前端工程项目"></el-radio>
                                    <el-radio border label="后端工程项目"></el-radio>
                                </el-radio-group>
                            </el-form-item>
                        </el-form>
                    </div>
                </div>
            </el-tab-pane>

            <el-tab-pane label="构建镜像">
                <div class="table">

                    <el-row>
                        <editor style="font-size: 15px" v-model="setup_content" @init="editorInit" lang="dockerfile"
                            theme="monokai" width="100%" height="600px" :options="{
                                enableSnippets: true,
                                enableBasicAutocompletion: true,
                                enableLiveAutocompletion: true
                            }">
                        </editor>
                    </el-row>
                </div>
            </el-tab-pane>

            <el-tab-pane label="构建后步骤">
                <div class="table">

                    <el-row>
                        <editor style="font-size: 15px" v-model="teardown_content" @init="editorInit" lang="dockerfile"
                            theme="monokai" width="100%" height="600px" :options="{
                                enableSnippets: true,
                                enableBasicAutocompletion: true,
                                enableLiveAutocompletion: true
                            }">
                        </editor>
                    </el-row>
                </div>
            </el-tab-pane>

            <el-tab-pane label="通知到企业微信">
                <div class="container">
                    <div class="form-box">
                        <el-form ref="form" :rules="rules" :model="form" label-width="100px">
                            <el-form-item label="地址路径" prop="address">
                                <el-input v-model="form.address" suffix-icon="el-icon-menu"
                                    @focus="clearValidate('address')" clearable></el-input>
                            </el-form-item>

                            <el-form-item label="是否通知">
                                <el-switch v-model="form.send" @change="changestatus"></el-switch>
                            </el-form-item>


                        </el-form>
                    </div>
                </div>
            </el-tab-pane>

            <el-row class="btn_class">
                <el-button type="primary" size="medium" style="margin-right: 10px;" @click="saveBuiltin">保存</el-button>
                <!--      <el-button type="danger" size="medium" @click="toIndexPage">返回</el-button>-->
            </el-row>
        </el-tabs>
    </div>
</template>

<script>
export default {

}
</script>

<style>
.btn_class {
    float: left;
    margin-top: 10px;
}
</style>