<template>
  <div class="<%= paramCaseName %>">
    <h1><%= name %></h1>
  </div>
</template>

<script>
export default {
  name: '<%= name %>'
}
</script>

<style scoped>
.<%= paramCaseName %> {
  width: 100%;
  height: 100%;
}
</style>
