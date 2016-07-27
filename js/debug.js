export function displayMotionValues(e, log = false) {
  if (e) {
    // const ax = event.accelerationIncludingGravity.x * 5;
    // const ay = event.accelerationIncludingGravity.y * 5;
    const xEl = document.getElementById('accelerationX');
    const yEl = document.getElementById('accelerationY');
    const zEl = document.getElementById('accelerationZ');
    const alphaEl = Math.round(e.rotationRate.alpha);
    const betaEl = Math.round(e.rotationRate.beta);
    const gammaEl = Math.round(e.rotationRate.gamma);

    xEl.innerHTML = Math.round(e.accelerationIncludingGravity.x);
    yEl.innerHTML = Math.round(e.accelerationIncludingGravity.y);
    zEl.innerHTML = Math.round(e.accelerationIncludingGravity.y);
    if (log) {
      console.log(
        e.accelerationIncludingGravity.x,
        e.accelerationIncludingGravity.y,
        e.accelerationIncludingGravity.z
      );
    }

    if (e.rotationRate) {
      alphaEl.innerHTML = Math.round(e.rotationRate.alpha);
      betaEl.innerHTML = Math.round(e.rotationRate.beta);
      gammaEl.innerHTML = Math.round(e.rotationRate.gamma);
      if (log) {
        console.log(
          e.accelerationIncludingGravity.x,
          e.accelerationIncludingGravity.y,
          e.accelerationIncludingGravity.z
        );
      }
    }
  }
}
