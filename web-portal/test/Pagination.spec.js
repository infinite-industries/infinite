import { createLocalVue, shallowMount } from '@vue/test-utils'
import Vuetify from 'vuetify'
import Pagination from '@/components/Pagination.vue'

const localVue = createLocalVue()
localVue.use(Vuetify)

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
})
