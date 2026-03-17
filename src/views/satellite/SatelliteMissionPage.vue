<template>
  <div class="space-y-3">
    <div class="flex items-center justify-between">
      <div>
        <h2 class="text-2xl font-bold text-white">任务管理</h2>
        <p class="text-slate-400 mt-1">卫星任务调度与监控</p>
      </div>
      <div class="flex gap-3">
        <el-button @click="refreshData">
          <el-icon class="mr-2"><Refresh /></el-icon>
          刷新
        </el-button>
      </div>
    </div>

    <div class="grid grid-cols-4 gap-4">
      <div class="glass-panel rounded-xl p-4">
        <div class="flex items-center justify-between mb-2">
          <div
            class="w-10 h-10 bg-sci-blue/20 rounded-lg flex items-center justify-center"
          >
            <el-icon :size="20" class="text-sci-blue"><List /></el-icon>
          </div>
          <span
            class="text-xs px-2 py-1 rounded-full bg-sci-green/20 text-sci-green"
            >+{{ stats.totalIncrement }}</span
          >
        </div>
        <div class="text-2xl font-bold text-white mb-1">{{ stats.total }}</div>
        <div class="text-slate-400 text-sm">总任务数</div>
      </div>
      <div class="glass-panel rounded-xl p-4">
        <div class="flex items-center justify-between mb-2">
          <div
            class="w-10 h-10 bg-sci-green/20 rounded-lg flex items-center justify-center"
          >
            <el-icon :size="20" class="text-sci-green"><VideoPlay /></el-icon>
          </div>
          <span
            class="text-xs px-2 py-1 rounded-full bg-sci-green/20 text-sci-green"
            >+{{ stats.executingIncrement }}</span
          >
        </div>
        <div class="text-2xl font-bold text-white mb-1">
          {{ stats.executing }}
        </div>
        <div class="text-slate-400 text-sm">执行中</div>
      </div>
      <div class="glass-panel rounded-xl p-4">
        <div class="flex items-center justify-between mb-2">
          <div
            class="w-10 h-10 bg-sci-amber/20 rounded-lg flex items-center justify-center"
          >
            <el-icon :size="20" class="text-sci-amber"><Clock /></el-icon>
          </div>
          <span
            class="text-xs px-2 py-1 rounded-full bg-sci-green/20 text-sci-green"
            >+{{ stats.scheduledIncrement }}</span
          >
        </div>
        <div class="text-2xl font-bold text-white mb-1">
          {{ stats.scheduled }}
        </div>
        <div class="text-slate-400 text-sm">已调度</div>
      </div>
      <div class="glass-panel rounded-xl p-4">
        <div class="flex items-center justify-between mb-2">
          <div
            class="w-10 h-10 bg-sci-purple/20 rounded-lg flex items-center justify-center"
          >
            <el-icon :size="20" class="text-sci-purple"
              ><CircleCheck
            /></el-icon>
          </div>
          <span
            class="text-xs px-2 py-1 rounded-full bg-sci-green/20 text-sci-green"
            >+{{ stats.completedIncrement }}</span
          >
        </div>
        <div class="text-2xl font-bold text-white mb-1">
          {{ stats.completed }}
        </div>
        <div class="text-slate-400 text-sm">已完成</div>
      </div>
    </div>

    <!-- 下半部分：搜索和表格区域 -->
    <div class="glass-panel rounded-xl p-4">
      <!-- 搜索区域 -->
      <div
        class="flex flex-nowrap items-center gap-4 mb-4 overflow-x-auto pb-2"
        style="min-width: max-content"
      >
        <div class="flex items-center gap-2 flex-shrink-0">
          <span class="text-sm text-slate-300 flex-shrink-0">卫星</span>
          <el-select
            v-model="searchForm.satellite"
            placeholder="请选择卫星"
            clearable
            style="width: 176px"
          >
            <el-option
              v-for="sat in satelliteOptions"
              :key="sat.value"
              :label="sat.label"
              :value="sat.value"
            />
          </el-select>
        </div>
        <div class="flex items-center gap-2 flex-shrink-0">
          <el-input
            v-model="searchForm.orbitNumber"
            placeholder="请输入圈号"
            clearable
            style="width: 176px"
          />
        </div>
        <div class="flex items-center gap-2 flex-shrink-0">
          <span class="text-sm text-slate-300 flex-shrink-0">设备</span>
          <el-select
            v-model="searchForm.device"
            placeholder="请选择设备"
            clearable
            style="width: 208px"
          >
            <el-option
              v-for="station in stationOptions"
              :key="station.value"
              :label="station.label"
              :value="station.value"
            />
          </el-select>
        </div>
        <div class="flex items-center gap-2 flex-shrink-0">
          <span class="text-sm text-slate-300 flex-shrink-0">任务类型</span>
          <el-select
            v-model="searchForm.taskType"
            placeholder="请选择"
            clearable
            multiple
            style="width: 200px"
          >
            <el-option label="遥控" value="C01" />
            <el-option label="遥测" value="C02" />
            <el-option label="数传" value="C03" />
          </el-select>
        </div>
        <div class="flex items-center gap-2 flex-shrink-0">
          <span class="text-sm text-slate-300 flex-shrink-0">申请状态</span>
          <el-select
            v-model="searchForm.applyStatus"
            placeholder="请选择"
            clearable
            style="width: 176px"
          >
            <el-option label="可申请" value="可申请" />
            <el-option label="申请中" value="申请中" />
            <el-option label="已申请" value="已申请" />
            <el-option label="不可申请" value="不可申请" />
          </el-select>
        </div>
        <div class="flex items-center gap-2 flex-shrink-0">
          <span class="text-sm text-slate-300 flex-shrink-0">时间</span>
          <el-date-picker
            v-model="searchForm.timeRange"
            type="datetimerange"
            range-separator="~"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            format="YYYY-MM-DD HH:mm:ss"
            value-format="YYYY-MM-DD HH:mm:ss"
            class="w-80"
          />
        </div>
        <el-button type="primary" class="flex-shrink-0" @click="handleSearch">
          <el-icon class="mr-1"><Search /></el-icon>
          搜索
        </el-button>
      </div>

      <!-- 表格区域 -->
      <el-table
        ref="multipleTableRef"
        :data="filteredMissions"
        style="width: 100%"
        height="490px"
        v-loading="loading"
        :row-class-name="getRowClassName"
        class="overflow-x-auto"
        @selection-change="handleSelectionChange"
      >
        <el-table-column
          type="selection"
          width="40"
          :selectable="isSelectable"
        />
        <!-- 固定列：卫星名称 -->
        <el-table-column
          prop="satelliteName"
          label="卫星名称"
          width="110"
          fixed
          show-overflow-tooltip
          class-name="fixed-column-bg"
        >
          <template #default="{ row }">
            <span class="text-white whitespace-nowrap">{{
              row.satelliteName
            }}</span>
          </template>
        </el-table-column>

        <!-- 固定列：圈号 -->
        <el-table-column
          prop="orbitNumber"
          label="圈号"
          width="70"
          fixed
          show-overflow-tooltip
          class-name="fixed-column-bg"
        >
          <template #default="{ row }">
            <span class="text-slate-300 whitespace-nowrap">{{
              row.orbitNumber
            }}</span>
          </template>
        </el-table-column>

        <!-- 固定列：设备名称 -->
        <el-table-column
          prop="deviceName"
          label="设备名称"
          width="140"
          fixed
          show-overflow-tooltip
          class-name="fixed-column-bg"
        >
          <template #default="{ row }">
            <div class="flex items-center gap-1">
              <span class="text-slate-300 whitespace-nowrap">{{
                row.deviceName
              }}</span>
              <el-tag
                v-if="row.isLongTerm"
                size="small"
                type="success"
                class="ml-1"
                >长管</el-tag
              >
            </div>
          </template>
        </el-table-column>

        <!-- 滚动列：跟踪类型 -->
        <el-table-column
          prop="trackType"
          label="跟踪类型"
          width="90"
          show-overflow-tooltip
        >
          <template #default="{ row }">
            <span class="text-slate-300 whitespace-nowrap">{{
              row.trackType || "-"
            }}</span>
          </template>
        </el-table-column>

        <!-- 滚动列：天气 -->
        <el-table-column
          prop="weather"
          label="天气"
          width="60"
          show-overflow-tooltip
        >
          <template #default="{ row }">
            <span class="text-slate-300 whitespace-nowrap">{{
              row.weather || "-"
            }}</span>
          </template>
        </el-table-column>

        <!-- 滚动列：遮蔽 -->
        <el-table-column
          prop="occlusion"
          label="遮蔽"
          width="60"
          show-overflow-tooltip
        >
          <template #default="{ row }">
            <div class="flex items-center gap-1">
              <span
                :class="
                  row.occlusion === '是' ? 'text-orange-400' : 'text-slate-300'
                "
                class="whitespace-nowrap"
              >
                {{ row.occlusion || "否" }}
              </span>
              <el-icon v-if="row.occlusion === '是'" class="text-orange-400"
                ><Warning
              /></el-icon>
            </div>
          </template>
        </el-table-column>

        <!-- 滚动列：任务类型 -->
        <el-table-column
          prop="taskType"
          label="任务类型"
          width="160"
          show-overflow-tooltip
        >
          <template #default="{ row }">
            <el-select
              v-model="row.taskMode"
              placeholder="请选择"
              size="small"
              multiple
              :disabled="row.applyStatus !== '可申请'"
              @change="(val) => handleTaskTypeChange(row, val)"
              style="width: 140px"
            >
              <el-option label="遥控" value="C01" />
              <el-option label="遥测" value="C02" />
              <el-option label="数传" value="C03" />
            </el-select>
          </template>
        </el-table-column>

        <!-- 滚动列：任务时间 -->
        <el-table-column
          prop="taskTime"
          label="任务时间"
          width="180"
          show-overflow-tooltip
        >
          <template #default="{ row }">
            <span class="text-slate-300 whitespace-nowrap">{{
              row.taskTime
            }}</span>
          </template>
        </el-table-column>

        <!-- 滚动列：理论数传时间 -->
        <el-table-column
          prop="transmissionTime"
          label="理论数传时间"
          width="170"
          show-overflow-tooltip
        >
          <template #default="{ row }">
            <span class="text-slate-300 whitespace-nowrap">{{
              row.transmissionTime
            }}</span>
          </template>
        </el-table-column>

        <!-- 滚动列：申请状态 -->
        <el-table-column
          prop="applyStatus"
          label="申请状态"
          width="90"
          show-overflow-tooltip
        >
          <template #default="{ row }">
            <span
              :class="getApplyStatusClass(row.applyStatus)"
              class="whitespace-nowrap"
            >
              {{ row.applyStatus }}
            </span>
          </template>
        </el-table-column>

        <!-- 滚动列：申请人 -->
        <el-table-column
          prop="applicant"
          label="申请人"
          width="100"
          show-overflow-tooltip
        >
          <template #default="{ row }">
            <span class="text-slate-300 whitespace-nowrap">{{
              row.applicant || "-"
            }}</span>
          </template>
        </el-table-column>

        <!-- 滚动列：申请时间 -->
        <el-table-column
          prop="applyTime"
          label="申请时间"
          width="150"
          show-overflow-tooltip
        >
          <template #default="{ row }">
            <span class="text-slate-300 whitespace-nowrap">{{
              row.applyTime || "-"
            }}</span>
          </template>
        </el-table-column>

        <!-- 滚动列：最高仰角(°) -->
        <el-table-column
          prop="maxElevation"
          label="最高仰角(°)"
          width="100"
          show-overflow-tooltip
        >
          <template #default="{ row }">
            <span class="text-slate-300 whitespace-nowrap">{{
              row.maxElevation
            }}</span>
          </template>
        </el-table-column>

        <!-- 滚动列：进站方位角(°) -->
        <el-table-column
          prop="entryAzimuth"
          label="进站方位角(°)"
          width="120"
          show-overflow-tooltip
        >
          <template #default="{ row }">
            <span class="text-slate-300 whitespace-nowrap">{{
              row.entryAzimuth
            }}</span>
          </template>
        </el-table-column>

        <!-- 滚动列：过顶方位角(°) -->
        <el-table-column
          prop="zenithAzimuth"
          label="过顶方位角(°)"
          width="120"
          show-overflow-tooltip
        >
          <template #default="{ row }">
            <span class="text-slate-300 whitespace-nowrap">{{
              row.zenithAzimuth
            }}</span>
          </template>
        </el-table-column>

        <!-- 滚动列：出站方位角(°) -->
        <el-table-column
          prop="exitAzimuth"
          label="出站方位角(°)"
          width="120"
          show-overflow-tooltip
        >
          <template #default="{ row }">
            <span class="text-slate-300 whitespace-nowrap">{{
              row.exitAzimuth
            }}</span>
          </template>
        </el-table-column>

        <!-- 滚动列：过顶时刻 -->
        <el-table-column
          prop="zenithTime"
          label="过顶时刻"
          width="150"
          show-overflow-tooltip
        >
          <template #default="{ row }">
            <span class="text-slate-300 whitespace-nowrap">{{
              row.zenithTime
            }}</span>
          </template>
        </el-table-column>

        <!-- 滚动列：跟踪时长(s) -->
        <el-table-column
          prop="trackDuration"
          label="跟踪时长(s)"
          width="110"
          show-overflow-tooltip
        >
          <template #default="{ row }">
            <span class="text-slate-300 whitespace-nowrap">{{
              row.trackDuration
            }}</span>
          </template>
        </el-table-column>

        <!-- 滚动列：圈次类型 -->
        <el-table-column
          prop="orbitType"
          label="圈次类型"
          width="90"
          show-overflow-tooltip
        >
          <template #default="{ row }">
            <el-tag
              v-if="row.orbitType"
              type="success"
              size="small"
              class="whitespace-nowrap"
            >
              {{ row.orbitType }}
            </el-tag>
            <span v-else class="text-slate-300">-</span>
          </template>
        </el-table-column>

        <!-- 固定列：操作 -->
        <el-table-column
          label="操作"
          width="200"
          fixed="right"
          class-name="fixed-column-bg-right"
        >
          <template #default="{ row }">
            <div class="flex items-center gap-2">
              <el-button
                v-if="
                  row.applyStatus === '已申请' || row.applyStatus === '申请中'
                "
                text
                type="danger"
                size="small"
                @click="handleCancel(row)"
              >
                取消跟踪
              </el-button>
              <el-button
                v-if="
                  row.applyStatus === '已申请' || row.applyStatus === '申请中'
                "
                text
                type="primary"
                size="small"
                @click="handleEditClick(row)"
              >
                任务修改
              </el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div class="flex items-center justify-between mt-4">
        <div class="flex items-center gap-3">
          <el-button
            type="primary"
            plain
            size="small"
            :disabled="selectedRows.length === 0"
            @click="handleBatchApply"
          >
            批量申请 (已选 {{ selectedRows.length }} 条)
          </el-button>
        </div>
        <div class="flex items-center gap-4">
          <span class="text-slate-400 text-sm">共 {{ total }} 条</span>
          <el-pagination
            v-model:current-page="currentPage"
            v-model:page-size="pageSize"
            :page-sizes="[10, 20, 50, 100]"
            :total="total"
            layout="sizes, prev, pager, next, jumper"
            background
          />
        </div>
      </div>
    </div>

    <!-- 申请对话框 -->
    <el-dialog
      v-model="applyDialogVisible"
      title="任务申请"
      width="800px"
      :close-on-click-modal="false"
    >
      <div class="mb-4">
        <p class="text-slate-300 mb-2">
          共选择 {{ selectedRows.length }} 条数据，请为每条数据选择任务类型：
        </p>
      </div>
      <el-table :data="batchApplyList" style="width: 100%" max-height="400px">
        <el-table-column prop="satelliteName" label="卫星" width="120" />
        <el-table-column prop="orbitNumber" label="圈号" width="100" />
        <el-table-column prop="deviceName" label="设备" width="120" />
        <el-table-column label="任务类型" min-width="200">
          <template #default="{ row, $index }">
            <el-checkbox-group
              v-model="batchApplyList[$index].taskMode"
              size="small"
            >
              <el-checkbox label="遥控" value="C01" />
              <el-checkbox label="遥测" value="C02" />
              <el-checkbox label="数传" value="C03" />
            </el-checkbox-group>
          </template>
        </el-table-column>
      </el-table>
      <template #footer>
        <el-button @click="applyDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitBatchApply" :loading="applying"
          >确定</el-button
        >
      </template>
    </el-dialog>

    <!-- 任务修改对话框 -->
    <el-dialog
      v-model="editDialogVisible"
      title="任务修改"
      width="600px"
      :close-on-click-modal="false"
    >
      <el-form :model="editForm" label-width="100px">
        <el-form-item label="任务类型">
          <el-checkbox-group v-model="editForm.taskMode">
            <el-checkbox label="遥控" value="C01" />
            <el-checkbox label="遥测" value="C02" />
            <el-checkbox label="数传" value="C03" />
          </el-checkbox-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="editDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitEdit" :loading="editing"
          >确定</el-button
        >
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import {
  Plus,
  Refresh,
  Search,
  Warning,
  List,
  Clock,
  CircleCheck,
  VideoPlay,
} from "@element-plus/icons-vue";
import { taskApi, availableSegmentsApi, satelliteApi, stationApi } from "@/api";

const taskTypeMap = {
  C01: "遥控",
  C02: "遥测",
  C03: "数传",
};

// 搜索表单
const searchForm = ref({
  satellite: "",
  orbitNumber: "",
  device: "",
  taskType: [],
  applyStatus: "",
  timeRange: [],
});

// 统计数据
const stats = ref({
  total: 0,
  executing: 0,
  scheduled: 0,
  completed: 0,
  totalIncrement: 0,
});

// 表格数据
const loading = ref(false);
const missions = ref([]);
const currentPage = ref(1);
const pageSize = ref(50);
const total = ref(491);

// 申请对话框
const applyDialogVisible = ref(false);
const batchApplyList = ref([]);
const applying = ref(false);

// 任务修改对话框
const editDialogVisible = ref(false);
const editForm = ref({
  taskMode: [],
});
const editing = ref(false);

// 卫星和地面站字典映射
const satelliteMap = ref(new Map());
const stationMap = ref(new Map());

// 搜索下拉选项
const satelliteOptions = ref([]);
const stationOptions = ref([]);

// 加载卫星字典
const loadSatelliteMap = async () => {
  try {
    const response = await satelliteApi.getList({
      page: 1,
      size: 1000,
    });
    const satList =
      response?.records || response || response?.data?.records || [];
    const map = new Map();
    const options = [];
    satList.forEach((sat) => {
      map.set(sat.satTleName, sat.satName);
      map.set(sat.id?.toString(), sat.satName);
      options.push({ label: sat.satName, value: sat.satTleName });
    });
    satelliteMap.value = map;
    satelliteOptions.value = options;
  } catch (error) {
    console.error("加载卫星字典失败:", error);
  }
};

// 加载地面站字典
const loadStationMap = async () => {
  try {
    const response = await stationApi.getList({});
    const stationList =
      response?.records || response || response?.data?.records || [];
    const map = new Map();
    const options = [];
    stationList.forEach((station) => {
      map.set(station.stationId, station.stationName);
      map.set(station.id?.toString(), station.stationName);
      options.push({ label: station.stationName, value: station.stationId });
    });
    stationMap.value = map;
    stationOptions.value = options;
  } catch (error) {
    console.error("加载地面站字典失败:", error);
  }
};

// 获取卫星名称
const getSatelliteName = (satelliteId) => {
  if (!satelliteId) return "-";
  return satelliteMap.value.get(satelliteId) || satelliteId;
};

// 获取地面站名称
const getStationName = (stationId) => {
  if (!stationId) return "-";
  return stationMap.value.get(stationId) || stationId;
};

// 转换后端可用弧段数据为前端格式
const transformArcData = (arcData) => {
  if (!Array.isArray(arcData)) return [];

  return arcData.map((item, index) => {
    // 根据后端状态映射到前端状态: 0=可申请, 1=申请中, 2=已申请, 3=不可申请
    let applyStatus = "可申请";
    if (item.status === "1" || item.status === "申请中") {
      applyStatus = "申请中";
    } else if (item.status === "2" || item.status === "已申请") {
      applyStatus = "已申请";
    } else if (item.status === "3" || item.status === "不可申请") {
      applyStatus = "不可申请";
    }

    // 解析任务模式
    let taskType = "未选择";
    if (item.taskMode) {
      if (item.taskMode.includes("TK") && item.taskMode.includes("DT")) {
        taskType = "测控数传";
      } else if (item.taskMode.includes("DT")) {
        taskType = "数传";
      } else if (item.taskMode.includes("TK")) {
        taskType = "测控";
      }
    }

    // 格式化时间
    const formatTime = (timeStr) => {
      if (!timeStr) return "-";
      // 如果是 Date 对象，转换为字符串
      if (timeStr instanceof Date) {
        const year = timeStr.getFullYear();
        const month = String(timeStr.getMonth() + 1).padStart(2, "0");
        const day = String(timeStr.getDate()).padStart(2, "0");
        const hours = String(timeStr.getHours()).padStart(2, "0");
        const minutes = String(timeStr.getMinutes()).padStart(2, "0");
        const seconds = String(timeStr.getSeconds()).padStart(2, "0");
        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
      }
      // 如果是字符串，替换 T
      return timeStr.replace("T", " ");
    };

    return {
      id: item.id || index + 1,
      satelliteName: getSatelliteName(item.satellite),
      orbitNumber: item.circleId || "-",
      deviceName: getStationName(item.antenna),
      isLongTerm: false, // 根据业务逻辑判断
      trackType: "-",
      weather: "-",
      occlusion: "否",
      taskType: taskType,
      taskMode: item.taskMode ? item.taskMode.split(';').filter(t => t) : [],
      taskTime: `${formatTime(item.accessStartTime)} ~ ${formatTime(item.accessEndTime)}`,
      transmissionTime: `${formatTime(item.scStartTime)} ~ ${formatTime(item.scEndTime)}`,
      applyStatus: applyStatus,
      applicant:
        item.username ||
        (applyStatus === "申请中" || applyStatus === "已申请"
          ? "任务计划调用"
          : "-"),
      applyTime: item.submitTime ? formatTime(item.submitTime) : "-",
      maxElevation: item.maxE || "-",
      entryAzimuth: item.startE || "-",
      zenithAzimuth: "-",
      exitAzimuth: item.endE || "-",
      zenithTime: formatTime(item.accessCenterTime),
      trackDuration: "-",
      orbitType: "常规圈次",
      // 保存原始数据用于操作
      _raw: item,
    };
  });
};

// 过滤后的数据 - 现在后端已经分页和过滤，直接返回
const filteredMissions = computed(() => {
  return missions.value;
});

// 获取申请状态样式类: 0=可申请(青色), 1=申请中(黄色), 2=已申请(绿色), 3=不可申请(红色)
const getApplyStatusClass = (status) => {
  switch (status) {
    case "已申请":
      return "text-green-400";
    case "不可申请":
      return "text-red-400";
    case "可申请":
      return "text-cyan-400";
    case "申请中":
      return "text-amber-400";
    default:
      return "text-slate-300";
  }
};

// 获取行样式类: 0=可申请, 1=申请中, 2=已申请, 3=不可申请
const getRowClassName = ({ row }) => {
  switch (row.applyStatus) {
    case "已申请":
      return "row-applied";
    case "申请中":
      return "row-applying";
    case "不可申请":
      return "row-unavailable";
    default:
      return "";
  }
};

// 加载数据
const loadData = async () => {
  loading.value = true;
  try {
    // 构建查询参数 - 使用新的 AvailableSegmentsController 接口
    const params = {
      pageNum: currentPage.value,
      pageSize: pageSize.value,
      satellite: searchForm.value.satellite || "",
      antenna: searchForm.value.device || "",
      circleId: searchForm.value.orbitNumber || "",
      status:
        searchForm.value.applyStatus === "可申请"
          ? "0"
          : searchForm.value.applyStatus === "申请中"
            ? "1"
            : searchForm.value.applyStatus === "已申请"
              ? "2"
              : searchForm.value.applyStatus === "不可申请"
                ? "3"
                : "",
      taskMode:
        Array.isArray(searchForm.value.taskType) &&
        searchForm.value.taskType.length > 0
          ? searchForm.value.taskType
              .map((type) => {
                if (type === "C01") return "C01";
                if (type === "C02") return "C02";
                if (type === "C03") return "C03";
                return "";
              })
              .filter((t) => t)
              .join(";")
          : "",
      startTime: searchForm.value.timeRange?.[0] || "",
      endTime: searchForm.value.timeRange?.[1] || "",
    };

    const response = await availableSegmentsApi.getList(params);

    // 新接口返回分页格式: { records: [], total: 0, size: 0, current: 0 }
    let arcData = [];
    if (response && response.records) {
      arcData = response.records;
      total.value = response.total || 0;
    } else if (Array.isArray(response)) {
      arcData = response;
      total.value = arcData.length;
    } else if (response && response.data) {
      arcData = response.data.records || response.data;
      total.value = response.data.total || arcData.length;
    }

    missions.value = transformArcData(arcData);

    // 加载统计数据
    loadStats();
  } catch (error) {
    console.error("加载任务数据失败:", error);
    ElMessage.error("加载数据失败: " + (error.message || "未知错误"));
    // 如果API失败，使用空数组
    missions.value = [];
    total.value = 0;
  } finally {
    loading.value = false;
  }
};

// 更新统计数据: 0=可申请, 1=申请中, 2=已申请, 3=不可申请
const updateStats = () => {
  stats.value.total = missions.value.length;
  stats.value.executing = missions.value.filter(
    (m) => m.applyStatus === "已申请",
  ).length;
  stats.value.scheduled =
    missions.value.filter((m) => m.applyStatus === "可申请").length +
    missions.value.filter((m) => m.applyStatus === "申请中").length;
  stats.value.completed = missions.value.filter(
    (m) => m.applyStatus === "不可申请",
  ).length;
};

// 加载统计数据
const loadStats = async () => {
  try {
    const response = await availableSegmentsApi.getStats();
    if (response) {
      stats.value = response;
    }
  } catch (error) {
    console.error("加载统计数据失败:", error);
  }
};

// 处理任务类型变化
const handleTaskTypeChange = async (row, val) => {
  try {
    // 构建 taskMode 字符串
    const taskModeStr = val.join(';');
    
    // 调用 API 更新任务类型
    await availableSegmentsApi.updateTaskMode(row._raw.id, taskModeStr);
    
    // 更新本地数据
    row._raw.taskMode = taskModeStr;
    
    // 更新显示的任务类型文本
    const taskTypeMap = {
      'C01': '遥控',
      'C02': '遥测',
      'C03': '数传'
    };
    const taskTypes = val.map(v => taskTypeMap[v]).filter(t => t);
    if (taskTypes.length === 3) {
      row.taskType = '遥控+遥测+数传';
    } else if (taskTypes.length === 2) {
      row.taskType = taskTypes.join('+');
    } else if (taskTypes.length === 1) {
      row.taskType = taskTypes[0];
    } else {
      row.taskType = '未选择';
    }
    
    ElMessage.success('任务类型已更新');
  } catch (error) {
    console.error('更新任务类型失败:', error);
    ElMessage.error('更新任务类型失败: ' + (error.message || '未知错误'));
    // 恢复原来的值
    row.taskMode = row._raw.taskMode ? row._raw.taskMode.split(';').filter(t => t) : [];
  }
};

// 搜索
const handleSearch = () => {
  currentPage.value = 1;
  loadData();
};

// 刷新数据
const refreshData = () => {
  loadData();
  loadStats();
  ElMessage.success("数据已刷新");
};

// 创建任务
const handleCreateMission = () => {
  ElMessage.info("创建任务功能开发中");
};

// 申请跟踪
const handleApply = async (row) => {
  try {
    await ElMessageBox.confirm(
      `确定申请跟踪设备"${row.deviceName}"吗？`,
      "确认",
      {
        type: "warning",
      },
    );

    // 使用新的 AvailableSegmentsController 接口更新状态: 0=可申请, 1=申请中, 2=已申请, 3=不可申请
    await availableSegmentsApi.updateStatus(row._raw?.id, "2");

    row.applyStatus = "-";
    row.applicant = "-";
    row.applyTime = new Date().toLocaleString();
    ElMessage.success("申请成功");
    loadStats();
  } catch (error) {
    if (error !== "cancel") {
      console.error("申请失败:", error);
      ElMessage.error("申请失败: " + (error.message || "未知错误"));
    }
  }
};

// 取消跟踪
const handleCancel = async (row) => {
  try {
    await ElMessageBox.confirm(
      `确定取消跟踪设备"${row.deviceName}"吗？`,
      "警告",
      {
        type: "warning",
      },
    );

    // 使用新的 AvailableSegmentsController 接口更新状态
    await availableSegmentsApi.updateStatus(row._raw?.id, "0");

    row.applyStatus = "可申请";
    row.applicant = "-";
    row.applyTime = "-";
    ElMessage.success("取消成功");
    updateStats();
    refreshData();
  } catch (error) {
    if (error !== "cancel") {
      console.error("取消失败:", error);
      ElMessage.error("取消失败: " + (error.message || "未知错误"));
    }
  }
};

// 编辑任务
const handleEdit = (row) => {
  ElMessage.info("编辑任务功能开发中");
};

// 选中的行
const selectedRows = ref([]);

// 判断行是否可选
const isSelectable = (row) => {
  return row.applyStatus === "可申请";
};

// 处理选择变化
const handleSelectionChange = (selection) => {
  selectedRows.value = selection;
};

// 批量申请
const handleBatchApply = async () => {
  if (selectedRows.value.length === 0) {
    ElMessage.warning("请至少选择一条可申请的数据");
    return;
  }

  // 初始化批量申请列表，为每条数据添加独立的 taskMode
  batchApplyList.value = selectedRows.value.map((row) => ({
    ...row,
    taskMode: [],
  }));

  applyDialogVisible.value = true;
};

// 提交批量申请
const submitBatchApply = async () => {
  // 检查每条数据是否都选择了任务类型
  const invalidRows = batchApplyList.value.filter(
    (item, index) => !item.taskMode || item.taskMode.length === 0,
  );
  if (invalidRows.length > 0) {
    ElMessage.warning(
      `请为所有数据选择任务类型（还有 ${invalidRows.length} 条未选择）`,
    );
    return;
  }

  try {
    // 按任务类型分组提交
    const taskModeGroups = {};

    batchApplyList.value.forEach((item) => {
      const taskModeKey = item.taskMode.join(";");
      if (!taskModeGroups[taskModeKey]) {
        taskModeGroups[taskModeKey] = [];
      }
      taskModeGroups[taskModeKey].push(item);
    });

    let totalSuccess = 0;
    let totalFail = 0;

    // 为每种任务类型组合提交一次申请
    for (const [taskMode, items] of Object.entries(taskModeGroups)) {
      const planList = items.map((item) => ({
        accessStartTime: item._raw.accessStartTime,
        accessEndTime: item._raw.accessEndTime,
        maxE: item._raw.maxE,
        scStartTime: item._raw.scStartTime,
        scEndTime: item._raw.scEndTime,
        circleID: item._raw.circleId,
        taskID: item._raw.taskId,
        satellite: item._raw.satellite,
        channelNo: "0",
        dataDownLinkBitRate: "450M",
        downLinkBitRate: "",
        priority: "RAPID",
      }));

      const data = {
        daType: taskMode,
        originator: items[0]._raw.originator,
        planList: planList,
        recipient: "00888000",
      };

      try {
        applying.value = true;
        const response = await availableSegmentsApi.batchApply(data);
        applying.value = false;

        if (response && response.data) {
          totalSuccess += response.data.success || 0;
          totalFail += response.data.fail || 0;
        }

        // 更新本地数据状态
        for (const item of items) {
          const originalRow = selectedRows.value.find(
            (r) => r._raw.taskId === item._raw.taskId,
          );
          if (originalRow) {
            originalRow.applyStatus = "已申请";
            originalRow.applicant = "任务计划调用";
            originalRow.applyTime = new Date().toLocaleString();
          }
        }
      } catch (error) {
        console.error(`任务类型 ${taskMode} 申请失败:`, error);
        totalFail += items.length;
        applying.value = false;
      }
    }

    if (totalSuccess > 0) {
      ElMessage.success(`成功申请 ${totalSuccess} 条数据`);
    }
    if (totalFail > 0) {
      ElMessage.warning(`${totalFail} 条数据申请失败`);
    }

    updateStats();
    selectedRows.value = [];
    applyDialogVisible.value = false;
    batchApplyList.value = [];
  } catch (error) {
    console.error("批量申请失败:", error);
    ElMessage.error("批量申请失败: " + (error.message || "未知错误"));
    applying.value = false;
  }
};

// 点击任务修改
const handleEditClick = (row) => {
  editForm.value.taskMode = row._raw.taskMode
    ? row._raw.taskMode.split(";").map((type) => type.trim())
    : [];
  editDialogVisible.value = true;
};

// 提交任务修改
const submitEdit = async () => {
  if (editForm.value.taskMode.length === 0) {
    ElMessage.warning("请至少选择一个任务类型");
    return;
  }

  const row = selectedRows.value[0];
  try {
    // 构建申请数据
    const planList = [
      {
        accessStartTime: row._raw.accessStartTime,
        accessEndTime: row._raw.accessEndTime,
        maxE: row._raw.maxE,
        scStartTime: row._raw.scStartTime,
        scEndTime: row._raw.scEndTime,
        circleID: row._raw.circleId,
        taskID: row._raw.taskId,
        satellite: row._raw.satellite,
        channelNo: "0",
        dataDownLinkBitRate: "450M",
        downLinkBitRate: "",
        priority: "RAPID",
      },
    ];

    const data = {
      daType: applyForm.value.taskMode.join(";"),
      originator: selectedRows.value[0]._raw.originator,
      planList: planList,
      recipient: "00888000",
    };

    editing.value = true;
    await availableSegmentsApi.batchApply(data);
    editing.value = false;

    // 更新本地数据状态
    row.applyStatus = "已申请";
    row.applicant = "任务计划调用";
    row.applyTime = new Date().toLocaleString();

    editDialogVisible.value = false;
    ElMessage.success("修改成功");
    updateStats();
    selectedRows.value = [];
  } catch (error) {
    console.error("修改失败:", error);
    ElMessage.error("修改失败: " + (error.message || "未知错误"));
    editing.value = false;
  }

  try {
    await ElMessageBox.confirm(
      `确定批量申请 ${selectedRows.value.length} 条数据吗？`,
      "确认",
      {
        type: "warning",
      },
    );

    const successCount = ref(0);
    const failCount = ref(0);

    for (const row of selectedRows.value) {
      try {
        await availableSegmentsApi.updateStatus(row._raw?.id, "2");
        row.applyStatus = "-";
        row.applicant = "-";
        row.applyTime = new Date().toLocaleString();
        successCount.value++;
      } catch (error) {
        console.error(`申请失败 (ID: ${row._raw?.id}):`, error);
        failCount.value.value++;
      }
    }

    if (successCount.value > 0) {
      ElMessage.success(`成功申请 ${successCount.value} 条数据`);
    }
    if (failCount.value > 0) {
      ElMessage.error(`${failCount.value} 条数据申请失败`);
    }

    updateStats();
    refreshData();
    selectedRows.value = [];
  } catch (error) {
    if (error !== "cancel") {
      console.error("批量申请失败:", error);
      ElMessage.error("批量申请失败: " + (error.message || "未知错误"));
    }
  }
};

onMounted(async () => {
  await Promise.all([loadSatelliteMap(), loadStationMap()]);
  loadData();
});

// 监听分页变化，自动加载数据
watch([currentPage, pageSize], () => {
  loadData();
});
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
  background-color: rgba(15, 23, 42, 0.8);
  color: #f8fafc;
  border-color: #1e293b;
  font-weight: 600;
  white-space: nowrap;
}

:deep(.el-table td.el-table__cell) {
  border-color: #1e293b;
  white-space: nowrap;
  background-color: transparent;
}

/* 固定列背景色 - 基础样式（最高优先级） */
:deep(td.fixed-column-bg),
:deep(td.fixed-column-bg-right) {
  background-color: #0f172a !important;
}

/* 固定列表头背景 */
:deep(th.fixed-column-bg),
:deep(th.fixed-column-bg-right) {
  background-color: #0f172a !important;
}

/* 已申请状态的固定列背景 - 使用不透明的深绿色 */
:deep(tr.row-applied td.fixed-column-bg),
:deep(tr.row-applied td.fixed-column-bg-right) {
  background-color: #102f30 !important;
}

/* 不可申请状态的固定列背景 - 使用不透明的深红色 */
:deep(tr.row-unavailable td.fixed-column-bg),
:deep(tr.row-unavailable td.fixed-column-bg-right) {
  background-color: #2f1d2d !important;
}

/* 悬停时保持固定列背景 */
:deep(tr:hover td.fixed-column-bg),
:deep(tr:hover td.fixed-column-bg-right) {
  background-color: #0f172a !important;
}

:deep(tr.row-applied:hover td.fixed-column-bg),
:deep(tr.row-applied:hover td.fixed-column-bg-right) {
  background-color: #1a3f40 !important;
}

:deep(tr.row-unavailable:hover td.fixed-column-bg),
:deep(tr.row-unavailable:hover td.fixed-column-bg-right) {
  background-color: #4a2d3d !important;
}

/* 固定列阴影 */
:deep(td.fixed-column-bg) {
  box-shadow: 4px 0 8px rgba(0, 0, 0, 0.5);
}

:deep(td.fixed-column-bg-right) {
  box-shadow: -4px 0 8px rgba(0, 0, 0, 0.5);
}

/* 已申请状态行背景色 - 绿色 */
:deep(.el-table .row-applied) {
  background-color: rgba(34, 197, 94, 0.15) !important;
}

:deep(.el-table--enable-row-hover .el-table__body tr.row-applied:hover > td) {
  background-color: rgba(34, 197, 94, 0.25) !important;
}

/* 不可申请状态行背景色 - 红色 */
:deep(.el-table .row-unavailable) {
  background-color: rgba(239, 68, 68, 0.15) !important;
}

:deep(
  .el-table--enable-row-hover .el-table__body tr.row-unavailable:hover > td
) {
  background-color: rgba(239, 68, 68, 0.25) !important;
}

:deep(.el-table--enable-row-hover .el-table__body tr:hover > td) {
  background-color: rgba(34, 211, 238, 0.1);
}

:deep(.el-input__wrapper) {
  background-color: #0f172a;
  border-color: #334155;
  box-shadow: none;
}

:deep(.el-input__wrapper:hover) {
  border-color: #475569;
}

:deep(.el-input__wrapper.is-focus) {
  border-color: #22d3ee;
}

:deep(.el-input__inner) {
  color: #f8fafc;
}

:deep(.el-input__inner::placeholder) {
  color: #64748b;
}

:deep(.el-select .el-input__wrapper) {
  background-color: #0f172a;
  border-color: #334155;
}

:deep(.el-select .el-input__wrapper:hover) {
  border-color: #475569;
}

:deep(.el-select .el-input__wrapper.is-focus) {
  border-color: #22d3ee;
}

:deep(.el-select .el-input__inner) {
  color: #f8fafc;
}

:deep(.el-date-editor.el-input__wrapper) {
  background-color: #0f172a;
  border-color: #334155;
}

:deep(.el-pagination) {
  --el-pagination-text-color: #94a3b8;
  --el-pagination-bg-color: transparent;
  --el-pagination-border-color: transparent;
  --el-pagination-hover-bg-color: rgba(34, 211, 238, 0.1);
  --el-pagination-hover-color: #22d3ee;
}

:deep(.el-pagination button) {
  background-color: #0f172a;
  color: #94a3b8;
  border: 1px solid #334155;
}

:deep(.el-pagination button:hover) {
  background-color: rgba(34, 211, 238, 0.1);
  color: #22d3ee;
  border-color: #22d3ee;
}

:deep(.el-pagination.is-background .el-pager li:not(.disabled).is-active) {
  background-color: #22d3ee;
  color: #020617;
}

:deep(.el-pagination.is-background .el-pager li:not(.is-active)) {
  background-color: #0f172a;
  color: #94a3b8;
  border: 1px solid #334155;
}

:deep(.el-pagination.is-background .el-pager li:not(.is-active):hover) {
  background-color: rgba(34, 211, 238, 0.1);
  color: #22d3ee;
  border-color: #22d3ee;
}

:deep(.el-tag--success) {
  background-color: rgba(34, 197, 94, 0.2);
  border-color: rgba(34, 197, 94, 0.4);
  color: #22c55e;
}

:deep(.el-button--primary) {
  background-color: #22d3ee;
  border-color: #22d3ee;
  color: #020617;
}

:deep(.el-button--primary:hover) {
  background-color: #67e8f9;
  border-color: #67e8f9;
  color: #020617;
}

:deep(.el-button--primary.is-plain) {
  background-color: transparent;
  border-color: #22d3ee;
  color: #22d3ee;
}

:deep(.el-button--primary.is-plain:hover) {
  background-color: rgba(34, 211, 238, 0.1);
  border-color: #22d3ee;
  color: #22d3ee;
}

/* 自定义滚动条样式 */
:deep(.el-table__body-wrapper::-webkit-scrollbar) {
  height: 10px;
  width: 10px;
}

:deep(.el-table__body-wrapper::-webkit-scrollbar-track) {
  background: rgba(15, 23, 42, 0.5);
  border-radius: 5px;
}

:deep(.el-table__body-wrapper::-webkit-scrollbar-thumb) {
  background: rgba(100, 116, 139, 0.5);
  border-radius: 5px;
  border: 2px solid rgba(15, 23, 42, 0.5);
}

:deep(.el-table__body-wrapper::-webkit-scrollbar-thumb:hover) {
  background: rgba(34, 211, 238, 0.6);
}

/* 页面滚动条样式 */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: rgba(15, 23, 42, 0.3);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb {
  background: rgba(100, 116, 139, 0.5);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: rgba(34, 211, 238, 0.6);
}
</style>
