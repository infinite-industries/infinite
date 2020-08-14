<template>
  <div>
    <slot v-bind="page" />
    <v-pagination v-model="pageNumber" :length="pageCount" />
  </div>
</template>

<script>
  export default {
    props: {
      items: {
        type: Array,
        required: true
      },
      pageSize: {
        type: Number,
        default: 10
      }
    },
    data: function () {
      return {
        pageNumber: 1
      }
    },
    computed: {
      page: function () {
        const items = this.items
        const pageSize = this.pageSize
        const pageIndex = this.pageIndex
        if (pageIndex < 0 || !items || items.length === 0) return []
        else return items.slice(pageIndex * pageSize, pageIndex * pageSize + pageSize)
      },
      pageIndex: function () {
        return this.pageNumber - 1
      },
      pageCount: function () {
        const items = this.items
        const pageSize = this.pageSize
        return items && items.length > 0 ? Math.ceil(items.length / pageSize) : 0
      }
    }
  }
</script>
