import { createLocalVue, shallowMount } from '@vue/test-utils'
import Pagination from '@/components/pagination/Pagination.vue'

const localVue = createLocalVue()

describe('Pagination component', () => {
  let wrapper

  const items = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]

  beforeEach(() => {
    wrapper = shallowMount(Pagination, {
      localVue,
      propsData: {
        items
      }
    })
  })

  it('computes the current page based on the page size', () => {
    const firstTen = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
    const firstFive = [1, 2, 3, 4, 5]

    expect(wrapper.vm.page).toEqual(expect.arrayContaining(firstTen))

    wrapper.setProps({ pageSize: 5 })
    expect(wrapper.vm.page).toEqual(expect.arrayContaining(firstFive))
  })

  it('updates the page when the page number changes', () => {
    // in practice this is controlled by the v-pagination component
    const secondPage = [11, 12, 13, 14, 15]
    wrapper.setData({
      pageNumber: 2
    })
    expect(wrapper.vm.page).toEqual(expect.arrayContaining(secondPage))
  })

  it('resets to the first page when the page count changes', async () => {
    // first, move to second page
    wrapper.setData({
      pageNumber: 2
    })

    // then, replace the data with a smaller set
    // (not sure why this change is async, but the other tests in this suite aren't)
    await wrapper.setProps({
      items: [1, 3, 5, 7, 9, 11, 13, 15]
    })

    expect(wrapper.vm.pageNumber).toEqual(1)
  })

  it('should show links for all numbers when there are less pages than max number of links shown', async () => {
    await wrapper.setProps({
      items: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      maxNumberOfPageShortcuts: 10,
      pageSize: 1
    })

    assertPaginationListDrawnCorrect({ wrapper, numExpectedLinks: 10 })
  })

  it('should show truncation spanner (...) for latter half of list when page selection near the beginning', async () => {
    await wrapper.setProps({
      items: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      maxNumberOfPageShortcuts: 2,
      pageSize: 1
    })

    const paginationEntries = assertHasListOfPaginationEntries(wrapper)

    // prev, page 1, page 2, ..., last page, next
    expect(paginationEntries.length).toEqual(6)
    assertHasBookendsAtEitherEndOfButtonList(paginationEntries)
    expect(paginationEntries.at(1).text()).toEqual('1')
    expect(paginationEntries.at(2).text()).toEqual('2')
    expect(paginationEntries.at(3).text()).toEqual('...')
    expect(paginationEntries.at(4).text()).toEqual('10')
  })

  it('should show truncation spanner (...) for first half of list when page selection near the end', async () => {
    await wrapper.setProps({
      items: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      maxNumberOfPageShortcuts: 2,
      pageSize: 1
    })

    await wrapper.setData({
      pageNumber: 8
    })

    const paginationEntries = assertHasListOfPaginationEntries(wrapper)

    // prev, page 1, ..., page 8, page 9, last page, next
    expect(paginationEntries.length).toEqual(7)
    assertHasBookendsAtEitherEndOfButtonList(paginationEntries)

    expect(paginationEntries.at(1).text()).toEqual('1') // always show first page
    expect(paginationEntries.at(2).text()).toEqual('...')
    expect(paginationEntries.at(3).text()).toEqual('8') // maxNumberOfPageShortcuts is 2
    expect(paginationEntries.at(4).text()).toEqual('9') // maxNumberOfPageShortcuts is 2
    expect(paginationEntries.at(5).text()).toEqual('10') // always show last page
  })

  it('should show truncation at both ends (...) when selection does not include first, 2nd to first, last or next to last entry', async () => {
    await wrapper.setProps({
      items: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      maxNumberOfPageShortcuts: 2,
      pageSize: 1
    })

    await wrapper.setData({
      pageNumber: 5
    })

    const paginationEntries = assertHasListOfPaginationEntries(wrapper)

    // prev, page 1, ..., page 5, page 6, ..., last page, next
    expect(paginationEntries.length).toEqual(8)
    assertHasBookendsAtEitherEndOfButtonList(paginationEntries)

    expect(paginationEntries.at(1).text()).toEqual('1') // always show first page
    expect(paginationEntries.at(2).text()).toEqual('...')
    expect(paginationEntries.at(3).text()).toEqual('5') // maxNumberOfPageShortcuts is 2
    expect(paginationEntries.at(4).text()).toEqual('6') // maxNumberOfPageShortcuts is 2
    expect(paginationEntries.at(5).text()).toEqual('...')
    expect(paginationEntries.at(6).text()).toEqual('10') // always show last page
  })

  it('should disable currently selected page', async () => {
    await wrapper.setProps({
      items: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      maxNumberOfPageShortcuts: 10,
      pageSize: 1
    })

    const paginationEntries = assertHasListOfPaginationEntries(wrapper)
    assertHasBookendsAtEitherEndOfButtonList(paginationEntries)

    // first page and pagination entries are disabled
    assertOnlyCurrentPageDisabled(wrapper, 1)
    assertLeftBookendDisabledAndRightEnabled(wrapper)

    await wrapper.setData({
      pageNumber: 2
    })

    // second page is disabled and nothing else
    assertOnlyCurrentPageDisabled(wrapper, 2)
    assertBothBookendsEnabled(wrapper)

    await wrapper.setData({
      pageNumber: 10
    })

    // last page and last bookend are disabled
    assertOnlyCurrentPageDisabled(wrapper, 10)
    assertRightBookendDisabledAndLeftEnabled(wrapper)
  })

  it('should pass through optional class attribute', async () => {
    await wrapper.setProps({
      items: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      maxNumberOfPageShortcuts: 10,
      pageSize: 1,
      classNamePageList: 'some-extra-class'
    })

    expect(wrapper.find('ul.ii-pagination__list.some-extra-class').exists()).toEqual(true)
  })

  function assertHasListOfPaginationEntries(wrapper) {
    const paginationButtonList = wrapper.find('.ii-pagination__list')
    expect(paginationButtonList.exists()).toBe(true)
    const paginationEntries = paginationButtonList.findAll('.ii-pagination__entry')

    return paginationEntries
  }

  function assertPaginationListDrawnCorrect({ wrapper, numExpectedLinks }) {
    const paginationButtonList = wrapper.find('.ii-pagination__list')
    expect(paginationButtonList.exists()).toBe(true)

    const paginationButtons = paginationButtonList.findAll('.ii-pagination__entry-button')
    expect(paginationButtons.length).toEqual(numExpectedLinks + 2) // number of pages + prev and next

    assertHasBookendsAtEitherEndOfButtonList(paginationButtons)

    // check explicit page number links shown
    for (let i = 1; i <= numExpectedLinks; i++) {
      expect(paginationButtons.at(i).text()).toEqual(`${i}`)
    }
  }

  function assertLeftBookendDisabledAndRightEnabled(wrapper) {
    const bookends = wrapper.findAll('.ii-pagination__entry-bookend')
    expect(bookends.at(0).attributes().disabled).toEqual('disabled')
    expect(bookends.at(1).attributes().disabled).toBeFalsy()
  }

  function assertRightBookendDisabledAndLeftEnabled(wrapper) {
    const bookends = wrapper.findAll('.ii-pagination__entry-bookend')
    expect(bookends.at(1).attributes().disabled).toEqual('disabled')
    expect(bookends.at(0).attributes().disabled).toBeFalsy()
  }

  function assertBothBookendsEnabled(wrapper) {
    const bookends = wrapper.findAll('.ii-pagination__entry-bookend')
    expect(bookends.at(0).attributes().disabled).toBeFalsy()
    expect(bookends.at(1).attributes().disabled).toBeFalsy()
  }

  function assertHasBookendsAtEitherEndOfButtonList(paginationButtons) {
    // check previous bookend shown
    expect(paginationButtons.at(0).text()).toEqual('<')

    // check last bookend shown
    expect(paginationButtons.at(paginationButtons.length - 1).text()).toEqual('>')
  }

  function assertOnlyCurrentPageDisabled(wrapper, currentPageIndex) {
    const paginationButtonList = wrapper.find('.ii-pagination__list')
    expect(paginationButtonList.exists()).toBe(true)
    const paginationEntries = paginationButtonList.findAll('.ii-pagination__entry')

    const selectedPageButton = paginationEntries.at(currentPageIndex).find('button')
    expect(selectedPageButton.attributes().disabled).toEqual('disabled')

    for (let i = 0; i < paginationEntries.length; i++) {
      const entry = paginationEntries.at(i)

      if (i !== currentPageIndex &&
        entry.text() !== '...' &&
        entry.text() !== '<' &&
        entry.text() !== '>'
      ) {
        const entryButton = entry.find('button')
        expect(entryButton.attributes().disabled).toBeFalsy()
      }
    }
  }
})
