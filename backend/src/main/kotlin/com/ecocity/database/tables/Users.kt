package com.ecocity.database.tables

import org.jetbrains.exposed.sql.Table
import org.jetbrains.exposed.sql.javatime.timestamp

object Users : Table("users") {
    val id          = uuid("id").autoGenerate()
    val email       = varchar("email", 255).uniqueIndex()
    val name        = varchar("name", 100)
    val avatarUrl   = varchar("avatar_url", 500).nullable()
    val provider    = varchar("provider", 50)        // "google", "local"
    val providerId  = varchar("provider_id", 255).nullable()
    val role        = varchar("role", 20).default("user") // "user", "admin"
    val createdAt   = timestamp("created_at")
    val updatedAt   = timestamp("updated_at")

    override val primaryKey = PrimaryKey(id)
}