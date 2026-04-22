package com.ecocity.auth

import com.auth0.jwt.JWT
import com.auth0.jwt.algorithms.Algorithm
import java.security.KeyFactory
import java.security.interfaces.RSAPrivateKey
import java.security.interfaces.RSAPublicKey
import java.security.spec.PKCS8EncodedKeySpec
import java.security.spec.X509EncodedKeySpec
import java.util.Base64
import java.util.Date

object JwtConfig {
    private val privateKey: RSAPrivateKey
    private val publicKey: RSAPublicKey
    val algorithm: Algorithm

    const val ISSUER   = "ecocity"
    const val AUDIENCE = "ecocity-users"
    const val CLAIM    = "email"

    init {
        val privateRaw = object {}.javaClass
            .getResourceAsStream("/keys/private.pem")!!
            .bufferedReader().readText()
            .replace("-----BEGIN RSA PRIVATE KEY-----", "")
            .replace("-----END RSA PRIVATE KEY-----",   "")
            .replace("-----BEGIN PRIVATE KEY-----",     "")
            .replace("-----END PRIVATE KEY-----",       "")
            .replace("\n", "").replace("\r", "").trim()

        val publicRaw = object {}.javaClass
            .getResourceAsStream("/keys/public.pem")!!
            .bufferedReader().readText()
            .replace("-----BEGIN PUBLIC KEY-----", "")
            .replace("-----END PUBLIC KEY-----",   "")
            .replace("\n", "").replace("\r", "").trim()

        val kf = KeyFactory.getInstance("RSA")
        privateKey = kf.generatePrivate(PKCS8EncodedKeySpec(Base64.getDecoder().decode(privateRaw))) as RSAPrivateKey
        publicKey  = kf.generatePublic(X509EncodedKeySpec(Base64.getDecoder().decode(publicRaw)))   as RSAPublicKey
        algorithm  = Algorithm.RSA256(publicKey, privateKey)
    }

    fun generateToken(email: String): String = JWT.create()
        .withIssuer(ISSUER)
        .withAudience(AUDIENCE)
        .withClaim(CLAIM, email)
        .withExpiresAt(Date(System.currentTimeMillis() + 3_600_000)) // 1h
        .sign(algorithm)
}