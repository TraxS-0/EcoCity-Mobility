package com.ecocity.repository

import com.ecocity.database.tables.RouteStops
import com.ecocity.database.tables.Routes
import com.ecocity.models.CreateRouteDTO
import com.ecocity.models.RouteDTO
import com.ecocity.models.RouteStopDTO
import com.ecocity.models.UpdateRouteDTO
import org.jetbrains.exposed.sql.*
import org.jetbrains.exposed.sql.SqlExpressionBuilder.eq
import org.jetbrains.exposed.sql.transactions.transaction
import java.util.UUID

object RouteRepository {

    fun getAll(page: Int, size: Int): List<RouteDTO> = transaction {
        Routes.selectAll()
            .limit(size, offset = ((page - 1) * size).toLong())
            .map { row ->
                val id = row[Routes.id]
                row.toDTO(id)
            }
    }

    fun getById(id: UUID): RouteDTO? = transaction {
        Routes.select { Routes.id eq id }
            .singleOrNull()
            ?.toDTO(id)
    }

    fun create(dto: CreateRouteDTO): RouteDTO = transaction {
        val newId = Routes.insert {
            it[name]        = dto.name
            it[type]        = dto.type
            it[distanceKm]  = dto.distanceKm
            it[durationMin] = dto.durationMin
        } get Routes.id

        insertStops(newId, dto.stops)
        getById(newId)!!
    }

    fun update(id: UUID, dto: UpdateRouteDTO): RouteDTO? = transaction {
        val updated = Routes.update({ Routes.id eq id }) {
            dto.name?.let        { v -> it[name]        = v }
            dto.distanceKm?.let  { v -> it[distanceKm]  = v }
            dto.durationMin?.let { v -> it[durationMin] = v }
        }
        if (updated == 0) return@transaction null

        dto.stops?.let {
            RouteStops.deleteWhere { routeId eq id }
            insertStops(id, it)
        }

        getById(id)
    }

    fun delete(id: UUID): Boolean = transaction {
        RouteStops.deleteWhere { routeId eq id }
        Routes.deleteWhere { Routes.id eq id } > 0
    }

    private fun insertStops(routeId: UUID, stops: List<RouteStopDTO>) {
        stops.forEach { stop ->
            RouteStops.insert {
                it[RouteStops.routeId] = routeId
                it[RouteStops.stopId]  = UUID.fromString(stop.stopId)
                it[RouteStops.order]   = stop.order
            }
        }
    }

    private fun getStopsForRoute(id: UUID): List<RouteStopDTO> =
        RouteStops
            .select { RouteStops.routeId eq id }
            .orderBy(RouteStops.order)
            .map { RouteStopDTO(it[RouteStops.stopId].toString(), it[RouteStops.order]) }

    private fun ResultRow.toDTO(id: UUID) = RouteDTO(
        id          = this[Routes.id].toString(),
        name        = this[Routes.name],
        type        = this[Routes.type],
        distanceKm  = this[Routes.distanceKm],
        durationMin = this[Routes.durationMin],
        stops       = getStopsForRoute(id)
    )
}