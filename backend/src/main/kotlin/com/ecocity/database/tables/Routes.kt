package com.ecocity.database.tables

import org.jetbrains.exposed.sql.Table

object Routes : Table("routes") {
    val id          = uuid("id").autoGenerate()
    val name        = varchar("name", 150)
    val type        = varchar("type", 50)
    val distanceKm  = double("distance_km")
    val durationMin = integer("duration_min")

    override val primaryKey = PrimaryKey(id)
}