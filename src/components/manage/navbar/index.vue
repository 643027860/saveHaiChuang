<template>
  <div class="hc-navbar">
    <Nav></Nav>
    <Menus></Menus>
  </div>
</template>

<script lang="ts">
  import {defineComponent} from 'vue'
  import Nav from './nav.vue'
  import Menus from './menus.vue'

  export default defineComponent({
    name: 'NavBar',
    components: {
      Nav,
      Menus
    }
  })
</script>

<style lang="less" scoped>
  @import "../../../assets/css/mutations";

  .hc-navbar{
    position: fixed;
    top: 0;
    left: 0;
    transition: 0.4s;
    z-index: 10;
  }
</style>
