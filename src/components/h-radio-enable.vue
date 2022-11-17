<template>
  <div class="h-radio-enable">
    <div
      class="h-radio-item"
      :class="{'h-radio-item-checked': isEnable}"
      @click="handleStatus(trueValue)"
    >
      <i class="h-radio-icon" :style="{background: isEnable ? color : '#FFF'}" />
      <span>{{ trueLabel }}</span>
    </div>
    <div
      class="h-radio-item"
      :class="{'h-radio-item-checked': isDisable}"
      @click="handleStatus(falseValue)"
    >
      <i class="h-radio-icon" :style="{background: isDisable ? color : '#FFF'}" />
      <span>{{ falseLabel }}</span>
    </div>
  </div>
</template>

<script>
/**
*  启用/禁选单选操作
*
*  @description 用 iview 的 Radio 组件异步不好控制，常用于 Table 表格里的数据启用/禁用操作
*  @props {object} row 当前行数据
*  @props {number} index 当前行序号，可选
*  @props {string} color 选中的颜色
*  @props {string} statusKey 当前行数据状态 key 字段名
*  @props {object} trueValue 启用对应的状态值
*  @props {string} trueLabel 启用选项的label文本
*  @props {object} falseValue 禁用对应的状态值
*  @props {string} falseLabel 禁用选项的label文本
*  @emit {function} on-change 状态改变
*/
export default {
  name: 'h-radio-enable',
  props: {
    row: {
      type: Object,
      default: () => ({})
    },
    index: {
      type: Number,
      default: null
    },
    color: {
      type: String,
      default: '#FFD121'
    },
    statusKey: { // 状态 key 字段名
      type: String,
      default: 'status'
    },
    trueValue: { // 启用的值
      type: [String, Number, Boolean],
      default: 1
    },
    trueLabel: {
      type: String,
      default: '启用'
    },
    falseValue: { // 禁用的值
      type: [String, Number, Boolean],
      default: 0
    },
    falseLabel: {
      type: String,
      default: '禁用'
    },
  },

  computed: {
    isEnable() { // 是否启用
      return this.row[this.statusKey] === this.trueValue
    },

    isDisable() { // 是否禁用
      return this.row[this.statusKey] === this.falseValue
    }
  },

  methods: {
    handleStatus(status) {
      this.$emit('on-change', {
        row: this.row,
        index: this.index,
        status
      })
    }
  }
}
</script>

<style lang="stylus" scoped>
.h-radio-enable
  display flex
  justify-content center
  .h-radio-item
    display flex
    align-items center
    cursor pointer
    &:first-child
      margin-right 16px
    .h-radio-icon
      display block
      width 16px
      height 16px
      border 2px solid #ddd
      border-radius 50%
      margin-right 5px
    &.h-radio-item-checked
      .h-radio-icon
        border none
        // background radial-gradient(#ffd121 4px, #FFF 4px, #FFF 6px,#ffd121 0) // 用渐变有锯齿
        display flex
        justify-content center
        align-items center
        &:after
          content ''
          display block
          width 12px
          height 12px
          border 2px solid #FFF
          border-radius 50%
          background inherit
</style>
