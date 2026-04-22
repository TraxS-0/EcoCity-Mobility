package com.ecocity.database.tables

import org.jetbrains.exposed.sql.Table
import org.jetbrains.exposed.sql.javatime.timestamp

object Trips : Table("trips") {
    val id          = uuid("id").autoGenerate()
    val userId      = uuid("user_id").references(Users.id)
    val vehicleId   = uuid("vehicle_id").references(Vehicles.id)
    val routeId     = uuid("route_id").references(Routes.id).nullable()
    val status      = varchar("status", 20).default("active") // "active", "completed", "cancelled"
    val startedAt   = timestamp("started_at")
    val endedAt     = timestamp("ended_at").nullable()
    val co2SavedKg  = double("co2_saved_kg").default(0.0)

    override val primaryKey = PrimaryKey(id)
}