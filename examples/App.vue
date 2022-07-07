<template>
  <div id="app">
    <h2>hao-design组件示例</h2>
    <HPager />
    <HModal v-model="show">
      dfdfsdaf
    </HModal>
    <p @click="onChange">改变子组件里的值</p>
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
  /* height: 3000px; */
}
</style>
