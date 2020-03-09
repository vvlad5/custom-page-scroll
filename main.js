['scroll', 'wheel', 'touchstart', 'touchend', 'touchmove'].forEach(eventName => {
  window.addEventListener(eventName, e => {
    e.preventDefault()
  }, {
    passive: false,
  })
})

const timingFns = {
  'linear': t => t,
  'easeIn': t => t * t,
  'easeOut': t => t * (2 - t),
}

const step = 150
let isScrolling = false
let direction = 0
let scrollDistance = 0

window.addEventListener('wheel', ({ deltaY }) => {
  direction = deltaY > 0 ? 1 : -1
  scrollDistance += step * direction
  if (isScrolling) return null
  isScrolling = true
  nativeSmoothScroll()
  customSmoothScroll()
})

function customSmoothScroll () {
  isScrolling = false
}

function nativeSmoothScroll () {
  scrollBy({
    top: step * direction,
    behavior: 'smooth',
  })
}