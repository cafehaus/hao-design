<template>
  <div id="app">
    <h2>haoUI组件示例</h2>
    <HCity v-model="city" />
    <p>父组件：{{ city.cityName }}</p>
    <p @click="onChange">改变子组件里的值</p>
  </div>
</template>

<script>
import HCity from '../src/components/h-city'

export default {
  name: 'App',
  components: {
    HCity
  },
  data() {
    return {
      city: {}
    }
  },

  methods: {
    onChange() {
      this.city = {
        "cityId":"16",
        "cityName":"延庆",
        "provinceId":null,
        "provinceName":null,
        "initials":"Y",
        "isHotCity":false,
        "longitude":null,
        "latitude":null
      }
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
  height: 3000px;
}
</style>
