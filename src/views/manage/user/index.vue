<template>
    <router-view></router-view>
</template>

<script lang="ts">
    import {defineComponent, reactive, ref} from 'vue';

    export default defineComponent({
        name: 'User',
        setup() {
            const data1 = reactive({
                name: ''
            })
            const data2 = ref('')
            const updateUser = () => {
                console.log('hh')
            }
            return {
                data1,
                data2,
                updateUser
            }
        }
    })
</script>

<style lang="less">

</style>
