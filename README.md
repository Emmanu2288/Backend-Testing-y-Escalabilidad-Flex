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
5. La API queda disponible en `http://localhost:8080/api`, con los endpoints de `/products`, `/users` y `/mocks`.

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

Los valores fijos del negocio (roles de usuario, estados de producto) están centralizados en `src/constants/index.js` como objetos `Object.freeze`, para evitar strings sueltos repetidos por el código y reducir errores de tipeo.

## Mocking y datos de prueba

El proyecto incluye un router de mocking (`/api/mocks`) para generar datos de prueba sin depender de información cargada a mano. Sigue la misma arquitectura por capas que el resto de la API: los generadores viven en `src/mocks/` (funciones puras, sin tocar la base de datos), `mocksService` los orquesta, y el Controller/Router exponen los endpoints.

Los datos falsos se generan con [Faker](https://fakerjs.dev/) (nombres, emails y productos realistas) para que cada dato sea distinto en cada ejecución.

### Endpoints disponibles

**`GET /api/mocks/mockingusers?count=N`**
Devuelve `N` usuarios falsos (por defecto 10 si no se especifica `count`) **sin guardarlos en la base de datos**. Sirve para ver rápidamente cómo se verían los datos, sin efectos secundarios.

**`GET /api/mocks/mockingproducts?count=N`**
Igual que el anterior, pero para productos.

**`POST /api/mocks/generateData`**
Genera e **inserta** en MongoDB la cantidad de usuarios y productos indicada en el body:
```json
{
  "users": 10,
  "products": 10
}
```
Cada usuario mock se crea a través de `usersService.createUser`, por lo que pasa por las mismas validaciones y el mismo hasheo de contraseña (con `bcrypt`) que un usuario real. Responde con la cantidad de registros creados, por ejemplo:
```json
{
  "usersCreated": 10,
  "productsCreated": 10
}
```
Si `users` y `products` no son números, son negativos, o ambos son `0`, la API responde `400` con un mensaje descriptivo.

### Cómo probarlo

Con el servidor corriendo (`npm run dev`), probar los tres endpoints desde Postman (o cualquier cliente HTTP) apuntando a `http://localhost:8080/api/mocks/...`. Para limpiar los datos de prueba generados, se pueden eliminar los documentos directamente desde MongoDB Compass, en las colecciones `users` y `products` de la base `shipnow`.
