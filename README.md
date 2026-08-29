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
   ```
4. Levantar el servidor en modo desarrollo (se reinicia solo ante cada cambio):
   ```
   npm run dev
   ```
5. La API queda disponible en `http://localhost:8080/api`, con los endpoints de `/products`, `/users`, `/orders`, `/deliveries` y `/mocks`.

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

## Manejo de errores

La API centraliza todos los errores esperados en una capa común, en vez de responderlos manualmente en cada Controller.

- **`src/errors/errorDictionary.js`**: diccionario con todos los errores del dominio (`USER_NOT_FOUND`, `PRODUCT_NOT_FOUND`, `ORDER_NOT_FOUND`, `DELIVERY_NOT_FOUND`, `INVALID_DRIVER_ROLE`, `VALIDATION_ERROR`, `INVALID_MOCK_AMOUNT`, `ROUTE_NOT_FOUND`, `INTERNAL_SERVER_ERROR`), cada uno con su `statusCode` HTTP y su mensaje.
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
- `users.yaml`, `products.yaml`, `orders.yaml`, `deliveries.yaml`: los 5 endpoints CRUD de cada entidad, agrupados con el tag correspondiente (`Users`, `Products`, `Orders`, `Deliveries`).
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

Con el servidor corriendo (`npm run dev`), probar los endpoints desde Postman (la colección incluida en `postman/` ya tiene las carpetas Products, Users, Orders, Deliveries y Mocks) apuntando a `http://localhost:8080/api/mocks/...`. Para limpiar los datos de prueba generados, se pueden eliminar los documentos directamente desde MongoDB Compass, en las colecciones `users`, `products`, `orders` y `deliveries` de la base `shipnow`.
