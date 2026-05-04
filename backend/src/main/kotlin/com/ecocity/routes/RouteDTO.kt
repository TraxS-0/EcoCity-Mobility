package com.ecocity.models

import kotlinx.serialization.Serializable

@Serializable
data class RouteDTO(
    val id: String,
    val name: String,
    val type: String,
    val distanceKm: Double,
    val durationMin: Int,
    val stops: List<RouteStopDTO>,
    val geometry: String? = null,
    val co2Saved: Double
)

@Serializable
data class RouteStopDTO(
    val stopId: String,
    val order: Int
)

@Serializable
data class CreateRouteDTO(
    val name: String,
    val type: String,
    val distanceKm: Double,
    val durationMin: Int,
    val stops: List<RouteStopDTO>,
    val co2Saved: Double = 0.0
)

@Serializable
data class UpdateRouteDTO(
    val name: String? = null,
    val distanceKm: Double? = null,
    val durationMin: Int? = null,
    val stops: List<RouteStopDTO>? = null,
    val geometry: String? = null,
    val co2Saved: Double? = null
)