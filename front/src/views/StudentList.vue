<template>
  <student-list />
</template>

<script lang="ts">
  import Vue from 'vue'
  import StudentList from '../components/StudentList.vue'

  export default Vue.extend({
    // eslint-disable-next-line
    name: 'Home',

    components: {
      StudentList,
    },
  })
</script>
