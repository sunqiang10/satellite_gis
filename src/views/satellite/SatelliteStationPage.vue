<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h2 class="text-2xl font-bold text-white">站点管理</h2>
        <p class="text-slate-400 mt-1">卫星地面站管理</p>
      </div>
      <div class="flex gap-3">
        <el-button type="primary" @click="handleAddStation">
          <el-icon class="mr-2"><Plus /></el-icon>
          新增站点
        </el-button>
        <el-button @click="refreshData">
          <el-icon class="mr-2"><Refresh /></el-icon>
          刷新
        </el-button>
      </div>
    </div>

    <div class="grid grid-cols-4 gap-6">
      <div class="glass-panel rounded-xl p-6">
        <div class="flex items-center justify-between mb-4">
          <div class="w-10 h-10 bg-sci-blue/20 rounded-lg flex items-center justify-center">
            <el-icon :size="20" class="text-sci-blue"><Location /></el-icon>
          </div>
        </div>
        <div class="text-2xl font-bold text-white mb-1">{{ stats.total }}</div>
        <div class="text-slate-400 text-sm">站点总数</div>
      </div>
      <div class="glass-panel rounded-xl p-6">
        <div class="flex items-center justify-between mb-4">
          <div class="w-10 h-10 bg-sci-green/20 rounded-lg flex items-center justify-center">
            <el-icon :size="20" class="text-sci-green"><CircleCheck /></el-icon>
          </div>
        </div>
        <div class="text-2xl font-bold text-white mb-1">{{ stats.active }}</div>
        <div class="text-slate-400 text-sm">运行中</div>
      </div>
      <div class="glass-panel rounded-xl p-6">
        <div class="flex items-center justify-between mb-4">
          <div class="w-10 h-10 bg-sci-amber/20 rounded-lg flex items-center justify-center">
            <el-icon :size="20" class="text-sci-amber"><Tools /></el-icon>
          </div>
        </div>
        <div class="text-2xl font-bold text-white mb-1">{{ stats.maintenance }}</div>
        <div class="text-slate-400 text-sm">维护中</div>
      </div>
      <div class="glass-panel rounded-xl p-6">
        <div class="flex items-center justify-between mb-4">
          <div class="w-10 h-10 bg-sci-purple/20 rounded-lg flex items-center justify-center">
            <el-icon :size="20" class="text-sci-purple"><Connection /></el-icon>
          </div>
        </div>
        <div class="text-2xl font-bold text-white mb-1">{{ stats.coverage }}</div>
        <div class="text-slate-400 text-sm">覆盖率(%)</div>
      </div>
    </div>

    <div class="glass-panel rounded-xl p-6">
      <div class="flex gap-4 mb-6">
        <el-input
          v-model="searchKeyword"
          placeholder="搜索站点名称..."
          clearable
          class="w-64"
        >
          <template #prefix>
            <el-icon><Search /></el-icon>
          </template>
        </el-input>
        <el-select v-model="filterStatus" placeholder="状态" clearable class="w-32">
          <el-option label="运行中" value="active" />
          <el-option label="维护中" value="maintenance" />
          <el-option label="离线" value="offline" />
        </el-select>
      </div>

      <el-table :data="filteredStations" style="width: 100%" v-loading="loading">
        <el-table-column type="selection" width="55" />
        <el-table-column prop="id" label="ID" width="60" />
        <el-table-column prop="stationId" label="站点ID" width="150" />
        <el-table-column prop="stationName" label="站点名称" min-width="100" />
        <el-table-column prop="stationCode" label="站点编码" min-width="100" />
        <el-table-column prop="owner" label="所属单位" min-width="100" />
        <el-table-column label="位置坐标" min-width="300">
          <template #default="{ row }">
            <div class="text-slate-300">
               经度: {{ row.lon?.toFixed(4) }}°&nbsp;&nbsp;&nbsp;&nbsp;
               纬度: {{ row.lat?.toFixed(4) }}°&nbsp;&nbsp;&nbsp;&nbsp;
               高度: {{ row.alt?.toFixed(2) }} m
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="canUse" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="getStatusColor(row.canUse)" size="small">
              {{ getStatusText(row.canUse) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="addTime" label="添加时间" width="180" />
        <el-table-column label="操作" width="180" fixed="right">
          <template #default="{ row }">
            <el-button text type="primary" size="small" @click="handleView(row)">
              <el-icon><View /></el-icon>
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
          共 {{ pagination.total }} 个站点
        </div>
        <el-pagination
          v-model:current-page="pagination.currentPage"
          v-model:page-size="pagination.pageSize"
          :page-sizes="[10, 20, 50, 100]"
          :total="pagination.total"
          layout="total, sizes, prev, pager, next, jumper"
          background
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </div>

    <el-drawer v-model="drawerVisible" :title="drawerTitle" size="50%">
      <div v-if="currentStation" class="space-y-6">
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="text-slate-400 text-sm">站点ID</label>
            <div class="text-white mt-1">{{ currentStation.stationId }}</div>
          </div>
          <div>
            <label class="text-slate-400 text-sm">站点名称</label>
            <div class="text-white mt-1">{{ currentStation.stationName }}</div>
          </div>
          <div>
            <label class="text-slate-400 text-sm">站点编码</label>
            <div class="text-white mt-1">{{ currentStation.stationCode || '-' }}</div>
          </div>
          <div>
            <label class="text-slate-400 text-sm">所属单位</label>
            <div class="text-white mt-1">{{ currentStation.owner }}</div>
          </div>
          <div>
            <label class="text-slate-400 text-sm">状态</label>
            <div class="mt-1">
              <el-tag :type="getStatusColor(currentStation.canUse)">
                {{ getStatusText(currentStation.canUse) }}
              </el-tag>
            </div>
          </div>
          <div>
            <label class="text-slate-400 text-sm">经度</label>
            <div class="text-white mt-1">{{ currentStation.lon?.toFixed(4) }}°</div>
          </div>
          <div>
            <label class="text-slate-400 text-sm">纬度</label>
            <div class="text-white mt-1">{{ currentStation.lat?.toFixed(4) }}°</div>
          </div>
          <div>
            <label class="text-slate-400 text-sm">高度</label>
            <div class="text-white mt-1">{{ currentStation.alt?.toFixed(2) }} m</div>
          </div>
          <div>
            <label class="text-slate-400 text-sm">添加时间</label>
            <div class="text-white mt-1">{{ currentStation.addTime }}</div>
          </div>
          <div>
            <label class="text-slate-400 text-sm">更新时间</label>
            <div class="text-white mt-1">{{ currentStation.modTime }}</div>
          </div>
        </div>
        <div class="flex gap-3">
          <el-button type="primary" @click="handleMaintenance(currentStation)" v-if="currentStation.canUse === 1">
            进入维护
          </el-button>
          <el-button type="success" @click="handleActivate(currentStation)" v-if="currentStation.canUse === 0">
            恢复运行
          </el-button>
          <el-button @click="drawerVisible = false">关闭</el-button>
        </div>
      </div>
    </el-drawer>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  Plus,
  Refresh,
  Search,
  View,
  Edit,
  Delete,
  Location,
  CircleCheck,
  Tools,
  Connection
} from '@element-plus/icons-vue'
import { stationApi } from '@/api'

const loading = ref(false)
const searchKeyword = ref('')
const filterStatus = ref('')
const drawerVisible = ref(false)
const drawerTitle = ref('站点详情')
const currentStation = ref(null)

const stats = ref({
  total: 0,
  active: 0,
  maintenance: 0,
  coverage: 85
})

const stations = ref([])

const pagination = ref({
  currentPage: 1,
  pageSize: 10,
  total: 0
})

// 状态颜色映射 (canUse: 1-可用, 0-不可用)
const getStatusColor = (canUse) => {
  return canUse === 1 ? 'success' : 'danger'
}

// 状态文本映射
const getStatusText = (canUse) => {
  return canUse === 1 ? '运行中' : '离线'
}

// 过滤后的站点数据
const filteredStations = computed(() => {
  let result = stations.value
  
  if (searchKeyword.value) {
    const keyword = searchKeyword.value.toLowerCase()
    result = result.filter(item =>
      (item.stationName?.toLowerCase().includes(keyword)) ||
      (item.stationId?.toLowerCase().includes(keyword)) ||
      (item.owner?.toLowerCase().includes(keyword))
    )
  }
  
  if (filterStatus.value) {
    if (filterStatus.value === 'active') {
      result = result.filter(item => item.canUse === 1)
    } else if (filterStatus.value === 'offline' || filterStatus.value === 'maintenance') {
      result = result.filter(item => item.canUse === 0)
    }
  }
  
  return result
})

// 加载数据
const loadData = async () => {
  loading.value = true
  try {
    const response = await stationApi.getList({
      page: pagination.value.currentPage,
      size: pagination.value.pageSize
    })
    
    if (response && response.records) {
      stations.value = response.records
      pagination.value.total = response.totalCount || response.records.length
      
      // 更新统计数据
      stats.value.total = pagination.value.total
      stats.value.active = stations.value.filter(s => s.canUse === 1).length
      stats.value.maintenance = stations.value.filter(s => s.canUse === 0).length
    } else if (Array.isArray(response)) {
      stations.value = response
      pagination.value.total = response.length
      stats.value.total = response.length
      stats.value.active = response.filter(s => s.canUse === 1).length
      stats.value.maintenance = response.filter(s => s.canUse === 0).length
    }
  } catch (error) {
    console.error('加载站点数据失败:', error)
    ElMessage.error('加载数据失败: ' + (error.message || '未知错误'))
  } finally {
    loading.value = false
  }
}

// 刷新数据
const refreshData = () => {
  loadData()
  ElMessage.success('数据已刷新')
}

// 分页大小变化
const handleSizeChange = (size) => {
  pagination.value.pageSize = size
  loadData()
}

// 页码变化
const handleCurrentChange = (page) => {
  pagination.value.currentPage = page
  loadData()
}

// 新增站点
const handleAddStation = () => {
  ElMessage.info('新增站点功能开发中')
}

// 查看站点详情
const handleView = (row) => {
  currentStation.value = row
  drawerTitle.value = '站点详情'
  drawerVisible.value = true
}

// 编辑站点
const handleEdit = (row) => {
  ElMessage.info('编辑功能开发中')
}

// 删除站点
const handleDelete = async (row) => {
  try {
    await ElMessageBox.confirm(`确定删除站点"${row.stationName}"吗？`, '警告', {
      type: 'warning',
      confirmButtonText: '删除',
      confirmButtonClass: 'el-button--danger'
    })
    await stationApi.delete(row.id)
    ElMessage.success('站点已删除')
    loadData()
  } catch (error) {
    if (error !== 'cancel') {
      console.error('删除失败:', error)
      ElMessage.error('删除失败: ' + (error.message || '未知错误'))
    }
  }
}

// 进入维护状态
const handleMaintenance = async (row) => {
  try {
    await ElMessageBox.confirm(`确定将站点"${row.stationName}"设置为不可用状态吗？`, '确认', {
      type: 'warning'
    })
    await stationApi.update({ ...row, canUse: 0 })
    ElMessage.success('站点状态已更新')
    loadData()
  } catch (error) {
    if (error !== 'cancel') {
      console.error('操作失败:', error)
      ElMessage.error('操作失败: ' + (error.message || '未知错误'))
    }
  }
}

// 恢复运行
const handleActivate = async (row) => {
  try {
    await ElMessageBox.confirm(`确定恢复站点"${row.stationName}"为可用状态吗？`, '确认', {
      type: 'warning'
    })
    await stationApi.update({ ...row, canUse: 1 })
    ElMessage.success('站点状态已更新')
    loadData()
  } catch (error) {
    if (error !== 'cancel') {
      console.error('操作失败:', error)
      ElMessage.error('操作失败: ' + (error.message || '未知错误'))
    }
  }
}

onMounted(() => {
  loadData()
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

:deep(.el-input__wrapper) {
  background-color: rgba(15, 23, 42, 0.6);
  border-color: rgba(59, 130, 246, 0.3);
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
