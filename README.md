# 🖨️ 3D Cost Calculator

<p align="center">
  <strong>Automatización inteligente de presupuestos y costos para impresión 3D</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite" />
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" />
  <img src="https://img.shields.io/badge/Tailwind_CSS_v4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="TailwindCSS" />
  <img src="https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black" alt="Firebase" />
  <img src="https://img.shields.io/badge/Status-Activo-brightgreen?style=for-the-badge" alt="Status" />
</p>

---

## 🌟 Acerca del Proyecto

**3D Cost Calculator** es una aplicación diseñada para sustituir las tradicionales hojas de Excel para pasar presupuesto. Permite a creadores y profesionales de la impresión 3D calcular los costos de fabricación de sus piezas y generar cotizaciones profesionales de forma instantánea.

---

## 🛠️ Características Clave (MVP)

### 📊 1. Cálculo Detallado de Costos

- **Múltiples Bandejas:** Soporte para calcular proyectos grandes desglosados en múltiples placas de impresión, sumando automáticamente los costos.
- **Filamento:** Cálculo basado en los gramos consumidos y de desperdicio a partir de la relación precio/peso por tipo de material.
- **Tiempo de Impresión:** Incorporación proporcional del consumo eléctrico y el desgaste de la impresora por hora activa.

### 💰 2. Proyección de Ganancias

- Permite definir un multiplicador de ganancia directo (por ejemplo, x6) sobre el costo total de producción de todas las bandejas.

### ⚙️ 3. Panel de Configuración

- **Tarifa eléctrica:** Costo por kilovatio hora (kWh).
- **Catálogo Sincronizado:** Listado de filamentos con precio y peso del carrete guardado en el perfil.
- **Consumibles y extras:** Cadenas para llaveros, laca de adherencia, etc.

## 🌐 Despliegue en Producción

La aplicación se encuentra desplegada y disponible públicamente en:
**🔗 [https://print-cost-calculator-6456f.web.app](https://print-cost-calculator-6456f.web.app)**

### 📋 4. Exportación y Gestión de Presupuestos

- **Formato Tabla:** Vista resumida y clara de todos los costos desglosados.
- **Formato PDF:** Descarga de presupuestos profesionales listos para enviar al cliente.
- **Historial en la Nube:** Guardado de cotizaciones vinculadas a tu cuenta con posibilidad de edición, visualización y exportación directa a PDF desde cualquier dispositivo.

### 🖥️ 5. Interfaz Optimizada

- **Soporte PWA:** Instalable como aplicación nativa (iOS/Android) con íconos, atajos y funcionamiento offline.
- **Sincronización en Tiempo Real:** Inicio de sesión con Google Auth y bases de datos con soporte sin conexión, permitiendo utilizar la app y sincronizar los datos automáticamente.
- **Soporte Internacional:** Soporte total para el uso de comas (`,`) como separador decimal en todos los campos numéricos.
- **Diseño Responsivo y Temas Dinámicos:** Disposición visual adaptativa y soporte automático para _Modo Claro_ y _Modo Oscuro_ en función de las preferencias del sistema del usuario.

---

## 🚀 Stack Tecnológico

| Componente       | Tecnología                                                | Propósito                                                                                         |
| :--------------- | :-------------------------------------------------------- | :------------------------------------------------------------------------------------------------ |
| **Framework**    | [React](https://reactjs.org/) + [Vite](https://vite.dev/) | Renderizado reactivo y carga ultra rápida                                                         |
| **Estilos**      | [Tailwind CSS v4](https://tailwindcss.com/)               | Diseño moderno con soporte nativo dual para Modo Claro/Oscuro                                     |
| **Backend & BD** | [Firebase](https://firebase.google.com/)                  | Autenticación con Google y Firestore (sincronización y persistencia en la nube con caché offline) |

---

## 🔒 Licencia y Propiedad

Este proyecto es software privado y propietario. Todos los derechos reservados a su creador exclusivo.
Para más detalles, consulta el archivo [LICENSE.md](file:///c:/Users/Elmo/Desktop/3d%20cost%20calculator/LICENSE.md).

---

<p align="center">
  <i>Diseñado para maximizar la productividad y profesionalizar el ecosistema maker.</i>
</p>
