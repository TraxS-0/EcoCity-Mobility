package com.ecocity.routes

import com.ecocity.models.CreateVehicleDTO
import com.ecocity.models.UpdateVehicleDTO
import com.ecocity.repository.VehicleRepository
import io.ktor.http.*
import io.ktor.server.application.*
import io.ktor.server.auth.*
import io.ktor.server.request.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import java.util.UUID

fun Route.vehicleRoutes() {
    route("/vehicles") {

        // Público
        get {
            val page = call.request.queryParameters["page"]?.toIntOrNull() ?: 1
            val size = call.request.queryParameters["size"]?.toIntOrNull() ?: 20
            call.respond(HttpStatusCode.OK, VehicleRepository.getAll(page, size))
        }

        get("/{id}") {
            val id = call.parameters["id"]?.let { runCatching { UUID.fromString(it) }.getOrNull() }
                ?: return@get call.respond(HttpStatusCode.BadRequest, "ID inválido")
            call.respond(VehicleRepository.getById(id) ?: return@get call.respond(HttpStatusCode.NotFound, "Vehículo no encontrado"))
        }

        // Protegido — requiere JWT
        authenticate("auth-jwt") {
            post {
                val dto = runCatching { call.receive<CreateVehicleDTO>() }.getOrNull()
                    ?: return@post call.respond(HttpStatusCode.BadRequest, "Datos inválidos")

                val validTypes = setOf("bus", "bike", "scooter", "car")
                if (dto.type !in validTypes)
                    return@post call.respond(HttpStatusCode.BadRequest, "Tipo inválido: ${dto.type}")

                call.respond(HttpStatusCode.Created, VehicleRepository.create(dto))
            }

            put("/{id}") {
                val id = call.parameters["id"]?.let { runCatching { UUID.fromString(it) }.getOrNull() }
                    ?: return@put call.respond(HttpStatusCode.BadRequest, "ID inválido")
                val dto = runCatching { call.receive<UpdateVehicleDTO>() }.getOrNull()
                    ?: return@put call.respond(HttpStatusCode.BadRequest, "Datos inválidos")
                call.respond(VehicleRepository.update(id, dto) ?: return@put call.respond(HttpStatusCode.NotFound, "Vehículo no encontrado"))
            }

            delete("/{id}") {
                val id = call.parameters["id"]?.let { runCatching { UUID.fromString(it) }.getOrNull() }
                    ?: return@delete call.respond(HttpStatusCode.BadRequest, "ID inválido")
                if (VehicleRepository.delete(id)) call.respond(HttpStatusCode.NoContent)
                else call.respond(HttpStatusCode.NotFound, "Vehículo no encontrado")
            }
        }
    }
}