<template>
  <ul :class="pageLinkListClassNames">
    <ii-pagination-list-entry
      v-for="pageEntry in visiblePageLinks"
      :key="pageEntry.entryKey"
      :label="pageEntry.label"
      :entry-type="pageEntry.entryType"
      :is-selected="pageEntry.label && pageEntry.label === `${pageNumber}`"
      :is-disabled="!pageEntry.enabled"
      @decrementPageClicked="$emit('decrementPageClicked')"
      @incrementPage="$emit('incrementPage')"
      @pageEntryClicked="onPageEntryClicked"
    />
  </ul>
</template>

<script>
  import PaginationListEntry from '@/components/pagination/PaginationListEntry.vue'

  export default {
    emits: ['incrementPage', 'pageEntryClicked', 'decrementPageClicked'],
    props: {
      maxNumberOfPageShortcuts: {
        type: Number,
        required: true
      },
      classNamePageList: {
        type: String,
        required: true
      },
      pageNumber: {
        type: Number,
        required: true
      },
      pageCount: {
        type: Number,
        required: true
      }
    },
    computed: {
      pageLinkListClassNames() {
        const classes = ['ii-pagination__list']

        if (this.classNamePageList !== '') {
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
      onPageEntryClicked() {
        this.$emit('pageEntryClicked', ...arguments)
      },
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
      }
    },
    components: {
      'ii-pagination-list-entry': PaginationListEntry
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
