package com.ecocity

import com.auth0.jwt.JWT
import com.auth0.jwt.algorithms.Algorithm
import com.ecocity.auth.JwtConfig
import com.ecocity.database.DatabaseFactory
import io.ktor.server.application.*
import io.ktor.server.auth.*
import io.ktor.server.auth.jwt.*
import io.ktor.serialization.kotlinx.json.*
import io.ktor.server.plugins.contentnegotiation.*

fun main(args: Array<String>) {
    io.ktor.server.netty.EngineMain.main(args)
}

fun Application.module() {
    install(ContentNegotiation) { json() }

    install(Authentication) {
        jwt("auth-jwt") {
            realm     = "ecocity"
            verifier(
                JWT.require(JwtConfig.algorithm)
                    .withIssuer(JwtConfig.ISSUER)
                    .withAudience(JwtConfig.AUDIENCE)
                    .build()
            )
            validate { credential ->
                if (credential.payload.getClaim(JwtConfig.CLAIM).asString() != null)
                    JWTPrincipal(credential.payload)
                else null
            }
        }
    }

    DatabaseFactory.init(environment.config)
    configureRouting()
}