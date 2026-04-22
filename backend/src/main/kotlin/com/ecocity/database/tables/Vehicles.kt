package com.ecocity.database.tables

import org.jetbrains.exposed.sql.Table
import org.jetbrains.exposed.sql.javatime.timestamp

object Vehicles : Table("vehicles") {
    val id         = uuid("id").autoGenerate()
    val type       = varchar("type", 50)        // "bike", "scooter", "bus"
    val status     = varchar("status", 20).default("available") // "available", "in_use", "maintenance"
    val latitude   = double("latitude")
    val longitude  = double("longitude")
    val batteryPct = integer("battery_pct").nullable()
    val updatedAt  = timestamp("updated_at")

    override val primaryKey = PrimaryKey(id)
}