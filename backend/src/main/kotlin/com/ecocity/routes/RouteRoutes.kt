package com.ecocity.routes

import com.ecocity.models.CreateRouteDTO
import com.ecocity.models.UpdateRouteDTO
import com.ecocity.repository.RouteRepository
import io.ktor.http.*
import io.ktor.server.application.*
import io.ktor.server.auth.*
import io.ktor.server.request.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import java.util.UUID

fun Route.routeRoutes() {
    route("/routes") {

        get {
            val page = call.request.queryParameters["page"]?.toIntOrNull() ?: 1
            val size = call.request.queryParameters["size"]?.toIntOrNull() ?: 20
            call.respond(HttpStatusCode.OK, RouteRepository.getAll(page, size))
        }

        get("/{id}") {
            val id = call.parameters["id"]?.let { runCatching { UUID.fromString(it) }.getOrNull() }
                ?: return@get call.respond(HttpStatusCode.BadRequest, "ID inválido")
            call.respond(RouteRepository.getById(id) ?: return@get call.respond(HttpStatusCode.NotFound, "Ruta no encontrada"))
        }

        authenticate("auth-jwt") {
            post {
                val dto = runCatching { call.receive<CreateRouteDTO>() }.getOrNull()
                    ?: return@post call.respond(HttpStatusCode.BadRequest, "Datos inválidos")
                call.respond(HttpStatusCode.Created, RouteRepository.create(dto))
            }

            put("/{id}") {
                val id = call.parameters["id"]?.let { runCatching { UUID.fromString(it) }.getOrNull() }
                    ?: return@put call.respond(HttpStatusCode.BadRequest, "ID inválido")
                val dto = runCatching { call.receive<UpdateRouteDTO>() }.getOrNull()
                    ?: return@put call.respond(HttpStatusCode.BadRequest, "Datos inválidos")
                call.respond(RouteRepository.update(id, dto) ?: return@put call.respond(HttpStatusCode.NotFound, "Ruta no encontrada"))
            }

            delete("/{id}") {
                val id = call.parameters["id"]?.let { runCatching { UUID.fromString(it) }.getOrNull() }
                    ?: return@delete call.respond(HttpStatusCode.BadRequest, "ID inválido")
                if (RouteRepository.delete(id)) call.respond(HttpStatusCode.NoContent)
                else call.respond(HttpStatusCode.NotFound, "Ruta no encontrada")
            }
        }
    }
}