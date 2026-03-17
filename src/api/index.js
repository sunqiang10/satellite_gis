import request from './request'

/**
 * 用户相关接口
 */
export const userApi = {
  // 用户登录
  login(data) {
    return request.post('/user/login', data)
  },
  
  // 配置用户卫星
  configUserSatellite(data) {
    return request.post('/user/configUserSatellite', data)
  },

  // 获取用户列表
  getList() {
    return request.get('/user/list')
  },

  // 添加用户
  add(data) {
    return request.post('/user/add', data)
  },

  // 更新用户
  update(data) {
    return request.post('/user/update', data)
  },

  // 删除用户
  delete(id) {
    return request.post('/user/delete', { id })
  }
}

/**
 * 卫星管理相关接口
 */
export const satelliteApi = {
  // 获取卫星列表
  getList(data = {}) {
    return request.post('/satellite/list', data)
  },
  
  // 添加卫星
  add(data) {
    return request.post('/satellite/add', data)
  },
  
  // 更新卫星
  update(data) {
    return request.post('/satellite/update', data)
  },
  
  // 删除卫星
  delete(id) {
    return request.post('/satellite/delete', { id })
  }
}

/**
 * 地面站管理相关接口
 */
export const stationApi = {
  // 获取地面站列表
  getList(data = {}) {
    return request.post('/station/list', data)
  },

  // 添加地面站
  add(data) {
    return request.post('/station/add', data)
  },

  // 更新地面站
  update(data) {
    return request.post('/station/update', data)
  },

  // 删除地面站
  delete(id) {
    return request.post('/station/delete', { id })
  },

  // 计算可用弧段
  computeAvailableArcSegments(data) {
    return request.post('/station/computeAvailableArcSegments', data)
  },

  // 过滤已占用弧段
  getUsedSegmentSX(data) {
    return request.post('/station/getUsedSegmentSX', data)
  }
}

/**
 * 任务/弧段管理相关接口
 */
export const taskApi = {
  // 查询可用弧段（空闲弧段）
  queryIdleArc(data = {}) {
    return request.post('/station/task/idleArc/query', data)
  },
  
  // 申请弧段
  applyArc(data) {
    return request.post('/station/task/apply', data)
  },
  
  // 变更弧段
  editArc(data) {
    return request.post('/station/task/edit', data)
  },
  
  // 取消弧段
  cancelArc(data) {
    return request.post('/station/task/cancel', data)
  },
  
  // 查询已申请弧段
  queryArrangedArc(data = {}) {
    return request.post('/station/task/arrangedArc/query', data)
  }
}

/**
 * 轨道根数相关接口
 */
export const trackApi = {
  // 获取瞬时轨道根数
  getTrackGen(data = {}) {
    return request.post('/track/trackGen', data)
  },
  
  // 获取TLE轨道根数
  getTrackTle(data = {}) {
    return request.post('/track/trackTle', data)
  }
}

/**
 * 测控数据相关接口（需要根据后端实际情况调整）
 */
export const ttcApi = {
  // 获取遥控记录
  getRemoteControlList(data = {}) {
    return request.post('/ttc/remoteControl/list', data)
  },
  
  // 获取遥测记录
  getTelemetryList(data = {}) {
    return request.post('/ttc/telemetry/list', data)
  },
  
  // 获取数传记录
  getDataTransmissionList(data = {}) {
    return request.post('/ttc/dataTransmission/list', data)
  },
  
  // 发送指令
  sendCommand(data) {
    return request.post('/ttc/command/send', data)
  }
}

/**
 * 仪表盘统计相关接口
 */
export const dashboardApi = {
  // 获取统计数据
  getStats() {
    return request.post('/dashboard/stats')
  },

  // 获取轨道数据
  getOrbitData() {
    return request.post('/dashboard/orbitData')
  },

  // 获取任务时间线
  getMissionTimeline() {
    return request.post('/dashboard/missionTimeline')
  }
}

/**
 * 可用弧段管理相关接口 (AvailableSegments)
 */
export const availableSegmentsApi = {
  // 分页查询弧段列表
  getList(data = {}) {
    return request.post('/available-segments/list', data)
  },

  // 查询单条弧段
  getById(id) {
    return request.get(`/available-segments/${id}`)
  },

  // 新增弧段
  add(data) {
    return request.post('/available-segments', data)
  },

  // 更新弧段
  update(id, data) {
    return request.put(`/available-segments/${id}`, data)
  },

  // 删除弧段
  delete(id) {
    return request.delete(`/available-segments/${id}`)
  },

  // 批量删除弧段
  batchDelete(ids) {
    return request.post('/available-segments/batch-delete', ids)
  },

  // 更新弧段状态
  updateStatus(id, status) {
    return request.post(`/available-segments/${id}/status?status=${status}`)
  },

  // 计算可用弧段
  compute(data) {
    return request.post('/available-segments/compute', data)
  },

  // 查询可用弧段（兼容旧接口）
  query(data) {
    return request.post('/available-segments/query', data)
  },

  // 获取任务统计数据
  getStats() {
    return request.post('/available-segments/stats')
  },

  // 批量申请任务
  batchApply(data) {
    return request.post('/available-segments/batch-apply', data)
  },

  // 更新任务类型
  updateTaskMode(id, taskMode) {
    return request.post(`/available-segments/${id}/taskMode`, { taskMode })
  }
}
