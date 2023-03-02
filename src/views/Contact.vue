<template>
  <div class="about">
    <h1>This is a contact page.</h1>
      <hello-world />
  </div>
</template>


<script lang="ts">
  import Vue from 'vue'
  import HelloWorld from '../components/HelloWorld.vue'

  export default Vue.extend({
    name: 'Home',

    components: {
      HelloWorld,
    },
  })
</script>
