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
import HaoDesign form 'hao-design'
export default {
    components: {
        HModal: HaoDesign.HModal
    }
}
```

单个引入
```js
import { HModal } form 'hao-design'
export default {
    components: {
        HModal
    }
}
```
