package com.frema.assignment6.helpers

import android.location.Location

fun Location.formattedLattitude() : String {
    return "lattitude: ${this.latitude}"
}

fun Location.formattedLongitude() : String {
    return "longitude: ${this.longitude}"
}