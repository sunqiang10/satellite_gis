# 天地图离线瓦片配置说明

## 目录结构

```
public/
└── tiles/
    └── tianditu/
        ├── 0/
        │   ├── 0/
        │   │   └── 0.png
        │   └── 1/
        │       └── 0.png
        ├── 1/
        │   ├── 0/
        │   │   ├── 0.png
        │   │   └── 1.png
        │   └── 1/
        │       ├── 0.png
        │       └── 1.png
        └── ... (更多层级)
```

## 瓦片获取方式

### 方式一：使用天地图官方服务（需要联网）

如果需要在线使用，可以修改 `CesiumEarth.vue` 中的 `addOfflineTianDiTu` 方法：

```javascript
const addOfflineTianDiTu = () => {
  // 天地图在线服务（需要申请 key）
  const tiandituUrl = 'https://t{s}.tianditu.gov.cn/vec_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=vec&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&tk=你的天地图Key'
  
  const imageryProvider = new Cesium.UrlTemplateImageryProvider({
    url: tiandituUrl,
    subdomains: ['0', '1', '2', '3', '4', '5', '6', '7'],
    tilingScheme: new Cesium.WebMercatorTilingScheme(),
    minimumLevel: 0,
    maximumLevel: 18,
    tileWidth: 256,
    tileHeight: 256,
  })

  viewer.imageryLayers.addImageryProvider(imageryProvider)
}
```

### 方式二：下载离线瓦片（推荐）

1. **使用瓦片下载工具**
   - 推荐工具：地图下载器、水经注、Bigemap 等
   - 下载天地图矢量底图（vec）或影像底图（img）
   - 格式选择：PNG 或 JPG
   - 坐标系：Web Mercator（EPSG:3857）

2. **瓦片组织格式**
   - 层级（z）：0-18 级
   - 列（x）：根据层级不同
   - 行（y）：根据层级不同
   - 文件格式：`{z}/{x}/{y}.png`

3. **放置位置**
   - 将下载的瓦片放入 `public/tiles/tianditu/` 目录
   - 确保路径格式正确

4. **测试瓦片**
   - 访问 `http://localhost:5173/tiles/tianditu/0/0/0.png` 应能正常显示瓦片

## 推荐的瓦片级别

- 全球概览：0-5 级（约 10MB）
- 中国区域：0-8 级（约 100MB）
- 详细区域：0-12 级（约 1GB）

## 注意事项

1. **版权问题**：天地图数据有使用限制，请确保合法使用
2. **存储空间**：高级别瓦片会占用大量存储空间
3. **加载性能**：建议只下载需要的区域和级别

## 替代方案

如果不需要离线地图，可以使用以下替代方案：

1. **Cesium 默认底图**（需要联网）
2. **OpenStreetMap**（在线或离线）
3. **本地影像数据**（GeoTIFF 等）

## 组件配置

在 `CesiumEarth.vue` 中可以配置：

- 瓦片路径
- 显示级别范围
- 透明度
- 亮度对比度
