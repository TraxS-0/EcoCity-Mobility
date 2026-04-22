package com.ecocity.database

import com.ecocity.database.tables.*
import com.zaxxer.hikari.HikariConfig
import com.zaxxer.hikari.HikariDataSource
import io.ktor.server.config.*
import org.jetbrains.exposed.sql.Database
import org.jetbrains.exposed.sql.SchemaUtils
import org.jetbrains.exposed.sql.transactions.transaction

object DatabaseFactory {
    fun init(config: ApplicationConfig) {
        val url      = config.property("database.url").getString()
        val user     = config.property("database.user").getString()
        val password = config.property("database.password").getString()
        val driver   = config.property("database.driver").getString()
        val poolSize = config.property("database.maxPoolSize").getString().toInt()

        val hikariConfig = HikariConfig().apply {
            jdbcUrl         = url
            username        = user
            this.password   = password
            driverClassName = driver
            maximumPoolSize = poolSize
            isAutoCommit    = false
            transactionIsolation = "TRANSACTION_REPEATABLE_READ"
        }

        Database.connect(HikariDataSource(hikariConfig))

        transaction {
            SchemaUtils.createMissingTablesAndColumns(
                Users,
                Vehicles,
                Stops,
                Routes,
                Trips
            )
        }
    }
}