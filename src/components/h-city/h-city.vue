<template>
  <HPoptip
    :transfer="true"
    :value="visible"
    :disabled="disabled"
    trigger="click"
    placement="bottom-start"
    @on-popper-show="visible = true"
    @on-popper-hide="visible = false"
  >
    <slot>
      <div
        class="h-city-input"
        :class="{'h-city-input-border': borderAnimation, 'h-city-input-border-active': visible, 'h-city-input-disabled': disabled}"
        :style="{width: inputWidth ? (inputWidth + 'px') : 'auto', height: inputHeight + 'px'}"
      >
        <input
          v-model.trim="keyword"
          placeholder="请选择"
          :disabled="disabled"
          @input="handleInput"
          @blur="handleBlur"
        />
        <i class="iconfont hao-icon-triangle-down" :class="{'active': visible}" />
      </div>
    </slot>

    <div slot="content" class="h-city-content">
      <div class="h-city-menu" v-show="!showSearch">
        <div class="h-city-tab" v-if="tabList.length">
          <div
            v-for="(tab, index) in tabList"
            :key="index"
            class="h-city-tab-item"
            :class="{'active': activeIndex === index, 'mr': tab.key === '热门'}"
            @click="scrollTo(index)"
          >
            {{ tab.key }}
          </div>
        </div>
        <div
          v-if="tabList.length"
          class="h-city-scroll"
          ref="list"
          :style="{maxHeight: maxHeight + 'px'}"
          @scroll="handleScroll"
        >
          <div v-for="(tab, index) in tabList" :key="index" class="h-city-scroll-item" :ref="`target-${index}`">
            <p class="h-city-scroll-item-title">{{ tab.key || '' }}</p>
            <div class="h-city-scroll-item-city-list" v-if="tab.list.length">
              <p
                class="h-city-scroll-item-city-list-item"
                :class="{'h-city-scroll-item-city-list-item-active': _item.cityId === curCityId}"
                v-for="(_item, _index) in tab.list"
                :key="_index"
                @click="handlePick(_item)"
              >
                {{ _item.cityName }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div class="h-city-select" v-show="showSearch" :style="{maxHeight: maxHeight + 'px'}">
        <p class="h-city-select-item" v-for="(city, idx) in searchList" :key="idx" @click="handlePick(city)">
          {{ city.cityName }}
        </p>

        <div v-show="!searchList.length" class="h-city-select-empty">
          <i class="iconfont hao-icon-empty" />
          <p>暂无数据</p>
        </div>
      </div>
    </div>
  </HPoptip>
</template>

<script>
  import HPoptip from '../h-poptip'
  import Citys from './city.js'

  export default {
    name: 'HCity',
    components: {
      HPoptip,
    },
    props: { 
      value: { // 双向绑定选中城市的信息
        type: Object,
        default: () => ({})
      },
      cityData: { // 城市列表数据
        type: [],
        default: () => []
        // 数组对象数据结构
        // {
        //   cityId: '249',
        //   cityName: '深圳',
        //   provinceId: null,
        //   provinceName: null,
        //   initials: 'S',
        //   isHotCity: true,
        //   longitude: null,
        //   latitude: null
        // }
      },
      inputHeight: { // 输入框高度
        type: [String, Number],
        default: 32
      },
      inputWidth: { // 输入框宽度
        type: [String, Number],
        default: ''
      },
      maxHeight: { // 滚动列表最大高度
        type: [String, Number],
        default: 267
      },
      disabled: { // 是否禁止输入和选择
        type: Boolean,
        default: false,
      },
      borderAnimation: { // 是否显示输入框底部的线条动画（仿直客官网旧版首页）
        type: Boolean,
        default: false,
      }
    },
    // model: {
    //   prop: "info",
    //   event: "update"
    // },
    data() {
      return {
        visible: false,
        // cityList: Citys,
        activeIndex: 0,
        targetHeight: {},

        searchList: [],
        showSearch: false,
        keyword: '', // 要单独字段存，不要直接用 curCity.cityName
        curCity: {},
      }
    },

    computed: {
      tabList() {
        const data = Citys || []
        let tabList = [
          { key: '热门', list: [] },
          { key: 'A', list: [] },
          { key: 'B', list: [] },
          { key: 'C', list: [] },
          { key: 'D', list: [] },
          { key: 'E', list: [] },
          { key: 'F', list: [] },
          { key: 'G', list: [] },
          { key: 'H', list: [] },
          { key: 'I', list: [] },
          { key: 'J', list: [] },
          { key: 'K', list: [] },
          { key: 'L', list: [] },
          { key: 'M', list: [] },
          { key: 'N', list: [] },
          { key: 'O', list: [] },
          { key: 'P', list: [] },
          { key: 'Q', list: [] },
          { key: 'R', list: [] },
          { key: 'S', list: [] },
          { key: 'T', list: [] },
          { key: 'U', list: [] },
          { key: 'V', list: [] },
          { key: 'W', list: [] },
          { key: 'X', list: [] },
          { key: 'Y', list: [] },
          { key: 'Z', list: [] },
          { key: '其他', list: [] }
        ]
        let keysList = tabList.map(k => k.key) // key值数组：添加数据的时候能快速找到往 tabList 哪条里加

        data.forEach(element => {
          let key = element.initials && /[a-z]/i.test(element.initials) ? element.initials.toUpperCase() : '其他'
          let index = keysList.indexOf(key) >= 0 ? keysList.indexOf(key) : (keysList.length - 1)

          tabList[index].list.push({ ...element })
          // 热门城市
          element.isHotCity && tabList[0].list.push({ ...element })
        })
        let realTab = tabList.filter(m => m.list.length)
        // let realTab = tabList.filter(m => {
        //   if (m.key === 'Y') {
        //     m.list =[{
        //       "cityId":"276",
        //       "cityName":"玉林",
        //       "provinceId":null,
        //       "provinceName":null,
        //       "initials":"Y",
        //       "isHotCity":false,
        //       "longitude":null,
        //       "latitude":null
        //     }]
        //   }
        //   if (m.key === 'Z') {
        //     m.list =[{
        //       "cityId":"39",
        //       "cityName":"张家口",
        //       "provinceId":null,
        //       "provinceName":null,
        //       "initials":"Z",
        //       "isHotCity":false,
        //       "longitude":null,
        //       "latitude":null
        //     }]
        //   }

        //   return m.list.length
        // })

        // 计算高度
        this.$nextTick(() => {
          this.getTargetList(realTab)
        })
        return realTab
      },

      curCityId() { // 当前选中的城市id
        return this.curCity.cityId || ''
      },

      cityList() {
        return this.cityData.length ? this.cityData : Citys
      }
    },

    watch: {
      // 外部值改变时更新输入框的值
      value: {
        handler(newV) {
          if (!newV || !newV.cityName) {
            this.keyword = ''
            this.curCity = {}
          }
          if (newV.cityName && newV.cityName !== this.keyword) {
            this.keyword = newV.cityName
            this.curCity = newV
          }
        },
        deep: true
      },
    },

    methods: {
      handleScroll(e) {
        let scrollTop = e.srcElement.scrollTop

        let n = 0
        let keys = Object.keys(this.targetHeight) || []
        keys.sort((a, b) => (b - a)) // 从大到小排序

        for (let i = 0; i < keys.length; i++) {
          let v = keys[i]
          if (scrollTop >= this.targetHeight[v]) {
            n = +v
            break
          }
        }

        this.activeIndex = n
      },

      scrollTo(index) {
        let num = this.targetHeight[index]
        // 坑：scrollTop是超出滚动视口的距离，不是元素顶部相对父元素的滚动距离
        // scrollTop: 代表在有滚动条时，滚动条向下滚动的距离也就是元素顶部被遮住部分的高度。在没有滚动条时scrollTop==0恒成立。单位px，可读可设置。
        // offsetTop: 当前元素顶部距离最近父元素顶部的距离,和有没有滚动条没有关系。单位px，只读元素。
        this.$refs['list'].scrollTop = num
      },

      getTargetList(arr) {
        let list = arr || this.tabList
        let len = list.length // 获取位置只要个索引，所以只用知道数组长度就可以了
        let heightTotal = 0

        for (let i = len - 1; i > 0; i--) {
          const target = this.$refs['target-' + i] || []
          const node = target[0]
          if (node) {
            let num = node.offsetTop - 24 // 滚动盒子顶部留24px

            // 已知bug：后面几个高度加起来还是不超过 this.maxHeight 时，顶部的tab有的会出现选不中效果
            if (heightTotal <= this.maxHeight) {
              const nodeHeight = node.offsetHeight
              const nodeMargin = 24 // h-city-scroll-item 还有个margin-bottom 24px
              const realHeight = nodeHeight + nodeMargin
              heightTotal += realHeight

              let range = this.maxHeight - heightTotal
              if (range > 0) num = num - range
            }

            this.targetHeight[i] = num
          }
        }
      },

      handleInput() {
        this.onSearch()
      },

      onSearch() {
        let value = this.keyword

        if (value) {
          this.searchList = Citys.filter(m => m.cityName && m.cityName.includes(value))
          this.showSearch = true
        } else {
          this.searchList = []
          this.showSearch = false
        }
      },

      handleBlur() {
        // 不用定时器延时会闪一下
        setTimeout(() => {
          if (this.keyword !== this.curCity.cityName) {
            this.keyword = this.curCity.cityName
          }
          this.showSearch = false
        }, 500)
      },

      handlePick(e) {
        this.curCity = e
        this.keyword = e.cityName
        this.visible = false
        this.$emit('input', e)
      },
    },
  }
</script>

<style lang="stylus" scoped>
  .h-city-input
    border 1px solid #dcdee2
    border-radius 6px
    display flex
    align-items center
    padding 0 4px
    box-sizing border-box
    .hao-icon-triangle-down
      font-size 20px
      color $black
      line-height 1
      display inline-block
      transition all .3s
      &.active
        transform rotate(180deg)
    input
      width 100%
      padding 4px 7px
      font-size 14px
      border-radius 6px
      color $black
      position relative
      cursor text
      box-shadow none
      outline none
      border none
      &::-moz-placeholder
        color #A2A2A3
      &:-ms-input-placeholder
        color #A2A2A3
      &::-webkit-input-placeholder
        color #A2A2A3
    &.h-city-input-disabled // 禁选
      cursor not-allowed
      input[disabled]
        cursor not-allowed
        background #FFF
    &.h-city-input-border // 线条动画
      padding 0
      border-radius 0
      border none
      border-bottom 1px solid $black
      position relative
      &:after
        content ''
        position absolute
        bottom -1px
        left 0
        height 1px
        width 100%
        background $main-color
        transition all 0.3s ease-out
        transform-origin left
        transform scaleX(0)
      &-active:after
         transform scaleX(1)
      input
        padding 4px 0

  .h-city-content // popper内容区   
    background-color #FFF
    border-radius 8px
    overflow hidden
    .h-city-menu
      width 556px
      overflow hidden
      .h-city-tab
        text-align center
        display flex
        margin  0 32px
        border-bottom 1px solid #f0f0f0
        font-size 14px
        .h-city-tab-item
          min-width 16px
          cursor pointer
          user-select none
          color $gray
          transition all 0.3s
          text-align center
          font-weight 600
          padding 17px 0
          transition all 0.3s ease-out
          position relative
          &.mr
            margin-right 8px
          &.active
            color $black
            &:after
              content ''
              display block
              width 100%;
              height 1px
              background-color $black
              position absolute
              bottom -1px
              left 0

      .h-city-scroll
        // max-height 267px
        position relative
        padding 24px 0 0 32px
        overflow auto
        scrollbar()
        &-item
          font-size 14px
          display flex
          margin-bottom 24px
          &-title
            font-weight 600
            color #606266
            line-height 1.2
            width 28px
            line-height 28px
            height 28px
            margin 0 16px 0 0
            flex-shrink 0
          &-city-list
            flex 1
            margin -12px 0 0 -12px
            display flex
            flex-wrap wrap
            &-item
              width 80px
              text-align center
              line-height 28px
              height 28px
              border-radius 14px
              margin 12px 0 0 12px
              background-color #f5f5f5
              color $dgray
              transition all 0.3s
              cursor pointer
              user-select none
              white-space nowrap
              overflow hidden
              text-overflow ellipsis
              &:hover,
              &-active
                background-color $main-color
                color $black

    .h-city-select
      width 300px
      // max-height 267px
      overflow auto
      scrollbar()
      &-item
        font-size 14px
        color #A2A3A3
        line-height 1.2
        cursor pointer
        margin 0
        padding 15px 20px
        &:hover
          background #f5f5f5
          color $black
      &-empty
        color #999
        padding 40px 0
        font-size 14px
        text-align center
        .hao-icon-empty
          font-size 40px
</style>
