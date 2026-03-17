<template>
  <div class="space-y-6">
    <div>
      <h2 class="text-2xl font-bold text-white">系统管理</h2>
      <p class="text-slate-400 mt-1">管理系统配置和用户权限</p>
    </div>

    <div class="glass-panel rounded-xl p-6">
      <div class="flex justify-between items-center mb-4">
        <h3 class="text-lg font-semibold text-white">用户管理</h3>
        <el-button type="primary" size="small" @click="handleAdd">新增用户</el-button>
      </div>
      <div style="width: 100%; overflow-x: auto;">
        <el-table :data="users" v-loading="loading" style="width: 100%">
        <el-table-column prop="id" label="ID" min-width="80" show-overflow-tooltip />
        <el-table-column prop="logonName" label="登录名" min-width="100" />
        <el-table-column prop="username" label="用户名" min-width="100" />
        <el-table-column prop="realName" label="真实姓名" min-width="90" />
        <el-table-column prop="role" label="角色" min-width="100">
          <template #default="{ row }">
            <el-tag :type="row.role === 'admin' ? 'danger' : 'primary'" size="small">
              {{ row.role === 'admin' ? '管理员' : row.role === 'qc' ? '质检员' : '普通用户' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="company" label="单位" min-width="120" show-overflow-tooltip />
        <el-table-column prop="telephone" label="电话" min-width="110" />
        <el-table-column prop="email" label="邮箱" min-width="150" show-overflow-tooltip />
        <el-table-column prop="regTime" label="注册时间" min-width="140">
          <template #default="{ row }">
            {{ row.regTime ? formatDate(row.regTime) : '-' }}
          </template>
        </el-table-column>
        <el-table-column label="操作" min-width="120" fixed="right">
          <template #default="{ row }">
            <el-button text type="primary" size="small" @click="handleEdit(row)">编辑</el-button>
            <el-button text type="danger" size="small" @click="handleDelete(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      </div>
    </div>

    <!-- 新增/编辑用户弹窗 -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogTitle"
      width="500px"
      destroy-on-close
    >
      <el-form :model="form" :rules="rules" ref="formRef" label-width="80px">
        <el-form-item label="登录名" prop="logonName">
          <el-input v-model="form.logonName" placeholder="请输入登录名" :disabled="isEdit" />
        </el-form-item>
        <el-form-item label="用户名" prop="username">
          <el-input v-model="form.username" placeholder="请输入用户名" :disabled="isEdit" />
        </el-form-item>
        <el-form-item label="真实姓名" prop="realName">
          <el-input v-model="form.realName" placeholder="请输入真实姓名" />
        </el-form-item>
        <el-form-item label="密码" prop="password" v-if="!isEdit">
          <el-input v-model="form.password" type="password" placeholder="请输入密码" show-password />
        </el-form-item>
        <el-form-item label="密码" v-else>
          <el-input v-model="form.password" type="password" placeholder="不修改请留空" show-password />
        </el-form-item>
        <el-form-item label="角色" prop="role">
          <el-select v-model="form.role" placeholder="请选择角色" style="width: 100%">
            <el-option label="管理员" value="admin" />
            <el-option label="质检员" value="qc" />
            <el-option label="普通用户" value="user" />
          </el-select>
        </el-form-item>
        <el-form-item label="单位" prop="company">
          <el-input v-model="form.company" placeholder="请输入单位" />
        </el-form-item>
        <el-form-item label="电话" prop="telephone">
          <el-input v-model="form.telephone" placeholder="请输入电话" />
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="form.email" placeholder="请输入邮箱" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleSubmit" :loading="submitLoading">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { userApi } from '@/api'

const users = ref([])
const loading = ref(false)
const dialogVisible = ref(false)
const dialogTitle = ref('新增用户')
const isEdit = ref(false)
const submitLoading = ref(false)
const formRef = ref(null)

const form = ref({
  id: '',
  logonName: '',
  username: '',
  realName: '',
  password: '',
  role: 'user',
  company: '',
  telephone: '',
  email: ''
})

const rules = {
  logonName: [{ required: true, message: '请输入登录名', trigger: 'blur' }],
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
  role: [{ required: true, message: '请选择角色', trigger: 'change' }]
}

// 加载用户列表
const loadUsers = async () => {
  loading.value = true
  try {
    const res = await userApi.getList()
    users.value = res || []
  } catch (error) {
    console.error('加载用户列表失败', error)
  } finally {
    loading.value = false
  }
}

// 格式化日期
const formatDate = (date) => {
  if (!date) return '-'
  const d = new Date(date)
  return d.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// 重置表单
const resetForm = () => {
  form.value = {
    id: '',
    logonName: '',
    username: '',
    realName: '',
    password: '',
    role: 'user',
    company: '',
    telephone: '',
    email: ''
  }
}

// 新增用户
const handleAdd = () => {
  isEdit.value = false
  dialogTitle.value = '新增用户'
  resetForm()
  dialogVisible.value = true
}

// 编辑用户
const handleEdit = (row) => {
  isEdit.value = true
  dialogTitle.value = '编辑用户'
  form.value = { ...row, password: '' }
  dialogVisible.value = true
}

// 删除用户
const handleDelete = async (row) => {
  try {
    await ElMessageBox.confirm('确定要删除该用户吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    await userApi.delete(row.id)
    ElMessage.success('删除成功')
    loadUsers()
  } catch (error) {
    if (error !== 'cancel') {
      console.error('删除失败', error)
    }
  }
}

// 提交表单
const handleSubmit = async () => {
  if (!formRef.value) return
  
  await formRef.value.validate(async (valid) => {
    if (valid) {
      submitLoading.value = true
      try {
        if (isEdit.value) {
          await userApi.update(form.value)
          ElMessage.success('更新成功')
        } else {
          await userApi.add(form.value)
          ElMessage.success('添加成功')
        }
        dialogVisible.value = false
        loadUsers()
      } catch (error) {
        console.error('提交失败', error)
      } finally {
        submitLoading.value = false
      }
    }
  })
}

onMounted(() => {
  loadUsers()
})
</script>

<style scoped>
:deep(.el-table) {
  background-color: transparent;
}

:deep(.el-table__inner-wrapper) {
  background-color: transparent;
}

:deep(.el-table tr) {
  background-color: transparent;
}

:deep(.el-table th.el-table__cell) {
  background-color: rgba(30, 41, 59, 0.5);
  color: #e2e8f0;
  border-color: #334155;
}

:deep(.el-table td.el-table__cell) {
  border-color: #334155;
  color: #cbd5e1;
}

:deep(.el-table--enable-row-hover .el-table__body tr:hover > td) {
  background-color: rgba(59, 130, 246, 0.1);
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}
</style>
