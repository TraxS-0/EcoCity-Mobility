package com.ecocity.routes

import com.ecocity.auth.JwtConfig
import io.ktor.client.*
import io.ktor.client.call.*
import io.ktor.client.engine.cio.*
import io.ktor.client.plugins.contentnegotiation.*
import io.ktor.client.request.*
import io.ktor.http.*
import io.ktor.serialization.kotlinx.json.*
import io.ktor.server.application.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import kotlinx.serialization.Serializable
import kotlinx.serialization.json.Json

@Serializable
data class GoogleTokenResponse(val access_token: String)

@Serializable
data class GoogleUserInfo(val email: String, val name: String, val picture: String? = null)

@Serializable
data class AuthResponse(val token: String, val email: String, val name: String)

fun Route.authRoutes() {
    val clientId     = System.getenv("GOOGLE_CLIENT_ID")     ?: error("GOOGLE_CLIENT_ID no configurado")
    val clientSecret = System.getenv("GOOGLE_CLIENT_SECRET") ?: error("GOOGLE_CLIENT_SECRET no configurado")
    val redirectUri  = System.getenv("GOOGLE_REDIRECT_URI")  ?: "http://localhost:8080/auth/callback"

    val httpClient = HttpClient(CIO) {
        install(io.ktor.client.plugins.contentnegotiation.ContentNegotiation) {
            json(Json { ignoreUnknownKeys = true })
        }
    }

    route("/auth") {

        // Redirige al login de Google
        get("/login") {
            val url = "https://accounts.google.com/o/oauth2/v2/auth?" +
                "client_id=$clientId" +
                "&redirect_uri=$redirectUri" +
                "&response_type=code" +
                "&scope=email%20profile"
            call.respondRedirect(url)
        }

        // Google redirige aquí con el código
        get("/callback") {
            val code = call.request.queryParameters["code"]
                ?: return@get call.respond(HttpStatusCode.BadRequest, "Código no recibido")

            // Intercambia código por access_token
            val tokenResponse: GoogleTokenResponse = httpClient.post("https://oauth2.googleapis.com/token") {
                contentType(ContentType.Application.FormUrlEncoded)
                setBody("code=$code&client_id=$clientId&client_secret=$clientSecret&redirect_uri=$redirectUri&grant_type=authorization_code")
            }.body()

            // Obtiene info del usuario
            val userInfo: GoogleUserInfo = httpClient.get("https://www.googleapis.com/oauth2/v2/userinfo") {
                bearerAuth(tokenResponse.access_token)
            }.body()

            // Genera JWT RS256
            val jwt = JwtConfig.generateToken(userInfo.email)

            call.respondRedirect("http://localhost:5173/auth/callback?token=$jwt")
        }
    }
}