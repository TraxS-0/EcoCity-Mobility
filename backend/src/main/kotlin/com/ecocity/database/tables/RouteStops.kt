package com.ecocity.database.tables

import org.jetbrains.exposed.sql.Table

object RouteStops : Table("route_stops") {
    val id      = uuid("id").autoGenerate()
    val routeId = uuid("route_id").references(Routes.id)
    val stopId  = uuid("stop_id").references(Stops.id)
    val order   = integer("order")

    override val primaryKey = PrimaryKey(id)
}