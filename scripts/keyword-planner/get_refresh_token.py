#!/usr/bin/env python3
"""Genera un refresh_token con scope `adwords`, reusando el cliente OAuth de GSC.

Correr UNA sola vez. Abre el navegador para que Juan de consentimiento con su
cuenta de Google (la misma del Google Ads). Al final imprime el refresh_token:
pegalo en google-ads.yaml (campo refresh_token).

Uso:
    cd scripts/keyword-planner
    python3 get_refresh_token.py
"""
import re
from pathlib import Path

from google_auth_oauthlib.flow import InstalledAppFlow

BASE = Path(__file__).resolve().parent
# Reusa el cliente OAuth ya creado para GSC (no hace falta crear otro).
CLIENT_SECRET = BASE.parent / "gsc" / "client_secret.json"
YAML = BASE / "google-ads.yaml"
SCOPES = ["https://www.googleapis.com/auth/adwords"]


def main() -> None:
    if not CLIENT_SECRET.exists():
        raise SystemExit(f"No encuentro {CLIENT_SECRET}. Es el cliente OAuth de GSC.")
    flow = InstalledAppFlow.from_client_secrets_file(str(CLIENT_SECRET), SCOPES)
    # access_type=offline + prompt=consent asegura que devuelva refresh_token.
    creds = flow.run_local_server(port=0, access_type="offline", prompt="consent")

    if not creds.refresh_token:
        raise SystemExit(
            "Google no devolvió refresh_token. Reintentá (el prompt=consent debería forzarlo)."
        )

    # Escribe el refresh_token directo en google-ads.yaml (sin copiar/pegar).
    if YAML.exists():
        text = YAML.read_text()
        text = re.sub(
            r'refresh_token:.*',
            f'refresh_token: "{creds.refresh_token}"',
            text,
            count=1,
        )
        YAML.write_text(text)
        print("\n" + "=" * 60)
        print("refresh_token escrito en google-ads.yaml ✓  Ya está todo listo.")
        print("=" * 60)
    else:
        print("\n" + "=" * 60)
        print("REFRESH TOKEN (pegalo en google-ads.yaml -> refresh_token):")
        print("=" * 60)
        print(creds.refresh_token)
        print("=" * 60)


if __name__ == "__main__":
    main()
