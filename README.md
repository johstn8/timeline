# 🌌 Historischer Zeitstrahl

Ein interaktives Web‑Tool, das historische Ereignisse von der Entstehung des Universums bis zur Gegenwart in einem responsiven, zoombaren und filterbaren Zeitstrahl visualisiert. Nutzer können eigene Events hochladen, Administratoren moderieren Einträge und KI‑Module schlagen passende Zusatzinhalte vor.

## 🚀 Features

- **Interaktive Timeline**: Zoomen, Scrollen und Filtern nach Datum, Kategorie und Schlagworten.
- **Benutzer‑Uploads**: Authentifizierte Nutzer können eigene historische Ereignisse hinzufügen.
- **Admin‑Moderation**: Moderationsdashboard zum Freigeben, Bearbeiten oder Löschen von Einträgen.
- **KI‑Integration**: Automatische Vorschläge für Schlagworte und verwandte Events mithilfe von ChatGPT-APIs.
- **Mehrsprachigkeit**: Unterstützt Deutsch und Englisch (weiter Sprachen in Arbeit).

## 📂 Projektstruktur

Im Ordner `frontend/` befindet sich die React-Anwendung, im Ordner `backend/` die REST-API.

```
timeline/
├── .env                   # Umgebungsvariablen (lokal)
├── .env.example           # Beispiel-Umgebungsvariablen
├── .gitignore             # Git-Ausnahmen
├── README.md              # Projektbeschreibung (diese Datei)
├── backend/               # Node.js/Express REST-API
├── chatgpt_data/          # KI-Trainings- und Logdaten
├── frontend/              # React + Vite + TailwindCSS Anwendung
├── node_modules/          # Abhängigkeiten (Frontend + Backend)
├── package-lock.json      # Sperrdatei für npm-Abhängigkeiten
├── package.json           # Projektmetadaten und npm-Skripte
└── scripts/               # Hilfs- und Deploymentskripte
```

## 🛠️ Installation & Entwicklung

1. **Repository klonen**

   ```bash
   git clone https://github.com/DeinRepo/timeline.git
   cd timeline
   ```

2. **Umgebungsvariablen konfigurieren**

   - Kopiere `.env.example` nach `.env` und passe Werte an (z. B. Datenbank-URL, API-Keys).

3. **Abhängigkeiten installieren**

   ```bash
   # Backend
   cd backend && npm install

   # Frontend
   cd ../frontend && npm install
   ```

4. **Entwicklungsserver starten**

   ```bash
   # Im Hauptverzeichnis
   npm run dev
   ```

   - Frontend unter `http://localhost:3000`
   - Backend unter `http://localhost:4000`

## 📦 Produktion

1. **Build erstellen**
   ```bash
   # Frontend
   cd frontend && npm run build
   ```
2. **Umgebung setzen und starten**
   ```bash
   cd backend
   NODE_ENV=production npm start
   ```
   Die statischen Dateien aus `frontend/dist` werden automatisch ausgeliefert.

## 🤖 CI/CD (Automatisiertes Deployment)

- Vorbereitendes Skript ausführbar machen:
  ```bash
  chmod +x scripts/deploy.sh
  ```
- Deployment starten:
  ```bash
  ./scripts/deploy.sh
  ```
  Das Skript baut das Frontend, deployed den Backend-Container und aktualisiert die Cloud-Infrastruktur.

## 📝 Lizenz

Dieses Projekt steht unter der MIT-Lizenz. Siehe [LICENSE](LICENSE) für Details.

---

© 2025 Johann Stein
