<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h2 class="text-2xl font-bold text-white">故障统计</h2>
        <p class="text-slate-400 mt-1">卫星任务圈次故障标记</p>
      </div>
      <div class="flex gap-3">
        <el-button type="primary" @click="handleAddRequirement">
          <el-icon class="mr-2"><Plus /></el-icon>
          新增圈次
        </el-button>
        <el-button @click="refreshData">
          <el-icon class="mr-2"><Refresh /></el-icon>
          刷新
        </el-button>
      </div>
    </div>

    <div class="glass-panel rounded-xl p-6">
      <div class="flex gap-4 mb-6">
        <el-input
          v-model="searchKeyword"
          placeholder="搜索圈次..."
          clearable
          class="w-64"
        >
          <template #prefix>
            <el-icon><Search /></el-icon>
          </template>
        </el-input>
        <el-select v-model="filterStatus" placeholder="状态" clearable class="w-32">
          <el-option label="待处理" value="pending" />
          <el-option label="进行中" value="in_progress" />
          <el-option label="已批准" value="approved" />
          <el-option label="已完成" value="completed" />
        </el-select>
        <el-select v-model="filterPriority" placeholder="优先级" clearable class="w-32">
          <el-option label="高" value="high" />
          <el-option label="中" value="medium" />
          <el-option label="低" value="low" />
        </el-select>
      </div>

      <el-table :data="filteredRequirements" style="width: 100%" v-loading="loading">
        <el-table-column type="selection" width="55" />
        <el-table-column prop="id" label="ID" width="60" />
        <el-table-column prop="title" label="圈次标题" min-width="200" />
        <el-table-column prop="type" label="类型" width="120">
          <template #default="{ row }">
            <el-tag :type="getTypeColor(row.type)" size="small">{{ row.type }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="priority" label="优先级" width="100">
          <template #default="{ row }">
            <el-tag :type="getPriorityColor(row.priority)" size="small">
              {{ getPriorityText(row.priority) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="getStatusColor(row.status)" size="small">
              {{ getStatusText(row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="requester" label="申请单位" width="120" />
        <el-table-column prop="deadline" label="截止日期" width="120" />
        <el-table-column label="操作" width="240" fixed="right">
          <template #default="{ row }">
            <el-button text type="primary" size="small" @click="handleView(row)">
              <el-icon><View /></el-icon>
            </el-button>
            <el-button text type="success" size="small" @click="handleApprove(row)" v-if="row.status === 'pending'">
              <el-icon><Select /></el-icon>
            </el-button>
            <el-button text type="warning" size="small" @click="handleEdit(row)">
              <el-icon><Edit /></el-icon>
            </el-button>
            <el-button text type="danger" size="small" @click="handleDelete(row)">
              <el-icon><Delete /></el-icon>
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="flex items-center justify-between mt-6">
        <div class="text-slate-400 text-sm">
          共 {{ filteredRequirements.length }} 条圈次
        </div>
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :page-sizes="[10, 20, 50, 100]"
          :total="requirements.length"
          layout="total, sizes, prev, pager, next, jumper"
          background
        />
      </div>
    </div>

    <el-drawer v-model="drawerVisible" :title="drawerTitle" size="50%">
      <div v-if="currentRequirement" class="space-y-6">
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="text-slate-400 text-sm">圈次标题</label>
            <div class="text-white mt-1">{{ currentRequirement.title }}</div>
          </div>
          <div>
            <label class="text-slate-400 text-sm">圈次类型</label>
            <div class="mt-1">
              <el-tag :type="getTypeColor(currentRequirement.type)">
                {{ currentRequirement.type }}
              </el-tag>
            </div>
          </div>
          <div>
            <label class="text-slate-400 text-sm">优先级</label>
            <div class="mt-1">
              <el-tag :type="getPriorityColor(currentRequirement.priority)">
                {{ getPriorityText(currentRequirement.priority) }}
              </el-tag>
            </div>
          </div>
          <div>
            <label class="text-slate-400 text-sm">状态</label>
            <div class="mt-1">
              <el-tag :type="getStatusColor(currentRequirement.status)">
                {{ getStatusText(currentRequirement.status) }}
              </el-tag>
            </div>
          </div>
          <div>
            <label class="text-slate-400 text-sm">申请单位</label>
            <div class="text-white mt-1">{{ currentRequirement.requester }}</div>
          </div>
          <div>
            <label class="text-slate-400 text-sm">截止日期</label>
            <div class="text-white mt-1">{{ currentRequirement.deadline }}</div>
          </div>
        </div>
        <div>
          <label class="text-slate-400 text-sm">圈次描述</label>
          <div class="text-white mt-1 p-4 bg-space-800/50 rounded-lg">
            {{ currentRequirement.description }}
          </div>
        </div>
        <div class="flex gap-3">
          <el-button type="primary" @click="handleApprove(currentRequirement)" v-if="currentRequirement.status === 'pending'">
            批准圈次
          </el-button>
          <el-button @click="drawerVisible = false">关闭</el-button>
        </div>
      </div>
    </el-drawer>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  Plus,
  Refresh,
  Search,
  View,
  Select,
  Edit,
  Delete
} from '@element-plus/icons-vue'
import { mockApi } from '@/api/mock'

const loading = ref(false)
const searchKeyword = ref('')
const filterStatus = ref('')
const filterPriority = ref('')
const currentPage = ref(1)
const pageSize = ref(10)
const drawerVisible = ref(false)
const drawerTitle = ref('圈次详情')
const currentRequirement = ref(null)

const requirements = ref([])

const filteredRequirements = computed(() => {
  let result = requirements.value
  
  if (searchKeyword.value) {
    const keyword = searchKeyword.value.toLowerCase()
    result = result.filter(item =>
      item.title.toLowerCase().includes(keyword) ||
      item.requester.toLowerCase().includes(keyword)
    )
  }
  
  if (filterStatus.value) {
    result = result.filter(item => item.status === filterStatus.value)
  }
  
  if (filterPriority.value) {
    result = result.filter(item => item.priority === filterPriority.value)
  }
  
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return result.slice(start, end)
})

const getTypeColor = (type) => {
  const colorMap = {
    '成像任务': 'primary',
    '气象监测': 'success',
    '通信任务': 'warning',
    '遥感监测': 'info'
  }
  return colorMap[type] || 'default'
}

const getPriorityColor = (priority) => {
  const colorMap = {
    high: 'danger',
    medium: 'warning',
    low: 'info'
  }
  return colorMap[priority] || 'default'
}

const getPriorityText = (priority) => {
  const textMap = {
    high: '高',
    medium: '中',
    low: '低'
  }
  return textMap[priority] || '未知'
}

const getStatusColor = (status) => {
  const colorMap = {
    pending: 'info',
    in_progress: 'warning',
    approved: 'success',
    completed: 'success'
  }
  return colorMap[status] || 'default'
}

const getStatusText = (status) => {
  const textMap = {
    pending: '待处理',
    in_progress: '进行中',
    approved: '已批准',
    completed: '已完成'
  }
  return textMap[status] || '未知'
}

const loadData = async () => {
  loading.value = true
  try {
    const response = await mockApi.getRequirements()
    if (response.success) {
      requirements.value = response.data
    }
  } catch (error) {
    ElMessage.error('加载数据失败')
  } finally {
    loading.value = false
  }
}

const refreshData = () => {
  loadData()
  ElMessage.success('数据已刷新')
}

const handleAddRequirement = () => {
  ElMessage.info('新增圈次功能开发中')
}

const handleView = (row) => {
  currentRequirement.value = row
  drawerTitle.value = '圈次详情'
  drawerVisible.value = true
}

const handleApprove = async (row) => {
  try {
    await ElMessageBox.confirm(`确定批准圈次"${row.title}"吗？`, '确认', {
      type: 'warning'
    })
    row.status = 'approved'
    ElMessage.success('圈次已批准')
  } catch {
    // 用户取消
  }
}

const handleEdit = (row) => {
  ElMessage.info('编辑功能开发中')
}

const handleDelete = async (row) => {
  try {
    await ElMessageBox.confirm(`确定删除圈次"${row.title}"吗？`, '警告', {
      type: 'warning',
      confirmButtonText: '删除',
      confirmButtonClass: 'el-button--danger'
    })
    const index = requirements.value.findIndex(item => item.id === row.id)
    if (index > -1) {
      requirements.value.splice(index, 1)
      ElMessage.success('圈次已删除')
    }
  } catch {
    // 用户取消
  }
}

loadData()
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

:deep(.el-input__wrapper) {
  background-color: rgba(15, 23, 42, 0.6);
  border-color: rgba(59, 130, 246, 0.3);
  box-shadow: none;
}

:deep(.el-input__wrapper:hover) {
  border-color: rgba(59, 130, 246, 0.5);
}

:deep(.el-input__wrapper.is-focus) {
  border-color: #3b82f6;
}

:deep(.el-input__inner) {
  color: #e2e8f0;
}

:deep(.el-input__inner::placeholder) {
  color: #64748b;
}

:deep(.el-select .el-input__wrapper) {
  background-color: rgba(15, 23, 42, 0.6);
  border-color: rgba(59, 130, 246, 0.3);
}

:deep(.el-select .el-input__wrapper:hover) {
  border-color: rgba(59, 130, 246, 0.5);
}

:deep(.el-select .el-input__wrapper.is-focus) {
  border-color: #3b82f6;
}

:deep(.el-select .el-input__inner) {
  color: #e2e8f0;
}

:deep(.el-pagination) {
  --el-pagination-text-color: #94a3b8;
  --el-pagination-bg-color: rgba(15, 23, 42, 0.6);
  --el-pagination-border-color: #334155;
  --el-pagination-hover-bg-color: rgba(59, 130, 246, 0.1);
}

:deep(.el-pagination button) {
  background-color: rgba(15, 23, 42, 0.6);
  color: #94a3b8;
  border-color: #334155;
}

:deep(.el-pagination button:hover) {
  background-color: rgba(59, 130, 246, 0.1);
  color: #3b82f6;
}

:deep(.el-pagination.is-background .el-pager li:not(.disabled).is-active) {
  background-color: #3b82f6;
  color: #ffffff;
}
</style>