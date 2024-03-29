<template>
  <div class="m-pager">
    <Page
      id="my-page"
      ref="myPage"
      :current="page.index"
      :total="page.total"
      :page-size="page.size"
      :page-size-opts="pageSizeOpts"
      :placement="placement"
      :show-total="showTotal"
      :show-elevator="showElevator"
      :show-sizer="showSizer"
      :size="size"
      transfer
      :prev-text="size === 'small' ? '' : '上一页'"
      :next-text="size === 'small' ? '' : '下一页'"
      @on-change="changePage"
      @on-page-size-change="changePageSize"
    />
    <span v-if="showElevator" class="m-pager-btn" :class="{'m-pager-btn-small': size === 'small'}" @click="goElevatorPage">确定</span>
  </div>
</template>

<script>
  export default {
    name: 'HPager',
    props: {
      page: {
        type: Object,
        default: () => {
          return {
            index: 1,
            size: 10,
            total: 0,
          }
        },
      },
      pageSizeOpts: { // 每页条数切换的配置
        type: Array,
        default: () => [10, 20, 30, 40],
      },
      placement: { // 条数切换弹窗的展开方向，可选值为 bottom 和 top
        type: String,
        default: 'bottom',
      },
      size: { // 可选值为small（迷你版）或不填（默认）
        type: String,
        default: undefined, // 这里设置为空字符串会报错
      },
      showTotal: { // 显示总数
        type: Boolean,
        default: true,
      },
      showElevator: { // 显示电梯，可以快速切换到某一页
        type: Boolean,
        default: true,
      },
      showSizer: { // 显示分页，用来改变page-size
        type: Boolean,
        default: true,
      },
      transfer: { // 是否将弹层放置于 body 内
        type: Boolean,
        default: false,
      },
    },
    data() {
      return {}
    },
    methods: {
      goElevatorPage() {
        let evtObj
        let thisPage = document.getElementById('my-page')
        let elevatorDiv = thisPage.getElementsByClassName('ivu-page-options-elevator')

        if (elevatorDiv && elevatorDiv.length > 0) {
          let pageInput = elevatorDiv[0].getElementsByTagName('input')[0]
          if (window.KeyEvent) { // firefox 浏览器下模拟事件
            evtObj = document.createEvent('KeyEvents')
            evtObj.initKeyEvent('keyup', true, true, window, true, false, false, false, 13, 0)
          } else { // chrome 浏览器下模拟事件
            evtObj = document.createEvent('UIEvents')
            evtObj.initUIEvent('keyup', true, true, window, 1)
            delete evtObj.keyCode
            if (typeof evtObj.keyCode === 'undefined') { // 为了模拟keycode
              Object.defineProperty(evtObj, 'keyCode', { value: 13 })
            } else {
              evtObj.key = String.fromCharCode(13)
            }
          }
          pageInput.dispatchEvent(evtObj)
        }
      },
      changePage(pageIndex, pageSize = this.page.size) {
        this.page.index = pageIndex
        this.$emit('update:page', this.page)
        this.$emit('change', pageIndex, pageSize)
      },
      changePageSize(pageSize) {
        this.page.size = pageSize
        this.$emit('update:page', this.page)

        // 页码为1时 changePage 不会触发
        if (this.page.index === 1) {
          this.changePage(1)
        }
      },
    },
  }
</script>

<style lang="stylus" scoped>
.m-pager
  display flex
  justify-content flex-end
  >>>.ivu-page .ivu-page-item
    border-radius 8px
  >>>.ivu-page-item-active
    background #FFD121
    a
      font-weight bold
      color #161718
  >>>.ivu-page-item-active:hover a
    color #161718
  >>>.ivu-select-selection
    border-radius 8px !important
  >>>.ivu-page-custom-text
    border 1px solid #dddee1
    border-radius 8px
    padding 0 6px
  >>>.ivu-page-options-elevator input
    border-radius 8px !important
  .m-pager-btn
    display inline-block
    height 32px
    padding 0 6px
    border 1px solid #dddee1
    border-radius 8px
    line-height 30px
    margin-left 8px
    cursor pointer
    &:hover
      opacity .8
    &.m-pager-btn-small
      height 22px
      line-height 20px
      font-size 13px
</style>
