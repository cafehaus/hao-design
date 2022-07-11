<template>
  <div id="app">
    <h2>hao-design 组件示例</h2>
    <HPager />
    <HModal v-model="show">
      我是示例弹窗组件里的内容
    </HModal>
    <div style="width: 400px">
      <HPoptip>
        <span slot="label">我是一个占位符</span>
        <div>我是HPoptip里面的内容</div>
      </HPoptip>
    </div>
    <span @click="onChange">{{ show ? '关闭' : '打开' }}弹窗</span>
  </div>
</template>

<script>
import HModal from '../src/components/h-modal'
import HPager from '../src/components/h-pager'
import HPoptip from '../src/components/h-poptip'

export default {
  name: 'App',
  components: {
    HModal,
    HPager,
    HPoptip,
  },
  data() {
    return {
      show: false
    }
  },

  methods: {
    onChange() {
      this.show = true
    }
  },
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 600px;
}
</style>
