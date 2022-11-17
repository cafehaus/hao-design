# hao-design 好运业务常用UI组件二次封装
在 view-design 组件的基础上二次封装
### 安装组件库

使用 npm:
```
npm install hao-design --save
```

### vue 组件里使用

整体引入
```js
import HaoDesign from 'hao-design'
export default {
    components: {
        HModal: HaoDesign.HModal
    }
}
```

单个引入
```js
import { HModal } from 'hao-design'
export default {
    components: {
        HModal
    }
}
```

### HModal 弹窗
依赖 iview 的 Modal 组件，支持所有属性设置

### HPager 分页
依赖 iview 的 page 组件，输入页面后可点击“确定”按钮切换，不用额外监听页码和页数变化

### HCollapse 折叠面板
有用到 iview 的 Icon 组件

### HDownloadExcel 下载 excel 按钮
依赖 iview 的 Button 组件

### HPoptip 气泡提示
支持放大缩小动画，项目中需安装 v-click-outside

### HPreviewImg 查看图片
有用到 iview 的 Carousel、CarouselItem 和 Icon 组件，支持传入单个路径、对象和数组，有值的时候会自动展示

### HRadioEnable 启用/禁用单选操作
用 iview 的 Radio 组件异步不好控制，常用于 Table 表格里的数据启用/禁用操作
