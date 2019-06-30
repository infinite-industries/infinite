<template>
  <div><span style="color: white">Hello</span></div>
</template>

<script>
  export default {
    props: ['id'],
    head() {
      return {
        title: this.event ? this.event.title : 'no event loaded',
        meta: [
          {
            hid: 'description',
            name: 'description',
            content: this.event ? this.event.brief_description : 'Lexington KY Infinite Industries Event'
          }
        ]
      }
    },
    created() {
      console.log(this.id)
    }
  }
</script>

<style>

</style>
