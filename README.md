# satellite_gis

一个基于 Vue 3 + Vite 的卫星地面站业务前端项目，面向“遥测遥控、任务管理、站点管理、卫星管理、系统总览”这类场景，整体界面采用深色科技风控制中心样式，并集成了地球可视化能力。

## 项目概览

从当前代码来看，这个项目的定位是“卫星任务控制 / 地面站管理 / 遥测遥控展示”的单页应用前端，主要包含以下能力：

- 登录鉴权与路由守卫
- 控制中心风格主布局
- 系统总览大屏
- 卫星实时监控页
- 任务管理、站点管理、卫星管理
- 遥测遥控记录查询与指令发送入口
- 客户服务 / 计费规则展示
- 系统管理与系统设置
- Cesium 地球、轨道、卫星模型展示

项目当前同时存在两类数据来源：

- 真实接口封装：位于 `src/api`，默认通过 `/api` 代理到本地后端
- 本地示例数据：部分页面直接在组件内写死演示数据，另有 `src/api/mock.js` 作为 mock 示例

## 技术栈

- Vue 3
- Vite 6
- Vue Router
- Pinia
- Element Plus
- Tailwind CSS 4
- Axios
- Cesium
- Three.js
- ECharts
- html2canvas
- jsPDF / jspdf-autotable
- xlsx

## 运行方式

推荐使用 `pnpm`，因为仓库中存在 `pnpm-lock.yaml`。

```bash
pnpm install
pnpm dev
```

构建生产包：

```bash
pnpm build
```

如果你使用 `npm`，也可以执行：

```bash
npm install
npm run dev
npm run build
```

## 本地开发配置

`vite.config.ts` 中已配置开发服务器：

- 端口：`3000`
- 接口代理前缀：`/api`
- 代理目标：`http://localhost:37818`

也就是说，前端开发时访问的 `/api/**` 请求会被转发到本地后端服务。

Axios 默认配置位于 `src/api/request.js`：

- `baseURL` 优先读取 `VITE_API_BASE_URL`
- 若未配置，则默认使用 `/api`
- 请求头默认 `application/json`
- 会自动从 `localStorage` 读取 token，放入 `Authorization: Bearer <token>`

## 登录与权限

项目使用 Pinia 中的 `auth` store 管理登录态：

- token 持久化保存在 `localStorage`
- 路由守卫会拦截需要登录的页面
- 未登录时访问业务页面会跳转到 `/login`
- 已登录时再次访问 `/login` 会跳转到 `/dashboard`

核心文件：

- `src/stores/auth.js`
- `src/router/index.js`
- `src/views/LoginPage.vue`

## 页面结构

当前路由大致分为两层：

### 1. 登录页

- `/login`

特点：

- 使用 `ThreeEarth.vue` 做 3D 地球背景
- 带星空、扫描线、轨道和卫星装饰动画
- 登录成功后进入 `/dashboard`

### 2. 主控台业务区

业务区统一挂在 `src/layouts/CommandCenterLayout.vue` 下，顶部有统一导航、当前时间、全屏按钮和退出登录。

主要页面如下：

- `/dashboard`
  系统总览页，包含顶部统计卡片、卫星状态、站点状态、资源使用、告警、事件流、通信日志，以及中间的 Cesium 地球视图。

- `/management`
  系统管理页，当前主要实现了用户管理，支持列表查询、新增、编辑、删除。

- `/settings`
  系统设置页，包含系统名称、刷新间隔、语言、时区、通知开关等基础配置。

- `/satellite/dashboard`
  卫星实时监控页，偏大屏风格，展示遥测、控制项、设备状态等实时信息。

- `/satellite/mission`
  任务管理页，展示任务统计、筛选条件、任务列表等。

- `/satellite/ttc`
  遥测遥控管理页，包含遥控记录、遥测记录等查询入口，并提供“发送指令”操作入口。

- `/satellite/station`
  站点管理页，展示地面站信息、状态和增删改查能力。

- `/satellite/satellite`
  卫星管理页，展示卫星资产信息、状态、电量、存储等，并提供管理操作。

- `/satellite/planning`
  当前页面标题更接近“需求/圈次/故障统计”管理，支持搜索、筛选、查看、审批、编辑、删除。

- `/satellite/qa`
  当前页面更接近“客户服务 / 计费规则”管理，包含按圈次、按数据量、按服务类型计费等展示内容。

## 地球与三维可视化

项目里有两个和地球相关的核心组件：

### `src/components/CesiumEarth.vue`

用于主控台中的 3D 地球展示，当前实现包括：

- 初始化 Cesium Viewer
- 隐藏默认工具栏和版权区
- 添加离线/第三方底图
- 绘制多条卫星轨道
- 加载卫星 glTF 模型
- 添加地面站标记
- 自动旋转地球视角

依赖资源：

- `src/assets/model/satellite.gltf`
- `src/assets/model/satellite.bin`

### `src/components/ThreeEarth.vue`

用于登录页的视觉化 3D 地球背景，主要承担首页动效和视觉表达。

## API 模块

接口统一在 `src/api/index.js` 中按领域拆分，当前已经封装了以下模块：

- `userApi`
- `satelliteApi`
- `stationApi`
- `taskApi`
- `trackApi`
- `ttcApi`
- `dashboardApi`
- `availableSegmentsApi`

这些模块说明项目已经对接或计划对接如下后端领域：

- 用户与权限
- 卫星资产
- 地面站
- 弧段/任务申请
- 轨道根数与 TLE
- 遥测遥控
- 仪表盘统计
- 可用弧段管理

## 目录说明

```text
.
├─ public/
│  └─ tiles/                  静态瓦片目录说明
├─ src/
│  ├─ api/                    接口封装、axios 实例、mock 数据
│  ├─ assets/                 图片、地球贴图、卫星模型
│  ├─ components/             可复用组件，如 CesiumEarth、ThreeEarth
│  ├─ layouts/                页面布局
│  ├─ router/                 路由配置与守卫
│  ├─ stores/                 Pinia 状态管理
│  ├─ styles/                 全局样式、主题、字体、Element Plus 深色覆盖
│  ├─ views/                  页面组件
│  │  └─ satellite/           卫星业务子页面
│  ├─ App.vue                 应用根组件
│  └─ main.js                 应用入口
├─ index.html
├─ package.json
├─ postcss.config.mjs
└─ vite.config.ts
```

## 当前实现特点

- 整体 UI 风格统一，偏“指挥中心 / 大屏监控”视觉
- 已完成较完整的页面骨架和主要交互布局
- 路由和基础登录流程已接通
- 多数业务页已具备表格、筛选、弹窗等管理后台常见能力
- 可视化能力较强，适合继续扩展监控、轨道、遥测相关场景

## 当前需要注意的点

从现有代码判断，项目还处在“可演示 + 部分对接”的阶段，接手时建议注意以下问题：

- 部分页面直接使用本地静态数据，和真实后端接口并未完全打通
- 仓库中没有看到测试脚本，当前 `package.json` 只有 `dev` 和 `build`
- 一些页面命名与实际业务内容已有偏差，例如 `SatellitePlanningPage.vue` 更像需求/圈次管理，`SatelliteQaPage.vue` 更像客户服务/计费管理
- 代码中存在少量中文注释或文案乱码现象，后续建议统一文件编码并清理显示文本
- `CesiumEarth.vue` 中包含硬编码的 Cesium Ion token，正式环境建议迁移到环境变量

## 建议的后续整理方向

- 补齐 `.env` / `.env.example`，统一管理接口地址、Cesium 配置等环境变量
- 明确哪些页面走真实接口，哪些页面仍是 mock 演示
- 统一路由命名、菜单命名和页面职责
- 增加接口类型定义或数据结构文档
- 增加 lint / test / build 检查流程
- 为 README 增补接口联调说明、账号说明、部署说明

## 关键文件

- `src/main.js`：应用启动入口
- `src/router/index.js`：路由和登录守卫
- `src/stores/auth.js`：登录态管理
- `src/layouts/CommandCenterLayout.vue`：主控台布局
- `src/components/CesiumEarth.vue`：Cesium 地球场景
- `src/views/LoginPage.vue`：登录页
- `src/views/DashboardPage.vue`：系统总览页
- `src/views/satellite/`：卫星业务相关页面

## 总结

这是一个以卫星地面站业务为背景的前端控制中心项目，已经具备较完整的页面体系、主控台风格和三维地球展示能力。它非常适合继续向“真实业务联调、监控展示、任务调度、资产管理”方向演进。
