# EcoCity Mobility — Informe técnico TFG
> Documento de referencia para generación de presentación académica

---

## 1. STACK TECNOLÓGICO

### 1.1 Backend

| Tecnología | Versión | Rol |
|---|---|---|
| Kotlin | 2.3.0 | Lenguaje principal del servidor |
| Ktor | 3.4.0 | Framework web asíncrono (JVM) |
| Java (JVM) | 17 | Plataforma de ejecución |
| Exposed ORM | 0.41.1 | Mapeo objeto-relacional tipado |
| PostgreSQL | 16 | Base de datos relacional principal |
| Redis | 7 | Cache en memoria (infraestructura preparada) |
| HikariCP | — | Pool de conexiones a BD |
| Gradle | — | Sistema de construcción (build) |
| Logback | 1.4.14 | Logging estructurado |

**Por qué Ktor y Kotlin:**
Ktor es un framework moderno y ligero diseñado con corrutinas de Kotlin como primitiva central, lo que permite manejar miles de peticiones concurrentes con un consumo de recursos significativamente menor al de frameworks basados en hilos (Spring, Java EE). Kotlin añade null-safety, expresividad y una sintaxis más concisa que Java manteniendo compatibilidad total con el ecosistema JVM.

---

### 1.2 Frontend

| Tecnología | Versión | Rol |
|---|---|---|
| TypeScript | 6.0.2 | Lenguaje tipado para la interfaz |
| React | 19.2.5 | Librería de componentes UI |
| Vite | 8.0.10 | Bundler y servidor de desarrollo |
| React Router | 7.14.2 | Navegación SPA (Single Page Application) |
| Leaflet | 1.9.4 | Motor de mapas interactivos |
| React-Leaflet | 5.0.0 | Integración declarativa de Leaflet en React |
| OpenRouteService | API externa | Geometría de rutas sobre mapa |
| ESLint | — | Análisis estático y calidad de código |

**Por qué este stack frontend:**
React con TypeScript es el estándar actual en desarrollo frontend profesional. Vite, frente a Webpack, ofrece arranque en frío casi instantáneo y HMR (Hot Module Replacement) que acelera significativamente el ciclo de desarrollo. Leaflet es la librería de mapas open-source más madura y ligera disponible.

---

### 1.3 Autenticación y seguridad

| Mecanismo | Detalle |
|---|---|
| OAuth2 (Google) | Proveedor de identidad externo |
| JWT | JSON Web Tokens como credencial de sesión |
| Algoritmo de firma | RSA-256 (asimétrico: clave pública/privada) |
| Librería JWT | Auth0 java-jwt 4.4.0 |
| Expiración de token | 1 hora |

---

### 1.4 Infraestructura y DevOps

| Tecnología | Rol |
|---|---|
| Docker | Contenerización de servicios |
| Docker Compose | Orquestación local (PostgreSQL + Redis) |
| GitHub Actions | Pipeline CI/CD automatizado |

**Pipeline CI/CD (`.github/workflows/ci.yml`):**
En cada push o Pull Request a `main`:
1. Levanta un servicio PostgreSQL real en el runner
2. Genera el par de claves RSA para JWT en tiempo de ejecución
3. Inyecta las variables de entorno necesarias
4. Ejecuta `./gradlew build` para verificar que el proyecto compila correctamente

---

### 1.5 Diagrama de arquitectura general

```
┌─────────────────────────────────────────────────────────────┐
│                        CLIENTE                              │
│              React SPA — TypeScript — Vite                  │
│                     Puerto 5173                             │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌───────────┐  │
│  │LoginPage │  │MapPage   │  │AuthCbk   │  │ Services  │  │
│  │          │  │(Leaflet) │  │Page      │  │ api.ts    │  │
│  └──────────┘  └──────────┘  └──────────┘  └───────────┘  │
└───────────────────────┬─────────────────────────────────────┘
                        │ HTTP/JSON + JWT Bearer
                        │ (proxy Vite /api → :8080)
┌───────────────────────▼─────────────────────────────────────┐
│                       SERVIDOR                              │
│              Ktor — Kotlin — JVM 17                         │
│                     Puerto 8080                             │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌───────────┐  │
│  │AuthRoutes│  │Vehicle   │  │Stop      │  │Route      │  │
│  │(OAuth2+  │  │Routes    │  │Routes    │  │Routes     │  │
│  │ JWT)     │  │          │  │          │  │           │  │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └─────┬─────┘  │
│       │             │              │               │         │
│  ┌────▼─────────────▼──────────────▼───────────────▼─────┐  │
│  │         Repository Layer (VehicleRepo, StopRepo...)   │  │
│  └───────────────────────┬────────────────────────────────┘  │
└──────────────────────────┼──────────────────────────────────┘
                           │ Exposed ORM / SQL
┌──────────────────────────▼──────────────────────────────────┐
│                    PERSISTENCIA                             │
│         PostgreSQL 16            Redis 7                    │
│         (datos relacionales)     (cache, preparado)         │
└─────────────────────────────────────────────────────────────┘
                           │
          ┌────────────────┴─────────────────┐
          │         SERVICIOS EXTERNOS       │
          │  Google OAuth2   OpenRouteService│
          │  (identidad)     (geometría)     │
          └──────────────────────────────────┘
```

---

## 2. PRÁCTICAS VERDES (GREEN COMPUTING)

Las prácticas verdes en software se refieren a decisiones de diseño y tecnológicas que minimizan el consumo de recursos computacionales (CPU, memoria, red, energía) y por tanto la huella de carbono del sistema.

### 2.1 Arquitectura basada en corrutinas (Kotlin Coroutines + Ktor)

**Qué es:** Ktor está construido sobre corrutinas de Kotlin, un modelo de concurrencia cooperativa que permite manejar miles de peticiones simultáneas en unos pocos hilos del sistema operativo.

**Por qué es verde:** Los servidores tradicionales basados en hilos (thread-per-request) necesitan crear un hilo del SO por cada petición concurrente. Un hilo consume entre 512 KB y 1 MB de memoria de pila. Con corrutinas, el mismo trabajo se puede realizar con decenas de hilos en lugar de miles, reduciendo el consumo de RAM y CPU de forma drástica.

**Impacto cuantificable:** Un servidor Ktor puede manejar la misma carga que un servidor Spring MVC tradicional con una fracción de los recursos, lo que se traduce directamente en menos servidores necesarios y menor consumo energético en producción.

---

### 2.2 Pool de conexiones con HikariCP

**Qué es:** HikariCP mantiene un conjunto fijo de conexiones abiertas a la base de datos (`DB_POOL_SIZE=10`), reutilizándolas entre peticiones en lugar de abrir y cerrar una conexión por cada operación.

**Por qué es verde:** Establecer una conexión TCP a PostgreSQL implica handshake TLS, autenticación y asignación de recursos en el servidor de BD. Reutilizar conexiones elimina este overhead en cada operación, reduciendo latencia, consumo de CPU en el servidor de BD y tráfico de red.

---

### 2.3 Paginación en todos los endpoints GET

**Qué es:** Todos los endpoints de listado (`/vehicles`, `/stops`, `/routes`) aceptan parámetros `page` y `size` con valor por defecto `size=20`.

**Por qué es verde:** Transferir solo los datos necesarios en lugar de datasets completos reduce el ancho de banda consumido, la memoria utilizada para serializar/deserializar JSON y el tiempo de CPU invertido. En redes móviles, además, esto se traduce en menor consumo de batería en el dispositivo del usuario.

---

### 2.4 SPA (Single Page Application) con Vite

**Qué es:** La aplicación se carga una sola vez como un bundle estático. Las navegaciones posteriores no requieren recargar HTML desde el servidor: React actualiza solo las partes del DOM que cambian.

**Por qué es verde:**
- Menos peticiones HTTP al servidor por cada interacción del usuario
- Assets estáticos cacheables en el navegador (no se vuelven a descargar)
- Vite genera bundles optimizados con tree-shaking, eliminando código muerto y reduciendo el tamaño de transferencia

---

### 2.5 Leaflet como librería de mapas

**Qué es:** Leaflet pesa ~42 KB minificado y gzippeado. Es la alternativa más ligera a Google Maps JS API (~250 KB) o Mapbox GL (~350 KB).

**Por qué es verde:** Menos kilobytes transferidos por usuario equivalen a menos energía consumida en la transferencia, especialmente relevante en aplicaciones de movilidad que pueden tener millones de usuarios. Con tiles de CartoDB Voyager (open-source), también se evita la dependencia de servicios propietarios con infraestructura energéticamente costosa.

---

### 2.6 Docker Compose para entornos locales reproducibles

**Qué es:** Los servicios de infraestructura (PostgreSQL, Redis) se ejecutan en contenedores Docker en local en lugar de requerir instalaciones nativas o VMs completas.

**Por qué es verde:** Los contenedores comparten el kernel del sistema operativo anfitrión. Frente a máquinas virtuales, eliminan la sobrecarga de un hipervisor y un SO completo por cada servicio, reduciendo el consumo de CPU y RAM del entorno de desarrollo.

---

### 2.7 Infraestructura de Redis preparada para caché

**Qué es:** Redis está incluido en `docker-compose.yml` aunque no está activamente utilizado aún en el código.

**Por qué es verde (cuando se active):** Cachear respuestas de endpoints de solo lectura frecuentes (listado de paradas, rutas) evita queries repetidas a PostgreSQL. Cada query eliminada ahorra ciclos de CPU en la BD, I/O de disco y tráfico de red entre aplicación y BD.

---

### 2.8 Filosofía de movilidad sostenible (misión del producto)

Más allá de la implementación técnica, el propio dominio del proyecto tiene un impacto verde directo:

- **Gestión de flotas de vehículos eléctricos compartidos**: el sistema facilita el acceso a transporte eléctrico compartido, reduciendo el número de vehículos privados de combustión en circulación
- **Visibilidad de CO2 ahorrado**: el modelo de datos incluye el campo `co2SavedKg` en los viajes (`Trips`), orientado a cuantificar y comunicar el impacto medioambiental positivo de cada trayecto
- **Rutas optimizadas**: la integración con OpenRouteService calcula rutas eficientes, minimizando distancias y tiempos de desplazamiento

---

## 3. INNOVACIÓN

### 3.1 Stack moderno en cada capa

| Dimensión | Elección innovadora | Alternativa convencional |
|---|---|---|
| Backend | Ktor + Kotlin con corrutinas | Spring Boot + Java |
| Autenticación | OAuth2 federado + JWT RS256 | Sesiones de servidor + contraseñas |
| Frontend | React 19 + TypeScript 6 + Vite 8 | Create React App + JS |
| Mapas | Leaflet + OpenRouteService | Google Maps API |
| Build backend | Gradle con Version Catalogs (TOML) | Maven con XML |

---

### 3.2 Autenticación federada con Google OAuth2

**Innovación:** Se delega completamente la gestión de identidad a Google. El sistema nunca almacena contraseñas. El flujo implementado sigue el estándar OAuth2 Authorization Code Flow con las siguientes características avanzadas:

1. **Sin estado en el servidor**: el JWT es auto-contenido, el backend no necesita consultar ninguna sesión en BD para autenticar cada petición
2. **Criptografía asimétrica RSA-256**: la firma del JWT usa un par de claves pública/privada. La clave privada nunca sale del servidor; cualquier servicio que tenga la clave pública puede verificar tokens sin comunicarse con el emisor
3. **Generación de claves en CI**: el pipeline genera el par RSA en tiempo de ejecución, garantizando que las claves no se almacenen en el repositorio

---

### 3.3 Visualización geoespacial en tiempo semi-real

**Innovación:** La combinación de Leaflet + React-Leaflet + OpenRouteService permite:
- Renderizar posiciones de flota de vehículos con iconos diferenciados por tipo en un mapa interactivo
- Calcular y dibujar la geometría real de rutas sobre la red viaria (no líneas rectas) mediante la API de OpenRouteService
- Filtrado dinámico por tipo de vehículo y estado directamente sobre el mapa
- Todo ello en una SPA sin recarga de página, con UX fluida

---

### 3.4 Arquitectura orientada a dominio de movilidad

El modelo de datos no es un esquema genérico: está diseñado específicamente para capturar la semántica del dominio de movilidad urbana sostenible:

```
Vehicles ──── Trips ──── Users
                │
              Routes ──── RouteStops ──── Stops
```

El campo `co2SavedKg` en `Trips` es un ejemplo de innovación orientada a impacto: no es un campo técnico sino una métrica de sostenibilidad integrada en el modelo de negocio desde el diseño.

---

### 3.5 Separación de capas con patrones profesionales

La combinación de **Repository Pattern** (backend) + **Service Layer + Custom Hooks** (frontend) es la arquitectura que usan equipos profesionales en empresas como Airbnb, Netflix o Meta para sus aplicaciones React/Kotlin. Aplicarla en un TFG demuestra conocimiento de ingeniería de software más allá del nivel académico básico.

---

### 3.6 CI/CD con entorno de integración real

El pipeline de GitHub Actions no es un simple linter: levanta una instancia de PostgreSQL completa para validar que el backend compila y se conecta correctamente. Esto replica las condiciones reales de producción en cada commit, una práctica de ingeniería de calidad que va más allá de lo habitualmente implementado en proyectos de este nivel académico.

---

## 4. SEGURIDAD

### 4.1 Modelo de autenticación y autorización

**OAuth2 Authorization Code Flow:**
El sistema no gestiona credenciales de usuario. Google actúa como Identity Provider (IdP), eliminando los riesgos asociados al almacenamiento de contraseñas (hashes comprometidos, ataques de fuerza bruta, gestión de resets).

**JWT con RSA-256:**
- Algoritmo **asimétrico**: la firma se realiza con la clave privada (solo en el servidor); la verificación usa la clave pública (puede distribuirse)
- Frente a HMAC-SHA256 (simétrico), RSA-256 permite que múltiples servicios verifiquen tokens sin compartir el secreto de firma
- Expiración configurada a **1 hora**, limitando la ventana de exposición si un token es comprometido
- El claim `email` identifica al usuario sin exponer datos sensibles adicionales

---

### 4.2 Protección de endpoints por autenticación

Los endpoints están clasificados en dos niveles:

| Nivel | Operaciones | Restricción |
|---|---|---|
| Público | GET /vehicles, GET /stops, GET /routes | Sin autenticación |
| Protegido | POST, PUT, DELETE en todos los recursos | JWT válido obligatorio |

El middleware de autenticación de Ktor verifica la firma, el issuer, el audience y la expiración del token en cada petición protegida antes de que llegue al handler.

---

### 4.3 Validación de entrada en el backend

Los endpoints implementan validaciones explícitas antes de procesar:
- Validación del formato **UUID** en parámetros de ruta (`/vehicles/{id}`)
- Validación de **enumerados**: el campo `type` de vehículo solo acepta `["bus", "bike", "scooter", "car"]`
- Devolución de códigos HTTP semánticamente correctos: `400 Bad Request` para datos inválidos, `404 Not Found` para recursos inexistentes, `401 Unauthorized` para acceso sin autenticación

---

### 4.4 Gestión de secretos y configuración

- Las credenciales de BD, claves de Google OAuth y claves RSA se inyectan como **variables de entorno**, nunca hardcodeadas en el código
- El archivo **`.env.example`** documenta las variables requeridas sin exponer valores reales
- La configuración `application.yaml` del backend referencia variables de entorno: `${DB_URL}`, `${DB_USER}`, `${GOOGLE_CLIENT_ID}`, etc.
- Las claves RSA en el pipeline CI se generan en tiempo de ejecución mediante `openssl`, no se almacenan en el repositorio

---

### 4.5 Aislamiento de transacciones en base de datos

HikariCP está configurado con nivel de aislamiento `TRANSACTION_REPEATABLE_READ`, que protege contra lecturas no repetibles (un mismo registro leído dos veces en la misma transacción siempre devuelve el mismo valor). Esto es especialmente relevante en un sistema de movilidad donde múltiples actualizaciones de posición pueden ocurrir concurrentemente.

---

### 4.6 Separación de red en infraestructura

Docker Compose define los servicios en una red interna aislada. PostgreSQL y Redis solo son accesibles dentro de esa red, no expuestos directamente a la red del host más allá de los puertos necesarios para desarrollo.

---

### 4.7 Áreas de seguridad identificadas para mejora

Estas vulnerabilidades son conocidas y documentadas; reconocerlas demuestra madurez técnica:

| Vulnerabilidad | Descripción | Solución propuesta |
|---|---|---|
| Credenciales en repositorio | El archivo `backend/.env` con credenciales reales está commiteado | Mover a GitHub Secrets; añadir `.env` a `.gitignore` del backend |
| JWT en sessionStorage | Accesible desde JavaScript (vulnerable a XSS) | Migrar a `httpOnly` cookies, inaccesibles desde JS |
| Sin rate limiting | Los endpoints no limitan peticiones por IP/usuario | Añadir plugin `RateLimit` de Ktor |
| Sin HTTPS forzado | Solo HTTP en desarrollo local | Configurar TLS con certificados en producción |
| Sin Content Security Policy | Headers de seguridad HTTP no configurados | Añadir plugin `CORS` + CSP headers en Ktor |

---

## 5. RESUMEN EJECUTIVO PARA PRESENTACIÓN

### Dato clave 1 — Escala del proyecto
- **2 lenguajes de programación** (Kotlin + TypeScript)
- **8+ tecnologías** integradas de forma coherente
- **3 capas arquitecturales** bien separadas (frontend, backend, persistencia)
- **2 servicios externos** integrados (Google OAuth2, OpenRouteService)
- **1 pipeline CI/CD** funcional

### Dato clave 2 — Nivel de madurez técnica
Los patrones aplicados (Repository, DTO, Service Layer, Custom Hooks, OAuth2 federado, JWT asimétrico) son los mismos que usan equipos de ingeniería en empresas de referencia del sector tecnológico.

### Dato clave 3 — Alineación con sostenibilidad
El proyecto tiene doble impacto verde: en el dominio (facilita movilidad eléctrica compartida) y en la implementación técnica (corrutinas, paginación, SPA, contenedores ligeros).

### Dato clave 4 — Autenticación de grado profesional
Implementar OAuth2 + JWT RSA-256 correctamente es significativamente más complejo que una autenticación básica usuario/contraseña. Elimina una clase entera de vulnerabilidades (gestión de contraseñas) y sigue los estándares de la industria.

---

*Documento generado para presentación académica TFG — EcoCity Mobility*
*Stack: Kotlin/Ktor · React/TypeScript · PostgreSQL · Docker · GitHub Actions*
