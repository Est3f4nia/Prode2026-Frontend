<div align="center">

# Prode 2026 - Frontend

**Frontend del Trabajo Práctico Integrador de Programación IV**

</div>

Interfaz moderna para una aplicación de pronósticos deportivos (Prode).

**[Ver Backend](https://github.com/Est3f4nia/Prode2026)**

---

## Tecnologías utilizadas

- **React 18** + **Vite**
- **JavaScript (ES6+)**
- **CSS3** (con archivos por componente)
- **Axios** para consumo de API
- **React Context API** (para autenticación)
- **JWT** (almacenado en localStorage)

---

## Funcionalidades principales

- Registro y Login de usuarios
- Página principal con información del torneo
- Carga y envío de pronósticos por fecha
- Tabla de posiciones / Leaderboard
- Diseño responsive
- Protección de endpoints
- Admin dashboard

---

## Estructura del proyecto

```
# Refactorización en proceso
```

---

## Ejecución

### Requisitos
- Node.js (v18 o superior)
- Backend corriendo (no es necesario, pero se recomienda para probar funcionalidades)

### Instalación

```bash
npm install
```

### Configuración
Asegúrate que el archivo `src/api.js` apunte a la URL correcta del backend:

```js
const API_URL = 'http://localhost:8080/api';
```

### Ejecutar

```bash
npm run dev
```

La aplicación estará disponible en: `http://localhost:5173`

---

## Endpoints

El frontend se comunica con el backend en las siguientes rutas principales:

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/equipos`
- `GET /api/partidos`
- `GET /api/pronosticos`
- `POST /api/pronosticos`
- `GET /api/posiciones`

---

## Notas importantes

- La autenticación se realiza mediante **JWT** almacenado en `localStorage` (solución implementada bajo presión de tiempo).
- Se utiliza **Context API** para manejar el estado de usuario logueado.
- El diseño es responsive y prioriza buena UX en dispositivos móviles.

---

## Documentación adicional

- [Backend del proyecto](https://github.com/Est3f4nia/Prode2026)

---

**Proyecto realizado en equipo**
