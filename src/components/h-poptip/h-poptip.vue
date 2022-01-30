<template>
  <div
    class="h-poptip"
    v-click-outside="handleClose"
    @mouseenter="handleMouseenter"
    @mouseleave="handleMouseleave"
  >
    <div
      class="h-poptip-rel"
      ref="reference"
      @click="handleClick"
      @mousedown="handleFocus(false)"
      @mouseup="handleBlur(false)"
    >
      <slot></slot>
    </div>

    <div
      class="h-poptip-content"
      ref="popper"
      @click="handleTransferClick"
      @mouseenter="handleMouseenter"
      @mouseleave="handleMouseleave"
    >
      <div class="h-poptip-content-inner" :style="visible ? 'transform: scale(1);' : ''">
      <!-- <div v-show="visible" class="h-poptip-content-inner" key="zpoptip"> -->
        <div v-show="!hide"><slot name="content"></slot></div>
      </div>
    </div>
  </div>
</template>

<script>
  import vco from 'v-click-outside'
  import Popper from '../../mixins/popper'
  import { transferIndex, transferIncrease } from '../../utils/transfer-queue'
  // import { createPopper } from '@popperjs/core'
  export default {
    name: 'HPoptip',
    mixins: [ Popper ],
    props: {
      trigger: {
        validator (value) {
          return ['click', 'focus', 'hover'].includes(value)
        },
        default: 'click'
      },
      placement: {
        validator (value) {
          return ['top', 'top-start', 'top-end', 'bottom', 'bottom-start', 'bottom-end', 'left', 'left-start', 'left-end', 'right', 'right-start', 'right-end'].includes(value)
        },
        default: 'bottom-start'
      },
      transfer: {
        type: Boolean,
        default: false
      },
      disabled: {
        type: Boolean,
        default: false
      },
    },
    data() {
      return {
        visible: false,
        isInput: false,
        disableCloseUnderTransfer: false,  // transfer 模式下，点击 slot 也会触发关闭
        tIndex: this.handleGetIndex(),
        hide: false
      }
    },

    watch: {
      visible(v) {
        if (!v) { // 延时为了有动画效果
          setTimeout(() => {
            this.hide = true
          }, 300)
        } else {
          this.hide = false
        }
      }
    },

    directives: {
      clickOutside: vco.directive,
    },

    mounted() {
      if (this.transfer) {
        document.body.appendChild(this.$refs.popper)
      }

      if (this.trigger === 'focus') {
        this.$nextTick(() => {
          const $children = this.getInputChildren()
          if ($children) {
            this.isInput = true
            $children.addEventListener('focus', this.handleFocus, false)
            $children.addEventListener('blur', this.handleBlur, false)
          }
        })
      }

      // 解决刷新第一次动画闪一下
      this.hide = false
      this.hide = true
    },

    beforeDestroy () {
      const $children = this.getInputChildren()
      if ($children) {
        $children.removeEventListener('focus', this.handleFocus, false)
        $children.removeEventListener('blur', this.handleBlur, false)
      }
    },

    methods: {
      handleClick () {
          if (this.disabled) return
          if (this.trigger !== 'click') {
              return false
          }
          this.visible = !this.visible
      },
      
      handleTransferClick () {
        if (this.transfer) this.disableCloseUnderTransfer = true
      },
      
      handleClose () {
        if (this.disableCloseUnderTransfer) {
          this.disableCloseUnderTransfer = false
          return false
        }
        if (this.trigger !== 'click') {
          return false
        }
        this.visible = false
      },

      handleFocus (fromInput = true) {
        if (this.disabled) return

        if (this.trigger !== 'focus' || (this.isInput && !fromInput)) {
          return false
        }
        this.visible = true
      },

      handleBlur (fromInput = true) {
        if (this.trigger !== 'focus' || (this.isInput && !fromInput)) {
          return false
        }
        this.visible = false
      },

      handleMouseenter () {
        if (this.disabled) return
        
        if (this.trigger !== 'hover') {
          return false
        }
        if (this.enterTimer) clearTimeout(this.enterTimer)
        this.enterTimer = setTimeout(() => {
            this.visible = true
        }, 100)
      },

      handleMouseleave () {
        if (this.trigger !== 'hover') {
          return false
        }
        if (this.enterTimer) {
          clearTimeout(this.enterTimer)
          this.enterTimer = setTimeout(() => {
              this.visible = false
          }, 100)
        }
      },

      getInputChildren () {
        const $input = this.$refs.reference.querySelectorAll('input')
        const $textarea = this.$refs.reference.querySelectorAll('textarea')
        let $children = null

        if ($input.length) {
            $children = $input[0]
        } else if ($textarea.length) {
            $children = $textarea[0]
        }

        return $children
      },

      handleGetIndex () {
        transferIncrease()
        return transferIndex
      },

      handleIndexIncrease () {
        this.tIndex = this.handleGetIndex()
      }
    },
  }
</script>

<style lang="stylus" scoped>

  .h-poptip
    display inline-block
    .h-poptip-rel
      display inline-block

  .h-poptip-content  
    .h-poptip-content-inner
      border-radius 12px
      box-shadow 0px 20px 40px 0px rgba(0, 0, 0, 0.16)
      transition all .3s ease
      transform scale(0)
      position relative
      &:before
        width 0
        height 0
        position absolute
        content ''
        border-color transparent
        border-style solid
    &[data-popper-placement^='top'] // pop出现在顶部
      .h-poptip-content-inner
        margin-bottom 10px
        &:before
          bottom -7px
          border-width 7px 7px 0
          border-top-color #FFF
    &[data-popper-placement='top']
      .h-poptip-content-inner
        transform-origin bottom center
        &:before
          left calc(50% - 3px)
    &[data-popper-placement='top-start']
      .h-poptip-content-inner
        transform-origin bottom left
        &:before
          left 24px
    &[data-popper-placement='top-end']
      .h-poptip-content-inner
        transform-origin bottom right
        &:before
          right 24px
    &[data-popper-placement^='bottom'] // pop出现在底部
      .h-poptip-content-inner
        margin-top 10px
        &:before
          top -7px
          border-width 0 7px 7px
          border-bottom-color #FFF
    &[data-popper-placement='bottom']
      .h-poptip-content-inner
        transform-origin top center
        &:before
          left calc(50% - 3px)
    &[data-popper-placement='bottom-start']
      .h-poptip-content-inner
        transform-origin top left
        &:before
          left 24px
    &[data-popper-placement='bottom-end']
      .h-poptip-content-inner
        transform-origin top right
        &:before
          right 24px
    &[data-popper-placement^='left']
      .h-poptip-content-inner
        margin-right 10px
        &:before
          border-width 7px 0 7px 7px
          border-left-color #FFF
          right -7px
    &[data-popper-placement='left'] // pop出现在左边
      .h-poptip-content-inner
        transform-origin center right
        &:before
          top calc(50% - 3px)
    &[data-popper-placement='left-start']
      .h-poptip-content-inner
        transform-origin top right
        &:before
          top 24px
    &[data-popper-placement='left-end']
      .h-poptip-content-inner
        transform-origin bottom right
        &:before
          bottom 24px
    &[data-popper-placement^='right']
      .h-poptip-content-inner
        margin-left 10px
        &:before
          left -7px
          border-width 7px 7px 7px 0
          border-right-color #FFF
    &[data-popper-placement='right'] // pop出现在右边
      .h-poptip-content-inner
        transform-origin center left
        &:before
          top calc(50% - 3px)
    &[data-popper-placement='right-start']
      .h-poptip-content-inner
        transform-origin top left
        &:before
          top 24px
    &[data-popper-placement='right-end']
      .h-poptip-content-inner
        transform-origin bottom left
        &:before
          bottom 24px
    

</style>
