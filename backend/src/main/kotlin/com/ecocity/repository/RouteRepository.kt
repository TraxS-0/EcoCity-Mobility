package com.ecocity.repository

import com.ecocity.database.tables.Routes
import com.ecocity.models.CreateRouteDTO
import com.ecocity.models.RouteDTO
import com.ecocity.models.UpdateRouteDTO
import org.jetbrains.exposed.sql.*
import org.jetbrains.exposed.sql.SqlExpressionBuilder.eq
import org.jetbrains.exposed.sql.transactions.transaction
import java.util.UUID

object RouteRepository {

    fun getAll(page: Int, size: Int): List<RouteDTO> = transaction {
        Routes.selectAll()
            .limit(size, offset = ((page - 1) * size).toLong())
            .map { it.toDTO() }
    }

    fun getById(id: UUID): RouteDTO? = transaction {
        Routes.select { Routes.id eq id }
            .singleOrNull()
            ?.toDTO()
    }

    fun create(dto: CreateRouteDTO): RouteDTO = transaction {
        val newId = Routes.insert {
            it[name]        = dto.name
            it[type]        = dto.type
            it[originId]    = UUID.fromString(dto.originId)
            it[destId]      = UUID.fromString(dto.destId)
            it[distanceKm]  = dto.distanceKm
            it[durationMin] = dto.durationMin
        } get Routes.id
        getById(newId)!!
    }

    fun update(id: UUID, dto: UpdateRouteDTO): RouteDTO? = transaction {
        val updated = Routes.update({ Routes.id eq id }) {
            dto.name?.let        { v -> it[name]        = v }
            dto.distanceKm?.let  { v -> it[distanceKm]  = v }
            dto.durationMin?.let { v -> it[durationMin] = v }
        }
        if (updated == 0) null else getById(id)
    }

    fun delete(id: UUID): Boolean = transaction {
        Routes.deleteWhere { Routes.id eq id } > 0
    }

    private fun ResultRow.toDTO() = RouteDTO(
        id          = this[Routes.id].toString(),
        name        = this[Routes.name],
        type        = this[Routes.type],
        originId    = this[Routes.originId].toString(),
        destId      = this[Routes.destId].toString(),
        distanceKm  = this[Routes.distanceKm],
        durationMin = this[Routes.durationMin]
    )
}