<template>
  <div class="space-y-6">
    <div>
      <h2 class="text-2xl font-bold text-white">系统设置</h2>
      <p class="text-slate-400 mt-1">配置系统参数和偏好设置</p>
    </div>

    <div class="grid grid-cols-2 gap-6">
      <div class="glass-panel rounded-xl p-6">
        <h3 class="text-lg font-semibold text-white mb-4">基本设置</h3>
        <el-form label-width="120px">
          <el-form-item label="系统名称">
            <el-input v-model="settings.systemName" />
          </el-form-item>
          <el-form-item label="数据刷新间隔">
            <el-select v-model="settings.refreshInterval">
              <el-option label="5秒" :value="5" />
              <el-option label="10秒" :value="10" />
              <el-option label="30秒" :value="30" />
              <el-option label="60秒" :value="60" />
            </el-select>
          </el-form-item>
          <el-form-item label="语言">
            <el-select v-model="settings.language">
              <el-option label="简体中文" value="zh-CN" />
              <el-option label="English" value="en-US" />
            </el-select>
          </el-form-item>
          <el-form-item label="时区">
            <el-select v-model="settings.timezone">
              <el-option label="UTC+8 (北京时间)" value="Asia/Shanghai" />
              <el-option label="UTC+0 (格林威治)" value="UTC" />
            </el-select>
          </el-form-item>
        </el-form>
      </div>

      <div class="glass-panel rounded-xl p-6">
        <h3 class="text-lg font-semibold text-white mb-4">通知设置</h3>
        <el-form label-width="120px">
          <el-form-item label="启用通知">
            <el-switch v-model="settings.notificationsEnabled" />
          </el-form-item>
          <el-form-item label="邮件通知">
            <el-switch v-model="settings.emailNotifications" />
          </el-form-item>
          <el-form-item label="短信通知">
            <el-switch v-model="settings.smsNotifications" />
          </el-form-item>
          <el-form-item label="声音提醒">
            <el-switch v-model="settings.soundAlerts" />
          </el-form-item>
        </el-form>
      </div>
    </div>

    <div class="flex gap-3">
      <el-button type="primary" @click="saveSettings">保存设置</el-button>
      <el-button @click="resetSettings">重置默认</el-button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'

const settings = ref({
  systemName: '远程测控中心系统',
  refreshInterval: 10,
  language: 'zh-CN',
  timezone: 'Asia/Shanghai',
  notificationsEnabled: true,
  emailNotifications: true,
  smsNotifications: false,
  soundAlerts: true
})

const saveSettings = () => {
  ElMessage.success('设置已保存')
}

const resetSettings = () => {
  settings.value = {
    systemName: '远程测控中心系统',
    refreshInterval: 10,
    language: 'zh-CN',
    timezone: 'Asia/Shanghai',
    notificationsEnabled: true,
    emailNotifications: true,
    smsNotifications: false,
    soundAlerts: true
  }
  ElMessage.info('设置已重置')
}
</script>

<style scoped>
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

:deep(.el-switch.is-checked .el-switch__core) {
  background-color: #3b82f6;
}
</style>