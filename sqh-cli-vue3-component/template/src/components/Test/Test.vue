<template>
  <div class="<%= name %>">
    {{message}}
  </div>
</template>

<script>
export default {
  name: '<%= camelCaseName %>',
  props: {
  },
  setup(ctx) {
    const message = '<%= description %>'
    return {
      message
    }
  }
}
</script>

<style type="text/css">
  .<%= name %> {
    color: red;
  }
</style>