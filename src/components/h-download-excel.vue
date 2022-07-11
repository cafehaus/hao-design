<template>
  <div class="h-download-excel" @click="onExport">
    <slot>
      <Button
        class="h-download-excel-btn"
        v-bind="$attrs"
        :loading="downloading"
        :disabled="disabled"
      >
        {{ btnText }}
      </Button>
    </slot>
  </div>
</template>

<script>
  export default {
    name: 'HDownloadExcel',
    props: {
      action: { // 接口地址，必填，完整url
        type: String,
        required: true,
      },
      params: { // 请求参数：根据查询参数导出所有数据一般用这个，否则需要用 beforeDownload 钩子函数自己组装参数
        type: Object,
        default: () => ({}),
      },
      method: { // 请求方式
        type: String,
        default: 'post',
      },
      fileName: { // 导出的文件名
        type: String,
        default: '导出的文件',
      },
      fileType: { // 导出的文件类型
        type: String,
        default: 'xlsx',
      },
      btnText: { // 按钮文字
        type: String,
        default: '导出',
      },
      disabled: { // 是否禁止导出按钮
        type: Boolean,
        default: false,
      },
      beforeDownload: Function, // 导出之前的钩子，可返回一个Promise（需返回接口请求参数），一般用来做权限判断和接口参数组装
    },
    data() {
      return {
        downloading: false,
      }
    },

    computed: {
      downloadUrl() {
        if (this.method === 'post') return this.action
        return this.setObj(this.action, {
          ...this.params,
          token: this.getCookie('token'),
        })
      },
    },

    methods: {
      onExport () {
        if (!this.beforeDownload) {
          return this.exportData()
        }
        const before = this.beforeDownload() // 注意外面的钩子函数如果加了 async，会被自动转成promise
        if (before && before.then) { // 返回一个promise，resolve回接口参数
          before.then(res => {
            res && this.exportData(res)
          })
        } else if (before) { // 普通函数直接返回接口参数
          this.exportData(before)
        }
      },

      async exportData(p) {
        let params = this.method === 'get' ? {} : (p || this.params || {})
        let xhr = new XMLHttpRequest()
        this.downloading = true
        this.$emit('on-loading', true) // 自定义Button时提供给外面使用

        let _this = this
        let type = this.fileType
        let fileName = this.fileName
        xhr.open(this.method, _this.downloadUrl, true)
        xhr.setRequestHeader('Token', this.getCookie('token'))
        xhr.setRequestHeader('Content-Type', 'application/json')
        xhr.responseType = 'blob'
        xhr.onload = function() {
          if (this.status === 200) {
            // 接受二进制文件流
            let blob = this.response
            _this.downloadExportFile(blob, fileName, type)
          } else {
            _this.$Message.error('请求失败,请稍后重试！')
          }
          _this.downloading = false
          _this.$emit('on-loading', false)
        }
        xhr.onerror = function() {
          _this.downloading = false
          _this.$emit('on-loading', false)
          this.$Message.error('请求失败,请稍后重试！')
        }
        xhr.send(JSON.stringify(params))
      },

      downloadExportFile(blob, tagFileName, fileType) {
        tagFileName = tagFileName + '.' + fileType
        if (window.navigator.msSaveOrOpenBlob) {
          // IE浏览器下
          navigator.msSaveBlob(blob, tagFileName)
        } else {
          let link = document.createElement('a')
          link.href = window.URL.createObjectURL(blob)
          link.download = tagFileName
          link.click()
          window.URL.revokeObjectURL(link.href)
        }
      },

      // 工具函数
      setObj(url, obj) {
        for (let [key, value] of Object.entries(obj)) {
          url = this.setParam(key, value, url)
        }
        return url
      },

      setParam(name, value, url) {
        if (typeof name === 'undefined' || typeof value === 'undefined' || typeof url === 'undefined') {
          return url
        }
        let reg = new RegExp('(^|&|\\?|#)' + name + '=([^&]*?)(&|#|$)')
        let hash = url.match(/#.*/) ? url.match(/#.*/)[0] : ''
        let separator
        url = url.replace(/#.*/, '')

        if (reg.test(url)) {
          url = url.replace(reg, function(m, r1, r2, r3) {
            return r1 + name + '=' + encodeURIComponent(value) + r3
          })
        } else {
          separator = url.indexOf('?') === -1 ? '?' : '&'
          url = url + separator + name + '=' + encodeURIComponent(value)
        }

        return url + hash
      },

      getCookie(key) {
        if (typeof document === 'undefined') return
        let arr = document.cookie.match(new RegExp('(^| )' + key + '=([^;]*)(;|$)'))
        return arr ? unescape(arr[2]) : ''
      },
    },
  }
</script>

<style lang="stylus" scoped>
.h-download-excel
  display inline-block
  .h-download-excel-btn
    padding 0 8px
    background #fff
    border 1px solid #1890FF
    color #1890FF
    height 24px
    border-radius 4px
    box-shadow none
</style>
