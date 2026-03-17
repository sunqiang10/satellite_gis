<template>
  <div ref="container" class="cesium-container"></div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import * as Cesium from 'cesium'
import 'cesium/Build/Cesium/Widgets/widgets.css'

const container = ref(null)
let viewer = null

// 创建地面站图标
const createGroundStationIcon = () => {
  const canvas = document.createElement('canvas')
  canvas.width = 20
  canvas.height = 20
  const ctx = canvas.getContext('2d')
  
  ctx.fillStyle = '#10b981'
  ctx.beginPath()
  ctx.moveTo(10, 2)
  ctx.lineTo(18, 18)
  ctx.lineTo(2, 18)
  ctx.closePath()
  ctx.fill()
  
  ctx.strokeStyle = '#ffffff'
  ctx.lineWidth = 2
  ctx.stroke()
  
  return canvas.toDataURL()
}

// 添加卫星轨道和标记
const addSatelliteOrbits = () => {
  const earthRadius = 6371000 // 地球半径（米）
  
  const satellites = [
    { 
      name: 'SX-01', 
      altitude: 500000,   // 500公里高度
      inclination: 85,   // 极地轨道
      color: '#06b6d4',
      period: 90,        // 轨道周期（秒）
      phase: 0,
      centerLon: 105
    },
    { 
      name: 'SX-02', 
      altitude: 600000,
      inclination: 88,
      color: '#10b981',
      period: 100,
      phase: 120
    },
    { 
      name: 'SX-03', 
      altitude: 550000,
      inclination: 45,
      color: '#f59e0b',
      period: 95,
      phase: 240
    }
  ]

  satellites.forEach((sat) => {
    const orbitRadius = earthRadius + sat.altitude
    
    // 绘制3D轨道线
    const orbitPositions = []
    for (let i = 0; i <= 360; i += 5) {
      const angle = Cesium.Math.toRadians(i)
      const incRad = Cesium.Math.toRadians(sat.inclination)
      
      // 3D圆形轨道参数方程
      const x = orbitRadius * Math.cos(angle)
      const y = orbitRadius * Math.sin(angle) * Math.cos(incRad)
      const z = orbitRadius * Math.sin(angle) * Math.sin(incRad)
      
      orbitPositions.push(new Cesium.Cartesian3(x, y, z))
    }

    viewer.entities.add({
      polyline: {
        positions: orbitPositions,
        width: 1,
        material: new Cesium.ColorMaterialProperty(
          Cesium.Color.fromCssColorString(sat.color).withAlpha(0.15)
        )
      }
    })

    // 添加卫星模型 - 真正的环绕飞行
    viewer.entities.add({
      position: new Cesium.CallbackProperty((time) => {
        const seconds = Cesium.JulianDate.secondsDifference(time, viewer.clock.startTime)
        const angle = Cesium.Math.toRadians(((seconds % sat.period) / sat.period) * 360 + sat.phase)
        const incRad = Cesium.Math.toRadians(sat.inclination)
        
        // 实时计算3D位置
        const x = orbitRadius * Math.cos(angle)
        const y = orbitRadius * Math.sin(angle) * Math.cos(incRad)
        const z = orbitRadius * Math.sin(angle) * Math.sin(incRad)
        
        return new Cesium.Cartesian3(x, y, z)
      }, false),
      model: {
        uri: new URL('../assets/model/satellite.gltf', import.meta.url).href,
        minimumPixelSize: 64,
        maximumScale: 200000,
        scale: 80000,
      },
      label: {
        text: sat.name,
        font: 'bold 12px sans-serif',
        fillColor: Cesium.Color.WHITE,
        outlineColor: Cesium.Color.BLACK,
        outlineWidth: 2,
        style: Cesium.LabelStyle.FILL_AND_OUTLINE,
        verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
        pixelOffset: new Cesium.Cartesian2(0, -30)
      }
    })
  })

  const groundStations = [
    { name: '北京站', lon: 116.4, lat: 39.9 },
    { name: '喀什站', lon: 76.0, lat: 39.5 },
    { name: '三亚站', lon: 109.5, lat: 18.3 },
  ]

  groundStations.forEach(station => {
    viewer.entities.add({
      position: Cesium.Cartesian3.fromDegrees(station.lon, station.lat, 0),
      billboard: {
        image: createGroundStationIcon(),
        width: 18,
        height: 18,
        verticalOrigin: Cesium.VerticalOrigin.BOTTOM
      },
      label: {
        text: station.name,
        font: '10px sans-serif',
        fillColor: Cesium.Color.fromCssColorString('#10b981'),
        outlineColor: Cesium.Color.BLACK,
        outlineWidth: 2,
        style: Cesium.LabelStyle.FILL_AND_OUTLINE,
        verticalOrigin: Cesium.VerticalOrigin.TOP,
        pixelOffset: new Cesium.Cartesian2(0, -5)
      }
    })
  })
}

// 添加天地图底图
const addOfflineTianDiTu = () => {
  const tdt_cta = new Cesium.UrlTemplateImageryProvider({
    url: 'http://webst02.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=6&x={x}&y={y}&z={z}'
  })
  const layer = viewer.imageryLayers.addImageryProvider(tdt_cta)
  layer.alpha = 0.8
}

onMounted(() => {
  if (!container.value) return

  Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJlYzYzM2Y3My0wYjUyLTRkZDItYjY5MC05ZjU2YjZlYzE3ZGYiLCJpZCI6MjQ1MTY0LCJpYXQiOjE3MjgyNDE1MDR9.XCza1hGhx3zZ5_3p3g7K-7dNq4p7C3q9v8w8x8y8z8'

  viewer = new Cesium.Viewer(container.value, {
    animation: false,
    timeline: false,
    baseLayerPicker: false,
    geocoder: false,
    homeButton: false,
    sceneModePicker: false,
    navigationHelpButton: false,
    fullscreenButton: false,
    vrButton: false,
    infoBox: false,
    selectionIndicator: false,
    skyBox: false,
    skyAtmosphere: false,
    imageryProvider: false,
  })

  if (viewer.cesiumWidget && viewer.cesiumWidget.creditContainer) {
    viewer.cesiumWidget.creditContainer.style.display = 'none'
  }

  viewer.scene.backgroundColor = new Cesium.Color(0, 0, 0, 0)
  
  if (viewer.scene.sun) viewer.scene.sun.show = false
  if (viewer.scene.moon) viewer.scene.moon.show = false
  
  if (viewer.scene.globe) {
    viewer.scene.globe.enableLighting = false
    viewer.scene.globe.depthTestAgainstTerrain = false
  }

  addOfflineTianDiTu()

  viewer.camera.setView({
    destination: Cesium.Cartesian3.fromDegrees(105, 35, 20000000),
    orientation: {
      heading: Cesium.Math.toRadians(0),
      pitch: Cesium.Math.toRadians(-90),
      roll: 0
    }
  })

  viewer.scene.screenSpaceCameraController.enableRotate = true
  viewer.scene.screenSpaceCameraController.enableZoom = true
  viewer.scene.screenSpaceCameraController.enableTranslate = false
  viewer.scene.screenSpaceCameraController.enableTilt = false
  viewer.scene.screenSpaceCameraController.enableLook = false

  viewer.clock.shouldAnimate = true
  viewer.clock.startTime = Cesium.JulianDate.now()
  viewer.clock.currentTime = Cesium.JulianDate.now()
  viewer.clock.clockRange = Cesium.ClockRange.UNBOUNDED
  viewer.clock.multiplier = 1

  let rotationSpeed = 0.02
  viewer.scene.preRender.addEventListener(() => {
    viewer.scene.camera.rotate(Cesium.Cartesian3.UNIT_Z, Cesium.Math.toRadians(rotationSpeed))
  })

  addSatelliteOrbits()
})

onUnmounted(() => {
  if (viewer) {
    viewer.destroy()
    viewer = null
  }
})
</script>

<style scoped>
.cesium-container {
  width: 100%;
  height: 100%;
  position: relative;
}

:deep(.cesium-viewer-bottom),
:deep(.cesium-viewer-toolbar),
:deep(.cesium-viewer-animationContainer),
:deep(.cesium-viewer-timelineContainer) {
  display: none !important;
}
</style>
