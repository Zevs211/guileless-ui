import directive from './click-outside'

const ClickOutside = {
  install(Vue) {
    Vue.directive('click-outside', directive)
  },
  directive,
}

export { ClickOutside }
