import { createLocalVue, shallowMount } from '@vue/test-utils'
import Pagination from '@/components/pagination/Pagination.vue'
import expect from 'expect'

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
    console.log('!!! start')
    await wrapper.setProps({
      items: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      maxNumberOfPageShortcuts: 10,
      pageSize: 1
    })

    assertPaginationListDrawnCorrect({ wrapper, numExpectedLinks: 10 })
  })

  it('should show truncation spanner (...) for latter half of list when page selection near the beginning', async () => {
    console.log('!!! start')
    await wrapper.setProps({
      items: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      maxNumberOfPageShortcuts: 2,
      pageSize: 1
    })

    const paginationButtonList = wrapper.find('.ii-pagination__list')
    expect(paginationButtonList.exists()).toBe(true)
    const paginationButtons = paginationButtonList.findAll('.ii-pagination__entry-button')

    // prev, page 1, page 2, ..., last page, next
    expect(paginationButtons.length).toEqual(5)
    assertHasBookends(paginationButtons)
    expect(paginationButtons.at(1).text()).toEqual('1')
    expect(paginationButtons.at(2).text()).toEqual('2')

    // should show span just before last page
    const paginationEntries = paginationButtonList.findAll('.ii-pagination__entry')
    expect(paginationEntries.length).toEqual(6)
    expect(paginationEntries.at(paginationEntries.length - 3).text()).toEqual('...')

    console.log('!!! paginationButtonList: ' + paginationButtonList.html())
  })

  it('should show truncation spanner (...) for first half of list when page selection near the end', async () => {
    console.log('!!! start')
    await wrapper.setProps({
      items: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      maxNumberOfPageShortcuts: 2,
      pageSize: 1
    })

    await wrapper.setData({
      pageNumber: 8
    })

    const paginationButtonList = wrapper.find('.ii-pagination__list')
    expect(paginationButtonList.exists()).toBe(true)
    const paginationButtons = paginationButtonList.findAll('.ii-pagination__entry-button')

    console.log('!!! paginationButtonList: ' + paginationButtonList.html())

    // prev, page 1, ..., page 8, page 9, last page, next
    expect(paginationButtons.length).toEqual(6)
    assertHasBookends(paginationButtons)
    expect(paginationButtons.at(1).text()).toEqual('1')
    expect(paginationButtons.at(2).text()).toEqual('2')

    // should show span just before last page
    const paginationEntries = paginationButtonList.findAll('.ii-pagination__entry')
    expect(paginationEntries.length).toEqual(6)
    expect(paginationEntries.at(2).text()).toEqual('...')
  })

  function assertPaginationListDrawnCorrect({ wrapper, numExpectedLinks }) {
    const paginationButtonList = wrapper.find('.ii-pagination__list')
    expect(paginationButtonList.exists()).toBe(true)

    const paginationButtons = paginationButtonList.findAll('.ii-pagination__entry-button')
    expect(paginationButtons.length).toEqual(numExpectedLinks + 2) // number of pages + prev and next

    assertHasBookends(paginationButtons)

    // check explicit page number links shown
    for (let i = 1; i <= numExpectedLinks; i++) {
      expect(paginationButtons.at(i).text()).toEqual(`${i}`)
    }
  }

  function assertHasBookends(paginationButtons) {
    // check previous bookend shown
    expect(paginationButtons.at(0).text()).toEqual('<')

    // check last bookend shown
    expect(paginationButtons.at(paginationButtons.length - 1).text()).toEqual('>')
  }

  // todo test current link disabled, threads options className, test with two spans
})
