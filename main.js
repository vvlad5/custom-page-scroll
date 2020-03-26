['scroll', 'wheel'].forEach(eventName => {
  window.addEventListener(eventName, e => {
    e.preventDefault();
  }, {
    passive: false,
  });
});

window.addEventListener('wheel', e => {
  if (isWindows()) freeScroll(e.deltaY);
  else requestAnimationFrame(() => {
    window.scrollBy(0, e.deltaY);
  });
});

let STEP = 10;
let DURATION = 1500;
let ACCELERATION = .9;
let ACCELERATION_STEP = .25;
const TIMING_FN = t => t < .5 ? 2 * t * t : -1 + (4 - 2 * t) * t;

let scrollDirection = null;
let scrollDuration = null;
let scrollStartTime = null;
let scrollId = null;

let acceleration = ACCELERATION;
let accelerationId = null;

let state = {};

export function setState (parentState) {
  state = parentState;
}

export function freeScroll (deltaY) {
  const direction = deltaY > 0 ? 1 : -1;
  customSmoothScroll(direction);
  accelerateScroll();
}

function customSmoothScroll (newScrollDirection) {
  scrollDuration = DURATION;
  scrollStartTime = performance.now();

  if (scrollDirection !== newScrollDirection) {
    acceleration = ACCELERATION;
    cancelAnimationFrame(scrollId);
    scrollDirection = newScrollDirection;
    scrollId = requestAnimationFrame(animateScroll);
  }
}

function animateScroll (currTime) {
  if (state.isFullpage) return resetAllProps();

  let timeFraction = (currTime - scrollStartTime) / scrollDuration;
  if (timeFraction > 1) timeFraction = 1;

  let progress = (STEP - (STEP * TIMING_FN(timeFraction))) * scrollDirection;
  progress = (progress * acceleration).toFixed(0);
  scrollTo(0, pageYOffset + parseInt(progress));

  if (timeFraction < 1) scrollId = requestAnimationFrame(animateScroll);
  else return resetAllProps();
}

function resetAllProps () {
  acceleration = ACCELERATION;
  cancelAnimationFrame(scrollId);
  scrollDuration = null;
  scrollDirection = null;
  scrollStartTime = null;
  scrollId = null;
}

function accelerateScroll () {
  acceleration += ACCELERATION_STEP;
  if (accelerationId) return null;
  accelerationId = setInterval(() => {
    acceleration -= ACCELERATION_STEP;
    if (acceleration < ACCELERATION) {
      acceleration = ACCELERATION;
      clearInterval(accelerationId);
      accelerationId = null;
    }
  }, 50);
}

function isMacintosh(){
  return navigator.platform.indexOf('Mac') > -1;
}
function isWindows() {
  return navigator.platform.indexOf('Win') > -1;
}