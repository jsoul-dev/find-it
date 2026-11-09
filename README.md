# FindIt: Campus Lost and Found Mobile Application

FindIt is a cross-platform mobile application developed for the IT-WS07 Final Case Study at Nueva Ecija University of Science and Technology (NEUST), College of Information and Communications Technology (CICT). 

The application provides a centralized, real-time registry for reporting and discovering lost and found belongings on campus, integrating native device capabilities (GPS Geolocation, Camera capture, and Haptic feedback) with interactive maps and a cloud-hosted REST API.

---

## 1. Technology Stack

- **Frontend Framework:** Ionic Framework 9 with Angular (Standalone Architecture)
- **Native Runtime:** Capacitor 8
- **Hardware & Device Plugins:**
  - `@capacitor/geolocation` (Device GPS coordinates)
  - `@capacitor/camera` (Photo capture and gallery selection)
  - `@capacitor/haptics` (Physical vibration notifications)
- **Mapping Engine:** Leaflet 1.9 with OpenStreetMap tile layer
- **Data Communication:** Angular `HttpClient` (`provideHttpClient()`)
- **Backend API:** Hosted HTTPS REST API via MockAPI.io
- **Local Persistence:** Browser `localStorage` for local-first image caching

---

## 2. Key Features

- **Campus Overview Map:** Interactive Leaflet map on the Home screen displaying the campus vicinity (`15.65588, 121.039818`).
- **Real-Time Feed with Segmented Filtering:** Browse all reports or filter reactively between All, Lost, Found, and Claimed items using Angular `computed()` signals.
- **Visual Evidence (Camera Integration):** Attach item photos directly from the camera or photo library. Photos are cached locally on the device and synchronized as compressed thumbnails to the cloud API.
- **Geographic Pinning (Geolocation):** Pin exact locations where items were lost or found using the "Locate Me" button or by tapping directly on the map.
- **Item Details and Resolution:** View item details, contact details, attached photos, and an interactive pin. Campus guards and owners can mark open items as "Claimed" via HTTP PUT.
- **Purposeful Haptic Feedback:** Tactile confirmation on successful submissions, input validation warnings for empty fields, and error notifications on network or hardware failures.

---

## 3. Data Model & REST Endpoints

### Data Model (`src/app/models/item.ts`)

```typescript
export interface Item {
  id: string;
  type: 'Lost' | 'Found';
  name: string;
  description: string;
  contact: string;
  lat: number;
  lng: number;
  status: 'Open' | 'Claimed';
  createdAt?: string;
  photo?: string;
}
```

### Hosted REST Endpoints

Base URL: `https://6af134ed11a6aa866e800324.mockapi.io/api/v1/items`

| Method | Endpoint | Description | Request Payload | Response |
|---|---|---|---|---|
| GET | `/items` | List all reported items | None | Array of `Item` objects |
| POST | `/items` | Create a new report | `{ type, name, description, contact, lat, lng, status, photo }` | Created `Item` object with `id` |
| PUT | `/items/:id` | Update report status | Full `Item` payload with `status: 'Claimed'` | Updated `Item` object |
| DELETE | `/items/:id` | Remove an item report | None | Deleted `Item` object |

---

## 4. Getting Started

### Prerequisites

- Node.js: version 18.x or later (Node 20+ recommended)
- npm: version 9.x or later
- Ionic CLI: version 7.x or later (`npm install -g @ionic/cli`)
- Android Studio: Ladybug / Hedgehog or newer (for building the Android APK)

### Installation

1. Clone or extract the project repository.
2. Navigate to the project directory:
   ```bash
   cd find-it
   ```
3. Install dependencies:
   ```bash
   npm install
   ```

### Running the App in the Browser

To start the local development server:
```bash
ionic serve
```
The browser will automatically open to `http://localhost:8100`.

---

## 5. Android APK Build Instructions

The native Android project is generated and pre-configured with required permissions in `android/app/src/main/AndroidManifest.xml`:
- `android.permission.INTERNET`
- `android.permission.ACCESS_FINE_LOCATION`
- `android.permission.ACCESS_COARSE_LOCATION`
- `android.permission.CAMERA`
- `android.permission.READ_EXTERNAL_STORAGE`
- `android.permission.READ_MEDIA_IMAGES`

### Building the Debug APK

1. Compile the Angular web assets and sync to the native platform:
   ```bash
   ionic build
   npx cap sync android
   ```
2. Open the native Android project in Android Studio:
   ```bash
   npx cap open android
   ```
   Alternatively, open Android Studio manually and select the `find-it/android` folder.
3. Wait for Gradle to finish indexing and synchronizing dependencies.
4. From the top menu, select:
   **Build > Build Bundle(s) / APK(s) > Build APK(s)**
5. Once the build completes, locate the output APK at:
   `android/app/build/outputs/apk/debug/app-debug.apk`

### Installing on a Physical Device

1. Transfer `app-debug.apk` to an Android phone via USB, Google Drive, or local file sharing.
2. Enable "Install unknown apps" for your file browser.
3. Open the APK file to install. If Google Play Protect displays an "Unrecognized app" warning, tap "More details" followed by "Install anyway".
4. When prompted, grant Location and Camera permissions to allow GPS map pinning and photo attachments.

---

## 6. Directory Structure

```
find-it/
├── android/                         Native Android Studio project
│   └── app/src/main/
│       └── AndroidManifest.xml      Native Android hardware permissions
├── src/
│   ├── app/
│   │   ├── components/
│   │   │   └── item-card/           Reusable standalone card component (input / output)
│   │   ├── home/                    Home page (map overview, filter segment, item list)
│   │   ├── item-detail/             Item Detail page (photo, metadata, pin map, claim action)
│   │   ├── post-item/               Post Item page (form, camera capture, GPS map pin)
│   │   ├── models/                  TypeScript interfaces (Item, NewItem)
│   │   ├── services/                ItemService (HttpClient calls, signals, local cache)
│   │   ├── app.component.ts         Root standalone component
│   │   └── app.routes.ts            Angular route declarations
│   ├── environments/                Environment configuration with API endpoint URL
│   ├── global.scss                  Global stylesheet (Leaflet CSS, theme overrides)
│   └── main.ts                      Application bootstrap (provideHttpClient, PWA elements)
├── capacitor.config.ts              Capacitor runtime configuration
├── ionic.config.json                Ionic project configuration
├── package.json                     Dependencies and build scripts
└── tsconfig.json                    TypeScript compiler configuration
```

---

## 7. Course Information and Academic Context

- **Course:** IT-WS07 Mobile Application Technology
- **Institution:** Nueva Ecija University of Science and Technology (NEUST)
- **College:** College of Information and Communications Technology (CICT)
- **Term:** 2026 Academic Term
- **Deliverables Covered:** Working Prototype, Mobile Capabilities (Geolocation, Camera, Haptics), Cloud REST API Data Operations, Usability Evaluation, and Installable Android APK.
