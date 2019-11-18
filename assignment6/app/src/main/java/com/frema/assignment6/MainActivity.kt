package com.frema.assignment6

import android.location.Location
import android.os.Bundle
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import com.frema.assignment6.helpers.formattedLattitude
import com.frema.assignment6.helpers.formattedLongitude
import com.google.android.gms.location.FusedLocationProviderClient
import com.google.android.gms.location.LocationRequest
import com.google.android.gms.location.LocationServices
import kotlinx.android.synthetic.main.activity_main.*
import com.google.android.gms.location.LocationCallback;
import com.google.android.gms.location.LocationResult


class MainActivity : AppCompatActivity() {

    lateinit var fusedLocationClient: FusedLocationProviderClient

    private var locationCallback: LocationCallback? = null


    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        fusedLocationClient = LocationServices.getFusedLocationProviderClient(this)

        Toast.makeText(this,"test", Toast.LENGTH_SHORT).show()

        locationCallback = object : LocationCallback() {
            override fun onLocationResult(locationResult: LocationResult?) {
                if (locationResult == null) {
                    return
                }
                for (location in locationResult.locations) {
                    if (location != null) {

                        latitude.text = location.formattedLattitude()
                        longitude.text = location.formattedLongitude()
                    }
                }
            }
        }


        val fineInterval = 10L

        val coarseInterval = 1000L

        val locationRequest = LocationRequest()

        if (isOnSDU()) {
            locationRequest.interval = fineInterval
        } else {
          locationRequest.interval = coarseInterval
        }

        getLocationV2(locationRequest)
        /*var it = GlobalScope.launch {

            repeat(Int.MAX_VALUE) {
                delay(1000)
            }
        }
*/
        // fusedLocationClient.requestLocationUpdates(LocationRequest.create().setInterval(5000), createPendingResult(1, this.intent, 0))

    }

    fun getLocation() {
        fusedLocationClient.lastLocation
            .addOnSuccessListener { location : Location? ->
                latitude.text = location?.formattedLattitude() ?: "lattitude:"
                longitude.text = location?.formattedLongitude() ?: "longitude:"
            }.addOnFailureListener {
                latitude.text = "lattitude: error"
                longitude.text = "longitude: error"
            }
    }

    fun getLocationV2(lr: LocationRequest) {
        fusedLocationClient.requestLocationUpdates(lr, locationCallback, null)
    }

    override fun onDestroy() {
        super.onDestroy()
        fusedLocationClient.removeLocationUpdates(locationCallback)
    }


    fun isOnSDU(): Boolean {
        return true
    }
}
