['scroll', 'wheel'].forEach(eventName => {
  window.addEventListener(eventName, e => {
    e.preventDefault();
  }, {
    passive: false,
  });
});

const STEP = 10;
const DURATION = 60;
const TIMING_FN = t => t * (2 - t);

let trottle = false;

let scrollDirection = null;
let scrollDistance = null;
let scrollDuration = null;
let scrollStartTime = null;
let scrollStartPos = null;
let scrollId = null;

let accelerationDistance = STEP;
let accelerationDuration = DURATION;
let accelerationStartTime = null;
let accelerationId = null;

window.addEventListener('wheel', ({ deltaY }) => {
  if (trottle) return null;
  trottle = true;
  customSmoothScroll(deltaY > 0 ? 1 : -1);
  customSmoothAcceleration();
  setTimeout(() => {
    trottle = false;
  }, 150);
});

function customSmoothScroll (newScrollDirection) {
  scrollDistance = STEP;
  scrollDuration = DURATION;
  scrollDirection = newScrollDirection;

  scrollStartPos = pageYOffset;
  scrollStartTime = performance.now();
  cancelAnimationFrame(scrollId);
  scrollId = requestAnimationFrame(animateScroll);
}

function animateScroll (currTime) {
  let timeFraction = (currTime - scrollStartTime) / scrollDuration;
  if (timeFraction > 1) timeFraction = 1;

  let progress = scrollStartPos + TIMING_FN(timeFraction) * scrollDistance * scrollDirection;
  progress = progress.toFixed(2);
  scrollTo(0, progress);

  if (timeFraction < 1) {
    scrollId = requestAnimationFrame(animateScroll);
  } else {
    scrollDistance = null;
    scrollDuration = null;
    scrollStartTime = null;
    scrollDirection = null;
    scrollStartPos = pageYOffset;
  }
}

function customSmoothAcceleration () {
  accelerationStartTime = performance.now();
  cancelAnimationFrame(accelerationId);
  accelerationId = requestAnimationFrame(animateAcceleration);
}

function animateAcceleration (currTime) {
  let timeFraction = (currTime - accelerationStartTime) / accelerationDuration;
  if (timeFraction > 1) timeFraction = 1;

  let progress = TIMING_FN(timeFraction) * accelerationDistance;
  progress = progress.toFixed(2);
  scrollDuration += DURATION * progress;
  scrollDistance += STEP * progress;

  if (timeFraction < 1) {
    accelerationId = requestAnimationFrame(animateAcceleration);
  } else {
    accelerationStartTime = null;
    accelerationId = null;
  }
}
