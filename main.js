['scroll', 'wheel'].forEach(eventName => {
  window.addEventListener(eventName, e => {
    e.preventDefault();
  }, {
    passive: false,
  });
});

const STEP = 5;
const DURATION = 1000;
const ACCELERATION = .9;
const TIMING_FN = t => t < .5 ? 2 * t * t : -1 + (4 - 2 * t) * t;

let scrollDirection = null;
let scrollDuration = null;
let scrollStartTime = null;
let scrollId = null;

let acceleration = ACCELERATION;
let accelerationId = null;

window.addEventListener('wheel', ({ deltaY }) => {
  customSmoothScroll(deltaY > 0 ? 1 : -1);
  accelerateScroll();
});

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
  let timeFraction = (currTime - scrollStartTime) / scrollDuration;
  if (timeFraction > 1) timeFraction = 1;

  let progress = (STEP - (STEP * TIMING_FN(timeFraction))) * scrollDirection;
  progress = (progress * acceleration).toFixed(0);
  scrollTo(0, pageYOffset + parseInt(progress));

  if (timeFraction < 1) {
    scrollId = requestAnimationFrame(animateScroll);
  } else {
    acceleration = ACCELERATION;
    cancelAnimationFrame(scrollId);
    scrollDuration = null;
    scrollDirection = null;
    scrollStartTime = null;
    scrollId = null;
  }
}

function accelerateScroll () {
  acceleration += .1;
  if (accelerationId) return null;
  accelerationId = setInterval(() => {
    acceleration -= .1;
    if (acceleration < ACCELERATION) {
      acceleration = ACCELERATION;
      clearInterval(accelerationId);
      accelerationId = null;
    }
  }, 50);
}
