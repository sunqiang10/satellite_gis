<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h2 class="text-2xl font-bold text-white">卫星管理</h2>
        <p class="text-slate-400 mt-1">卫星资产与状态管理</p>
      </div>
      <div class="flex gap-3">
        <el-button type="primary" @click="handleAddSatellite">
          <el-icon class="mr-2"><Plus /></el-icon>
          新增卫星
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
            <el-icon :size="20" class="text-sci-blue"><Monitor /></el-icon>
          </div>
        </div>
        <div class="text-2xl font-bold text-white mb-1">{{ stats.total }}</div>
        <div class="text-slate-400 text-sm">卫星总数</div>
      </div>
      <div class="glass-panel rounded-xl p-6">
        <div class="flex items-center justify-between mb-4">
          <div class="w-10 h-10 bg-sci-green/20 rounded-lg flex items-center justify-center">
            <el-icon :size="20" class="text-sci-green"><CircleCheck /></el-icon>
          </div>
        </div>
        <div class="text-2xl font-bold text-white mb-1">{{ stats.active }}</div>
        <div class="text-slate-400 text-sm">正常运行</div>
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
            <el-icon :size="20" class="text-sci-purple"><TrendCharts /></el-icon>
          </div>
        </div>
        <div class="text-2xl font-bold text-white mb-1">{{ stats.avgBattery }}%</div>
        <div class="text-slate-400 text-sm">平均电量</div>
      </div>
    </div>

    <div class="glass-panel rounded-xl p-6">
      <div class="flex gap-4 mb-6">
        <el-input
          v-model="searchKeyword"
          placeholder="搜索卫星名称..."
          clearable
          class="w-64"
        >
          <template #prefix>
            <el-icon><Search /></el-icon>
          </template>
        </el-input>
        <el-select v-model="filterType" placeholder="卫星类型" clearable class="w-32">
          <el-option label="SAR卫星" :value="1" />
          <el-option label="光学卫星" :value="2" />
          <el-option label="红外卫星" :value="3" />
          <el-option label="通信卫星" :value="4" />
          <el-option label="导航卫星" :value="5" />
          <el-option label="气象卫星" :value="6" />
        </el-select>
        <el-select v-model="filterStatus" placeholder="状态" clearable class="w-32">
          <el-option label="正常" value="active" />
          <el-option label="维护" value="maintenance" />
          <el-option label="离线" value="offline" />
        </el-select>
      </div>

      <div class="table-container">
        <el-table :data="filteredSatellites" style="width: max-content" v-loading="loading">
          <el-table-column type="selection" width="55" />
          <el-table-column prop="id" label="ID" width="60" />
          <el-table-column prop="satId" label="卫星ID" width="180" />
          <el-table-column prop="satName" label="卫星名称" width="150" />
          <el-table-column prop="satTleName" label="TLE名称" width="150" />
          <el-table-column prop="satType" label="类型" width="120">
            <template #default="{ row }">
              <el-tag :type="getTypeColor(row.satType)" size="small">{{ getSatelliteTypeText(row.satType) }}</el-tag>
            </template>
          </el-table-column>
            <el-table-column prop="owner" label="所属单位" width="150" />
          <el-table-column prop="orbitNum" label="轨道圈数" width="100" />
          <el-table-column prop="mass" label="重量(kg)" width="100">
            <template #default="{ row }">
              {{ row.mass?.toFixed(2) || '-' }}
            </template>
          </el-table-column>
          <el-table-column prop="area" label="迎风面积" width="100">
            <template #default="{ row }">
              {{ row.area?.toFixed(4) || '-' }}
            </template>
          </el-table-column>
          <el-table-column prop="batteryCapacity" label="电量" width="100">
            <template #default="{ row }">
              <el-progress :percentage="Math.round(row.batteryCapacity || 0)" :stroke-width="6" />
            </template>
          </el-table-column>
          <el-table-column prop="storageCapacity" label="存储容量(GB)" width="120">
            <template #default="{ row }">
              {{ row.storageCapacity?.toFixed(2) || '-' }}
            </template>
          </el-table-column>
          <el-table-column prop="dataRate" label="数据速率" width="120">
            <template #default="{ row }">
              {{ row.dataRate?.toFixed(2) || '-' }} Mbps
            </template>
          </el-table-column>
          <el-table-column prop="canUse" label="状态" width="100">
            <template #default="{ row }">
              <el-tag :type="getStatusColor(row.canUse)" size="small">
                {{ getStatusText(row.canUse) }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="addTime" label="添加时间" width="220" />
          <el-table-column label="操作" width="180" fixed="right" class-name="fixed-column-bg-right">
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
      </div>

      <div class="flex items-center justify-between mt-6">
        <div class="text-slate-400 text-sm">
          共 {{ pagination.total }} 颗卫星
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
      <div v-if="currentSatellite" class="space-y-6">
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="text-slate-400 text-sm">卫星ID</label>
            <div class="text-white mt-1">{{ currentSatellite.satId }}</div>
          </div>
          <div>
            <label class="text-slate-400 text-sm">卫星名称</label>
            <div class="text-white mt-1">{{ currentSatellite.satName }}</div>
          </div>
          <div>
            <label class="text-slate-400 text-sm">TLE名称</label>
            <div class="text-white mt-1">{{ currentSatellite.satTleName }}</div>
          </div>
          <div>
            <label class="text-slate-400 text-sm">卫星类型</label>
            <div class="mt-1">
              <el-tag :type="getTypeColor(currentSatellite.satType)">
                {{ getSatelliteTypeText(currentSatellite.satType) }}
              </el-tag>
            </div>
          </div>
          <div>
            <label class="text-slate-400 text-sm">所属单位</label>
            <div class="text-white mt-1">{{ currentSatellite.owner }}</div>
          </div>
          <div>
            <label class="text-slate-400 text-sm">状态</label>
            <div class="mt-1">
              <el-tag :type="getStatusColor(currentSatellite.canUse)">
                {{ getStatusText(currentSatellite.canUse) }}
              </el-tag>
            </div>
          </div>
          <div>
            <label class="text-slate-400 text-sm">当前轨道圈数</label>
            <div class="text-white mt-1">{{ currentSatellite.orbitNum }}</div>
          </div>
          <div>
            <label class="text-slate-400 text-sm">重量</label>
            <div class="text-white mt-1">{{ currentSatellite.mass?.toFixed(2) }} kg</div>
          </div>
          <div>
            <label class="text-slate-400 text-sm">迎风面积</label>
            <div class="text-white mt-1">{{ currentSatellite.area?.toFixed(4) }}</div>
          </div>
          <div>
            <label class="text-slate-400 text-sm">电量</label>
            <div class="mt-1">
              <el-progress :percentage="Math.round(currentSatellite.batteryCapacity || 0)" :stroke-width="8" />
            </div>
          </div>
          <div>
            <label class="text-slate-400 text-sm">存储容量</label>
            <div class="text-white mt-1">{{ currentSatellite.storageCapacity?.toFixed(2) }} GB</div>
          </div>
          <div>
            <label class="text-slate-400 text-sm">数据速率</label>
            <div class="text-white mt-1">{{ currentSatellite.dataRate?.toFixed(2) }} Mbps</div>
          </div>
          <div>
            <label class="text-slate-400 text-sm">姿态类型</label>
            <div class="text-white mt-1">{{ currentSatellite.attitudeType || '-' }}</div>
          </div>
          <div>
            <label class="text-slate-400 text-sm">添加时间</label>
            <div class="text-white mt-1">{{ currentSatellite.addTime }}</div>
          </div>
          <div>
            <label class="text-slate-400 text-sm">更新时间</label>
            <div class="text-white mt-1">{{ currentSatellite.modTime }}</div>
          </div>
        </div>
        <div class="flex gap-3">
          <el-button type="primary" @click="handleMaintenance(currentSatellite)" v-if="currentSatellite.canUse === 1">
            进入维护
          </el-button>
          <el-button type="success" @click="handleActivate(currentSatellite)" v-if="currentSatellite.canUse === 0">
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
  Monitor,
  CircleCheck,
  Tools,
  TrendCharts
} from '@element-plus/icons-vue'
import { satelliteApi } from '@/api'

const loading = ref(false)
const searchKeyword = ref('')
const filterType = ref('')
const filterStatus = ref('')
const drawerVisible = ref(false)
const drawerTitle = ref('卫星详情')
const currentSatellite = ref(null)

const stats = ref({
  total: 0,
  active: 0,
  maintenance: 0,
  avgBattery: 0
})

const satellites = ref([])

const pagination = ref({
  currentPage: 1,
  pageSize: 10,
  total: 0
})

// 卫星类型映射
const satelliteTypeMap = {
  1: 'SAR卫星',
  2: '光学卫星',
  3: '红外卫星',
  4: '通信卫星',
  5: '导航卫星',
  6: '气象卫星'
}

// 获取卫星类型文本
const getSatelliteTypeText = (type) => {
  return satelliteTypeMap[type] || '未知类型'
}

// 类型颜色映射
const getTypeColor = (type) => {
  const colorMap = {
    1: 'primary',    // SAR
    2: 'success',    // 光学
    3: 'warning',    // 红外
    4: 'info',       // 通信
    5: 'danger',     // 导航
    6: ''            // 气象
  }
  return colorMap[type] || 'default'
}

// 状态颜色映射 (canUse: 1-可用, 0-不可用)
const getStatusColor = (canUse) => {
  return canUse === 1 ? 'success' : 'danger'
}

// 状态文本映射
const getStatusText = (canUse) => {
  return canUse === 1 ? '正常' : '离线'
}

// 过滤后的卫星数据
const filteredSatellites = computed(() => {
  let result = satellites.value
  
  if (searchKeyword.value) {
    const keyword = searchKeyword.value.toLowerCase()
    result = result.filter(item =>
      (item.satName?.toLowerCase().includes(keyword)) ||
      (item.satId?.toLowerCase().includes(keyword)) ||
      (item.satTleName?.toLowerCase().includes(keyword))
    )
  }
  
  if (filterType.value !== '') {
    result = result.filter(item => item.satType === filterType.value)
  }
  
  if (filterStatus.value) {
    if (filterStatus.value === 'active') {
      result = result.filter(item => item.canUse === 1)
    } else if (filterStatus.value === 'offline') {
      result = result.filter(item => item.canUse === 0)
    }
  }
  
  return result
})

// 加载数据
const loadData = async () => {
  loading.value = true
  try {
    const response = await satelliteApi.getList({
      page: pagination.value.currentPage,
      size: pagination.value.pageSize
    })
    
    if (response && response.records) {
      satellites.value = response.records
      pagination.value.total = response.total || response.records.length
      
      // 更新统计数据
      stats.value.total = pagination.value.total
      stats.value.active = satellites.value.filter(s => s.canUse === 1).length
      stats.value.maintenance = 0 // 后端目前没有维护状态字段
      const totalBattery = satellites.value.reduce((sum, s) => sum + (s.batteryCapacity || 0), 0)
      stats.value.avgBattery = satellites.value.length > 0 
        ? Math.round(totalBattery / satellites.value.length) 
        : 0
    } else if (Array.isArray(response)) {
      satellites.value = response
      pagination.value.total = response.length
      stats.value.total = response.length
      stats.value.active = response.filter(s => s.canUse === 1).length
      const totalBattery = response.reduce((sum, s) => sum + (s.batteryCapacity || 0), 0)
      stats.value.avgBattery = response.length > 0 
        ? Math.round(totalBattery / response.length) 
        : 0
    }
  } catch (error) {
    console.error('加载卫星数据失败:', error)
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

// 新增卫星
const handleAddSatellite = () => {
  ElMessage.info('新增卫星功能开发中')
}

// 查看卫星详情
const handleView = (row) => {
  currentSatellite.value = row
  drawerTitle.value = '卫星详情'
  drawerVisible.value = true
}

// 编辑卫星
const handleEdit = (row) => {
  ElMessage.info('编辑功能开发中')
}

// 删除卫星
const handleDelete = async (row) => {
  try {
    await ElMessageBox.confirm(`确定删除卫星"${row.satName}"吗？`, '警告', {
      type: 'warning',
      confirmButtonText: '删除',
      confirmButtonClass: 'el-button--danger'
    })
    await satelliteApi.delete(row.id)
    ElMessage.success('卫星已删除')
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
    await ElMessageBox.confirm(`确定将卫星"${row.satName}"设置为不可用状态吗？`, '确认', {
      type: 'warning'
    })
    await satelliteApi.update({ ...row, canUse: 0 })
    ElMessage.success('卫星状态已更新')
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
    await ElMessageBox.confirm(`确定恢复卫星"${row.satName}"为可用状态吗？`, '确认', {
      type: 'warning'
    })
    await satelliteApi.update({ ...row, canUse: 1 })
    ElMessage.success('卫星状态已更新')
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
.table-container {
  overflow-x: auto;
}

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

:deep(.el-table__fixed-right) {
  background-color: #1e293b;
}

:deep(.el-table__fixed-right .el-table__cell) {
  background-color: #1e293b !important;
}

:deep(.el-table__fixed-right::before) {
  background-color: #1e293b;
}

/* 固定列背景色 */
:deep(td.fixed-column-bg-right) {
  background-color: #0f172a !important;
}

:deep(th.fixed-column-bg-right) {
  background-color: #0f172a !important;
}

:deep(tr:hover td.fixed-column-bg-right) {
  background-color: #0f172a !important;
}

:deep(.el-progress-bar__outer) {
  background-color: rgba(30, 41, 59, 0.5);
}

:deep(.el-progress-bar__inner) {
  background: linear-gradient(90deg, #3b82f6, #22d3ee);
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
