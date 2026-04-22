package com.ecocity.models

import kotlinx.serialization.Serializable

@Serializable
data class RouteDTO(
    val id: String,
    val name: String,
    val type: String,
    val originId: String,
    val destId: String,
    val distanceKm: Double,
    val durationMin: Int
)

@Serializable
data class CreateRouteDTO(
    val name: String,
    val type: String,
    val originId: String,
    val destId: String,
    val distanceKm: Double,
    val durationMin: Int
)

@Serializable
data class UpdateRouteDTO(
    val name: String? = null,
    val distanceKm: Double? = null,
    val durationMin: Int? = null
)