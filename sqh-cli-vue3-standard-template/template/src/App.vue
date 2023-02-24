<template>
  <div id="app">
    <TestView msg="Vue3 标准模板"/>
  </div>
</template>

<script>
import TestView from './components/TestView.vue'

export default {
  name: 'App',
  components: {
    TestView
  }
}
</script>

<style>
#app {
  width: 100%;
  height: 100%;
}
</style>
