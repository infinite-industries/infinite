import { mount, RouterLinkStub } from '@vue/test-utils'
import Logo from '@/components/vectors/Logo.vue'

describe('Logo', () => {
  test('is a Vue instance', () => {
    const wrapper = mount(Logo, { stubs: { NuxtLink: RouterLinkStub } })

    expect(wrapper.vm).toBeTruthy()
  })
})
