<template>
  <div class="test-view">
    <h1>{{ msg }}</h1>
  </div>
</template>

<script>
export default {
  name: 'TestView',
  props: {
    msg: String
  }
}
</script>

<style scoped>
.test-view {
  font-size: 20px;
  font-weight: bold;
  text-align: center;
  margin-top: 50px;
}
</style>
