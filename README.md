# React Native E-Commerce App

## Descripción
Esta aplicación de e-commerce está desarrollada en React Native y proporciona una experiencia de compra integral. Permite a los usuarios explorar productos, agregar al carrito, realizar pedidos, y más.

---

## Características Principales
- Listado de productos.
- Filtrado por categoría.
- Carrito de compras.
- Gestión de pedidos.
- Registro y autenticación de usuarios.

---

## Tecnologías Utilizadas
- **Frontend**: React Native, Native Base, Expo.
- **Autenticación**: JWT (JSON Web Tokens).

---

## Requisitos del Sistema
- Node.js v14 o superior.
- Expo CLI instalado globalmente.

---

## Instalación y Configuración
1. Clona el repositorio:
   ```bash
   git clone https://github.com/JaquelineRocio/frontend-e-commerce
   ```

2. Instala las dependencias:
   ```bash
   npm install
   ```

3. Configura las variables de entorno:
   - Crea un archivo `.env` en el directorio raíz.
   - Agrega las variables necesarias (p. ej., URL del backend, claves de API).

4. Inicia el proyecto:
   ```bash
   npm start
   ```

---

## Navegación
La aplicación utiliza React Navigation para la navegación entre las pantallas:
- **Inicio**: Listado de productos.
- **Detalle del Producto**: Información detallada de un producto.
- **Carrito**: Lista de productos seleccionados.
- **Pedidos**: Historial de pedidos.
- **Perfil**: Gestión de cuenta de usuario.

---

## API Endpoints
### Productos
- **GET**: `/api/v1/products` - Lista de productos.
- **POST**: `/api/v1/products` - Crear un nuevo producto.
- **PUT**: `/api/v1/products/:id` - Actualizar un producto.
- **DELETE**: `/api/v1/products/:id` - Eliminar un producto.

### Usuarios
- **POST**: `/api/v1/users/register` - Registrar un nuevo usuario.
- **POST**: `/api/v1/users/login` - Iniciar sesión y obtener el token JWT.

### Pedidos
- **GET**: `/api/v1/orders` - Lista de pedidos.
- **POST**: `/api/v1/orders` - Crear un nuevo pedido.


