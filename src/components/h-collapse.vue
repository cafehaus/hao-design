<template>
  <div class="h-collapse">
    <!-- 为订单详情定制 -->
    <div v-if="orderTitle" class="h-collapse-header-order">
      <h4 class="order-title">{{ orderTitle }}</h4>
      <div class="h-collapse-header-arrow" @click="toggle">
        <span>{{ value ? '收起' : '展开' }}</span>
        <Icon type="ios-arrow-down" :class="[value ? 'arrow arrow-active' : 'arrow']" />
      </div>
    </div>

    <!-- 通用：可通过 slot="header" 自定义整个面板头部 -->
    <div v-else class="h-collapse-header" @click="toggle">
      <slot name="header">
        <div class="h-collapse-header-arrow">
          <span>{{ value ? '收起' : '展开' }}</span>
          <Icon type="ios-arrow-down" :class="[value ? 'arrow arrow-active' : 'arrow']" />
        </div>
      </slot>
    </div>

    <!-- 展开内容 -->
    <transition name="fade">
      <div v-show="value" class="h-collapse-content">
        <slot />
      </div>
    </transition>
  </div>
</template>
<script>
/**
*  折叠面板组件
*  TODO：目前只能单个使用，可考虑整体封装，可手风琴模式展开
*
*  @param {boolean} value 控制展开/折叠
*  @param {string} orderTitle 为订单详情页面定制的头部，传了这个值就默认是订单详情弹窗使用
*/
  export default {
    name: 'HCollapse',
    props: {
      value: {
        type: Boolean,
        default: false,
      },
      orderTitle: { // 订单详情弹窗右边展示的次标题文字，传了这个参数就默认复用订单详情样式
        type: String,
        default: '',
      },
    },
    data() {
      return {}
    },

    methods: {
      toggle() {
        let flag = !this.value
        this.$emit('input', flag)
      },
    },
  }
</script>
<style lang="stylus" scoped>

.h-collapse
  .h-collapse-header-order
    font-size 16px
    font-weight 500
    color #868686
    display flex
    justify-content space-between
    align-items center
    width 230px
    height 40px
    margin-bottom 12px
    .title
      font-weight bold
      color #868686

  .h-collapse-header-arrow
    display flex
    align-items center
    font-size 12px
    color #116DF3
    cursor pointer
    .arrow
      font-size 14px
      display block
      font-size 10px
      margin-left 12px
      transition all .3s
      &.arrow-active
        transform rotate(180deg)

  // .h-collapse-content

</style>
