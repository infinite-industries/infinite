<template>
  <div class="ii-pagination">
    <slot v-bind="page" />

    <div class="ii-pagination__list-wrapper">
      <ul :class="pageLinkListClassNames">
        <ii-pagination-list-entry
          v-for="pageEntry in visiblePageLinks"
          :key="pageEntry.entryKey"
          :label="pageEntry.label"
          :entry-type="pageEntry.entryType"
          :is-selected="pageEntry.label && pageEntry.label === `${pageNumber}`"
          :is-disabled="!pageEntry.enabled"
          @decrementPageClicked="decrementPage()"
          @incrementPage="incrementPage()"
          @pageEntryClicked="setPage(...arguments)"
        />
      </ul>
    </div>
  </div>
</template>

<script>
  import PagenationListEntry from '@/components/pagination/PagenationListEntry.vue'

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
        default: null
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
      },

      pageLinkListClassNames() {
        const classes = ['ii-pagination__list']

        if (typeof this.classNamePageList === 'string') {
          classes.push(this.classNamePageList)
        }

        return classes.join(' ')
      },

      visiblePageLinks: function() {
        const maxLinks = this.maxNumberOfPageShortcuts // this.maxLinks

        const visiblePages = [this.createPreviousEntry(this.pageNumber !== 1)]

        if (this.pageCount <= maxLinks) {
          // just show everything
          for (let i = 1; i <= this.pageCount; i++) {
            visiblePages.push(this.createPageEntry(i, this.pageNumber !== i))
          }
        } else if (this.pageNumber <= maxLinks) {
          // too many to show everything, current is less that number of links
          // we will show
          for (let i = 1; i <= maxLinks; i++) {
            visiblePages.push(this.createPageEntry(i, this.pageNumber !== i))
          }

          if (maxLinks < this.pageCount) {
            visiblePages.push(this.createTruncationEntry('truncationEntry1'))
          }

          // make sure to show a link to the last page
          visiblePages.push(this.createPageEntry(this.pageCount, true))
        } else {
          // the current page is greater than number of links shown, so make
          // sure to display first page, ..., and current through number shown
          visiblePages.push(this.createPageEntry(1, true))
          if (maxLinks < this.pageCount) {
            visiblePages.push(this.createTruncationEntry('truncationEntry2'))
          }

          if (this.pageNumber + maxLinks < this.pageCount) {
            for (let i = this.pageNumber; i <= this.pageNumber + maxLinks - 1; i++) {
              visiblePages.push(this.createPageEntry(i, this.pageNumber !== i))
            }
          } else {
            for (let i = this.pageCount - maxLinks; i <= this.pageCount; i++) {
              visiblePages.push(this.createPageEntry(i, this.pageNumber !== i))
            }
          }

          // add ... and last page if last page is not already shown
          if (this.pageNumber + maxLinks < this.pageCount) {
            visiblePages.push(this.createTruncationEntry('truncationEntry3'))

            visiblePages.push(this.createPageEntry(this.pageCount, true))
          }
        }

        visiblePages.push(this.createNextEntry(this.pageNumber !== this.pageCount))

        return visiblePages
      }
    },
    methods: {
      createPreviousEntry(enabled) {
        return {
          entryType: 'previous',
          label: '<',
          entryKey: 'previous',
          enabled
        }
      },

      createNextEntry(enabled) {
        return {
          entryType: 'next',
          label: '>',
          entryKey: 'next',
          enabled
        }
      },

      createTruncationEntry(entryKey) {
        return {
          entryType: 'truncation',
          label: '...',
          entryKey: entryKey,
          enabled: false
        }
      },

      createPageEntry(pageNumber, enabled) {
        return {
          entryType: 'page-number',
          label: `${pageNumber}`,
          entryKey: `${pageNumber}`,
          enabled
        }
      },
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
      'ii-pagination-list-entry': PagenationListEntry
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

<style scoped>
  .ii-pagination__list {
    align-items: center;
    display: inline-flex;
    list-style-type: none;
    margin: 0;
    padding: 0;
    max-width: 100%;
  }
</style>
