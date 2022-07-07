<template>
  <div id="app">
    <h2>hao-design 组件示例</h2>
    <HPager />
    <HModal v-model="show">
      我是示例弹窗组件里的内容
    </HModal>
    <span @click="onChange">{{ show ? '关闭' : '打开' }}弹窗</span>
  </div>
</template>

<script>
import HModal from '../src/components/h-modal'
import HPager from '../src/components/h-pager'

export default {
  name: 'App',
  components: {
    HModal,
    HPager,
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
