package com.ecocity.models

import kotlinx.serialization.Serializable

@Serializable
data class StopDTO(
    val id: String,
    val name: String,
    val type: String,
    val latitude: Double,
    val longitude: Double,
    val capacity: Int
)

@Serializable
data class CreateStopDTO(
    val name: String,
    val type: String,
    val latitude: Double,
    val longitude: Double,
    val capacity: Int = 0
)

@Serializable
data class UpdateStopDTO(
    val name: String? = null,
    val type: String? = null,
    val latitude: Double? = null,
    val longitude: Double? = null,
    val capacity: Int? = null
)