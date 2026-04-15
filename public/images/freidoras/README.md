# Imágenes de Freidoras de Aire

Copiá las fotos de los productos acá con estos nombres exactos (formato WebP, 800×800px):

| Nombre de archivo | Producto | MLA ID |
|---|---|---|
| `atma-fr248abp-8l.webp` | Atma FR248ABP 8L | MLA39861162 |
| `atma-pro-fr60ar-6-5l.webp` | Atma Pro FR60AR 6.5L | MLA27351841 |
| `atma-fr901dp-grill.webp` | Atma FR901DP Grill 6.3L | MLA37004216 |
| `atma-pro-doble-frd248ap.webp` | Atma Pro Doble FRD248AP 8.5L | MLA40161710 |
| `peabody-pe-afd650n.webp` | Peabody PE-AFD650N 6.5L | MLA44703897 |
| `peabody-pe-afd720n-visor.webp` | Peabody PE-AFD720N Visor 360° 7.2L | MLA41829394 |
| `peabody-pe-afdl102n-10l.webp` | Peabody PE-AFDL102N Doble Piso 10L | MLA53776810 |
| `peabody-pe-afg01ix-grill.webp` | Peabody PE-AFG01IX Grill Inox 6L | MLA23318618 |
| `philips-na12000-4-2l.webp` | Philips NA12000 4.2L | MLA61393261 |
| `philips-phna35100-doble.webp` | Philips PHNA35100 Doble Canasta 9L | MLA55779230 |
| `philips-phna23100-13en1.webp` | Philips PHNA23100 13-en-1 6.2L | MLA53675940 |
| `philips-hd9280-xl.webp` | Philips HD9280 Essential XL | MLA19630913 |
| `philips-hd9270-6-2l.webp` | Philips HD9270 Essential 6.2L | MLA19630911 |
| `oster-dual-7-6l-diamondforce.webp` | Oster Dual DiamondForce 7.6L | MLA28709303 |
| `oster-digital-ventana-4l.webp` | Oster Digital con Ventana 4L | MLA41041543 |
| `ninja-crispi-5-2l.webp` | Ninja Crispi 5.2L | MLA62320294 |
| `powerxl-af-e4001-ar-3-8l.webp` | PowerXL AF-E4001-AR 3.8L | MLA36974228 |
| `kanji-home-kjh-1700dc-8l.webp` | Kanji Home KJH-1700DC 8L | MLA42113760 |
| `gadnic-airfryer-6-5l.webp` | Gadnic Airfryer 6.5L | MLA44142280 |
| `suono-airfryer-digital-10l.webp` | Suono Airfryer Digital 10L | MLA54106293 |

## Cómo convertir a WebP desde la terminal

```bash
# Instalar cwebp si no lo tenés
apt install webp  # Linux
brew install webp  # Mac

# Convertir una imagen
cwebp -q 85 foto-original.jpg -o atma-fr248abp-8l.webp

# Redimensionar a 800x800 y convertir (con ImageMagick)
convert foto-original.jpg -resize 800x800^ -gravity center -extent 800x800 atma-fr248abp-8l.webp
```

## OG/Featured images (1200×630px)

Para las featured images de los artículos, usá la imagen del producto principal
de cada review redimensionada a 1200×630px con el logo del sitio superpuesto.
