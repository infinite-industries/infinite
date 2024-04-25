<template>
  <div class="ii-pagination">
    <slot v-bind="page" />

    <div class="ii-pagination__list-wrapper">
      <ii-pagination-list
        :class-name-page-list="classNamePageList"
        :max-number-of-page-shortcuts="maxNumberOfPageShortcuts"
        :page-number="pageNumber"
        :page-count="pageCount"
        @decrementPageClicked="decrementPage()"
        @incrementPage="incrementPage()"
        @pageEntryClicked="setPage(...arguments)"
      />
    </div>
  </div>
</template>

<script>
  import PaginationList from '@/components/pagination/PaginationList.vue'

  export default {
    props: {
      items: {
        type: Array,
        required: true
      },
      pageSize: {
        type: Number,
        default: 10
      },
      maxNumberOfPageShortcuts: {
        type: Number,
        default: 10
      },
      classNamePageList: {
        type: String,
        default: ''
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
    },
    methods: {
      setPage(newPageNumber) {
        if (newPageNumber > 0 && newPageNumber <= this.pageCount) {
          this.pageNumber = parseInt(newPageNumber)
        }
      },
      incrementPage() {
        this.setPage(this.pageNumber + 1)
      },
      decrementPage() {
        this.setPage(this.pageNumber - 1)
      }
    },
    components: {
      'ii-pagination-list': PaginationList
    },
    watch: {
      items: function (newItems, oldItems) {
        if (newItems.length < oldItems.length) {
          this.pageNumber = 1
        }
      }
    }
  }
</script>
