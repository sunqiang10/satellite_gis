import axios from 'axios'

const mockDelay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms))

export const mockApi = {
  async login(username, password) {
    await mockDelay(800)
    if (username && password) {
      return {
        success: true,
        data: {
          token: 'mock-token-' + Date.now(),
          user: {
            id: 1,
            username,
            role: 'admin',
            permissions: ['read', 'write', 'delete']
          }
        }
      }
    }
    throw new Error('用户名或密码错误')
  },

  async getSatellites() {
    await mockDelay(300)
    return {
      success: true,
      data: [
        {
          id: 1,
          name: '北斗三号-G1',
          type: '导航卫星',
          status: 'active',
          orbit: 'GEO',
          latitude: 0,
          longitude: 140,
          altitude: 35786,
          battery: 92,
          temperature: 24,
          lastContact: '2026-02-11 10:30:00'
        },
        {
          id: 2,
          name: '风云四号-A',
          type: '气象卫星',
          status: 'active',
          orbit: 'GEO',
          latitude: 0,
          longitude: 105,
          altitude: 35786,
          battery: 88,
          temperature: 26,
          lastContact: '2026-02-11 10:28:00'
        },
        {
          id: 3,
          name: '高分三号',
          type: '遥感卫星',
          status: 'active',
          orbit: 'LEO',
          latitude: 35.8,
          longitude: 104.2,
          altitude: 755,
          battery: 95,
          temperature: 18,
          lastContact: '2026-02-11 10:25:00'
        },
        {
          id: 4,
          name: '实践二十号',
          type: '技术试验卫星',
          status: 'maintenance',
          orbit: 'GEO',
          latitude: 0,
          longitude: 120,
          altitude: 35786,
          battery: 65,
          temperature: 32,
          lastContact: '2026-02-11 09:45:00'
        },
        {
          id: 5,
          name: '天链一号-05',
          type: '中继卫星',
          status: 'active',
          orbit: 'GEO',
          latitude: 0,
          longitude: 160,
          altitude: 35786,
          battery: 90,
          temperature: 22,
          lastContact: '2026-02-11 10:32:00'
        }
      ]
    }
  },

  async getRequirements() {
    await mockDelay(300)
    return {
      success: true,
      data: [
        {
          id: 1,
          title: '华北地区灾害监测',
          type: '成像任务',
          priority: 'high',
          status: 'pending',
          requester: '应急管理部',
          deadline: '2026-02-15',
          description: '对华北地区进行高分辨率成像，用于灾害评估'
        },
        {
          id: 2,
          title: '南海海域气象观测',
          type: '气象监测',
          priority: 'medium',
          status: 'in_progress',
          requester: '气象局',
          deadline: '2026-02-18',
          description: '持续监测南海海域气象变化'
        },
        {
          id: 3,
          title: '西部边防通信保障',
          type: '通信任务',
          priority: 'high',
          status: 'approved',
          requester: '国防部',
          deadline: '2026-02-12',
          description: '为西部边防地区提供通信中继服务'
        },
        {
          id: 4,
          title: '东部沿海渔业监测',
          type: '成像任务',
          priority: 'low',
          status: 'pending',
          requester: '农业农村部',
          deadline: '2026-02-20',
          description: '监测东部沿海渔业活动情况'
        },
        {
          id: 5,
          title: '长江流域水质监测',
          type: '遥感监测',
          priority: 'medium',
          status: 'completed',
          requester: '生态环境部',
          deadline: '2026-02-10',
          description: '对长江流域水质进行遥感监测'
        }
      ]
    }
  },

  async getMissions() {
    await mockDelay(300)
    return {
      success: true,
      data: [
        {
          id: 1,
          name: '灾害监测任务-20260211',
          type: '成像',
          satellite: '高分三号',
          status: 'executing',
          progress: 65,
          startTime: '2026-02-11 08:00:00',
          endTime: '2026-02-11 12:00:00',
          operator: '张三'
        },
        {
          id: 2,
          name: '气象观测任务-20260211',
          type: '气象',
          satellite: '风云四号-A',
          status: 'scheduled',
          progress: 0,
          startTime: '2026-02-11 14:00:00',
          endTime: '2026-02-11 18:00:00',
          operator: '李四'
        },
        {
          id: 3,
          name: '通信保障任务-20260211',
          type: '通信',
          satellite: '天链一号-05',
          status: 'completed',
          progress: 100,
          startTime: '2026-02-11 06:00:00',
          endTime: '2026-02-11 10:00:00',
          operator: '王五'
        },
        {
          id: 4,
          name: '导航服务任务-20260211',
          type: '导航',
          satellite: '北斗三号-G1',
          status: 'executing',
          progress: 45,
          startTime: '2026-02-11 09:00:00',
          endTime: '2026-02-11 17:00:00',
          operator: '赵六'
        },
        {
          id: 5,
          name: '技术试验任务-20260210',
          type: '试验',
          satellite: '实践二十号',
          status: 'paused',
          progress: 30,
          startTime: '2026-02-10 10:00:00',
          endTime: '2026-02-10 16:00:00',
          operator: '钱七'
        }
      ]
    }
  },

  async getTtcData() {
    await mockDelay(200)
    return {
      success: true,
      data: {
        realtime: {
          signalStrength: 85,
          snr: 42.5,
          dataRate: 1024,
          uplinkFreq: 8400.5,
          downlinkFreq: 7200.3,
          temperature: 24.5,
          power: 95.2,
          antennaAngle: 45.3
        },
        commands: [
          {
            id: 1,
            command: 'SET_ATTITUDE',
            params: { pitch: 0.5, roll: 0.3, yaw: 0.2 },
            status: 'executed',
            timestamp: '2026-02-11 10:25:00'
          },
          {
            id: 2,
            command: 'UPLOAD_DATA',
            params: { size: '1024KB' },
            status: 'executing',
            timestamp: '2026-02-11 10:30:00'
          },
          {
            id: 3,
            command: 'CHECK_SYSTEM',
            params: {},
            status: 'pending',
            timestamp: '2026-02-11 10:35:00'
          }
        ]
      }
    }
  },

  async getStations() {
    await mockDelay(300)
    return {
      success: true,
      data: [
        {
          id: 1,
          name: '北京密云站',
          location: '北京市密云区',
          type: '主控站',
          status: 'active',
          antennaSize: 15,
          frequency: 'S/X/Ka',
          lastContact: '2026-02-11 10:30:00'
        },
        {
          id: 2,
          name: '新疆喀什站',
          location: '新疆喀什地区',
          type: '测控站',
          status: 'active',
          antennaSize: 12,
          frequency: 'S/X',
          lastContact: '2026-02-11 10:28:00'
        },
        {
          id: 3,
          name: '海南三亚站',
          location: '海南省三亚市',
          type: '测控站',
          status: 'active',
          antennaSize: 10,
          frequency: 'S/X',
          lastContact: '2026-02-11 10:32:00'
        },
        {
          id: 4,
          name: '黑龙江佳木斯站',
          location: '黑龙江省佳木斯市',
          type: '测控站',
          status: 'maintenance',
          antennaSize: 12,
          frequency: 'S/X',
          lastContact: '2026-02-11 08:45:00'
        },
        {
          id: 5,
          name: '云南昆明站',
          location: '云南省昆明市',
          type: '数据接收站',
          status: 'active',
          antennaSize: 8,
          frequency: 'X/Ka',
          lastContact: '2026-02-11 10:25:00'
        }
      ]
    }
  },

  async getQaData() {
    await mockDelay(300)
    return {
      success: true,
      data: {
        indicators: [
          { name: '成像质量', value: 95.2, trend: 'up', unit: '分' },
          { name: '轨道精度', value: 0.8, trend: 'stable', unit: '米' },
          { name: '数据完整性', value: 99.5, trend: 'up', unit: '%' },
          { name: '系统可用性', value: 98.8, trend: 'up', unit: '%' },
          { name: '响应时间', value: 2.3, trend: 'down', unit: '秒' }
        ],
        testResults: [
          {
            id: 1,
            testName: '成像质量测试',
            satellite: '高分三号',
            result: 'pass',
            score: 96,
            date: '2026-02-10'
          },
          {
            id: 2,
            testName: '轨道精度测试',
            satellite: '北斗三号-G1',
            result: 'pass',
            score: 98,
            date: '2026-02-10'
          },
          {
            id: 3,
            testName: '数据传输测试',
            satellite: '风云四号-A',
            result: 'pass',
            score: 94,
            date: '2026-02-09'
          },
          {
            id: 4,
            testName: '通信稳定性测试',
            satellite: '天链一号-05',
            result: 'warning',
            score: 88,
            date: '2026-02-09'
          }
        ],
        issues: [
          {
            id: 1,
            title: '实践二十号温度异常',
            severity: 'high',
            status: 'open',
            satellite: '实践二十号',
            description: '卫星温度持续偏高，需要进一步检查',
            createdAt: '2026-02-10 14:30:00'
          },
          {
            id: 2,
            title: '天链一号-05信号波动',
            severity: 'medium',
            status: 'in_progress',
            satellite: '天链一号-05',
            description: '信号强度出现周期性波动',
            createdAt: '2026-02-09 16:20:00'
          },
          {
            id: 3,
            title: '佳木斯站设备维护',
            severity: 'low',
            status: 'resolved',
            satellite: '-',
            description: '地面站设备例行维护完成',
            createdAt: '2026-02-08 09:00:00'
          }
        ]
      }
    }
  },

  async getDashboardStats() {
    await mockDelay(300)
    return {
      success: true,
      data: {
        totalSatellites: 5,
        activeSatellites: 4,
        totalMissions: 156,
        activeMissions: 12,
        successRate: 98.5,
        uptime: 99.9
      }
    }
  },

  async getOrbitData() {
    await mockDelay(200)
    const now = Date.now()
    const data = []
    for (let i = 0; i < 24; i++) {
      const time = now - (23 - i) * 3600000
      data.push({
        time: new Date(time).getHours() + ':00',
        value: Math.sin(i * 0.5) * 10 + 50 + Math.random() * 5
      })
    }
    return {
      success: true,
      data
    }
  },

  async getMissionTimeline() {
    await mockDelay(200)
    return {
      success: true,
      data: [
        { time: '08:00', event: '灾害监测任务开始', type: 'start' },
        { time: '09:00', event: '导航服务任务开始', type: 'start' },
        { time: '10:00', event: '通信保障任务完成', type: 'complete' },
        { time: '10:30', event: '数据上传完成', type: 'info' },
        { time: '14:00', event: '气象观测任务开始', type: 'start' },
        { time: '17:00', event: '导航服务任务完成', type: 'complete' }
      ]
    }
  }
}