package com.ecocity.models

import kotlinx.serialization.Serializable

@Serializable
data class VehicleDTO(
    val id: String,
    val type: String,
    val status: String,
    val latitude: Double,
    val longitude: Double,
    val batteryPct: Int?
)

@Serializable
data class CreateVehicleDTO(
    val type: String,
    val latitude: Double,
    val longitude: Double,
    val batteryPct: Int? = null
)

@Serializable
data class UpdateVehicleDTO(
    val status: String? = null,
    val latitude: Double? = null,
    val longitude: Double? = null,
    val batteryPct: Int? = null
)