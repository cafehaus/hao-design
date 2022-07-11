<template>
  <div class="h-poptip" :class="{'h-poptip-show': visible}" v-click-outside="close">
    <div class="h-poptip-rel" @click="change">
      <div class="h-poptip-label">
        <slot name="label" />
      </div>
      <!-- <i v-if="!hideIcon" class="iconfont icon-select-bottom2" /> -->
      <Icon v-if="!hideIcon" type="md-arrow-dropdown" />
    </div>

    <!-- 弹出层 -->
    <div class="h-poptip-content" :style="{left: left}" :class="{'right':position === 'right'}">
      <slot />
    </div>
  </div>
</template>

<script>
  import vco from 'v-click-outside'
  export default {
    name: 'HPoptip',
    props: {
      value: {
        type: Boolean,
        default: false,
      },
      left: {
        type: String,
        default: '0px',
      },
      position: {
        type: String,
        default: 'left',
      },
      hideIcon: {
        type: Boolean,
        default: false,
      },
    },

    data() {
      return {
        visible: this.value,
      }
    },

    watch: {
      value: {
        immediate: true,
        handler(val) {
          this.visible = val
          this.$emit('input', val)
        },
      },
      visible(val) {
        if (val) {
          this.$emit('on-popper-show')
        } else {
          this.$emit('on-popper-hide')
        }
        this.$emit('input', val)
      },
    },

    directives: {
      clickOutside: vco.directive,
    },

    methods: {
      change() {
        this.visible = !this.visible
      },

      close() {
        this.visible = false
      },
    },
  }
</script>

<style lang="stylus" scoped>

.h-poptip
  position relative
  z-index 999
  width 100%
  .h-poptip-rel
    display flex
    cursor pointer
    .h-poptip-label
      line-height 24px
      font-size 14px
      height 24px
      flex 1
      no-wrap()
      text-align left
    >>>.ivu-icon
      font-size 20px
      transition all 0.3s
      flex-shrink 0
      line-height 1
      display flex
      justify-content center
      align-items center

  .h-poptip-content
    position absolute
    top 100%
    left 0
    background #FFFFFF
    border-radius 6px
    transform scale(0)
    margin-top 20px
    transform-origin top left
    transition all 0.3s ease-out
    box-shadow 0px 20px 40px 0px rgba(0, 0, 0, 0.16)
    min-width 150px
    &.right
      right 0
    &:before
      display block
      width 0
      height 0
      position absolute
      border-color transparent
      border-style solid
      content ''
      top -6px
      border-width 7px
      margin-left 25px
      border-top-width 0
      border-bottom-width 7px
      border-bottom-color #fff

  &.h-poptip-show
    >>>.ivu-icon
      transform rotate(180deg)
    .h-poptip-content
      transform scale(1)

</style>
