<template>
    <div class="feedback">
        <div class="top-control">
            <!-- 新增 -->
            <el-button type="primary" :icon="Plus" round @click="addContent">{{ $t("str.btn.add") }}</el-button>
            <div class="flex-auto"></div>
            <!-- 分页导航 -->
            <div v-if="state.dataList && state.dataList.length">
                <el-pagination background @current-change="handleCurrentChange" :current-page="state.page"
                    layout="total, prev, pager, next" :page-size="state.limit" :total="state.total">
                </el-pagination>
            </div>
        </div>
        <el-table class="mt16" :data="state.dataList" :border="true" stripe empty-text="暂无数据">
            <el-table-column label="反馈用户" prop="owner" min-width="192">
                <template #default="scope">
                    <div v-if="scope.row.owner">
                        <el-tag size="small" type="info" v-if="scope.row.owner._id">{{ scope.row.owner._id }}</el-tag>
                        <el-tag size="small" type="danger" v-if="scope.row.owner.nickname">{{ scope.row.owner.nickname
                        }}
                        </el-tag>
                    </div>
                </template>
            </el-table-column>
            <el-table-column label="联系方式" prop="contact" min-width="192"></el-table-column>
            <el-table-column label="内容" prop="content" min-width="256"></el-table-column>
            <el-table-column label="备注" prop="remark" min-width="192"></el-table-column>
            <el-table-column label="相关用户" prop="user" min-width="192">
                <template #default="scope">
                    <div v-if="scope.row.user">
                        <el-tag size="small" type="info" v-if="scope.row.user._id">{{ scope.row.user._id }}</el-tag>
                        <el-tag size="small" type="danger" v-if="scope.row.user.nickname">{{ scope.row.user.nickname }}
                        </el-tag>
                    </div>
                </template>
            </el-table-column>
            <el-table-column label="相关帖子" prop="post" min-width="192">
                <template #default="scope">
                    <div v-if="scope.row.post">
                        <el-tag size="small" type="info" v-if="scope.row.post._id">{{ scope.row.post._id }}</el-tag>
                        <el-tag size="small" type="danger" v-if="scope.row.post.title">{{ scope.row.post.title }}
                        </el-tag>
                    </div>
                </template>
            </el-table-column>
            <el-table-column label="相关评论" prop="comment" min-width="192">
                <template #default="scope">
                    <div v-if="scope.row.comment">
                        <el-tag size="small" type="info" v-if="scope.row.comment._id">{{ scope.row.comment._id }}
                        </el-tag>
                        <el-tag size="small" type="danger" v-if="scope.row.comment.content">
                            {{ scope.row.comment.content }}</el-tag>
                    </div>
                </template>
            </el-table-column>
            <el-table-column label="附件" prop="attachments" min-width="256">
                <template #default="scope">
                    <div v-if="scope.row.attachments">
                        <el-tag size="small" type="info" v-for="(item, index) in scope.row.attachments" :key="index">
                            {{ item.path }}</el-tag>
                    </div>
                </template>
            </el-table-column>
            <el-table-column label="状态" prop="status" width="96">
                <template #default="scope">
                    <el-tag size="small"
                        :type="scope.row.status == 2 ? 'success' : scope.row.status == 1 ? 'warning' : 'info'">
                        {{ wrapFeedbackStatus(scope.row.status) }}
                    </el-tag>
                </template>
            </el-table-column>
            <el-table-column label="类型" prop="type" width="96">
                <template #default="scope">
                    <el-tag size="small" type="success" v-if="scope.row.type == 0">{{ wrapFeedbackType(scope.row.type)
                    }}
                    </el-tag>
                    <el-tag size="small" type="" v-if="scope.row.type == 1">{{ wrapFeedbackType(scope.row.type) }}
                    </el-tag>
                    <el-tag size="small" type="info" v-if="scope.row.type == 2">{{ wrapFeedbackType(scope.row.type) }}
                    </el-tag>
                    <el-tag size="small" type="warning" v-if="scope.row.type == 3">{{ wrapFeedbackType(scope.row.type)
                    }}
                    </el-tag>
                    <el-tag size="small" type="danger" v-if="scope.row.type == 4">{{ wrapFeedbackType(scope.row.type) }}
                    </el-tag>
                    <el-tag size="small" type="danger" v-if="scope.row.type == 5">{{ wrapFeedbackType(scope.row.type) }}
                    </el-tag>
                    <el-tag size="small" type="info" v-if="scope.row.type >= 6">{{ wrapFeedbackType(scope.row.type) }}
                    </el-tag>
                </template>
            </el-table-column>
            <el-table-column label="时间" prop="createdAt" width="160">
                <template #default="scope">
                    <span>{{ wrapDate(scope.row.createdAt) }}</span>
                </template>
            </el-table-column>

            <el-table-column :label="$t('str.btn.dispose')" fixed="right" :width="106">
                <template #default="scope">
                    <!-- 编辑按钮 -->
                    <el-button type="success" circle :icon="Edit" @click="editContent(scope.row)"></el-button>
                    <!-- 删除二次确认提醒 -->
                    <el-popconfirm :title="$t('str.tips.delMsg')" :confirm-button-text="$t('str.btn.ok')"
                        :cancel-button-text="$t('str.btn.cancel')" @confirm="delContent(scope.row)">
                        <template #reference>
                            <el-button type="danger" circle :icon="Delete"></el-button>
                        </template>
                    </el-popconfirm>
                </template>
            </el-table-column>
        </el-table>

        <!-- 新增与编辑对话框 -->
        <el-dialog v-model="state.isShowEditDialog" :title="state.editTitle" :before-close="resetSave" width="36%">
            <el-form class="mr32" :model="state.model" :rules="state.rules" ref="formRef" label-width="96px"
                label-position="right" size="small">
                <el-form-item label="联系方式">
                    <el-input v-model="state.model.contact" :placeholder="$t('str.tips.inputHint')" clearable>
                    </el-input>
                </el-form-item>
                <el-form-item label="内容" prop="content">
                    <el-input v-model="state.model.content" rows="5" type="textarea"
                        :placeholder="$t('str.tips.inputHint')" clearable></el-input>
                </el-form-item>
                <el-form-item label="备注" prop="remark">
                    <el-input v-model="state.model.remark" rows="3" type="textarea"
                        :placeholder="$t('str.tips.inputHint')" clearable></el-input>
                </el-form-item>
                <el-form-item label="状态" prop="status">
                    <el-select v-model="state.model.status" :placeholder="$t('str.tips.selectHint')">
                        <el-option v-for="item in state.selectData.feedbackStatus" :key="item.id" :label="item.value"
                            :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="类型" prop="type">
                    <el-select v-model="state.model.type" :placeholder="$t('str.tips.selectHint')">
                        <el-option v-for="item in state.selectData.feedbackTypes" :key="item.id" :label="item.value"
                            :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <template #footer>
                <span class="dialog-footer">
                    <el-button size="small" round @click="resetSave">{{ $t("str.btn.cancel") }}</el-button>
                    <el-button type="primary" size="small" round @click="doSave" :loading="state.loading">
                        {{ $t("str.btn.ok") }}</el-button>
                </span>
            </template>
        </el-dialog>
    </div>
</template>

<script lang="ts" setup>
import { onMounted, reactive, getCurrentInstance } from "vue"
import { Plus, Edit, Delete } from "@element-plus/icons-vue"
import { useI18n } from "vue-i18n"
import { addFeedback, updateFeedback, delFeedback, feedback } from "@/api/feedback"
import { formatDate } from "@/utils/vdate"
import { Data, wrapFeedbackStatus, wrapFeedbackType } from "@/utils/vdata"

import { ElMessage } from "element-plus"

const { proxy } = getCurrentInstance() as any
const { t } = useI18n()
const state = reactive({
    loading: false,
    dataList: [],
    total: 0,
    page: 1,
    limit: 20,

    isShowEditDialog: false,
    editTitle: "",
    model: {
        id: "",
        contact: "",
        content: "",
        remark: "",
        status: 0,
        type: 0,
    },
    rules: {
        // contact: [
        //   { required: true, message: t("str.tips.inputNull"), trigger: "blur" },
        //   { min: 1, max: 32, message: `${t("str.tips.inputLengthLimit")} 1-32`, trigger: "blur" },
        // ],
        content: [
            { required: true, message: t("str.tips.inputNull"), trigger: "blur" },
            { min: 1, max: 128, message: `${t("str.tips.inputLengthLimit")} 1-128`, trigger: "blur" },
        ],
    },
    selectData: {
        feedbackStatus: Array(),
        feedbackTypes: Array(),
    },
})
// 页面加载时
onMounted(() => {
    initData()
})
/**
 * 初始化数据
 */
const initData = () => {
    state.selectData.feedbackStatus = Data.selectData.feedbackStatus
    state.selectData.feedbackTypes = Data.selectData.feedbackTypes
    loadFeedback()
}
/**
 * 包装日期
 */
const wrapDate = (value) => {
    return formatDate(new Date(value), "YYYY/mm/dd HH:MM:SS")
}
/**
 * 页面变动
 */
const handleCurrentChange = (value) => {
    state.page = value
    loadFeedback()
}
/**
 * 新增
 */
const addContent = () => {
    state.editTitle = "新增反馈"
    state.isShowEditDialog = true
}
/**
 * 删除
 */
const delContent = async (value) => {
    try {
        const result = await delFeedback(value._id)
    } catch (e) {
        return
    }
    ElMessage.success(t("str.tips.delSuccess"))

    // 重新拉取数据
    loadFeedback()
}
/**
 * 编辑
 */
const editContent = (data) => {
    state.model = {
        id: data._id,
        contact: data.contact,
        content: data.content,
        remark: data.remark,
        status: data.status,
        type: data.type,
    }
    state.editTitle = "编辑反馈"
    state.isShowEditDialog = true
}

/**
 *  获取反馈列表
 */
const loadFeedback = async () => {
    state.loading = true

    // 组装参数
    const params = { page: state.page - 1, limit: state.limit }
    try {
        const result = await feedback(params)
        state.dataList = result.data.data
        state.total = result.data.totalCount
    } catch (e) { }
    state.loading = false
}

/**
 * 保存内容
 */
const doSave = () => {
    proxy.$refs.formRef.validate((valid) => {
        if (valid) submitSave()
    })
}
/**
 * 提交保存
 */
const submitSave = async () => {
    state.loading = true
    let result
    try {
        if (state.model.id) {
            result = await updateFeedback(state.model.id, state.model)
        } else {
            result = await addFeedback(state.model)
        }
    } catch (e) {
        state.loading = false
        return
    }
    state.loading = false
    ElMessage.success(result.msg)

    resetSave()

    // 重新拉取数据
    loadFeedback()
}
/**
 * 重置内容编辑对话框
 */
const resetSave = () => {
    state.isShowEditDialog = false
    state.model = {
        id: "",
        contact: "",
        content: "",
        remark: "",
        status: 0,
        type: 0,
    }
}
</script>

<!-- 添加“scoped”属性以将 CSS 仅限于此组件 -->
<style lang="scss" scoped>
.top-control {
    display: flex;
    align-items: center;
}
</style>
