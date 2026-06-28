# Lector de Google Search Console

Baja tus datos de GSC con Python, los guarda en una base local (historico que GSC borra a los 16 meses) y te tira reportes de oportunidades.

## Que hace cada comando

| Comando | Para que sirve |
|---|---|
| `setup-check` | Verifica que la conexion funciona y lista tus propiedades. **Corre esto primero.** |
| `fetch` | Baja queries, paginas, fechas y paises. Guarda un "snapshot" y CSVs. Correlo cada semana. |
| `audit` | Oportunidades: paginas pos 4-20 (cerca del top), keywords con CTR flojo, canibalizacion. |
| `report` | Rinde por seccion (fichas / guias / categorias) y top/peores URLs. |
| `alerts` | Compara con la corrida anterior y avisa caidas/subidas fuertes. Necesita 2 `fetch`. |
| `history` | Lista los snapshots guardados. |

---

## Setup (una sola vez)

> **Por que OAuth y no service account:** Google ahora bloquea por defecto la creacion
> de claves de service account (`iam.disableServiceAccountKeyCreation`, heredada y no
> editable desde una cuenta normal). OAuth no usa esa clave: entras con tu propio Google.
> El codigo igual soporta service account por si en el futuro se libera; si guardas
> `service-account.json` lo usa, si no, usa OAuth.

### A. Crear el cliente OAuth

1. Entra a **https://console.cloud.google.com/** con la cuenta de Google que tiene acceso a Search Console.
2. Seleccioná tu proyecto arriba (el `productosvirales` que ya creaste sirve).
3. **Habilita la API.** Buscá arriba "Google Search Console API" → entrá → **Habilitar / Enable**.
4. **Pantalla de consentimiento.** Menu ☰ → **APIs y servicios → Pantalla de consentimiento de OAuth** (o "Google Auth Platform"):
   - Tipo de usuario: **Externo** → Crear.
   - Completá lo obligatorio (nombre de la app: "GSC reader"; tu email de soporte; tu email de contacto). Guardá.
   - **Publico / Publicacion:** poné la app en estado **"En produccion"** (boton "Publicar app"). Asi el login no caduca a los 7 dias. Ignorá el aviso de "app no verificada": es para tu propio uso.
   - *Alternativa si "Publicar" te complica:* dejala en **"Prueba / Testing"** y agregate como **usuario de prueba** (tu propio email). Funciona igual; la unica contra es que tenes que volver a loguear cada ~7 dias.
5. **Crear credencial.** Menu ☰ → **APIs y servicios → Credenciales → Crear credenciales → ID de cliente de OAuth**:
   - Tipo de aplicacion: **Aplicacion de escritorio**. Nombre: el que quieras. **Crear**.
   - En el popup, **Descargar JSON**. Guardá ese archivo en esta carpeta como **`client_secret.json`**:
     `scripts/gsc/client_secret.json`

### B. (Solo service account) Permiso en Search Console
Si algun dia usas service account en vez de OAuth, ahi si tenes que copiar su `client_email`
y agregarlo como usuario en Search Console. **Con OAuth no hace falta** porque ya entras con tu cuenta.

### C. Instalar las librerias

```bash
cd "/Users/juan/Proyectos web/productosvirales"
python3 -m venv scripts/gsc/.venv
source scripts/gsc/.venv/bin/activate
pip install -r scripts/gsc/requirements.txt
```

---

## Usar

Siempre activá el venv primero (`source scripts/gsc/.venv/bin/activate`), despues:

```bash
python scripts/gsc/gsc.py setup-check     # verifica todo y lista propiedades
python scripts/gsc/gsc.py fetch           # baja los ultimos 28 dias
python scripts/gsc/gsc.py audit           # oportunidades
python scripts/gsc/gsc.py report          # rinde por seccion
python scripts/gsc/gsc.py report --section guias
python scripts/gsc/gsc.py alerts          # cambios vs la corrida anterior
```

**La primera vez** que corras `setup-check` (o `fetch`) con OAuth, se abre el navegador
para que inicies sesion con Google y autorices. Si aparece "Google no verifico esta app",
clic en **"Avanzado" → "Ir a GSC reader (no seguro)"** (es tu propia app) → **Permitir**.
Queda guardado en `token.json` y no te lo vuelve a pedir.

`setup-check` te dice exactamente que falta si algo no esta (credenciales, API sin habilitar, o falta el permiso en GSC).

### Propiedad de dominio vs URL
En `config.py`, `SITE_URL` viene como `sc-domain:productosvirales.com.ar`.
Si tu propiedad en GSC es la de prefijo de URL, `setup-check` te lo va a mostrar y
solo cambiás esa linea por `https://productosvirales.com.ar/`.

## Que NO se commitea
`client_secret.json`, `token.json`, `service-account.json`, `data/` y `exports/` estan en `.gitignore`.
Son credenciales: no las subas a git ni las compartas.
