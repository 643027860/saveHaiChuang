<template>
  MienClassify
</template>

<script lang="ts">
  import {defineComponent, ref} from 'vue';

  export default defineComponent({
    name: 'MienClassify',
    setup() {
      const data = ref('')
      const updateUser = () => {
        console.log('hh')
      }
      return {
        data,
        updateUser
      }
    }
  })
</script>

<style lang="less" scoped>

</style>
