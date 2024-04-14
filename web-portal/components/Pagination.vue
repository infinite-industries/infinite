<template>
  <div>
    <slot v-bind="page" />
    <v-pagination v-model="pageNumber" :length="pageCount" />

    <!--    !!! page.label is a bad key, it can happen more than once, should create a key field, that's number prev or next-->
    <ul class="ii-pagination__list">
      <li
        v-for="page in visiblePageLinks"
        :key="page.label"
        class="ii-pagination__entry"
      >
        <button
          :class="getLinkClasses(page)"
          v-if="page.entryType === 'page-number'"
          :disabled="!page.enabled"
          @click="setPage(page.pageNumber)"
        >
          {{ page.label }}
        </button>

        <button
          :class="getLinkClasses(page)"
          v-if="page.entryType === 'previous'"
          :disabled="!page.enabled"
          @click="decrementPage()"
        >
          {{ page.label }}
        </button>

        <button
          :class="getLinkClasses(page)"
          v-if="page.entryType === 'next'"
          :disabled="!page.enabled"
          @click="incrementPage()"
        >
          {{ page.label }}
        </button>

        <span
          class="ii-pagination__entry-separator"
          v-if="page.isSeparator"
        >
          {{ page.label }}
        </span>
      </li>
    </ul>
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
      },

      maxLinks: function () {
        if (process.client) {
          console.log('!!! client side: ' + window.innerWidth)
        }

        console.log('!!! computing')
        if (!process.client) {
          console.log('!!! server side')
          return 10
        } else if (window.innerWidth > 700) {
          return 25
        } else if (window.innerWidth < 300) {
          return 2
        } else {
          return 10
        }
      },

      visiblePageLinks: function() {
        const maxLinks = this.maxLinks

        const visiblePages = [this.createPreviousEntry(this.pageNumber !== 1)]

        if (this.pageCount < maxLinks) {
          // just show everything
          for (let i = 1; i <= this.pageCount; i++) {
            visiblePages.push(this.createPageEntry(i, this.pageNumber !== i))
          }
        } else if (this.pageNumber <= maxLinks) {
          // too many to show everything, current is is less that number of links
          // we will show
          for (let i = 1; i <= maxLinks; i++) {
            visiblePages.push(this.createPageEntry(i, this.pageNumber !== i))
          }

          if (maxLinks < this.pageCount) {
            visiblePages.push(this.createPageEntry('...'))
          }

          visiblePages.push(this.createPageEntry(this.pageCount))
        } else {
          // the current page is is greater than number of links shown, so make
          // sure to display first page, ..., and current through number shown
          visiblePages.push(this.createPageEntry(1))
          if (maxLinks < this.pageCount) {
            visiblePages.push(this.createPageEntry('...'))
          }

          if (this.pageNumber + maxLinks < this.pageCount) {
            for (let i = this.pageNumber; i <= this.pageNumber + maxLinks; i++) {
              visiblePages.push(this.createPageEntry(i, this.pageNumber !== i))
            }
          } else {
            for (let i = this.pageCount - maxLinks; i <= this.pageCount; i++) {
              visiblePages.push(this.createPageEntry(i, this.pageNumber !== i))
            }
          }

          // add ... and last page if last page is not already shown
          if (this.pageNumber + maxLinks < this.pageCount) {
            visiblePages.push(this.createPageEntry('...'))

            visiblePages.push(this.createPageEntry(this.pageCount))
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
          entrykey: 'previous',
          enabled,
          label: '<'
        }
      },

      createNextEntry(enabled) {
        return {
          entryType: 'next',
          entryKey: 'next',
          label: '>',
          enabled
        }
      },
      createPageEntry(label, enabled) {
        const pageNumber = isNaN(label) ? null : `${label}`

        const isSeparator = pageNumber === '...'
        const isBookEnd = pageNumber === '>' || pageNumber === '<'
        if (enabled === null || enabled === undefined) {
          enabled = true
        }

        return {
          entryType: isSeparator ? 'separator' : 'page-number',
          label,
          pageNumber,
          isSeparator,
          isBookEnd,
          enabled,
          entryKey: isSeparator ? 'Separator' : label
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
      },
      getLinkClasses(pageEntry) {
        const classes = ['ii-pagination__entry-button']
        if (pageEntry.isBookEnd) {
          classes.push('ii-pagination__entry-bookend')
        } else if (pageEntry.pageNumber && pageEntry.pageNumber === `${this.pageNumber}`) {
          classes.push('ii-pagination__entry-active')
        }

        return classes.join(' ').trimEnd()
      }
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
  /* >>> overrides scoping, allowing the targeting of child components */
  .v-pagination >>> .v-pagination__item--active {
    color: white;
    background-color: black;
  }

  .ii-pagination__list {
    align-items: center;
    display: inline-flex;
    list-style-type: none;
    margin: 0;
    max-width: 100%;
    padding: 0;
  }

  .ii-pagination__entry {
    align-items: center;
    display: flex;

    background-repeat: no-repeat;
    padding: 0;
    margin: 0;

    list-style: none;
  }

  .ii-pagination__entry-button {
    background: #fff;
    color: #000;
    min-width: 34px;
    padding: 0 5px;

    box-shadow: 0px 3px 1px -2px rgba(0,0,0,0.2), 0px 2px 2px 0px rgba(0,0,0,0.14), 0px 1px 5px 0px rgba(0,0,0,0.12);
    border-radius: 4px;
    font-size: 14px;
    height: 34px;
    width: 34px;
    margin: 0.3rem;
    text-decoration: none;
    transition: 0.3s cubic-bezier(0, 0, 0.2, 1);

    border-style: none;

    text-transform: none;
  }

  .ii-pagination__entry-bookend {
    margin: 0.3rem 10px;
  }

  .ii-pagination__entry-active {
    color: white;
    background-color: black;
  }

  .ii-pagination__entry-separator {
    margin: 0.3rem;
    display: inline-flex;
    align-items: flex-end;
    justify-content: center;
    height: 2rem;
    width: 2rem;
  }
</style>
