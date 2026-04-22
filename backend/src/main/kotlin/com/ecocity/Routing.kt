package com.ecocity

import com.ecocity.routes.vehicleRoutes
import com.ecocity.routes.stopRoutes
import com.ecocity.routes.routeRoutes
import com.ecocity.routes.authRoutes
import io.ktor.server.application.*
import io.ktor.server.response.*
import io.ktor.server.routing.*


fun Application.configureRouting() {
    routing {
        get("/") { call.respondText("Hello World!") }
        authRoutes()
        vehicleRoutes()
        stopRoutes()
        routeRoutes()
    }
}