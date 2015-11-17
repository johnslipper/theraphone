export function displayMotionValues(e, log=false) {
  if(!e) {
    console.error('No Motion Event')
    return false
  }

  var ax = event.accelerationIncludingGravity.x * 5
  var ay = event.accelerationIncludingGravity.y * 5
  document.getElementById("accelerationX").innerHTML = Math.round(e.accelerationIncludingGravity.x)
  document.getElementById("accelerationY").innerHTML = Math.round(e.accelerationIncludingGravity.y)
  document.getElementById("accelerationZ").innerHTML = Math.round(e.accelerationIncludingGravity.z)
  if(log) console.log(e.accelerationIncludingGravity.x, e.accelerationIncludingGravity.y, e.accelerationIncludingGravity.z)

  if(e.rotationRate) {
    document.getElementById("rotationAlpha").innerHTML = Math.round(e.rotationRate.alpha)
    document.getElementById("rotationBeta").innerHTML = Math.round(e.rotationRate.beta)
    document.getElementById("rotationGamma").innerHTML = Math.round(e.rotationRate.gamma)
    if(log) console.log(e.accelerationIncludingGravity.x, e.accelerationIncludingGravity.y, e.accelerationIncludingGravity.z)
  }
}
