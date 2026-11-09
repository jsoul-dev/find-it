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

- **Campus Overview & Metrics Dashboard:** Interactive dashboard summarizing live counts (Total, Lost, Found, Claimed) with tactile category shortcuts and a collapsible NEUST Sumacab campus map (`15.44825, 120.93922`).
- **Real-Time Search & Segmented Filtering:** Debounced keyword searchbar (`ion-searchbar`) with instant filtering across names, descriptions, and places, paired with segment buttons.
- **Visual Verification & Cloud CDN Hosting:** Capture photos via Capacitor Camera (`@capacitor/camera`) and automatically upload them to ImgBB CDN for direct HTTPS image URLs, backed by local device storage cache.
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

Base URL: `https://<YOUR_PROJECT_ID>.mockapi.io/api/v1/items`

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

### Environment & API Configuration

To run the application locally or compile the project from source, set up your local environment file:

1. Copy the example environment template:
   ```bash
   cp src/environments/environment.example.ts src/environments/environment.ts
   cp src/environments/environment.example.ts src/environments/environment.prod.ts
   ```

2. Configure the following APIs in `src/environments/environment.ts`:
   - **MockAPI.io REST API (`apiUrl`):** Required for saving and querying lost and found reports. You can create a free resource at [mockapi.io](https://mockapi.io/) with fields: `id`, `name`, `type`, `description`, `contact`, `lat`, `lng`, `status`, `photo`, `createdAt`.
   - **ImgBB API Key (`imgbbApiKey`):** Free API key from [api.imgbb.com](https://api.imgbb.com/) used to host attached item photos on a CDN and save direct HTTPS links in MockAPI. *(Note: If left blank or if offline, FindIt gracefully falls back to local device storage).*
   - **ImgBB Upload URL (`imgbbUrl`):** Set to `https://api.imgbb.com/1/upload`.

Example `src/environments/environment.ts`:
```typescript
export const environment = {
  production: false,
  apiUrl: 'https://<YOUR_PROJECT_ID>.mockapi.io/api/v1/items',
  imgbbApiKey: 'YOUR_IMGBB_API_KEY',
  imgbbUrl: 'https://api.imgbb.com/1/upload',
};
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
