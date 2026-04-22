package com.ecocity.repository

import com.ecocity.database.tables.Vehicles
import com.ecocity.models.CreateVehicleDTO
import com.ecocity.models.UpdateVehicleDTO
import com.ecocity.models.VehicleDTO
import org.jetbrains.exposed.sql.*
import org.jetbrains.exposed.sql.SqlExpressionBuilder.eq
import org.jetbrains.exposed.sql.transactions.transaction
import java.time.Instant
import java.util.UUID

object VehicleRepository {

    fun getAll(page: Int, size: Int): List<VehicleDTO> = transaction {
        Vehicles.selectAll()
            .limit(size, offset = ((page - 1) * size).toLong())
            .map { it.toDTO() }
    }

    fun getById(id: UUID): VehicleDTO? = transaction {
        Vehicles.select { Vehicles.id eq id }
            .singleOrNull()
            ?.toDTO()
    }

    fun create(dto: CreateVehicleDTO): VehicleDTO = transaction {
        val newId = Vehicles.insert {
            it[type]       = dto.type
            it[status]     = "available"
            it[latitude]   = dto.latitude
            it[longitude]  = dto.longitude
            it[batteryPct] = dto.batteryPct
            it[updatedAt]  = Instant.now()
        } get Vehicles.id

        getById(newId)!!
    }

    fun update(id: UUID, dto: UpdateVehicleDTO): VehicleDTO? = transaction {
        val updated = Vehicles.update({ Vehicles.id eq id }) {
            dto.status?.let     { s -> it[status]     = s }
            dto.latitude?.let   { l -> it[latitude]   = l }
            dto.longitude?.let  { l -> it[longitude]  = l }
            dto.batteryPct?.let { b -> it[batteryPct] = b }
            it[updatedAt] = Instant.now()
        }
        if (updated == 0) null else getById(id)
    }

    fun delete(id: UUID): Boolean = transaction {
        Vehicles.deleteWhere { Vehicles.id eq id } > 0
    }

    private fun ResultRow.toDTO() = VehicleDTO(
        id         = this[Vehicles.id].toString(),
        type       = this[Vehicles.type],
        status     = this[Vehicles.status],
        latitude   = this[Vehicles.latitude],
        longitude  = this[Vehicles.longitude],
        batteryPct = this[Vehicles.batteryPct]
    )
}