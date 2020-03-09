['scroll', 'wheel'].forEach(eventName => {
  window.addEventListener(eventName, e => {
    e.preventDefault();
  }, {
    passive: false,
  });
});

const timingFn = t => t * (2 - t);

const STEP = 10;
const DURATION = 30;
let busy = false;
let direction = null;
let distance = null;
let duration = null;
let startTime = null;
let startPos = null;
let scrollId = null;

window.addEventListener('wheel', ({ deltaY }) => {
  customSmoothScroll(deltaY > 0 ? 1 : -1);
});

function customSmoothScroll(newDirection) {
  if (newDirection === direction) {
    duration += DURATION;
    distance += STEP;
    return null;
  } else {
    distance = STEP;
    duration = DURATION;
    direction = newDirection;
    cancelAnimationFrame(scrollId);
  }

  busy = true;
  startPos = pageYOffset;
  startTime = performance.now();
  scrollId = requestAnimationFrame(animateScroll);
}

function animateScroll(currTime) {
  let timeFraction = (currTime - startTime) / duration;
  if (timeFraction > 1) timeFraction = 1;

  const progress = startPos + timingFn(timeFraction) * distance * direction;
  scrollTo(0, progress);

  if (timeFraction < 1) {
    requestAnimationFrame(animateScroll);
  } else {
    distance = null;
    duration = null;
    startTime = null;
    direction = null;
    startPos = pageYOffset;
    busy = false;
  }
}

// function nativeSmoothScroll() {
//   scrollBy({
//     top: step * direction,
//     behavior: 'smooth',
//   });
// }
