# ShipNow API

API de logística construida como proyecto de práctica para el curso de Programación Backend III: Testing y Escalabilidad Backend. Implementa una arquitectura por capas (Router → Controller → Service → Repository → Model) sobre Node.js, Express y MongoDB.

## Cómo correr el proyecto localmente

1. Clonar el repositorio.
2. Instalar las dependencias:
   ```
   npm install
   ```
3. Crear un archivo `.env` en la raíz del proyecto, basado en `.env.example`, completando los valores reales:
   ```
   PORT=8080
   MONGODB_URI=mongodb://localhost:27017/shipnow
   NODE_ENV=development
   LOG_LEVEL=
   CLIENT_URL=http://localhost:5173
   ```
   `LOG_LEVEL` es opcional — si no se define, el nivel del logger se calcula solo según `NODE_ENV` (`debug` en desarrollo, `info` en producción). `CLIENT_URL` se usa para configurar CORS (qué origen tiene permitido consumir la API); si no se define, cae en `http://localhost:5173` por defecto.
4. Levantar el servidor en modo desarrollo (se reinicia solo ante cada cambio):
   ```
   npm run dev
   ```
5. La API queda disponible en `http://localhost:8080/api`, con los endpoints de `/products`, `/users`, `/orders`, `/deliveries` y `/mocks`. El health check vive fuera de `/api`, en `http://localhost:8080/health`.

**Nota sobre idioma:** los identificadores del código (archivos, funciones, variables) están en inglés, como es convención en desarrollo de software. Los datos que expone la API (campos de los modelos, valores de los estados y roles) están en español — por ejemplo, un usuario tiene `nombre`, `email` y `rol` (`cliente`, `repartidor` o `admin`), y un producto tiene `nombre`, `descripcion`, `precio` y `estado`.

Si falta alguna variable de entorno crítica (como `MONGODB_URI`), el servidor no arranca y muestra un error descriptivo en la consola.

## Arquitectura

El proyecto separa responsabilidades en capas:

- **Router**: define los endpoints disponibles y los conecta con el Controller correspondiente.
- **Controller**: recibe el `req`/`res` de Express, llama al Service y devuelve la respuesta HTTP con el código de estado adecuado.
- **Service**: se encarga de la lógica de negocio. Es donde viven las reglas propias de la aplicación (por ejemplo, que un producto no se pueda crear con precio menor o igual a cero, o que un usuario no se pueda registrar con un email inválido).
- **Repository**: administra el acceso a los datos. Es la única capa que habla directamente con Mongoose/MongoDB — busca, crea, actualiza y elimina documentos, sin conocer ninguna regla de negocio.
- **Model**: define el esquema de cada entidad en MongoDB.

## Por qué separar Service y Repository

El Service se encarga de la lógica: decide qué es válido y qué no antes de guardar o modificar datos. El Repository, en cambio, administra esa información: solo sabe leer y escribir en la base de datos, sin opinar sobre si esos datos tienen sentido.

Separarlos evita mezclar dos responsabilidades distintas en un mismo lugar. Si el Repository también validara reglas de negocio, cualquier cambio en esas reglas obligaría a tocar el mismo archivo que maneja el acceso a la base de datos, y viceversa. Con la separación, se puede cambiar cómo se guardan los datos (por ejemplo, migrar de MongoDB a otra base) sin tocar las reglas de negocio, o cambiar una regla de negocio sin arriesgar romper las consultas a la base de datos.

## Configuración de entorno

Las variables de entorno se centralizan en `src/config/index.js`, que valida al arrancar la aplicación que las variables críticas estén presentes. El resto del proyecto nunca accede a `process.env` directamente, sino que importa el objeto `config` ya validado.

## Constantes de dominio

Los valores fijos del negocio (roles de usuario, estados de producto, estados de pedido, estados y prioridad de entrega) están centralizados en `src/constants/index.js` como objetos `Object.freeze`, para evitar strings sueltos repetidos por el código y reducir errores de tipeo.

## Entidades y relaciones

El proyecto tiene 4 entidades: **Products** (independiente) y **Users**, **Orders** y **Deliveries** (relacionadas entre sí):

- Un **Order** (pedido) pertenece a un `cliente`, que es la referencia (`ObjectId`) a un `User` con rol `cliente`. El `total` se calcula en el Service a partir de los `items` (no se confía en el valor que mande el cliente HTTP).
- Una **Delivery** (entrega) referencia a un `pedido` (`Order`) y a un `repartidor` (`User` con rol `repartidor`). El Service valida que ambos existan y que el usuario asignado tenga efectivamente el rol de repartidor antes de crear la entrega.

Estas validaciones de relación viven en los Services (`orders.service.js`, `deliveries.service.js`), que consultan los Repositories de las entidades relacionadas para confirmar que los ids recibidos correspondan a documentos reales.

## Performance: paginación en los listados

Para evitar devolver colecciones completas sin control, los 4 endpoints de listado (`GET /api/products`, `/api/users`, `/api/orders`, `/api/deliveries`) están paginados con `page` y `limit` como query params opcionales:
```
GET /api/orders?page=2&limit=10
```
- `page` (por defecto `1`): qué página pedir.
- `limit` (por defecto `10`): cuántos resultados por página.

La respuesta ya no es un array plano, sino un objeto con la página pedida más información de paginación, por ejemplo para `/api/orders`:
```json
{
  "orders": [ /* hasta "limit" pedidos */ ],
  "total": 137,
  "page": 2,
  "totalPages": 14
}
```
(La propiedad con el array cambia de nombre según la entidad: `products`, `users`, `orders` o `deliveries`.) El total se calcula con una consulta `countDocuments()` aparte, y `totalPages` sale de `Math.ceil(total / limit)`.

Esta paginación está documentada en Swagger (los 4 endpoints indican `page`/`limit` como parámetros de query, y la respuesta `200` con la forma exacta de arriba) y cubierta por tests funcionales.

## Manejo de errores

La API centraliza todos los errores esperados en una capa común, en vez de responderlos manualmente en cada Controller.

- **`src/errors/errorDictionary.js`**: diccionario con todos los errores del dominio (`USER_NOT_FOUND`, `PRODUCT_NOT_FOUND`, `ORDER_NOT_FOUND`, `DELIVERY_NOT_FOUND`, `INVALID_DRIVER_ROLE`, `VALIDATION_ERROR`, `INVALID_MOCK_AMOUNT`, `ROUTE_NOT_FOUND`, `FILE_REQUIRED`, `INVALID_FILE_TYPE`, `FILE_TOO_LARGE`, `INVALID_DOCUMENT_TYPE`, `UPLOAD_ERROR`, `INTERNAL_SERVER_ERROR`), cada uno con su `statusCode` HTTP y su mensaje.
- **`src/errors/AppError.js`**: clase que extiende `Error`, arma un error a partir de un código del diccionario (opcionalmente con un mensaje más específico).
- **`src/middlewares/errorHandler.js`**: middleware global (el último que se registra en `app.js`) que recibe cualquier error de la aplicación y arma la respuesta final.
- **`src/middlewares/routeNotFound.js`**: middleware para rutas que no existen.

Los Services lanzan `AppError` cuando detectan un problema (dato inválido, recurso inexistente, relación inconsistente). Los Controllers ya no deciden códigos HTTP: en el `catch` solo hacen `next(error)`, delegando la respuesta al middleware global.

### Formato de respuesta de error

Toda la API responde los errores esperados con la misma estructura:
```json
{
  "status": "error",
  "error": "USER_NOT_FOUND",
  "message": "El usuario solicitado no existe"
}
```
Un error inesperado (no controlado explícitamente) responde `500` con `error: "INTERNAL_SERVER_ERROR"`, sin exponer detalles internos del servidor.

### Cómo probar el comportamiento ante errores

Con el servidor corriendo, algunos casos para probar:
- `GET /api/users/000000000000000000000000` (id válido pero inexistente) → `404 USER_NOT_FOUND`
- `POST /api/products` con `"precio": -5` → `400 VALIDATION_ERROR`
- `POST /api/mocks/generateData` con `"users": -3` → `400 INVALID_MOCK_AMOUNT`
- `POST /api/deliveries` con un `repartidor` que en realidad tiene rol `cliente` → `400 INVALID_DRIVER_ROLE`
- Cualquier ruta que no exista, por ejemplo `GET /api/ruta-inexistente` → `404 ROUTE_NOT_FOUND`

## Carga de archivos (Multer)

La API acepta documentos y comprobantes vía `multipart/form-data`, usando **Multer**, configurado de forma centralizada en `src/middlewares/upload.middleware.js` (separado de rutas y controllers).

### Configuración

- **Almacenamiento**: `diskStorage`, con la carpeta de destino decidida según el campo del archivo (`document` → `uploads/documents`, `proof` → `uploads/proofs`, `license` → `uploads/licenses`). El nombre del archivo se genera único (`timestamp-random.extension`), nunca se usa el nombre original como nombre final.
- **Tipos permitidos**: `application/pdf`, `image/jpeg`, `image/png`, `image/webp`.
- **Tamaño máximo**: 5MB.
- La carpeta `uploads/` está en `.gitignore` (excepto los `.gitkeep` que mantienen la estructura de subcarpetas) — los archivos subidos nunca se suben al repositorio, y en MongoDB solo se guardan sus **metadatos** (nombre original, nombre generado, ruta, tipo MIME, tamaño, tipo de documento y fecha), nunca el archivo en sí.

### Endpoints

**`POST /api/users/{id}/documents`** — sube un documento asociado a un usuario. Body `multipart/form-data` con:
- `document` (archivo, requerido)
- `type` (texto, requerido) — uno de `documento_usuario`, `licencia_repartidor`, `comprobante_entrega`

**`POST /api/orders/{id}/proof`** — sube un comprobante de entrega asociado a un pedido. Body `multipart/form-data` con:
- `proof` (archivo, requerido)

Ambos endpoints validan que la entidad exista, que el archivo haya llegado, el tipo de archivo y (para documentos de usuario) el tipo de documento, respondiendo siempre con el formato de error centralizado del proyecto (`FILE_REQUIRED`, `INVALID_FILE_TYPE`, `FILE_TOO_LARGE`, `INVALID_DOCUMENT_TYPE`, `USER_NOT_FOUND`/`ORDER_NOT_FOUND`). Si la validación de negocio falla después de que Multer ya guardó el archivo en disco, el Service borra ese archivo antes de responder, para no dejar archivos huérfanos en el servidor.

Documentados en Swagger (`/api/docs`, tags Users y Orders) como `multipart/form-data`, y cubiertos por tests funcionales en `tests/uploads.test.js` (carga exitosa, archivo faltante, tipo de archivo inválido, tipo de documento inválido, entidad inexistente).

## Testing

La API tiene una suite de tests funcionales automatizados con **Mocha** (organiza y ejecuta), **Chai** (aserciones) y **Supertest** (peticiones HTTP contra la app, sin necesidad de abrir un puerto real).

### Por qué `app.js` y `server.js` están separados

`src/app.js` exporta la app de Express configurada (rutas, middlewares, manejo de errores), sin llamar a `app.listen(...)`. `src/server.js` es el punto de entrada real: importa `app`, conecta a MongoDB y recién ahí levanta el servidor. Esta separación es la que le permite a Supertest importar `app` directamente en los tests, sin depender de que haya un servidor real corriendo en un puerto.

### Entorno de testing separado

Los tests usan variables de entorno propias, cargadas desde un archivo `.env.test` (no se sube al repositorio, igual que `.env` — ver `.env.test.example` como referencia):
```
PORT=8081
MONGODB_URI=mongodb://localhost:27017/shipnow-test
NODE_ENV=test
```
La base de datos (`shipnow-test`) es **distinta** a la de desarrollo (`shipnow`), para que correr los tests nunca modifique datos reales. Mongo crea la base sola la primera vez que un test escribe en ella.

### Cómo ejecutar los tests

```
npm test
```

Esto corre `mocha` sobre todos los archivos `tests/**/*.test.js`, precargando `tests/setup.js` (que carga `.env.test` y conecta/desconecta MongoDB una sola vez para toda la suite).

### Qué está cubierto

- **`tests/users.test.js`**: crear usuario (éxito), email inválido (400), listar usuarios (paginado).
- **`tests/products.test.js`**: crear producto (éxito), precio inválido (400), listar productos (paginado), producto inexistente (404).
- **`tests/orders.test.js`**: crear pedido con total calculado (éxito), cliente inexistente (404), pedido sin items (400), obtener por ID (éxito y 404), actualizar estado, listar (paginado).
- **`tests/deliveries.test.js`**: crear entrega (éxito), repartidor con rol incorrecto (400), pedido inexistente (404), listar (paginado), entrega inexistente (404).
- **`tests/mocks.test.js`**: generar datos falsos sin guardarlos (éxito), cantidad inválida (400), generar e insertar en MongoDB (éxito).
- **`tests/logger.test.js`**: endpoint `/api/loggerTest` (éxito) y ruta inexistente (404, coherente con el middleware de errores).
- **`tests/docs.test.js`**: la ruta de Swagger (`/api/docs`) responde.
- **`tests/uploads.test.js`**: carga de documento de usuario (éxito, archivo faltante, tipo de documento inválido, tipo de archivo inválido, usuario inexistente) y carga de comprobante de pedido (éxito, pedido inexistente). Usa archivos reales de `tests/fixtures/` con `.attach()` de Supertest, y borra los archivos que efectivamente sube al terminar.

Cada test valida el `status` HTTP **y** la estructura del body (propiedades esperadas, valores calculados, código de error interno), no solo que la ruta "responda algo".

### Datos de prueba y limpieza

Los datos que necesita cada grupo de tests (usuarios, pedidos) se crean dentro del propio test, con emails identificables (`test-...@mail.com`) para poder limpiarlos después con `afterEach`/`after`, sin depender de datos cargados manualmente. Los mocks generados por `generateData` usan el dominio `@test.com`, y también se limpian automáticamente.

## Documentación interactiva (Swagger)

La API está documentada con **OpenAPI 3.0**, usando `swagger-jsdoc` (arma la especificación) y `swagger-ui-express` (la muestra en una interfaz web interactiva).

Con el servidor corriendo, la documentación está disponible en:
```
http://localhost:8080/api/docs
```

Desde ahí se puede ver cada endpoint agrupado por módulo, y **probarlo directamente** desde el navegador (botón "Try it out"), sin necesidad de Postman.

### Qué está documentado

La configuración vive separada de las rutas, en `src/docs/`:
- `swagger.config.js`: configuración general (info de la API, servidor, dónde buscar la documentación).
- `schemas.yaml`: schemas reutilizables — `Usuario`, `Producto`, `Pedido`, `ItemPedido`, `Entrega`, `ErrorResponse`, `MessageResponse`.
- `users.yaml`, `products.yaml`, `orders.yaml`, `deliveries.yaml`: los endpoints CRUD de cada entidad (incluida la paginación del listado), agrupados con el tag correspondiente (`Users`, `Products`, `Orders`, `Deliveries`). `users.yaml` y `orders.yaml` además documentan sus endpoints de carga de archivos (`/documents` y `/proof`).
- `mocks.yaml`: los 5 endpoints del módulo de mocking, aclarando cuáles no guardan datos (`mockingusers`, `mockingproducts`, `mockingorders`, `mockingdeliveries`) y cuál sí inserta en MongoDB (`generateData`).
- `logger.yaml`: el endpoint `/api/loggerTest`, aclarando que es una herramienta de diagnóstico y no una funcionalidad de negocio.

Cada endpoint documenta método HTTP, ruta, descripción, parámetros (de ruta o query), el body esperado (cuando aplica), la respuesta exitosa y las respuestas de error posibles — usando los mismos códigos de error reales del proyecto (`USER_NOT_FOUND`, `PRODUCT_NOT_FOUND`, `ORDER_NOT_FOUND`, `DELIVERY_NOT_FOUND`, `INVALID_DRIVER_ROLE`, `VALIDATION_ERROR`, `INVALID_MOCK_AMOUNT`).

La documentación refleja el comportamiento real de la API: los nombres de campo son los mismos que usa el proyecto (`nombre`, `email`, `rol`, `precio`, `cliente`, `repartidor`, etc.), no una versión traducida o simplificada.

## Logging

La API usa **[Winston](https://github.com/winstonjs/winston)** como logger centralizado, configurado en `src/utils/logger.js` y reutilizado en todo el proyecto (nunca se usa `console.log` directamente para eventos de la aplicación).

### Niveles de log

De más grave a menos grave: `fatal`, `error`, `warning`, `info`, `http`, `debug`.

- **`debug`**: detalle técnico, solo útil durante el desarrollo.
- **`http`**: registro de peticiones.
- **`info`**: eventos normales importantes (servidor iniciado, pedido creado, mocks generados).
- **`warning`**: errores esperados del negocio (recurso no encontrado, validación fallida) — se usan en el middleware global de errores para todo lo que responde con status `< 500`.
- **`error`**: fallas operativas — errores inesperados del servidor (status `>= 500`).
- **`fatal`**: problemas críticos, como no poder conectar a MongoDB al arrancar.

### Comportamiento por entorno

Controlado por `NODE_ENV` (ya validado en `src/config/index.js`):
- **Desarrollo**: se muestran todos los niveles, desde `debug`.
- **Producción**: se muestran desde `info` en adelante (se omiten `http` y `debug`, para no generar ruido).

### Persistencia y rotación

Los niveles `error` y `fatal` se guardan además en archivos dentro de `logs/`, rotados por día (`logs/errors-YYYY-MM-DD.log`, usando `winston-daily-rotate-file`), conservando un historial de 14 días. La carpeta `logs/` y los archivos `*.log` están en `.gitignore` — no se suben al repositorio porque los genera la aplicación y podrían contener información interna.

### Endpoint de prueba

`GET /loggerTest` dispara los 6 niveles de una sola vez, para verificar rápidamente que la configuración funciona. No es un endpoint de negocio, es una herramienta de diagnóstico. Al probarlo se debería ver: las 6 líneas en la consola del servidor (con color y timestamp), y solo las de `error`/`fatal` reflejadas en `logs/errors-FECHA.log`.

## Mocking y datos de prueba

El proyecto incluye un router de mocking (`/api/mocks`) para generar datos de prueba sin depender de información cargada a mano. Sigue la misma arquitectura por capas que el resto de la API: los generadores viven en `src/mocks/` (funciones puras, sin tocar la base de datos), `mocksService` los orquesta, y el Controller/Router exponen los endpoints.

Los datos falsos se generan con [Faker](https://fakerjs.dev/) (nombres, emails y productos realistas) para que cada dato sea distinto en cada ejecución.

### Endpoints disponibles

**`GET /api/mocks/mockingusers?count=N`** / **`mockingproducts`** / **`mockingorders`** / **`mockingdeliveries`**
Devuelven `N` registros falsos de cada entidad (por defecto 10 si no se especifica `count`) **sin guardarlos en la base de datos**. Como los pedidos y entregas de "solo lectura" no existen realmente en Mongo, sus relaciones (`cliente`, `pedido`, `repartidor`) se completan con ids con formato válido pero inventados — sirven para ver la forma del dato, no para usarse como referencias reales.

**`POST /api/mocks/generateData`**
Genera e **inserta** en MongoDB la cantidad indicada de cada entidad, respetando las relaciones entre ellas:
```json
{
  "users": 10,
  "products": 10,
  "orders": 5,
  "deliveries": 3
}
```
El orden de generación importa: primero se crean los usuarios (1 de cada 3 con rol `repartidor`, el resto `cliente`), después los pedidos (cada uno asignado a un cliente recién creado), y por último las entregas (cada una asignada a un pedido y a un repartidor recién creados). Si se piden `orders` o `deliveries` sin los usuarios/pedidos necesarios para relacionarlos, la API responde `400` con un mensaje descriptivo en vez de crear datos inconsistentes.

Cada registro pasa por su Service correspondiente (`usersService.createUser`, `ordersService.createOrder`, etc.), por lo que se aplican las mismas validaciones y reglas de negocio que un dato real (hasheo de contraseña, cálculo de `total`, coherencia de rol del repartidor). Responde con la cantidad de registros creados:
```json
{
  "usersCreated": 10,
  "productsCreated": 10,
  "ordersCreated": 5,
  "deliveriesCreated": 3
}
```

### Cómo probarlo

Con el servidor corriendo (`npm run dev`), probar los endpoints desde Postman (la colección incluida en `postman/` tiene una carpeta por módulo: Products, Users, Orders, Deliveries, Mocks, Errores, Logger, Health y Uploads) apuntando a `http://localhost:8080/api/mocks/...`. Para limpiar los datos de prueba generados, se pueden eliminar los documentos directamente desde MongoDB Compass, en las colecciones `users`, `products`, `orders` y `deliveries` de la base `shipnow`.

## Producción y Docker

### Health check

`GET /health` responde sin necesidad de tocar la base de datos ni ninguna otra capa — sirve para que una herramienta de monitoreo o el propio Docker sepan rápidamente si la API está viva:
```json
{
  "status": "ok",
  "environment": "production",
  "uptime": 123.45,
  "timestamp": "2026-01-01T00:00:00.000Z"
}
```
No expone información sensible (nada de credenciales, rutas internas o detalles de conexión).

### Endpoints internos según el entorno

`/api/mocks` y `/api/loggerTest` son herramientas de desarrollo — generan datos falsos o disparan logs de prueba, no tienen valor para un cliente real de la API. Por eso, **solo están disponibles cuando `NODE_ENV !== 'production'`**; en producción, esas rutas responden `404 ROUTE_NOT_FOUND` como cualquier ruta inexistente. `/api/docs` (Swagger), en cambio, **queda disponible en todos los entornos**, porque documentar la API no representa un riesgo y es útil para quien la consuma en cualquier momento.

### Variables de entorno

El proyecto no implementa autenticación todavía, por lo que no usa `JWT_SECRET` — si en algún momento se agrega login, ahí sí correspondería sumarlo a `.env`/`.env.example`. El resto de las variables (`PORT`, `MONGODB_URI`, `NODE_ENV`, `LOG_LEVEL`, `CLIENT_URL`) están detalladas más arriba, en "Cómo correr el proyecto localmente".

### Construir la imagen

```
docker build -t shipnow-api .
```
Usa `node:22-alpine` como base, instala solo las dependencias de producción (`npm install --omit=dev`, sin Mocha/Chai/Supertest/nodemon) y expone el puerto `8080`.

### Ejecutar el contenedor

```
docker run -d -p 8080:8080 --env-file .env shipnow-api
```
La opción `-p 8080:8080` conecta el puerto `8080` del contenedor con el `8080` de tu máquina — la API queda en `http://localhost:8080`, igual que en desarrollo local.

**Importante si MongoDB corre en tu propia máquina** (no en Atlas): dentro del contenedor, `localhost` apunta al contenedor mismo, no a tu PC. Hay que usar `host.docker.internal` en el `MONGODB_URI` en vez de `localhost`, por ejemplo:
```
MONGODB_URI=mongodb://host.docker.internal:27017/shipnow
```

### Qué no viaja a la imagen

El `.dockerignore` excluye `node_modules`, `.env`, `.env.test`, `.git`, `logs`, `uploads`, `coverage`, `npm-debug.log` y `tests` — mismo criterio que `.gitignore`, pero aplicado a lo que Docker copia. Las carpetas de `uploads/` (`documents`, `proofs`, `licenses`) se recrean solas al arrancar la app (ver `src/middlewares/upload.middleware.js`), así que no hace falta que viajen vacías en la imagen.

### Logs y uploads dentro de un contenedor

Los archivos que la app genera en tiempo de ejecución (logs rotados, documentos subidos) viven **dentro del contenedor**, no son persistentes: si el contenedor se elimina, se pierden. Para este proyecto alcanza con saber esto — en un entorno productivo real, esos archivos se guardarían con volúmenes de Docker o un servicio externo de almacenamiento, algo fuera del alcance de esta etapa.
