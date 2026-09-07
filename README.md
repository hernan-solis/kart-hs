# 🏁 Kart-HS - WebApp de Campeonatos de Karting con Estética F1

Aplicación web integral, rápida y responsive (diseñada especialmente para celulares y PCs) para el seguimiento y gestión de campeonatos internos de karting, inspirada al 100% en la emoción y gráfica de la **Fórmula 1**.

---

## 🏆 Campeonato Oficial Activo: Copa Pistón 2025

| Pos | Escudería | Pilotos (Parejas) | Colores Oficiales | Puntos a Fecha 8 |
| :---: | :--- | :--- | :--- | :---: |
| **1º** 🏆 | **HAAS** | **DEMON** (Braian) + **PUCHO** (Lucas) | Rojo Racing / Blanco / Negro | **79 pts** |
| **2º** 🥈 | **Red Bull Racing** | **MECA** (Darío) + **JOEL** (Mauro) | Azul Marino / Rojo / Amarillo | **66 pts** |
| **3º** 🥉 | **McLaren** | **NAHUE** (Nahuel) + **LUQUITAS** (Luciano) | Naranja Papaya / Negro | **57 pts** |
| **4º** | **Alpine** | **SALTA** (Adrián) + **RAMA** (Ramiro) | Azul Eléctrico / Rosa BWT | **53 pts** |
| **5º** | **Audi Sport** | **FEDE** (Federico) + **EZE** (Emanuel) | Plata / Rojo Sport / Negro | **39 pts** |

---

## ⚡ Sistema Oficial de Puntuación

- **1º Puesto**: 8 puntos
- **2º Puesto**: 7 puntos
- **3º Puesto**: 6 puntos
- **4º Puesto**: 5 puntos
- **5º Puesto**: 4 puntos
- **6º Puesto**: 3 puntos
- **7º Puesto**: 2 puntos
- **8º Puesto**: 1 punto
- **9º y 10º Puesto**: 0 puntos
- **⏱️ Vuelta Rápida Oficial**: **+1 punto extra** al piloto con el mejor tiempo de vuelta de la carrera.
- **Puntuación de Equipos**: Es la sumatoria matemática de los puntos que logren ambos pilotos de la escudería en cada fecha.

---

## 🔐 Acceso de Administrador (Panel de Control)

Para acceder al centro de control y cargar carreras o modificar datos:
- **Usuario:** `admin`
- **Contraseña:** `admin`

### Funciones de Administrador:
1. **Gestión de Torneos**: Crear torneos, cambiar fechas de inicio/fin y estado.
2. **Gestión de Escuderías**: Editar nombres, colores y parejas de pilotos.
3. **Gestión de Pilotos**: Crear pilotos con **Apodo destacado** (DEMON, NAHUE, etc.), Nombre, Apellido, número de kart y escudería.
4. **Carga y Guardado de Carreras**: Guardar resultados que recalculan automáticamente los puntos individuales y de escuderías.

---

## 📷 Escáner OCR de Planillas de Tiempos (Gratuito)

- Permite sacar una foto con la cámara del celular o subir una imagen de la planilla física del kartódromo (ej: MyLaps / Kartódromo Internacional de Zárate).
- Corre localmente en el navegador mediante **Tesseract.js** (sin costo ni APIs pagas).
- Incluye un botón para probar al instante con la **Carrera 9 de Zárate** precargada.
- Detecta automáticamente posiciones, tiempos y la vuelta rápida, permitiendo revisar y validar los pilotos antes de guardar los puntos.

---

## 💾 Base de Datos SQLite & Cloudflare D1

La WebApp utiliza una **arquitectura híbrida inteligente**:
1. **Modo Local / Offline**: Funciona inmediatamente en el navegador con `LocalStorage`, precargada con todos los datos de la Copa Pistón a la Fecha 8.
2. **Modo Cloudflare D1 (Producción)**: Al desplegarse en Cloudflare Pages, se conecta automáticamente a la base de datos relacional SQLite D1 mediante las funciones en `functions/api/*`.
3. **Archivo de Base de Datos Local**: Ya se encuentra generado `karthas.db` en la carpeta raíz del proyecto, listo para consultas SQL o importación directa.

---

## 🚀 Cómo Probar en Local

Podés abrir `index.html` directamente en tu navegador, o iniciar un servidor web local con Python:

```bash
cd /Users/hernanabelsolis/.gemini/antigravity/scratch/kart-hs
python3 -m http.server 8080
```
Y abrir en tu navegador: `http://localhost:8080`

---

## 📤 Subir a tu Repositorio en GitHub

Para subir el proyecto a tu cuenta de GitHub (`https://github.com/hernan-solis/kart-hs.git`):
1. Hacé doble clic en el archivo ejecutable:
   `subir_a_github.command`
2. O ejecutalo desde la terminal:
   ```bash
   ./subir_a_github.command
   ```
