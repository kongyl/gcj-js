<script setup>
import trans from './util/trans'
import { fromLonLat, toLonLat } from 'ol/proj'

const lng = 116.30284478001347
const lat = 39.9035179065456

// wgs2gcj
const gcj = trans.wgs2gcj(lng, lat)
const gcjCoor = {
  lng: gcj[0],
  lat: gcj[1]
}

// gcj2wgs
const wgs = trans.gcj2wgs(lng, lat)
const wgsCoor = {
  lng: wgs[0],
  lat: wgs[1]
}

const x = 12946773.458720237
const y = 4851931.6540772095
const oriLngLat = toLonLat([x, y])

// wgs2gcj
const gcjLngLat = trans.wgs2gcj(oriLngLat[0], oriLngLat[1])
const gcjXY = fromLonLat(gcjLngLat)
const gcjXYCoor = {
  x: gcjXY[0],
  y: gcjXY[1]
}

// gcj2wgs
const wgsLngLat = trans.gcj2wgs(oriLngLat[0], oriLngLat[1])
const wgsXY = fromLonLat(wgsLngLat)
const wgsXYCoor = {
  x: wgsXY[0],
  y: wgsXY[1]
}
</script>

<template>
  <div>
    <p>origin: lng: {{ lng }}, lat: {{ lat }}</p>
    <p>wgs2gcj: lng: {{ gcjCoor.lng }}, lat: {{ gcjCoor.lat }}</p>
    <p>gcj2wgs: lng: {{ wgsCoor.lng }}, lat: {{ wgsCoor.lat }}</p>
    <p>origin: x: {{ x }}, y: {{ y }}</p>
    <p>wgs2gcj: x: {{ gcjXYCoor.x }}, y: {{ gcjXYCoor.y }}</p>
    <p>gcj2wgs: x: {{ wgsXYCoor.x }}, y: {{ wgsXYCoor.y }}</p>
  </div>
</template>
