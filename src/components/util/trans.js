const a = 6378245.0
const f = 1 / 298.3
const b = a * (1 - f)
const ee = 1 - (b * b) / (a * a)

function outOfChina(lng, lat) {
  if (lng < 72.004 || lng > 137.8347 || lat < 0.8293 || lat > 55.8271) {
    return true
  }

  return false
}

function transformLat(x, y) {
  let ret = -100.0 + 2.0 * x + 3.0 * y + 0.2 * y * y + 0.1 * x * y + 0.2 * Math.sqrt(Math.abs(x))
  ret = ret + (20.0 * Math.sin(6.0 * x * Math.PI) + 20.0 * Math.sin(2.0 * x * Math.PI)) * 2.0 / 3.0
  ret = ret + (20.0 * Math.sin(y * Math.PI) + 40.0 * Math.sin(y / 3.0 * Math.PI)) * 2.0 / 3.0
  ret = ret + (160.0 * Math.sin(y / 12.0 * Math.PI) + 320.0 * Math.sin(y * Math.PI / 30.0)) * 2.0 / 3.0
  return ret
}

function transformLng(x, y) {
  let ret = 300.0 + x + 2.0 * y + 0.1 * x * x +  0.1 * x * y + 0.1 * Math.sqrt(Math.abs(x))
  ret = ret + (20.0 * Math.sin(6.0 * x * Math.PI) + 20.0 * Math.sin(2.0 * x * Math.PI)) * 2.0 / 3.0
  ret = ret + (20.0 * Math.sin(x * Math.PI) + 40.0 * Math.sin(x / 3.0 * Math.PI)) * 2.0 / 3.0
  ret = ret + (150.0 * Math.sin(x / 12.0 * Math.PI) + 300.0 * Math.sin(x * Math.PI / 30.0)) * 2.0 / 3.0
  return ret
}

function wgs2gcj(wgsLng, wgsLat) {
  if (outOfChina(wgsLng, wgsLat)) {
    return [wgsLng, wgsLat]
  }

  let dLat = transformLat(wgsLng - 105.0, wgsLat - 35.0)
  let dLng = transformLng(wgsLng - 105.0, wgsLat - 35.0)
  const radLat = wgsLat / 180.0 * Math.PI
  let magic = Math.sin(radLat)
  magic = 1 - ee * magic * magic
  let sqrtMagic = Math.sqrt(magic)
  dLat = (dLat * 180.0) / ((a * (1 - ee)) / (magic * sqrtMagic) * Math.PI)
  dLng = (dLng * 180.0) / (a / sqrtMagic * Math.cos(radLat) * Math.PI)
  const gcjLat = wgsLat + dLat
  const gcjLng = wgsLng + dLng
    return [gcjLng, gcjLat]
}

function gcj2wgs(gcjLng, gcjLat) {
  let g0 = [gcjLng, gcjLat]
  let w0 = g0
  let g1 = wgs2gcj(w0[0], w0[1])

  // w1 = w0 - (g1 - g0)
  let w1x = w0[0] - (g1[0] - g0[0])
  let w1y = w0[1] - (g1[1] - g0[1])
  let w1 = [w1x, w1y]
  // delta = w1 - w0
  let dx = w1[0] - w0[0]
  let dy = w1[1] - w0[1]
  let delta = [dx, dy]

  while (Math.abs(delta[0]) >= 1e-6 || Math.abs(delta[1]) >= 1e-6) {
    w0 = w1
    g1 = wgs2gcj(w0[0], w0[1])

    // w1 = w0 - (g1 - g0)
    w1x = w0[0] - (g1[0] - g0[0])
    w1y = w0[1] - (g1[1] - g0[1])
    w1 = [w1x, w1y]
    // delta = w1 - w0
    dx = w1[0] - w0[0]
    dy = w1[1] - w0[1]
    delta = [dx, dy]
  }
  return w1
}

export default {
  wgs2gcj,
  gcj2wgs
}