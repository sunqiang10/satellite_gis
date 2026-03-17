<template>
  <div class="space-y-6">
    <!-- 页面标题 -->
    <div class="flex items-center justify-between">
      <div>
        <h2 class="text-2xl font-bold text-white">客户服务</h2>
        <p class="text-slate-400 mt-1">账单管理</p>
      </div>
      <div class="flex gap-3">
        <el-button @click="refreshData">
          <el-icon class="mr-2"><Refresh /></el-icon>
          刷新
        </el-button>
      </div>
    </div>

    <!-- 计费规则配置 -->
    <div class="glass-panel rounded-xl p-6">
      <div class="flex items-center justify-between mb-6">
        <h3 class="text-lg font-semibold text-white">计费规则配置</h3>
        <el-button type="primary" size="small" @click="showBillingRuleDialog">
          <el-icon class="mr-1"><Plus /></el-icon>
          修改规则
        </el-button>
      </div>
      
      <div class="grid grid-cols-3 gap-6">
        <!-- 按圈次计费 -->
        <div class="border border-slate-700 rounded-lg p-4">
          <div class="flex items-center justify-between mb-4">
            <div class="flex items-center gap-2">
              <div class="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                <el-icon :size="20" class="text-blue-400"><Refresh /></el-icon>
              </div>
              <div>
                <div class="text-white font-medium">按圈次计费</div>
                <div class="text-slate-400 text-xs">基于卫星圈次数量</div>
              </div>
            </div>
            <el-switch v-model="billingRules.orbit.enabled" />
          </div>
          <div class="space-y-3">
            <div class="flex items-center justify-between">
              <span class="text-slate-400 text-sm">基础费率</span>
              <span class="text-white font-medium">¥{{ billingRules.orbit.baseRate }}/圈次</span>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-slate-400 text-sm">服务类型系数</span>
              <el-tag size="small" type="info">可配置</el-tag>
            </div>
            <div class="pt-2 border-t border-slate-700">
              <div class="text-xs text-slate-500 mb-2">服务类型费率:</div>
              <div class="space-y-1">
                <div v-for="(rate, type) in billingRules.orbit.serviceRates" :key="type" 
                     class="flex items-center justify-between text-sm">
                  <span class="text-slate-400">{{ getServiceTypeText(type) }}</span>
                  <span class="text-sci-cyan">x{{ rate }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 按数据传输量计费 -->
        <div class="border border-slate-700 rounded-lg p-4">
          <div class="flex items-center justify-between mb-4">
            <div class="flex items-center gap-2">
              <div class="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center">
                <el-icon :size="20" class="text-green-400"><DataLine /></el-icon>
              </div>
              <div>
                <div class="text-white font-medium">按数据传输量计费</div>
                <div class="text-slate-400 text-xs">基于实际传输数据量</div>
              </div>
            </div>
            <el-switch v-model="billingRules.data.enabled" />
          </div>
          <div class="space-y-3">
            <div class="flex items-center justify-between">
              <span class="text-slate-400 text-sm">基础费率</span>
              <span class="text-white font-medium">¥{{ billingRules.data.baseRate }}/GB</span>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-slate-400 text-sm">阶梯优惠</span>
              <el-tag size="small" :type="billingRules.data.tieredPricing ? 'success' : 'info'">
                {{ billingRules.data.tieredPricing ? '已启用' : '未启用' }}
              </el-tag>
            </div>
            <div v-if="billingRules.data.tieredPricing" class="pt-2 border-t border-slate-700">
              <div class="text-xs text-slate-500 mb-2">阶梯费率:</div>
              <div class="space-y-1">
                <div v-for="(tier, index) in billingRules.data.tiers" :key="index" 
                     class="flex items-center justify-between text-sm">
                  <span class="text-slate-400">{{ tier.range }}</span>
                  <span class="text-sci-green">¥{{ tier.rate }}/GB</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 按服务类型计费 -->
        <div class="border border-slate-700 rounded-lg p-4">
          <div class="flex items-center justify-between mb-4">
            <div class="flex items-center gap-2">
              <div class="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
                <el-icon :size="20" class="text-purple-400"><Service /></el-icon>
              </div>
              <div>
                <div class="text-white font-medium">按服务类型计费</div>
                <div class="text-slate-400 text-xs">基于服务类型定价</div>
              </div>
            </div>
            <el-switch v-model="billingRules.service.enabled" />
          </div>
          <div class="space-y-3">
            <div class="pt-2">
              <div class="text-xs text-slate-500 mb-2">服务定价:</div>
              <div class="space-y-2">
                <div v-for="service in billingRules.service.types" :key="service.code" 
                     class="flex items-center justify-between p-2 rounded bg-slate-800/50">
                  <div class="flex items-center gap-2">
                    <el-icon :size="14" :class="service.iconColor">
                      <component :is="service.icon" />
                    </el-icon>
                    <span class="text-slate-300 text-sm">{{ service.name }}</span>
                  </div>
                  <span class="text-white font-medium">¥{{ service.price }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 圈次列表 -->
    <div class="glass-panel rounded-xl p-6">
      <!-- 标题区域 -->
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-lg font-semibold text-white whitespace-nowrap">圈次列表</h3>
      </div>

      <!-- 搜索区域 -->
      <div class="flex flex-nowrap items-center gap-4 mb-4 overflow-x-auto pb-2" style="min-width: max-content;">
        <div class="flex items-center gap-2 flex-shrink-0">
          <span class="text-sm text-slate-300 flex-shrink-0">状态</span>
          <el-select v-model="orbitFilter.status" placeholder="请选择" clearable style="width: 120px;">
            <el-option label="未执行" value="pending" />
            <el-option label="执行中" value="executing" />
            <el-option label="已执行" value="completed" />
          </el-select>
        </div>
        <div class="flex items-center gap-2 flex-shrink-0">
          <span class="text-sm text-slate-300 flex-shrink-0">卫星</span>
          <el-select v-model="orbitFilter.satellite" placeholder="请选择" clearable style="width: 160px;">
            <el-option
              v-for="sat in satelliteList"
              :key="sat.id"
              :label="sat.satName"
              :value="sat.satTleName"
            />
          </el-select>
        </div>
        <div class="flex items-center gap-2 flex-shrink-0">
          <span class="text-sm text-slate-300 flex-shrink-0">时间</span>
          <el-date-picker
            v-model="orbitFilter.dateRange"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            style="width: 280px;"
          />
        </div>
        <el-button type="primary" class="flex-shrink-0" @click="handleSearchOrbits">
          <el-icon class="mr-1"><Search /></el-icon>
          查询
        </el-button>
        <el-button type="primary" @click="handleGenerateBillFromOrbits" :disabled="selectedOrbits.length === 0">
          <el-icon class="mr-1"><Plus /></el-icon>
          生成账单 ({{ selectedOrbits.length }})
        </el-button>
      </div>

      <el-table
        ref="orbitTableRef"
        :data="filteredOrbits"
        v-loading="orbitLoading"
        style="width: 100%"
        height="600px"
        row-key="id"
        :reserve-selection="true"
        @select="handleSelect"
        @select-all="handleSelectAll"
      >
        <el-table-column type="selection" width="55" fixed />
        <el-table-column prop="orbitNumber" label="圈号" min-width="80" fixed>
          <template #default="{ row }">
            <span class="text-white font-medium">{{ row.orbitNumber }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="satelliteName" label="卫星" min-width="120" fixed>
          <template #default="{ row }">
            <span class="text-slate-300">{{ row.satelliteName }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="deviceName" label="设备名称" min-width="140" show-overflow-tooltip>
          <template #default="{ row }">
            <span class="text-slate-300">{{ row.deviceName }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="taskType" label="任务类型" min-width="100">
          <template #default="{ row }">
            <el-tag size="small" :type="getTaskTypeTag(row.taskType)">
              {{ row.taskType }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="orbitTime" label="圈次时间" min-width="180">
          <template #default="{ row }">
            <span class="text-slate-300">{{ row.orbitTime }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="trackDuration" label="跟踪时长" min-width="100">
          <template #default="{ row }">
            <span class="text-slate-300">{{ row.trackDuration }}s</span>
          </template>
        </el-table-column>
        <el-table-column prop="dataAmount" label="数据量" min-width="100">
          <template #default="{ row }">
            <span class="text-sci-cyan">{{ row.dataAmount }} GB</span>
          </template>
        </el-table-column>
        <el-table-column prop="billingAmount" label="计费金额" min-width="120">
          <template #default="{ row }">
            <span class="text-sci-green font-medium">¥{{ row.billingAmount.toFixed(2) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" min-width="90" fixed="right">
          <template #default="{ row }">
            <el-tag :type="getOrbitStatusType(row.status)" size="small">
              {{ getOrbitStatusText(row.status) }}
            </el-tag>
          </template>
        </el-table-column>
      </el-table>

      <div class="flex items-center justify-between mt-4">
        <div class="text-slate-400 text-sm">
          已选择 {{ selectedOrbits.length }} 条圈次，预计金额: 
          <span class="text-sci-cyan font-bold">¥{{ selectedOrbitsTotal.toFixed(2) }}</span>
        </div>
        <el-pagination
          v-model:current-page="orbitPagination.current"
          v-model:page-size="orbitPagination.size"
          :total="orbitPagination.total"
          :page-sizes="[10, 20, 50, 100]"
          layout="sizes, prev, pager, next, jumper"
          background
        />
      </div>
    </div>

    <!-- 账单列表 -->
    <div class="glass-panel rounded-xl p-6">
      <!-- 标题区域 -->
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-lg font-semibold text-white whitespace-nowrap">账单列表</h3>
      </div>

      <!-- 搜索区域 -->
      <div class="flex flex-nowrap items-center gap-4 mb-4 overflow-x-auto pb-2" style="min-width: max-content;">
        <div class="flex items-center gap-2 flex-shrink-0">
          <span class="text-sm text-slate-300 flex-shrink-0">状态</span>
          <el-select v-model="billFilter.status" placeholder="请选择" clearable style="width: 120px;">
            <el-option label="待支付" value="pending" />
            <el-option label="已支付" value="paid" />
            <el-option label="已逾期" value="overdue" />
          </el-select>
        </div>
        <div class="flex items-center gap-2 flex-shrink-0">
          <span class="text-sm text-slate-300 flex-shrink-0">时间</span>
          <el-date-picker
            v-model="billFilter.dateRange"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            style="width: 280px;"
          />
        </div>
        <el-button type="primary" class="flex-shrink-0" @click="handleSearchBills">
          <el-icon class="mr-1"><Search /></el-icon>
          查询
        </el-button>
      </div>
      
      <el-table :data="filteredBills" style="width: 100%" max-height="400">
        <el-table-column prop="billNo" label="账单编号" width="150" />
        <el-table-column prop="customer" label="客户名称" width="150" />
        <el-table-column prop="period" label="计费周期" width="180" />
        <el-table-column prop="totalAmount" label="金额" width="120">
          <template #default="{ row }">
            <span class="text-sci-cyan font-medium">¥{{ row.totalAmount.toFixed(2) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="items" label="计费项目" min-width="200">
          <template #default="{ row }">
            <div class="flex flex-wrap gap-1">
              <el-tag v-for="item in row.items" :key="item.type" size="small" :type="getItemType(item.type)">
                {{ item.name }}: {{ item.count }}{{ item.unit }}
              </el-tag>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="getBillStatusType(row.status)" size="small">
              {{ getBillStatusText(row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180" fixed="right">
          <template #default="{ row }">
            <el-button text type="primary" size="small" @click="viewBillDetail(row)">详情</el-button>
            <el-dropdown trigger="click">
              <el-button text size="small">
                <el-icon><Download /></el-icon>
              </el-button>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item @click="exportBill(row, 'excel')">
                    <el-icon class="mr-2"><Document /></el-icon>导出 Excel
                  </el-dropdown-item>
                  <el-dropdown-item @click="exportBill(row, 'pdf')">
                    <el-icon class="mr-2"><DocumentChecked /></el-icon>导出 PDF
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </template>
        </el-table-column>
      </el-table>

      <div class="flex justify-end mt-4">
        <el-pagination
          v-model:current-page="pagination.current"
          v-model:page-size="pagination.size"
          :total="pagination.total"
          :page-sizes="[10, 20, 50, 100]"
          layout="total, sizes, prev, pager, next"
        />
      </div>
    </div>

    <!-- 底部保留区域：测试结果、问题列表、质量趋势分析 -->
    <div class="grid grid-cols-2 gap-6">
      <div class="glass-panel rounded-xl p-6">
        <div class="flex items-center justify-between mb-6 flex-nowrap gap-4">
          <h3 class="text-lg font-semibold text-white whitespace-nowrap flex-shrink-0">测试结果</h3>
          <el-select v-model="testFilter" placeholder="筛选结果" clearable class="w-32">
            <el-option label="通过" value="pass" />
            <el-option label="警告" value="warning" />
            <el-option label="失败" value="fail" />
          </el-select>
        </div>
        <el-table :data="filteredTestResults" style="width: 100%" max-height="300">
          <el-table-column prop="testName" label="测试名称" min-width="150" />
          <el-table-column prop="satellite" label="卫星" width="120" />
          <el-table-column prop="result" label="结果" width="80">
            <template #default="{ row }">
              <el-tag :type="getResultType(row.result)" size="small">
                {{ getResultText(row.result) }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="score" label="分数" width="80">
            <template #default="{ row }">
              <span :class="getScoreClass(row.score)">{{ row.score }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="date" label="测试日期" width="120" />
        </el-table>
      </div>

      <div class="glass-panel rounded-xl p-6">
        <div class="flex items-center justify-between mb-6 flex-nowrap gap-4">
          <h3 class="text-lg font-semibold text-white whitespace-nowrap flex-shrink-0">问题列表</h3>
          <el-select v-model="issueFilter" placeholder="筛选问题" clearable class="w-32">
            <el-option label="高" value="high" />
            <el-option label="中" value="medium" />
            <el-option label="低" value="low" />
          </el-select>
        </div>
        <div class="space-y-4 max-h-[300px] overflow-y-auto">
          <div v-for="issue in filteredIssues" :key="issue.id" class="p-4 rounded-lg border border-slate-700 hover:border-slate-600 transition-colors">
            <div class="flex items-start justify-between mb-2">
              <div class="flex items-center gap-2">
                <el-tag :type="getSeverityType(issue.severity)" size="small">
                  {{ getSeverityText(issue.severity) }}
                </el-tag>
                <span class="text-white font-medium">{{ issue.title }}</span>
              </div>
              <el-tag :type="getIssueStatusType(issue.status)" size="small">
                {{ getIssueStatusText(issue.status) }}
              </el-tag>
            </div>
            <p class="text-slate-400 text-sm mb-2">{{ issue.description }}</p>
            <div class="flex items-center justify-between text-xs text-slate-500">
              <span>卫星: {{ issue.satellite }}</span>
              <span>{{ issue.createdAt }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="glass-panel rounded-xl p-6">
      <h3 class="text-lg font-semibold text-white mb-6 whitespace-nowrap">质量趋势分析</h3>
      <div class="grid grid-cols-2 gap-6">
        <div>
          <h4 class="text-sm font-medium text-slate-400 mb-4">质量趋势</h4>
          <div ref="trendChartRef" class="echart-container h-56"></div>
        </div>
        <div>
          <h4 class="text-sm font-medium text-slate-400 mb-4">任务完成统计</h4>
          <div ref="taskChartRef" class="echart-container h-56"></div>
        </div>
        <div>
          <h4 class="text-sm font-medium text-slate-400 mb-4">任务类型分布</h4>
          <div ref="typeChartRef" class="echart-container h-56"></div>
        </div>
        <div>
          <h4 class="text-sm font-medium text-slate-400 mb-4">费用统计</h4>
          <div ref="costChartRef" class="echart-container h-56"></div>
        </div>
      </div>
    </div>

    <!-- 生成账单对话框 -->
    <el-dialog v-model="generateDialogVisible" title="自动生成账单" width="600px">
      <el-form :model="generateForm" label-width="100px">
        <el-form-item label="客户">
          <el-select v-model="generateForm.customer" placeholder="选择客户" class="w-full">
            <el-option v-for="customer in customers" :key="customer.id" :label="customer.name" :value="customer.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="计费周期">
          <el-date-picker
            v-model="generateForm.period"
            type="monthrange"
            range-separator="至"
            start-placeholder="开始月份"
            end-placeholder="结束月份"
            class="w-full"
          />
        </el-form-item>
        <el-form-item label="计费方式">
          <el-checkbox-group v-model="generateForm.billingMethods">
            <el-checkbox label="orbit">按圈次</el-checkbox>
            <el-checkbox label="data">按数据量</el-checkbox>
            <el-checkbox label="service">按服务类型</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="任务记录">
          <div class="border border-slate-700 rounded-lg p-4 max-h-40 overflow-y-auto">
            <el-table :data="taskRecords" size="small" style="width: 100%">
              <el-table-column prop="date" label="日期" width="100" />
              <el-table-column prop="taskName" label="任务名称" />
              <el-table-column prop="serviceType" label="服务类型" width="100" />
              <el-table-column prop="amount" label="数据量" width="100">
                <template #default="{ row }">
                  <span v-if="row.dataAmount">{{ row.dataAmount }} GB</span>
                  <span v-else-if="row.orbitCount">{{ row.orbitCount }} 圈</span>
                  <span v-else>-</span>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="generateDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="confirmGenerateBills" :loading="generating">
          生成账单
        </el-button>
      </template>
    </el-dialog>

    <!-- 计费规则配置对话框 -->
    <el-dialog v-model="ruleDialogVisible" title="配置计费规则" width="500px">
      <el-tabs v-model="activeRuleTab">
        <el-tab-pane label="按圈次" name="orbit">
          <el-form :model="billingRules.orbit" label-width="100px">
            <el-form-item label="启用">
              <el-switch v-model="billingRules.orbit.enabled" />
            </el-form-item>
            <el-form-item label="基础费率">
              <el-input-number v-model="billingRules.orbit.baseRate" :min="0" :precision="2" class="w-full" />
            </el-form-item>
            <el-form-item label="测控服务系数">
              <el-input-number v-model="billingRules.orbit.serviceRates.ttc" :min="0" :precision="2" />
            </el-form-item>
            <el-form-item label="数据传输系数">
              <el-input-number v-model="billingRules.orbit.serviceRates.data" :min="0" :precision="2" />
            </el-form-item>
            <el-form-item label="成像服务系数">
              <el-input-number v-model="billingRules.orbit.serviceRates.imaging" :min="0" :precision="2" />
            </el-form-item>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="按数据量" name="data">
          <el-form :model="billingRules.data" label-width="100px">
            <el-form-item label="启用">
              <el-switch v-model="billingRules.data.enabled" />
            </el-form-item>
            <el-form-item label="基础费率">
              <el-input-number v-model="billingRules.data.baseRate" :min="0" :precision="2" class="w-full" />
            </el-form-item>
            <el-form-item label="阶梯优惠">
              <el-switch v-model="billingRules.data.tieredPricing" />
            </el-form-item>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="按服务" name="service">
          <el-form :model="billingRules.service" label-width="100px">
            <el-form-item label="启用">
              <el-switch v-model="billingRules.service.enabled" />
            </el-form-item>
          </el-form>
          <div class="space-y-3">
            <div v-for="service in billingRules.service.types" :key="service.code" class="flex items-center gap-3 p-3 border border-slate-700 rounded-lg">
              <span class="text-slate-300 flex-1">{{ service.name }}</span>
              <el-input-number v-model="service.price" :min="0" :precision="2" size="small" />
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
      <template #footer>
        <el-button @click="ruleDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="saveBillingRules">保存</el-button>
      </template>
    </el-dialog>

    <!-- 账单详情对话框 -->
    <el-dialog v-model="detailDialogVisible" title="账单详情" width="700px">
      <div v-if="selectedBill" class="space-y-6">
        <div class="flex items-center justify-between pb-4 border-b border-slate-700">
          <div>
            <div class="text-slate-400 text-sm">账单编号</div>
            <div class="text-white text-lg font-medium">{{ selectedBill.billNo }}</div>
          </div>
          <el-tag :type="getBillStatusType(selectedBill.status)" size="large">
            {{ getBillStatusText(selectedBill.status) }}
          </el-tag>
        </div>
        
        <div class="grid grid-cols-2 gap-6">
          <div>
            <div class="text-slate-400 text-sm mb-1">客户名称</div>
            <div class="text-white">{{ selectedBill.customer }}</div>
          </div>
          <div>
            <div class="text-slate-400 text-sm mb-1">计费周期</div>
            <div class="text-white">{{ selectedBill.period }}</div>
          </div>
        </div>

        <div>
          <div class="text-slate-400 text-sm mb-3">计费明细</div>
          <el-table :data="selectedBill.items" style="width: 100%">
            <el-table-column prop="name" label="项目" />
            <el-table-column prop="count" label="数量" width="100">
              <template #default="{ row }">
                {{ row.count }} {{ row.unit }}
              </template>
            </el-table-column>
            <el-table-column prop="unitPrice" label="单价" width="120">
              <template #default="{ row }">
                ¥{{ row.unitPrice.toFixed(2) }}
              </template>
            </el-table-column>
            <el-table-column prop="amount" label="金额" width="120">
              <template #default="{ row }">
                <span class="text-sci-cyan">¥{{ row.amount.toFixed(2) }}</span>
              </template>
            </el-table-column>
          </el-table>
        </div>

        <div class="flex items-center justify-end pt-4 border-t border-slate-700">
          <div class="text-right">
            <div class="text-slate-400 text-sm">总计金额</div>
            <div class="text-2xl font-bold text-sci-cyan">¥{{ selectedBill.totalAmount.toFixed(2) }}</div>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount, watch, nextTick, shallowRef } from 'vue'
import { ElMessage } from 'element-plus'
import {
  Plus,
  Refresh,
  Download,
  Document,
  DocumentChecked,
  DataLine,
  Service,
  ArrowUp,
  ArrowDown,
  Minus,
  Search
} from '@element-plus/icons-vue'
import * as echarts from 'echarts'
import * as XLSX from 'xlsx'
import { jsPDF } from 'jspdf'
import autoTable from 'jspdf-autotable'
import html2canvas from 'html2canvas'
import { availableSegmentsApi, satelliteApi } from '@/api'

const trendChartRef = ref(null)
const taskChartRef = ref(null)
const typeChartRef = ref(null)
const costChartRef = ref(null)
const trendChart = shallowRef(null)
const taskChart = shallowRef(null)
const typeChart = shallowRef(null)
const costChart = shallowRef(null)

// 圈次表格引用
const orbitTableRef = ref(null)

// 筛选条件
const testFilter = ref('')
const issueFilter = ref('')
const billFilter = ref({
  status: '',
  dateRange: null
})

// 圈次列表筛选
const orbitFilter = ref({
  status: '',
  satellite: '',
  dateRange: null
})

// 圈次列表搜索参数（点击查询按钮后生效）
const orbitSearchParams = ref({
  status: '',
  satellite: '',
  dateRange: null
})

// 账单列表搜索参数（点击查询按钮后生效）
const billSearchParams = ref({
  status: '',
  dateRange: null
})

// 分页
const pagination = ref({
  current: 1,
  size: 10,
  total: 0
})

// 圈次列表分页
const orbitPagination = ref({
  current: 1,
  size: 20,
  total: 0
})

// 选中的圈次（用于存储所有页面的选择）
const selectedOrbits = ref([])
const selectedOrbitIds = ref(new Set())

// 对话框显示状态
const generateDialogVisible = ref(false)
const ruleDialogVisible = ref(false)
const detailDialogVisible = ref(false)
const activeRuleTab = ref('orbit')
const generating = ref(false)

// 表单数据
const generateForm = ref({
  customer: '',
  period: null,
  billingMethods: ['orbit', 'data', 'service']
})

const selectedBill = ref(null)

// 计费规则
const billingRules = ref({
  orbit: {
    enabled: true,
    baseRate: 500.00,
    serviceRates: {
      ttc: 1.0,
      data: 1.2,
      imaging: 1.5
    }
  },
  data: {
    enabled: false,
    baseRate: 50.00,
    tieredPricing: true,
    tiers: [
      { range: '0-100 GB', rate: 50.00 },
      { range: '101-500 GB', rate: 45.00 },
      { range: '501-1000 GB', rate: 40.00 },
      { range: '> 1000 GB', rate: 35.00 }
    ]
  },
  service: {
    enabled: false,
    types: [
      { code: 'ttc', name: '测控服务', price: 800.00, icon: 'Refresh', iconColor: 'text-blue-400' },
      { code: 'data', name: '数据传输', price: 600.00, icon: 'DataLine', iconColor: 'text-green-400' },
      { code: 'imaging', name: '成像服务', price: 1200.00, icon: 'Camera', iconColor: 'text-purple-400' },
      { code: 'emergency', name: '应急服务', price: 2000.00, icon: 'Warning', iconColor: 'text-red-400' }
    ]
  }
})

// 客户列表
const customers = ref([
  { id: 1, name: '中国航天科技集团' },
  { id: 2, name: '中科院空间中心' },
  { id: 3, name: '国家卫星气象中心' },
  { id: 4, name: '航天科工集团' }
])

// 任务记录
const taskRecords = ref([
  { date: '2026-01-15', taskName: 'SZ-01测控任务', serviceType: '测控', orbitCount: 3, dataAmount: null },
  { date: '2026-01-16', taskName: '高分数据传输', serviceType: '数据', orbitCount: null, dataAmount: 256.5 },
  { date: '2026-01-18', taskName: '应急成像任务', serviceType: '成像', orbitCount: 2, dataAmount: 128.0 },
  { date: '2026-01-20', taskName: '北斗测控任务', serviceType: '测控', orbitCount: 5, dataAmount: null }
])

// 圈次列表数据
const orbits = ref([])
const orbitLoading = ref(false)

// 卫星列表数据（用于显示卫星名称）
const satelliteList = ref([])
const satelliteMap = ref(new Map())

// 加载卫星列表
const loadSatelliteList = async () => {
  try {
    const response = await satelliteApi.getList({})
    if (response && response.records) {
      satelliteList.value = response.records
    } else if (Array.isArray(response)) {
      satelliteList.value = response
    } else if (response && response.data) {
      satelliteList.value = response.data.records || response.data
    }
    
    // 构建卫星ID到名称的映射
    const map = new Map()
    satelliteList.value.forEach(sat => {
      map.set(sat.satTleName, sat.satName)
      map.set(sat.id?.toString(), sat.satName)
    })
    satelliteMap.value = map
  } catch (error) {
    console.error('加载卫星列表失败:', error)
  }
}

// 获取卫星名称
const getSatelliteName = (satelliteId) => {
  if (!satelliteId) return '-'
  return satelliteMap.value.get(satelliteId) || satelliteId
}

// 转换后端 AvailableSegments 数据为前端圈次格式
const transformSegmentsToOrbits = (segments) => {
  if (!Array.isArray(segments)) return []
  
  return segments.map((item, index) => {
    // 解析任务模式
    let taskType = '测控'
    if (item.taskMode) {
      if (item.taskMode.includes('TK') && item.taskMode.includes('DT')) {
        taskType = '测控数传'
      } else if (item.taskMode.includes('DT')) {
        taskType = '数传'
      } else if (item.taskMode.includes('TK')) {
        taskType = '测控'
      }
    }
    
    // 计算跟踪时长（秒）
    let trackDuration = 120
    if (item.accessStartTime && item.accessEndTime) {
      try {
        const start = new Date(item.accessStartTime.replace('T', ' '))
        const end = new Date(item.accessEndTime.replace('T', ' '))
        trackDuration = Math.floor((end - start) / 1000)
      } catch (e) {
        trackDuration = 120
      }
    }
    
    // 计算数据量（模拟）
    const dataAmount = (50 + Math.random() * 200).toFixed(2)
    
    // 计算计费金额
    let billingAmount = 0
    if (billingRules.value.orbit.enabled) {
      const baseRate = billingRules.value.orbit.baseRate
      let coefficient = 1.0
      if (taskType === '测控数传') coefficient = billingRules.value.orbit.serviceRates.data
      else if (taskType === '测控') coefficient = billingRules.value.orbit.serviceRates.ttc
      billingAmount = baseRate * coefficient
    }
    
    // 根据当前时间和 access 时间判断状态
    // 当前时间在 accessStartTime 和 accessEndTime 之间 → 执行中
    // 当前时间在 accessStartTime 之前 → 未执行
    // 当前时间在 accessEndTime 之后 → 已执行
    let status = 'pending'
    const now = new Date()
    if (item.accessStartTime && item.accessEndTime) {
      try {
        const startTime = new Date(item.accessStartTime.replace('T', ' '))
        const endTime = new Date(item.accessEndTime.replace('T', ' '))
        if (now >= startTime && now <= endTime) {
          status = 'executing'
        } else if (now > endTime) {
          status = 'completed'
        } else {
          status = 'pending'
        }
      } catch (e) {
        status = 'pending'
      }
    }
    
    // 使用卫星表中的卫星名称
    const satelliteName = getSatelliteName(item.satellite)
    
    return {
      id: item.id || index + 1,
      orbitNumber: item.circleId || String(14400 + index),
      satelliteName: satelliteName,
      deviceName: item.antenna || '-',
      taskType: taskType,
      orbitTime: item.accessStartTime ? item.accessStartTime.replace('T', ' ') : '-',
      trackDuration: trackDuration,
      dataAmount: dataAmount,
      billingAmount: billingAmount,
      status: status,
      _raw: item
    }
  })
}

// 从后端加载圈次数据
const loadOrbitData = async () => {
  orbitLoading.value = true
  try {
    // 构建查询参数 - 只查询已申请的圈次(status=2)
    const params = {
      pageNum: orbitPagination.value.current,
      pageSize: orbitPagination.value.size,
      satellite: orbitSearchParams.value.satellite || '',
      antenna: '',
      circleId: '',
      status: '2',
      startTime: orbitSearchParams.value.dateRange?.[0] || '',
      endTime: orbitSearchParams.value.dateRange?.[1] || ''
    }

    const response = await availableSegmentsApi.getList(params)
    
      let segments = []
    if (response && response.records) {
      segments = response.records
      orbitPagination.value.total = response.total || 0
    } else if (Array.isArray(response)) {
      segments = response
      orbitPagination.value.total = segments.length
    } else if (response && response.data) {
      segments = response.data.records || response.data
      orbitPagination.value.total = response.data.total || segments.length
    }
    
    orbits.value = transformSegmentsToOrbits(segments)
    
    // 恢复选中状态
    await nextTick(() => {
      restoreSelection()
    })
  } catch (error) {
    console.error('加载圈次数据失败:', error)
    ElMessage.error('加载圈次数据失败: ' + (error.message || '未知错误'))
    orbits.value = []
    orbitPagination.value.total = 0
  } finally {
    orbitLoading.value = false
  }
}

// 生成圈次数据（保留用于降级）
const generateOrbitData = () => {
  const devices = [
    '阿塞拜疆0751-S/X',
    '七台河1201-X/Ka',
    '威海0751-X',
    '佳木斯1301-X/S',
    '三亚0451-S/X'
  ]
  const taskTypes = ['测控数传', '数传', '测控']
  const satellites = ['四象爱数AS01', '四象爱数AS02']
  
  const data = []
  for (let i = 0; i < 50; i++) {
    const device = devices[i % devices.length]
    const taskType = taskTypes[i % 3]
    const satellite = satellites[i % 2]
    const orbitNum = 14400 + i
    const dataAmount = 50 + Math.random() * 200
    const duration = 120 + Math.floor(Math.random() * 300)
    
    // 计算计费金额
    let billingAmount = 0
    if (billingRules.value.orbit.enabled) {
      const baseRate = billingRules.value.orbit.baseRate
      let coefficient = 1.0
      if (taskType === '测控数传') coefficient = billingRules.value.orbit.serviceRates.data
      else if (taskType === '测控') coefficient = billingRules.value.orbit.serviceRates.ttc
      billingAmount = baseRate * coefficient
    }
    
    data.push({
      id: i + 1,
      orbitNumber: String(orbitNum),
      satelliteName: satellite,
      deviceName: device,
      taskType: taskType,
      orbitTime: `2026-02-${13 + Math.floor(i/10)} ${8 + Math.floor(i/5)}:${10 + (i%5)*10}:00`,
      trackDuration: duration,
      dataAmount: dataAmount.toFixed(2),
      billingAmount: billingAmount,
      status: i % 3 === 0 ? 'billed' : 'pending'
    })
  }
  return data
}

// 账单数据
const bills = ref([
  {
    billNo: 'BILL-2026-001',
    customer: '中国航天科技集团',
    period: '2026年1月',
    totalAmount: 15800.00,
    status: 'pending',
    items: [
      { type: 'orbit', name: '圈次计费', count: 15, unit: '圈', unitPrice: 500.00, amount: 7500.00 },
      { type: 'data', name: '数据传输', count: 256, unit: 'GB', unitPrice: 50.00, amount: 12800.00 },
      { type: 'service', name: '测控服务', count: 8, unit: '次', unitPrice: 800.00, amount: 6400.00 }
    ]
  },
  {
    billNo: 'BILL-2026-002',
    customer: '中科院空间中心',
    period: '2026年1月',
    totalAmount: 12500.00,
    status: 'paid',
    items: [
      { type: 'orbit', name: '圈次计费', count: 10, unit: '圈', unitPrice: 500.00, amount: 5000.00 },
      { type: 'data', name: '数据传输', count: 150, unit: 'GB', unitPrice: 50.00, amount: 7500.00 }
    ]
  },
  {
    billNo: 'BILL-2026-003',
    customer: '国家卫星气象中心',
    period: '2026年1月',
    totalAmount: 28000.00,
    status: 'pending',
    items: [
      { type: 'service', name: '成像服务', count: 20, unit: '次', unitPrice: 1200.00, amount: 24000.00 },
      { type: 'data', name: '数据传输', count: 80, unit: 'GB', unitPrice: 50.00, amount: 4000.00 }
    ]
  }
])

// 底部数据
const indicators = ref([])
const testResults = ref([])
const issues = ref([])

// 计算属性
const filteredBills = computed(() => {
  let result = bills.value
  if (billSearchParams.value.status) {
    result = result.filter(bill => bill.status === billSearchParams.value.status)
  }
  if (billSearchParams.value.dateRange && billSearchParams.value.dateRange.length === 2) {
    // 日期筛选逻辑
  }
  return result
})

// 圈次列表筛选 - 现在由后端处理分页和筛选
const filteredOrbits = computed(() => {
  // 前端只根据状态筛选（如果选择了已执行/未执行）
  let result = orbits.value
  if (orbitSearchParams.value.status) {
    result = result.filter(orbit => orbit.status === orbitSearchParams.value.status)
  }
  return result
})

// 选中圈次的总金额
const selectedOrbitsTotal = computed(() => {
  return selectedOrbits.value.reduce((sum, orbit) => sum + orbit.billingAmount, 0)
})

const filteredTestResults = computed(() => {
  if (!testFilter.value) return testResults.value
  return testResults.value.filter(result => result.result === testFilter.value)
})

const filteredIssues = computed(() => {
  if (!issueFilter.value) return issues.value
  return issues.value.filter(issue => issue.severity === issueFilter.value)
})

// 方法
const getServiceTypeText = (type) => {
  const map = { ttc: '测控服务', data: '数据传输', imaging: '成像服务' }
  return map[type] || type
}

const getBillStatusType = (status) => {
  const map = { pending: 'warning', paid: 'success', overdue: 'danger' }
  return map[status] || 'info'
}

const getBillStatusText = (status) => {
  const map = { pending: '待支付', paid: '已支付', overdue: '已逾期' }
  return map[status] || status
}

const getItemType = (type) => {
  const map = { orbit: 'primary', data: 'success', service: 'warning' }
  return map[type] || 'info'
}

const getResultType = (result) => {
  const map = { pass: 'success', warning: 'warning', fail: 'danger' }
  return map[result] || 'default'
}

const getResultText = (result) => {
  const map = { pass: '通过', warning: '警告', fail: '失败' }
  return map[result] || '未知'
}

const getScoreClass = (score) => {
  if (score >= 90) return 'text-sci-green'
  if (score >= 80) return 'text-sci-amber'
  return 'text-sci-red'
}

const getSeverityType = (severity) => {
  const map = { high: 'danger', medium: 'warning', low: 'info' }
  return map[severity] || 'default'
}

const getSeverityText = (severity) => {
  const map = { high: '高', medium: '中', low: '低' }
  return map[severity] || '未知'
}

// 圈次列表方法
const getTaskTypeTag = (type) => {
  const map = { '测控数传': 'success', '数传': 'primary', '测控': 'warning' }
  return map[type] || 'info'
}

// 获取圈次状态类型（用于el-tag的type属性）
// pending=未执行, executing=执行中, completed=已执行
const getOrbitStatusType = (status) => {
  const map = { pending: 'warning', executing: 'primary', completed: 'success' }
  return map[status] || 'info'
}

// 获取圈次状态文本
const getOrbitStatusText = (status) => {
  const map = { pending: '未执行', executing: '执行中', completed: '已执行' }
  return map[status] || status
}

// 处理单行选择
const handleSelect = (selection, row) => {
  if (selectedOrbitIds.value.has(row.id)) {
    selectedOrbitIds.value.delete(row.id)
  } else {
    selectedOrbitIds.value.add(row.id)
  }
  updateSelectedOrbits()
}

// 处理全选
const handleSelectAll = (selection) => {
  const currentPageIds = filteredOrbits.value.map(orbit => orbit.id)
  if (selection.length === 0) {
    // 取消全选，移除当前页所有数据
    currentPageIds.forEach(id => selectedOrbitIds.value.delete(id))
  } else {
    // 全选，添加当前页所有数据
    currentPageIds.forEach(id => selectedOrbitIds.value.add(id))
  }
  updateSelectedOrbits()
}

// 更新选中的圈次列表
const updateSelectedOrbits = () => {
  selectedOrbits.value = orbits.value.filter(orbit => selectedOrbitIds.value.has(orbit.id))
}

// 恢复选中状态（在翻页后调用）
const restoreSelection = () => {
  if (!orbitTableRef.value) return
  filteredOrbits.value.forEach(orbit => {
    if (selectedOrbitIds.value.has(orbit.id)) {
      orbitTableRef.value.toggleRowSelection(orbit, true)
    }
  })
}

// 查询圈次列表
const handleSearchOrbits = () => {
  // 将筛选条件复制到搜索参数
  orbitSearchParams.value = { ...orbitFilter.value }
  // 重置到第一页
  orbitPagination.value.current = 1
  // 从后端加载数据
  loadOrbitData()
}

// 查询账单列表
const handleSearchBills = () => {
  // 将筛选条件复制到搜索参数
  billSearchParams.value = { ...billFilter.value }
  // 重置到第一页
  pagination.value.current = 1
  ElMessage.success('查询成功')
}

const handleGenerateBillFromOrbits = () => {
  if (selectedOrbits.value.length === 0) {
    ElMessage.warning('请先选择圈次')
    return
  }
  
  // 生成新账单
  const totalAmount = selectedOrbitsTotal.value
  const newBill = {
    billNo: `BILL-2026-${String(bills.value.length + 1).padStart(3, '0')}`,
    customer: '当前客户',
    period: '2026年2月',
    totalAmount: totalAmount,
    status: 'pending',
    items: [
      { 
        type: 'orbit', 
        name: '圈次计费', 
        count: selectedOrbits.value.length, 
        unit: '圈', 
        unitPrice: billingRules.value.orbit.baseRate, 
        amount: totalAmount 
      }
    ]
  }
  
  bills.value.unshift(newBill)
  
  // 更新圈次状态
  selectedOrbits.value.forEach(orbit => {
    const index = orbits.value.findIndex(o => o.id === orbit.id)
    if (index !== -1) {
      orbits.value[index].status = 'billed'
    }
  })
  
  // 清空选择
  selectedOrbits.value = []
  selectedOrbitIds.value.clear()
  // 清空表格的选中状态
  orbitTableRef.value?.clearSelection()
  
  ElMessage.success(`成功生成账单 ${newBill.billNo}，金额：¥${totalAmount.toFixed(2)}`)
}

const getIssueStatusType = (status) => {
  const map = { open: 'danger', in_progress: 'warning', resolved: 'success' }
  return map[status] || 'default'
}

const getIssueStatusText = (status) => {
  const map = { open: '待处理', in_progress: '处理中', resolved: '已解决' }
  return map[status] || '未知'
}

const handleGenerateBills = () => {
  generateForm.value = {
    customer: '',
    period: null,
    billingMethods: ['orbit', 'data', 'service']
  }
  generateDialogVisible.value = true
}

const confirmGenerateBills = async () => {
  if (!generateForm.value.customer || !generateForm.value.period) {
    ElMessage.warning('请填写完整的账单信息')
    return
  }
  
  generating.value = true
  // 模拟生成账单
  setTimeout(() => {
    const customer = customers.value.find(c => c.id === generateForm.value.customer)
    const newBill = {
      billNo: `BILL-2026-${String(bills.value.length + 1).padStart(3, '0')}`,
      customer: customer.name,
      period: '2026年2月',
      totalAmount: 15000.00 + Math.random() * 10000,
      status: 'pending',
      items: [
        { type: 'orbit', name: '圈次计费', count: 12, unit: '圈', unitPrice: 500.00, amount: 6000.00 },
        { type: 'data', name: '数据传输', count: 180, unit: 'GB', unitPrice: 50.00, amount: 9000.00 }
      ]
    }
    bills.value.unshift(newBill)
    generating.value = false
    generateDialogVisible.value = false
    ElMessage.success('账单生成成功')
  }, 1500)
}

const showBillingRuleDialog = () => {
  ruleDialogVisible.value = true
}

const saveBillingRules = () => {
  ruleDialogVisible.value = false
  ElMessage.success('计费规则保存成功')
}

const viewBillDetail = (bill) => {
  selectedBill.value = bill
  detailDialogVisible.value = true
}

const exportBill = async (bill, format) => {
  if (format === 'excel') {
    // 导出为 Excel
    const data = [
      ['账单编号', bill.billNo],
      ['客户', bill.customer],
      ['周期', bill.period],
      ['状态', bill.status === 'paid' ? '已支付' : '待支付'],
      ['', ''],
      ['项目', '数量', '单位', '单价', '金额']
    ]
    
    bill.items.forEach(item => {
      data.push([item.name, item.count, item.unit, item.unitPrice, item.amount])
    })
    
    data.push(['', '', '', '', ''])
    data.push(['总计', '', '', '', bill.totalAmount])
    
    const ws = XLSX.utils.aoa_to_sheet(data)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, '账单')
    XLSX.writeFile(wb, `${bill.billNo}.xlsx`)
    
    ElMessage.success('Excel 导出成功')
  } else if (format === 'pdf') {
    // 导出为 PDF（使用 html2canvas 解决中文乱码）
    const pdfContent = document.createElement('div')
    pdfContent.style.cssText = `
      position: fixed;
      left: -9999px;
      top: 0;
      width: 210mm;
      min-height: 297mm;
      padding: 20mm;
      background: white;
      font-family: 'SimSun', 'Microsoft YaHei', sans-serif;
      color: #333;
      z-index: -9999;
    `
    
    const itemsHtml = bill.items.map(item => `
      <tr>
        <td style="padding: 8px; border: 1px solid #ddd;">${item.name}</td>
        <td style="padding: 8px; border: 1px solid #ddd; text-align: center;">${item.count}</td>
        <td style="padding: 8px; border: 1px solid #ddd; text-align: center;">${item.unit}</td>
        <td style="padding: 8px; border: 1px solid #ddd; text-align: right;">¥${item.unitPrice}</td>
        <td style="padding: 8px; border: 1px solid #ddd; text-align: right;">¥${item.amount}</td>
      </tr>
    `).join('')
    
    pdfContent.innerHTML = `
      <div style="max-width: 100%;">
        <h1 style="text-align: center; color: #2563eb; margin-bottom: 30px; font-size: 24px;">账单详情</h1>
        
        <div style="margin-bottom: 20px; line-height: 2;">
          <p><strong>账单编号：</strong>${bill.billNo}</p>
          <p><strong>客户：</strong>${bill.customer}</p>
          <p><strong>周期：</strong>${bill.period}</p>
          <p><strong>状态：</strong>${bill.status === 'paid' ? '已支付' : '待支付'}</p>
        </div>
        
        <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
          <thead>
            <tr style="background: #2563eb; color: white;">
              <th style="padding: 10px; border: 1px solid #ddd; text-align: left;">项目</th>
              <th style="padding: 10px; border: 1px solid #ddd; text-align: center;">数量</th>
              <th style="padding: 10px; border: 1px solid #ddd; text-align: center;">单位</th>
              <th style="padding: 10px; border: 1px solid #ddd; text-align: right;">单价</th>
              <th style="padding: 10px; border: 1px solid #ddd; text-align: right;">金额</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHtml}
          </tbody>
        </table>
        
        <div style="text-align: right; margin-top: 20px; font-size: 16px; font-weight: bold;">
          总计：¥${bill.totalAmount}
        </div>
      </div>
    `
    
    document.body.appendChild(pdfContent)
    
    try {
      const canvas = await html2canvas(pdfContent, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff'
      })
      
      const imgData = canvas.toDataURL('image/png')
      const doc = new jsPDF('p', 'mm', 'a4')
      const imgWidth = 210
      const pageHeight = 297
      const imgHeight = (canvas.height * imgWidth) / canvas.width
      let heightLeft = imgHeight
      let position = 0
      
      doc.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
      heightLeft -= pageHeight
      
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight
        doc.addPage()
        doc.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
        heightLeft -= pageHeight
      }
      
      doc.save(`${bill.billNo}.pdf`)
      ElMessage.success('PDF 导出成功')
    } catch (error) {
      console.error('PDF导出失败:', error)
      ElMessage.error('PDF 导出失败')
    } finally {
      document.body.removeChild(pdfContent)
    }
  }
}

const refreshData = () => {
  ElMessage.success('数据已刷新')
  loadOrbitData()
  initTrendChart()
  initTaskChart()
  initTypeChart()
  initCostChart()
}

const initTrendChart = () => {
  if (!trendChartRef.value) return
  if (trendChart.value) {
    trendChart.value.dispose()
  }
  
  trendChart.value = echarts.init(trendChartRef.value)
  
  // 使用bills数据计算每月账单数量和金额
  const monthData = {}
  bills.value.forEach(bill => {
    const month = bill.period.replace('年', '-').replace('月', '')
    if (!monthData[month]) {
      monthData[month] = { count: 0, amount: 0 }
    }
    monthData[month].count += 1
    monthData[month].amount += bill.totalAmount
  })
  
  const months = Object.keys(monthData).sort()
  const counts = months.map(m => monthData[m].count)
  const amounts = months.map(m => monthData[m].amount)
  
  trendChart.value.setOption({
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(15, 23, 42, 0.9)',
      borderColor: '#334155',
      textStyle: { color: '#e2e8f0' }
    },
    legend: {
      data: ['账单数量', '账单金额'],
      textStyle: { color: '#94a3b8' },
      top: 0,
      itemGap: 10
    },
    grid: { left: '3%', right: '4%', top: 40, bottom: '3%', containLabel: true },
    xAxis: { type: 'category', data: months, axisLine: { lineStyle: { color: '#475569' } }, axisLabel: { color: '#94a3b8' } },
    yAxis: [
      { type: 'value', name: '数量', axisLine: { lineStyle: { color: '#475569' } }, axisLabel: { color: '#94a3b8' }, splitLine: { lineStyle: { color: '#334155', type: 'dashed' } } },
      { type: 'value', name: '金额', axisLine: { lineStyle: { color: '#475569' } }, axisLabel: { color: '#94a3b8', formatter: '¥{value}' }, splitLine: { show: false } }
    ],
    series: [
      {
        name: '账单数量',
        type: 'bar',
        data: counts,
        itemStyle: { color: '#22d3ee' }
      },
      {
        name: '账单金额',
        type: 'line',
        yAxisIndex: 1,
        data: amounts,
        smooth: true,
        lineStyle: { color: '#f472b6', width: 2 },
        itemStyle: { color: '#f472b6' }
      }
    ]
  })
}

const initTaskChart = () => {
  if (!taskChartRef.value) return
  if (taskChart.value) {
    taskChart.value.dispose()
  }
  
  taskChart.value = echarts.init(taskChartRef.value)
  
  // 使用orbits数据，按卫星统计圈次
  const satelliteStats = {}
  orbits.value.forEach(orbit => {
    const satellite = orbit.satelliteName
    if (!satelliteStats[satellite]) {
      satelliteStats[satellite] = { total: 0, billed: 0, pending: 0 }
    }
    satelliteStats[satellite].total += 1
    if (orbit.status === 'billed') {
      satelliteStats[satellite].billed += 1
    } else {
      satelliteStats[satellite].pending += 1
    }
  })
  
  const satellites = Object.keys(satelliteStats)
  
  taskChart.value.setOption({
    backgroundColor: 'transparent',
    tooltip: { trigger: 'axis', backgroundColor: 'rgba(15, 23, 42, 0.9)', borderColor: '#334155', textStyle: { color: '#e2e8f0' } },
    legend: { data: ['已计费', '待计费'], textStyle: { color: '#94a3b8' }, top: 0, itemGap: 10 },
    grid: { left: '3%', right: '4%', top: 40, bottom: '3%', containLabel: true },
    xAxis: { type: 'category', data: satellites, axisLine: { lineStyle: { color: '#475569' } }, axisLabel: { color: '#94a3b8' } },
    yAxis: { type: 'value', axisLine: { lineStyle: { color: '#475569' } }, axisLabel: { color: '#94a3b8' }, splitLine: { lineStyle: { color: '#334155', type: 'dashed' } } },
    series: [
      { name: '已计费', type: 'bar', data: satellites.map(s => satelliteStats[s].billed), itemStyle: { color: '#10b981' }, stack: 'total' },
      { name: '待计费', type: 'bar', data: satellites.map(s => satelliteStats[s].pending), itemStyle: { color: '#f59e0b' }, stack: 'total' }
    ]
  })
}

const initTypeChart = () => {
  if (!typeChartRef.value) return
  if (typeChart.value) {
    typeChart.value.dispose()
  }
  
  typeChart.value = echarts.init(typeChartRef.value)
  
  // 使用taskRecords数据，统计各服务类型数量
  const typeStats = {}
  taskRecords.value.forEach(record => {
    const type = record.serviceType
    if (!typeStats[type]) typeStats[type] = 0
    typeStats[type] += 1
  })
  
  const colorMap = {
    '测控': '#3b82f6',
    '数据': '#22d3ee',
    '成像': '#10b981'
  }
  
  const data = Object.keys(typeStats).map(type => ({
    value: typeStats[type],
    name: type,
    itemStyle: { color: (colorMap[type] || '#64748b') }
  }))
  
  typeChart.value.setOption({
    backgroundColor: 'transparent',
    tooltip: { trigger: 'item', backgroundColor: 'rgba(15, 23, 42, 0.9)', borderColor: '#334155', textStyle: { color: '#e2e8f0' } },
    legend: { orient: 'vertical', right: 10, top: 'center', textStyle: { color: '#94a3b8' } },
    series: [{
      type: 'pie',
      radius: ['40%', '70%'],
      center: ['40%', '50%'],
      avoidLabelOverlap: false,
      itemStyle: { borderRadius: 4, borderColor: '#0f172a', borderWidth: 2 },
      label: { show: false },
      emphasis: { label: { show: true, fontSize: 14, fontWeight: 'bold', color: '#e2e8f0' } },
      labelLine: { show: false },
      data: data
    }]
  })
}

const initCostChart = () => {
  if (!costChartRef.value) return
  if (costChart.value) {
    costChart.value.dispose()
  }
  
  costChart.value = echarts.init(costChartRef.value)
  
  // 使用bills数据，计算月度费用
  const monthData = {}
  bills.value.forEach(bill => {
    const month = bill.period.replace('年', '-').replace('月', '')
    if (!monthData[month]) monthData[month] = 0
    monthData[month] += bill.totalAmount
  })
  
  const sortedMonths = Object.keys(monthData).sort()
  const months = sortedMonths.length > 0 ? sortedMonths : ['2026-01', '2026-02']
  const values = sortedMonths.length > 0 ? sortedMonths.map(m => monthData[m]) : [35000, 52000]
  
  costChart.value.setOption({
    backgroundColor: 'transparent',
    tooltip: { trigger: 'axis', backgroundColor: 'rgba(15, 23, 42, 0.9)', borderColor: '#334155', textStyle: { color: '#e2e8f0' } },
    grid: { left: '3%', right: '4%', top: 10, bottom: '3%', containLabel: true },
    xAxis: { type: 'category', data: months, axisLine: { lineStyle: { color: '#475569' } }, axisLabel: { color: '#94a3b8' } },
    yAxis: { type: 'value', axisLine: { lineStyle: { color: '#475569' } }, axisLabel: { color: '#94a3b8', formatter: '¥{value}' }, splitLine: { lineStyle: { color: '#334155', type: 'dashed' } } },
    series: [{
      type: 'line',
      data: values,
      smooth: true,
      areaStyle: { color: 'rgba(34, 211, 238, 0.2)' },
      lineStyle: { color: '#22d3ee', width: 2 },
      itemStyle: { color: '#22d3ee' }
    }]
  })
}

onMounted(async () => {
  await nextTick()

  // 先加载卫星列表，再加载圈次数据
  await loadSatelliteList()
  await loadOrbitData()

  initTrendChart()
  initTaskChart()
  initTypeChart()
  initCostChart()

  window.addEventListener('resize', () => {
    trendChart.value?.resize()
    taskChart.value?.resize()
    typeChart.value?.resize()
    costChart.value?.resize()
  })
})

onBeforeUnmount(() => {
  trendChart.value?.dispose()
  taskChart.value?.dispose()
  typeChart.value?.dispose()
  costChart.value?.dispose()
})

// 监听圈次数据变化，恢复选中状态
watch(filteredOrbits, () => {
  nextTick(() => {
    restoreSelection()
  })
})

// 监听分页变化，自动加载数据
watch([() => orbitPagination.value.current, () => orbitPagination.value.size], () => {
  loadOrbitData()
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

:deep(.el-dialog) {
  background-color: #0f172a;
  border: 1px solid #334155;
}

:deep(.el-dialog__header) {
  border-bottom: 1px solid #334155;
}

:deep(.el-dialog__title) {
  color: #e2e8f0;
}

:deep(.el-dialog__body) {
  color: #cbd5e1;
}

:deep(.el-form-item__label) {
  color: #94a3b8;
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

:deep(.el-radio__label) {
  color: #cbd5e1;
}

:deep(.el-radio__input.is-checked .el-radio__inner) {
  background-color: #3b82f6;
  border-color: #3b82f6;
}

:deep(.el-checkbox__label) {
  color: #cbd5e1;
}

:deep(.el-checkbox__input.is-checked .el-checkbox__inner) {
  background-color: #3b82f6;
  border-color: #3b82f6;
}

:deep(.el-tabs__item) {
  color: #94a3b8;
}

:deep(.el-tabs__item.is-active) {
  color: #3b82f6;
}

:deep(.el-tabs__active-bar) {
  background-color: #3b82f6;
}

:deep(.el-pagination) {
  --el-pagination-bg-color: transparent;
  --el-pagination-text-color: #94a3b8;
  --el-pagination-button-color: #94a3b8;
}

:deep(.el-date-picker) {
  background-color: #0f172a;
  border-color: #334155;
}

.echart-container {
  flex: 1;
  height: 224px; /* 等价 h-56 */
  width: 100%;
}
</style>