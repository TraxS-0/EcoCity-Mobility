package com.ecocity.repository

import com.ecocity.database.tables.Users
import org.jetbrains.exposed.sql.*
import org.jetbrains.exposed.sql.transactions.transaction
import java.time.Instant

object UserRepository {

    fun upsert(email: String, name: String, avatarUrl: String?): Unit = transaction {
        val existing = Users.select { Users.email eq email }.singleOrNull()
        if (existing == null) {
            Users.insert {
                it[Users.email]     = email
                it[Users.name]      = name
                it[Users.avatarUrl] = avatarUrl
                it[Users.provider]  = "google"
                it[Users.createdAt] = Instant.now()
                it[Users.updatedAt] = Instant.now()
            }
        } else {
            Users.update({ Users.email eq email }) {
                it[Users.name]      = name
                it[Users.avatarUrl] = avatarUrl
                it[Users.updatedAt] = Instant.now()
            }
        }
    }

    fun findByEmail(email: String) = transaction {
        Users.select { Users.email eq email }.singleOrNull()?.let {
            mapOf(
                "email"     to it[Users.email],
                "name"      to it[Users.name],
                "avatarUrl" to (it[Users.avatarUrl] ?: "")
            )
        }
    }
}