package com.ecocity.database.tables

import org.jetbrains.exposed.sql.Table

object Stops : Table("stops") {
    val id        = uuid("id").autoGenerate()
    val name      = varchar("name", 150)
    val type      = varchar("type", 50)       // "bus", "bike_station", "scooter_zone"
    val latitude  = double("latitude")
    val longitude = double("longitude")
    val capacity  = integer("capacity").default(0)

    override val primaryKey = PrimaryKey(id)
}