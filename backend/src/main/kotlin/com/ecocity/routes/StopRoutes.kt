package com.ecocity.routes

import com.ecocity.models.CreateStopDTO
import com.ecocity.models.UpdateStopDTO
import com.ecocity.repository.StopRepository
import io.ktor.http.*
import io.ktor.server.application.*
import io.ktor.server.auth.*
import io.ktor.server.request.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import java.util.UUID

fun Route.stopRoutes() {
    route("/stops") {

        get {
            val page = call.request.queryParameters["page"]?.toIntOrNull() ?: 1
            val size = call.request.queryParameters["size"]?.toIntOrNull() ?: 20
            call.respond(HttpStatusCode.OK, StopRepository.getAll(page, size))
        }

        get("/{id}") {
            val id = call.parameters["id"]?.let { runCatching { UUID.fromString(it) }.getOrNull() }
                ?: return@get call.respond(HttpStatusCode.BadRequest, "ID inválido")
            call.respond(StopRepository.getById(id) ?: return@get call.respond(HttpStatusCode.NotFound, "Parada no encontrada"))
        }

        authenticate("auth-jwt") {
            post {
                val dto = runCatching { call.receive<CreateStopDTO>() }.getOrNull()
                    ?: return@post call.respond(HttpStatusCode.BadRequest, "Datos inválidos")
                call.respond(HttpStatusCode.Created, StopRepository.create(dto))
            }

            put("/{id}") {
                val id = call.parameters["id"]?.let { runCatching { UUID.fromString(it) }.getOrNull() }
                    ?: return@put call.respond(HttpStatusCode.BadRequest, "ID inválido")
                val dto = runCatching { call.receive<UpdateStopDTO>() }.getOrNull()
                    ?: return@put call.respond(HttpStatusCode.BadRequest, "Datos inválidos")
                call.respond(StopRepository.update(id, dto) ?: return@put call.respond(HttpStatusCode.NotFound, "Parada no encontrada"))
            }

            delete("/{id}") {
                val id = call.parameters["id"]?.let { runCatching { UUID.fromString(it) }.getOrNull() }
                    ?: return@delete call.respond(HttpStatusCode.BadRequest, "ID inválido")
                if (StopRepository.delete(id)) call.respond(HttpStatusCode.NoContent)
                else call.respond(HttpStatusCode.NotFound, "Parada no encontrada")
            }
        }
    }
}