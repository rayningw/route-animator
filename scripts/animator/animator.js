function Animator(forwardRenderer, fps) {
  this.renderForward = forwardRenderer;
  this.millisBetweenRenders = 1000 / fps;
}

// Starts the animation
Animator.prototype.start = function() {
  this.curTick = 0;
  this.prevRenderedTick = 0;
  this.prevCycleTime = Date.now();

  this.tickForward();
};

// Sets the speed as ticks per millisecond
Animator.prototype.setSpeed = function(speed) {
  this.speed = speed;
};

// Gets the number of milliseconds that have elapsed since the last ticking
// cycle and marks it for the next cycle
Animator.prototype.getAndMarkElapsedTime = function() {
  var prevCycleTime = this.prevCycleTime;
  this.prevCycleTime = Date.now();
  return this.prevCycleTime - prevCycleTime;
};

// Moves the ticker forward, calls the forward renderer, schedules the next tick
Animator.prototype.tickForward = function() {
  // Move the ticker forward
  this.curTick += this.getAndMarkElapsedTime() * this.speed;

  // Render forward
  var elapsedTicksSincePrevRender = this.curTick - this.prevRenderedTick;
  var shouldEnd = this.renderForward(elapsedTicksSincePrevRender);
  this.prevRenderedTick = this.curTick;

  // End of animation
  if (shouldEnd) {
    return;
  }

  // Schedule the next ticking cycle
  this.timeoutId = setTimeout(this.tickForward.bind(this), this.millisBetweenRenders);
};

// Stops the animation
Animator.prototype.stop = function() {
  if (this.timeoutId) {
    clearTimeout(this.timeoutId);
  }
};

module.exports = Animator;
