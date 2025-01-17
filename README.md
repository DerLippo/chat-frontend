# Chat-Anwendung (Frontend)

Dies ist das Frontend der Chat-Anwendung, das mit React entwickelt wurde und die Benutzeroberfläche für Echtzeit-Kommunikation bereitstellt.

## Aktuelle Version

**Version:** `1.3.2`

---

## Changelog

### **1.3.2**

- **Link entfernt**
  - Ein unnötiger Link wurde aus dem Code entfernt, der nicht hätte vorhanden sein dürfen.

### 1.3.1

- **Code Refactoring**
  - Der Code wurde umfassend überarbeitet, um die Lesbarkeit und Wartbarkeit zu verbessern.
  - Komponenten wurden besser aufgeteilt und klar voneinander getrennt.

### 1.3.0

- **Title**
  - Der WebTitle ändert sich jetzt dynamisch, abhängig davon was aktuell der Stand ist (ausgeloggt, eingeloggt, neue Nachricht)
- **Nachricht senden**
  - Ein Fehler wurde gefixed bei dem die Nachricht mittels senden Button nicht abgeschickt wurde

### 1.2.0

- **Textarea**:
  - Das Senden einer Nachricht ist jetzt mit Enter möglich.
    - Textarea-Komponente mit `onKeyDown` + `onKeyUp` hinzugefügt.
    - Bei gedrückter Shift-Taste + Enter wird ein Zeilenumbruch erstellt.
    - Bei Taste Enter wird die Nachricht abgesendet.

### 1.1.1

- **Textarea-Optimierung**:
  - `outline: none;` wurde korrekt für `&:hover` und den Normalzustand hinzugefügt. Zuvor war es nur für `&:focus` definiert.
- **Schriftgröße im Chat angepasst**:
  - Die Schriftgröße wurde für eine bessere Lesbarkeit optimiert.

### 1.1.0

- **Title-Update**:
  - Der Titel der Webseite wurde von **React App** auf einen passenderen Namen geändert.
- **Bugfix - Registrierung**:
  - Verbesserte Fehlerbehandlung und Anzeige spezifischer Fehlermeldungen, z. B. wenn der Benutzername oder die E-Mail bereits verwendet wird.
- **Styling-Optimierungen**:
  - Der Stil der Login- und Registrierungs-Buttons wurde überarbeitet.
  - Schriftgröße im Chat angepasst.
  - Textarea kann jetzt nur noch vertikal (y-Achse) in der Größe verändert werden.
- **Feature-Anpassungen**:
  - Emoji-Button im Chat ausgeblendet, da er derzeit noch nicht funktionsfähig ist.
  - Settings-Button im Chat ausgeblendet.
- **Code-Optimierungen**:
  - Unnötige `console.log`-Ausgaben entfernt bzw. angepasst.
  - `reconnectionDelay` für die Socket-Verbindung angepasst, um Verbindungsabbrüche besser zu handhaben.
  - Intervall für den Refresh des Tokens optimiert.
- **Favicon aktualisiert**:
  - Ein passenderes Favicon wurde hinzugefügt.

### 1.0.1

- Visuelle Optimierung: Passwort-Wiederherstellungslink ausgeblendet, da die Funktion noch nicht verfügbar ist.

### 1.0.0

- **Initialer Release mit den grundlegenden Funktionen**:
  - Registrierung und Login
  - Echtzeit-Chat
  - Raum-Management

---

## Funktionen

- **Benutzerregistrierung und -anmeldung**: Erstelle ein Konto und melde dich an.
- **Raum-Management**: Räume erstellen, betreten und verlassen.
- **Echtzeit-Chat**: Senden und Empfangen von Nachrichten.
- **Online-Status**: Zeigt den Online-Status von Mitgliedern an.
- **Automatisches Scrollen**: Scrollt automatisch zu neuen Nachrichten.

---

## Installation und Setup

### Voraussetzungen

- **Node.js**: Version 16.x oder höher.
- **NPM**: Version 7.x oder höher.

### Schritte

1. **Repository klonen**:

   ```bash
   git clone https://github.com/derlippo/chat-frontend.git
   cd chat-frontend
   ```

2. **Abhängigkeiten installieren**:

   ```bash
   npm install
   ```

3. **Entwicklungsserver starten**:

   ```bash
   npm start
   ```

4. **Build für Produktion erstellen**:
   ```bash
   npm run build
   ```

### Verwendete Technologien

- **React**: Entwicklung der Benutzeroberfläche und modularer Komponenten.
- **React Router**: Navigation und Routing zwischen verschiedenen Seiten.
- **Socket.IO Client**: Echtzeit-Kommunikation mit dem Backend.
- **SCSS (Sass)**: Modularisierung und Erweiterung von CSS für Styles.
- **JavaScript (ES6+)**: Programmiersprache für die Implementierung der Logik.
- **HTML5**: Struktur und Inhalte der Anwendung.
- **Fetch API**: Für asynchrone HTTP-Anfragen an das Backend.
- **JS-Cookie**: Verwaltung und Zugriff auf Cookies.
- **Environment Variables (.env)**: Konfiguration von Umgebungsparametern.
- **NPM**: Paketmanager zur Verwaltung der Abhängigkeiten.
- **React Scripts**: Entwicklungs- und Build-Tools, die mit Create React App bereitgestellt werden.
- **Webpack** (indirekt durch React Scripts): Bundling und Optimierung der Anwendung.

### Umgebungsvariablen

Erstelle eine `.env`-Datei im Stammverzeichnis und füge die folgenden Variablen hinzu:

```env
# API-URL für die Produktionsumgebung
REACT_APP_API_URL=<PRODUKTIONS-URL HIER EINTRAGEN>

# API-URL für die Entwicklungsumgebung
REACT_APP_API_URL_DEV=http://localhost:3001
```

---

## Lizenz

Dieses Projekt ist unter der [MIT-Lizenz](LICENSE) lizenziert. Details findest du in der Datei `LICENSE` im Repository.
