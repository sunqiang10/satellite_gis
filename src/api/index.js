import usersSeed from './mock-data/users.json'
import satellitesSeed from './mock-data/satellites.json'
import stationsSeed from './mock-data/stations.json'
import availableSegmentsSeed from './mock-data/available-segments.json'

const clone = (value) => JSON.parse(JSON.stringify(value))
const wait = (ms = 120) => new Promise((resolve) => setTimeout(resolve, ms))

const createState = () => ({
  users: clone(usersSeed),
  satellites: clone(satellitesSeed),
  stations: clone(stationsSeed),
  availableSegments: clone(availableSegmentsSeed),
})

const state = createState()

const nowText = () => {
  const now = new Date()
  const pad = (value) => String(value).padStart(2, '0')
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`
}

const paginate = (list, options = {}) => {
  const current = Number(options.pageNum || options.page || 1)
  const size = Number(options.pageSize || options.size || list.length || 10)
  const start = (current - 1) * size
  const records = list.slice(start, start + size)

  return {
    records: clone(records),
    total: list.length,
    totalCount: list.length,
    current,
    size,
    pageNum: current,
    pageSize: size,
  }
}

const nextNumericId = (list) => {
  const ids = list.map((item) => Number(item.id)).filter((id) => !Number.isNaN(id))
  return (ids.length ? Math.max(...ids) : 0) + 1
}

const matchKeyword = (value, keyword) => String(value || '').toLowerCase().includes(String(keyword || '').toLowerCase())

const getCurrentDemoUser = () => {
  const token = localStorage.getItem('token') || ''
  const matched = state.users.find((item) => token.includes(item.logonName))
  return matched || state.users[0]
}

const normalizeTaskMode = (taskMode) => {
  if (Array.isArray(taskMode)) {
    return taskMode.filter(Boolean).join(';')
  }
  return String(taskMode || '')
}

const computeAvailableSegmentStats = () => {
  const total = state.availableSegments.length
  const executing = state.availableSegments.filter((item) => String(item.status) === '2').length
  const scheduled = state.availableSegments.filter((item) => ['0', '1'].includes(String(item.status))).length
  const completed = state.availableSegments.filter((item) => String(item.status) === '3').length

  return {
    total,
    executing,
    scheduled,
    completed,
    totalIncrement: 3,
    executingIncrement: 1,
    scheduledIncrement: 2,
    completedIncrement: 1,
  }
}

export const userApi = {
  async login(data = {}) {
    await wait()

    const username = data.username || data.logonName
    const user = state.users.find((item) => item.logonName === username || item.username === username)

    if (!user) {
      throw new Error('登录失败:用户名不存在')
    }

    if (user.password !== data.password) {
      throw new Error('登录失败:密码不正确')
    }

    const token = `mock-token-${user.logonName}-${Date.now()}`

    return {
      id: user.id,
      logonName: user.logonName,
      username: user.username,
      role: user.role,
      realName: user.realName,
      company: user.company,
      permissions: user.role === 'admin' ? ['read', 'write', 'delete'] : ['read', 'write'],
      token,
    }
  },

  async configUserSatellite(data = {}) {
    await wait()
    return {
      success: true,
      message: '配置成功',
      data,
    }
  },

  async getList() {
    await wait()
    return clone(state.users).map(({ password, ...rest }) => rest)
  },

  async add(data = {}) {
    await wait()
    const id = String(nextNumericId(state.users))
    const record = {
      id,
      logonName: data.logonName || `user${id}`,
      username: data.username || data.logonName || `user${id}`,
      password: data.password || '123456',
      telephone: data.telephone || '',
      email: data.email || '',
      role: data.role || 'user',
      company: data.company || '',
      position: data.position || '',
      communicator: data.communicator || '',
      realName: data.realName || data.username || data.logonName || `用户${id}`,
      regTime: data.regTime || nowText(),
    }
    state.users.unshift(record)
    const { password, ...rest } = record
    return clone(rest)
  },

  async update(data = {}) {
    await wait()
    const index = state.users.findIndex((item) => String(item.id) === String(data.id))
    if (index === -1) {
      throw new Error('用户不存在')
    }

    state.users[index] = {
      ...state.users[index],
      ...clone(data),
      password: data.password || state.users[index].password,
    }

    const { password, ...rest } = state.users[index]
    return clone(rest)
  },

  async delete(id) {
    await wait()
    state.users.splice(
      state.users.findIndex((item) => String(item.id) === String(id)),
      1,
    )
    return {
      success: true,
      id,
    }
  },
}

export const satelliteApi = {
  async getList(data = {}) {
    await wait()
    let list = clone(state.satellites)

    if (data.keyword) {
      list = list.filter(
        (item) => matchKeyword(item.satName, data.keyword) || matchKeyword(item.satId, data.keyword) || matchKeyword(item.owner, data.keyword),
      )
    }

    return paginate(list, data)
  },

  async add(data = {}) {
    await wait()
    const id = nextNumericId(state.satellites)
    const record = {
      id,
      satId: data.satId || `SAT-DEMO-${id}`,
      satName: data.satName || `演示卫星-${id}`,
      satTleName: data.satTleName || `DEMO-SAT-${id}`,
      satType: Number(data.satType || 4),
      owner: data.owner || '演示单位',
      orbitNum: Number(data.orbitNum || 1000 + id),
      mass: Number(data.mass || 3000),
      area: Number(data.area || 10),
      batteryCapacity: Number(data.batteryCapacity || 80),
      storageCapacity: Number(data.storageCapacity || 256),
      dataRate: Number(data.dataRate || 120),
      attitudeType: data.attitudeType || '三轴稳定',
      canUse: Number(data.canUse ?? 1),
      addTime: data.addTime || nowText(),
      modTime: nowText(),
    }
    state.satellites.unshift(record)
    return clone(record)
  },

  async update(data = {}) {
    await wait()
    const index = state.satellites.findIndex((item) => Number(item.id) === Number(data.id))
    if (index === -1) {
      throw new Error('卫星不存在')
    }

    state.satellites[index] = {
      ...state.satellites[index],
      ...clone(data),
      modTime: nowText(),
    }

    return clone(state.satellites[index])
  },

  async delete(id) {
    await wait()
    const index = state.satellites.findIndex((item) => Number(item.id) === Number(id))
    if (index !== -1) {
      state.satellites.splice(index, 1)
    }
    return {
      success: true,
      id,
    }
  },
}

export const stationApi = {
  async getList(data = {}) {
    await wait()
    let list = clone(state.stations)

    if (data.keyword) {
      list = list.filter(
        (item) => matchKeyword(item.stationName, data.keyword) || matchKeyword(item.stationId, data.keyword) || matchKeyword(item.owner, data.keyword),
      )
    }

    return paginate(list, data)
  },

  async add(data = {}) {
    await wait()
    const id = nextNumericId(state.stations)
    const record = {
      id,
      stationId: data.stationId || `ST-DEMO-${id.toString().padStart(3, '0')}`,
      stationName: data.stationName || `演示站点-${id}`,
      stationCode: data.stationCode || `DM${id}`,
      owner: data.owner || '演示单位',
      canUse: Number(data.canUse ?? 1),
      lon: Number(data.lon || 0),
      lat: Number(data.lat || 0),
      alt: Number(data.alt || 0),
      addTime: data.addTime || nowText(),
      modTime: nowText(),
    }
    state.stations.unshift(record)
    return clone(record)
  },

  async update(data = {}) {
    await wait()
    const index = state.stations.findIndex((item) => Number(item.id) === Number(data.id))
    if (index === -1) {
      throw new Error('站点不存在')
    }

    state.stations[index] = {
      ...state.stations[index],
      ...clone(data),
      modTime: nowText(),
    }

    return clone(state.stations[index])
  },

  async delete(id) {
    await wait()
    const index = state.stations.findIndex((item) => Number(item.id) === Number(id))
    if (index !== -1) {
      state.stations.splice(index, 1)
    }
    return {
      success: true,
      id,
    }
  },

  async computeAvailableArcSegments(data = {}) {
    await wait()
    return clone(state.availableSegments).filter(
      (item) => (!data.satellite || item.satellite === data.satellite) && (!data.antenna || item.antenna === data.antenna),
    )
  },

  async getUsedSegmentSX() {
    await wait()
    return clone(state.availableSegments).filter((item) => ['1', '2'].includes(String(item.status)))
  },
}

export const taskApi = {
  async queryIdleArc(data = {}) {
    await wait()
    return clone(state.availableSegments).filter((item) => String(item.status) === '0' && (!data.satellite || item.satellite === data.satellite))
  },

  async applyArc(data = {}) {
    await wait()
    return availableSegmentsApi.batchApply(data)
  },

  async editArc(data = {}) {
    await wait()
    return {
      code: 200,
      message: '任务修改成功',
      data,
      total: 1,
    }
  },

  async cancelArc(data = {}) {
    await wait()
    return {
      code: 200,
      message: '任务取消成功',
      data,
      total: Array.isArray(data) ? data.length : 1,
    }
  },

  async queryArrangedArc() {
    await wait()
    return clone(state.availableSegments).filter((item) => ['1', '2'].includes(String(item.status)))
  },
}

export const trackApi = {
  async getTrackGen(data = {}) {
    await wait()
    return {
      ...data,
      satellite: data.satellite || 'SAT-DEMO',
      a: 6878.14,
      e: 0.0012,
      i: 98.6,
      o: 120.3,
      w: 35.2,
      m: 280.6,
      revNum: 1288,
      conStatus: 1,
    }
  },

  async getTrackTle(data = {}) {
    await wait()
    return {
      ...data,
      satellite: data.satellite || 'SAT-DEMO',
      tle0: 'SAT-DEMO',
      line1: '1 25544U 98067A   26076.51234567  .00001234  00000-0  29603-4 0  9991',
      line2: '2 25544  51.6423 104.1234 0005123 128.1234 289.5678 15.49876543234567',
      conStatus: '1',
    }
  },
}

export const ttcApi = {
  async getRemoteControlList() {
    await wait()
    return []
  },

  async getTelemetryList() {
    await wait()
    return []
  },

  async getDataTransmissionList() {
    await wait()
    return []
  },

  async sendCommand(data = {}) {
    await wait()
    return {
      success: true,
      message: '指令已提交',
      data,
    }
  },
}

export const dashboardApi = {
  async getStats() {
    await wait()
    return {
      onlineSatellites: state.satellites.filter((item) => item.canUse === 1).length,
      onlineStations: state.stations.filter((item) => item.canUse === 1).length,
      tasks: state.availableSegments.filter((item) => ['1', '2'].includes(String(item.status))).length,
      users: state.users.length,
    }
  },

  async getOrbitData() {
    await wait()
    return clone(state.availableSegments.slice(0, 8))
  },

  async getMissionTimeline() {
    await wait()
    return clone(state.availableSegments.slice(0, 8)).map((item) => ({
      taskId: item.taskId,
      satellite: item.satellite,
      start: item.accessStartTime,
      end: item.accessEndTime,
      status: item.status,
    }))
  },
}

export const availableSegmentsApi = {
  async getList(data = {}) {
    await wait()
    let list = clone(state.availableSegments)

    if (data.satellite) {
      list = list.filter((item) => item.satellite === data.satellite)
    }
    if (data.antenna) {
      list = list.filter((item) => item.antenna === data.antenna)
    }
    if (data.circleId) {
      list = list.filter((item) => matchKeyword(item.circleId, data.circleId))
    }
    if (data.status !== undefined && data.status !== null && data.status !== '') {
      list = list.filter((item) => String(item.status) === String(data.status))
    }
    if (data.taskMode) {
      const modes = String(data.taskMode).split(';').filter(Boolean)
      list = list.filter((item) => modes.every((mode) => String(item.taskMode || '').includes(mode)))
    }
    if (data.startTime) {
      list = list.filter((item) => String(item.accessStartTime) >= String(data.startTime))
    }
    if (data.endTime) {
      list = list.filter((item) => String(item.accessEndTime) <= String(data.endTime))
    }

    return paginate(list, data)
  },

  async getById(id) {
    await wait()
    return clone(state.availableSegments.find((item) => Number(item.id) === Number(id)) || null)
  },

  async add(data = {}) {
    await wait()
    const record = {
      id: nextNumericId(state.availableSegments),
      satellite: data.satellite || '',
      antenna: data.antenna || '',
      taskId: data.taskId || `TASK-${Date.now()}`,
      maxE: data.maxE || '0',
      accessStartTime: data.accessStartTime || nowText(),
      accessEndTime: data.accessEndTime || nowText(),
      scStartTime: data.scStartTime || nowText(),
      scEndTime: data.scEndTime || nowText(),
      status: String(data.status ?? '0'),
      taskMode: normalizeTaskMode(data.taskMode),
      circleId: data.circleId || '',
      accessCenterTime: data.accessCenterTime || nowText(),
      startE: data.startE || '',
      endE: data.endE || '',
      originator: data.originator || 'MCC-01',
      username: data.username || '',
      submitTime: data.submitTime || null,
    }
    state.availableSegments.unshift(record)
    return clone(record)
  },

  async update(id, data = {}) {
    await wait()
    const index = state.availableSegments.findIndex((item) => Number(item.id) === Number(id))
    if (index === -1) {
      throw new Error('弧段不存在')
    }
    state.availableSegments[index] = {
      ...state.availableSegments[index],
      ...clone(data),
      taskMode: data.taskMode ? normalizeTaskMode(data.taskMode) : state.availableSegments[index].taskMode,
    }
    return clone(state.availableSegments[index])
  },

  async delete(id) {
    await wait()
    const index = state.availableSegments.findIndex((item) => Number(item.id) === Number(id))
    if (index !== -1) {
      state.availableSegments.splice(index, 1)
    }
    return {
      success: true,
      id,
    }
  },

  async batchDelete(ids = []) {
    await wait()
    const idSet = new Set(ids.map((item) => Number(item)))
    state.availableSegments = state.availableSegments.filter((item) => !idSet.has(Number(item.id)))
    return {
      success: true,
      deleted: ids.length,
    }
  },

  async updateStatus(id, status) {
    await wait()
    const item = state.availableSegments.find((record) => Number(record.id) === Number(id))
    if (!item) {
      throw new Error('弧段不存在')
    }

    item.status = String(status)
    if (String(status) === '2') {
      item.username = getCurrentDemoUser().username
      item.submitTime = nowText()
    }
    if (String(status) === '0') {
      item.username = ''
      item.submitTime = null
    }

    return {
      success: true,
      data: clone(item),
    }
  },

  async compute(data = {}) {
    await wait()
    return clone(state.availableSegments).filter(
      (item) => (!data.satellite || item.satellite === data.satellite) && (!data.antenna || item.antenna === data.antenna),
    )
  },

  async query(data = {}) {
    await wait()
    return this.getList(data)
  },

  async getStats() {
    await wait()
    return computeAvailableSegmentStats()
  },

  async batchApply(data = {}) {
    await wait()

    const taskIds = new Set((data.planList || []).map((item) => item.taskID))
    let success = 0

    state.availableSegments.forEach((item) => {
      if (taskIds.has(item.taskId)) {
        item.status = '2'
        item.taskMode = normalizeTaskMode(data.daType || item.taskMode)
        item.username = getCurrentDemoUser().username
        item.submitTime = nowText()
        success += 1
      }
    })

    return {
      code: 200,
      message: '批量申请成功',
      data: {
        success,
        fail: 0,
      },
    }
  },

  async updateTaskMode(id, taskMode) {
    await wait()
    const item = state.availableSegments.find((record) => Number(record.id) === Number(id))
    if (!item) {
      throw new Error('弧段不存在')
    }

    item.taskMode = normalizeTaskMode(taskMode)
    return {
      success: true,
      data: clone(item),
    }
  },
}
