import { describe, expect, it } from 'vitest'

import { mount } from '@vue/test-utils'
import ControlPanel from '../ControlPanel.vue'

describe('ControlPanel', () => {
  it('renders properly', () => {
    const wrapper = mount(ControlPanel)
    expect(wrapper.text()).toContain('Control Panel')
  })
})
