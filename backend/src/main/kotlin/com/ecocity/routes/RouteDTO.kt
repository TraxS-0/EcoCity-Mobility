package com.ecocity.models

import kotlinx.serialization.Serializable

@Serializable
data class RouteDTO(
    val id: String,
    val name: String,
    val type: String,
    val distanceKm: Double,
    val durationMin: Int,
    val stops: List<RouteStopDTO>
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
    val stops: List<RouteStopDTO>  // mínimo 2
)

@Serializable
data class UpdateRouteDTO(
    val name: String? = null,
    val distanceKm: Double? = null,
    val durationMin: Int? = null,
    val stops: List<RouteStopDTO>? = null
)