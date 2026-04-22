package com.ecocity.repository

import com.ecocity.database.tables.Stops
import com.ecocity.models.CreateStopDTO
import com.ecocity.models.StopDTO
import com.ecocity.models.UpdateStopDTO
import org.jetbrains.exposed.sql.*
import org.jetbrains.exposed.sql.SqlExpressionBuilder.eq
import org.jetbrains.exposed.sql.transactions.transaction
import java.util.UUID

object StopRepository {

    fun getAll(page: Int, size: Int): List<StopDTO> = transaction {
        Stops.selectAll()
            .limit(size, offset = ((page - 1) * size).toLong())
            .map { it.toDTO() }
    }

    fun getById(id: UUID): StopDTO? = transaction {
        Stops.select { Stops.id eq id }
            .singleOrNull()
            ?.toDTO()
    }

    fun create(dto: CreateStopDTO): StopDTO = transaction {
        val newId = Stops.insert {
            it[name]      = dto.name
            it[type]      = dto.type
            it[latitude]  = dto.latitude
            it[longitude] = dto.longitude
            it[capacity]  = dto.capacity
        } get Stops.id
        getById(newId)!!
    }

    fun update(id: UUID, dto: UpdateStopDTO): StopDTO? = transaction {
        val updated = Stops.update({ Stops.id eq id }) {
            dto.name?.let      { v -> it[name]      = v }
            dto.type?.let      { v -> it[type]      = v }
            dto.latitude?.let  { v -> it[latitude]  = v }
            dto.longitude?.let { v -> it[longitude] = v }
            dto.capacity?.let  { v -> it[capacity]  = v }
        }
        if (updated == 0) null else getById(id)
    }

    fun delete(id: UUID): Boolean = transaction {
        Stops.deleteWhere { Stops.id eq id } > 0
    }

    private fun ResultRow.toDTO() = StopDTO(
        id        = this[Stops.id].toString(),
        name      = this[Stops.name],
        type      = this[Stops.type],
        latitude  = this[Stops.latitude],
        longitude = this[Stops.longitude],
        capacity  = this[Stops.capacity]
    )
}