<template>
  UserDetail
</template>

<script lang="ts">
  import {defineComponent, ref} from 'vue'
  import {useRouter} from 'vue-router'
  import {GetUserInfo} from '../../../api/types'

  export default defineComponent({
    name: 'UserDetail',
    async setup() {
      const router = useRouter()
      // 获取用户 id
      const form = ref({
        number: router.currentRoute.value.query.number
      })
      const user = await GetUserInfo(form.value)
      console.log(user)
      return {}
    }
  })
</script>

<style lang="less" scoped>

</style>
