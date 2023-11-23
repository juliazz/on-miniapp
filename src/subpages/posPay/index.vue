<template>
  <Pager :header="headerOptions">
   
  </Pager>
</template>

<script>
import Pager from "@/components/common/Pager.vue";

export default {
  name: "Scanner",
  components: { Pager },
  data() {
    return {
      headerOptions: {
        title: "",
        backgroundColor: "transparent",
        style: "white"
      }
    }
  },
  methods: {
   
  }
}
</script>

<style lang="scss">
  
</style>
