<template>
  <div class="button-view">
    <px-button></px-button>
    <el-button @click="clickHandle">click test</el-button>
  </div>
</template>

<script>
import PxButton from '@/components/Button'

export default {
  name: 'button-view',
  title () {
    return 'Koa Vue SSR | Button'
  },
  components: {
    PxButton
  },
  methods: {
    clickHandle (e) {
      console.log(11111, e)
      this.$message.success(`xxxxx`)
    }
  }
}
</script>

<style>
</style>
