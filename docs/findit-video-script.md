# FindIt: Video Presentation Script (8–12 Minutes)
**Course:** IT-WS07 Mobile Application Technology  
**Program:** College of Information and Communications Technology (CICT), NEUST  
**Format:** 4 Group Members / Speakers  
**Total Target Duration:** 9–11 minutes  

---

## Presentation Structure Overview

| Segment | Speaker | Topic | Target Time |
|---|---|---|---|
| **Part 1** | Speaker 1 | Problem Statement, Users & Solution Overview | 0:00 – 1:45 (1m 45s) |
| **Part 2** | Speaker 2 | Live Application Walkthrough & Feature Demo | 1:45 – 5:15 (3m 30s) |
| **Part 3** | Speaker 3 | Technical Architecture & Code Snippet Deep-Dive | 5:15 – 8:00 (2m 45s) |
| **Part 4** | Speaker 4 | Testing Results, Limitations, Future Roadmap & AI Disclosure | 8:00 – 10:15 (2m 15s) |

---

## Part 1: Introduction, Problem Statement & Solution (Speaker 1)
**Target Duration:** ~1 minute 45 seconds  
**Visual on screen:** Title slide with group members and course info, followed by problem illustration slide.

> **[SPEAKER 1]:**  
> "Good day, Sir Gel and everyone. We are Group `[Group Number]`, and today we are presenting **FindIt**, a campus Lost and Found mobile application engineered for our IT-WS07 Mobile Application Technology final case study here at NEUST College of Information and Communications Technology.
>
> On any university campus, personal belongings like student IDs, calculators, tumblers, and lab materials are lost and found every single day. Traditionally, students rely on word of mouth, campus bulletin boards, or random posts in student Facebook groups. 
>
> This current setup has three major flaws:
> 1. **No Geographic Context:** A post saying 'found near the library' is too vague—students have no exact location or map reference.
> 2. **No Visual Verification:** Text descriptions alone lead to false claims or confusion, especially for identical items like black umbrellas or calculators.
> 3. **No Resolution Tracking:** Once an item is found or claimed, there is no centralized way to update its status, so students continue looking for items that have already been resolved.
>
> To solve this, our team developed **FindIt**. FindIt is a cross-platform mobile application built using the **Ionic Framework 9**, **Angular Standalone**, and **Capacitor 8**. It integrates three native mobile hardware capabilities—**GPS Geolocation**, **Camera capture**, and **Haptic feedback**—paired with interactive **Leaflet maps** and a cloud-hosted **REST API**.
>
> Now, I will pass the floor to `[Speaker 2 Name]` to walk you through the live application."

---

## Part 2: Live Application Walkthrough & Demo (Speaker 2)
**Target Duration:** ~3 minutes 30 seconds  
**Visual on screen:** Screen recording or live screen mirroring of the FindIt app running on an Android physical device / emulator.

> **[SPEAKER 2]:**  
> "Thank you, `[Speaker 1 Name]`. Here is FindIt running on our device.
>
> ### 1. Home Screen & Campus Map
> When we launch the app, the first thing you see is the **Home Screen**. 
> - At the top, we have an interactive **Leaflet OpenStreetMap** centered directly on the NEUST campus coordinates. 
> - Right below the toolbar is our **Filter Segment**. By default, it displays **All** reported items. With a single tap, we can filter reactively to show only **Lost** items, only **Found** items, or already **Claimed** items. Notice how the list updates instantly using Angular signals without any page reload.
> - Each item card displays the item photo thumbnail, category badge, report title, description, and contact information.
>
> ### 2. Reporting an Item (Post Item Flow)
> Now, let us simulate finding a lost item on campus by tapping the floating action button (**+**) at the bottom right.
> - This brings us to the **Report Lost or Found** screen. 
> - We select our category—let's choose **Found**.
> - For the name, we enter *'Graphing Calculator'*, and describe it: *'Texas Instruments calculator found on a bench outside the CICT building'*.
> - For contact, we enter *'Guard House Post 2'*.
>
> ### 3. Camera Integration
> Next, to provide visual verification, we tap **Take or Choose Photo**.
> - This triggers the native **Capacitor Camera** plugin. We take a picture of the calculator, and it instantly renders directly on the screen as a preview. If we made a mistake, we can tap 'Remove Photo' and snap a new one.
>
> ### 4. Geolocation & Interactive Map Pinning
> For the location, we tap **Locate Me via GPS**.
> - Capacitor Geolocation queries the device hardware, recenters our Leaflet map to our exact coordinates, and places a precise pin. If we want to adjust the location manually, we can simply tap anywhere on the map to reposition the pin.
>
> ### 5. Submission & Haptic Feedback
> Now, we tap **Submit Report**.
> - The app fires a physical **Success Haptic vibration**, sends an HTTP POST request to our cloud REST API, and returns us to the Home screen.
> - As you can see, our new item immediately appears at the top of the feed with its photo and coordinates intact!
>
> ### 6. Item Details & Claiming
> Finally, tapping on the item card opens the **Item Detail** screen. 
> - Here, users can view the full-resolution photograph, complete contact details, and a dedicated Leaflet map zoomed in on the item's location.
> - When the rightful owner retrieves the calculator from the guard post, the guard taps **Mark as Claimed**. An HTTP PUT request updates the record in the cloud, changing the status badge to 'Claimed' and disabling further claim actions.
>
> Now, `[Speaker 3 Name]` will dive into our technical architecture and core code implementation."

---

## Part 3: Technical Implementation & Code Deep-Dive (Speaker 3)
**Target Duration:** ~2 minutes 45 seconds  
**Visual on screen:** Architecture diagram followed by IDE / code snippet slides highlighting `locateMe()`, `ItemService`, and `getPhoto()`.

> **[SPEAKER 3]:**  
> "Thank you, `[Speaker 2 Name]`. Let us look under the hood at how FindIt was built.
>
> Our stack follows modern industry standards:
> - **Ionic 9 with Angular Standalone:** We avoided legacy NgModules completely. We use standalone components, signals for reactive state, and the new Angular `@for` and `@if` template control flow.
> - **Capacitor 8:** Bridges our native device capabilities (`@capacitor/geolocation`, `@capacitor/camera`, and `@capacitor/haptics`).
> - **Leaflet 1.9:** Provides smooth, lightweight interactive maps using OpenStreetMap tiles.
> - **MockAPI.io REST API:** Provides our persistent cloud backend via standard HTTP GET, POST, and PUT operations.
>
> Let us highlight three key code implementations:
>
> ### Snippet 1: Geolocation Pinning (`post-item.page.ts`)
> First is our `locateMe()` function. When the user taps the GPS button, we call:
> ```typescript
> const position = await Geolocation.getCurrentPosition();
> ```
> We extract the hardware latitude and longitude, center the Leaflet map with `map.setView()`, and drop a single circle marker. If GPS is disabled or denied by the user, we catch the error gracefully, display a user-friendly error banner, and trigger an **Error Haptic vibration** using Capacitor Haptics.
>
> ### Snippet 2: Reactive State with Signals & HttpClient (`item.ts`)
> Second is our `ItemService`. Rather than complex RxJS subscriptions scattered throughout components, we centralize state using Angular `signal()`:
> - We maintain `items`, `loading`, and `error` signals.
> - In `fetchItems()`, we issue an `http.get<Item[]>()`. When the response arrives, `items.set(data)` automatically notifies all computed signals, updating the Home screen cards and filter counts with zero boilerplate.
>
> ### Snippet 3: Hybrid Local-First Photo Persistence
> Third is our photo storage architecture. Cloud mock endpoints often reject large base64 camera payloads. To solve this, we implemented a **hybrid local-first architecture**:
> - When a photo is captured, we compress an optimized thumbnail to sync over the REST API so all devices see the image preview.
> - Simultaneously, we save the full photo directly on the device using `localStorage` keyed by item ID. 
> - When opening the Item Detail screen, the app first checks local storage for the crisp original photo, falling back to the cloud thumbnail if accessed from another device.
>
> Now, `[Speaker 4 Name]` will cover our testing results, limitations, and AI disclosure."

---

## Part 4: Testing, Limitations, Future Work & AI Disclosure (Speaker 4)
**Target Duration:** ~2 minutes 15 seconds  
**Visual on screen:** Test execution table slide, terminal showing passing Playwright tests, and AI disclosure table.

> **[SPEAKER 4]:**  
> "Thank you, `[Speaker 3 Name]`.
>
> ### Testing & Quality Assurance
> To guarantee reliability, our team conducted comprehensive testing:
> 1. **Manual Device Testing:** We executed a 10-point test matrix covering all core workflows—including clean data loading, offline airplane-mode error handling, input validation warnings, camera capture, GPS permissions, and PUT claim updates. All 10 test cases achieved a **Pass** status.
> 2. **Automated End-to-End (E2E) Testing:** In addition to physical phone testing, we configured automated E2E tests using **Playwright**. Our test suite simulates mobile Chrome on a Pixel 7 viewport, validating the home page rendering, segment filters, Leaflet map mounting, and report form fields. All 3 automated test suites execute and pass in under 10 seconds.
>
> ### Limitations & Future Improvements (CO4)
> We also evaluated realistic limitations and planned future enhancements:
> - Importantly, while *Photo Attachment* was originally suggested in the course syllabus as a future improvement, our team proactively implemented native Camera capture directly into this working prototype!
> - For future production releases, we propose:
>   1. Adding a **Confirmation Alert Dialog** before resolving items to prevent accidental taps.
>   2. Adding **Push Notifications** via Capacitor Push to alert students when a matching item is posted.
>   3. Upgrading our local photo cache to **Dedicated Cloud Object Storage** (Firebase/S3) for full-resolution photos.
>   4. Implementing **Offline Map Tile Caching** for connectivity-free browsing.
>   5. Securing the backend with **Student Google SSO Authentication** restricted to `@neust.edu.ph` accounts.
>
> ### AI Usage Disclosure
> In compliance with university guidelines, we transparently disclose our AI usage:
> - We consulted AI tools (Claude and Gemini) for initial milestone planning, architectural structuring, and Ionic/Leaflet starter syntax.
> - All architectural decisions—including our local-first photo persistence model, hardware permission configuration, Android Studio APK builds, testing, and documentation—were authored, executed, and verified by our group members.
>
> ### Conclusion & APK Delivery
> Our complete source code is publicly accessible on GitHub at `github.com/jsoul-dev/find-it`, and our installable release APK is packaged and ready in our shared Google Drive folder for Sir Gel's evaluation.
>
> Thank you very much for listening, and we are ready for any questions!"

---

## Recording Tips for the Team

1. **Camera & Audio:** Record in a quiet room with good lighting. Use a headset or external mic if possible.
2. **Screen Recording:** Record the Android device screen using Android Studio's built-in Screen Recorder, or run `ionic serve` in Chrome with Device Mode enabled (Pixel 7).
3. **Pacing:** Speak clearly and keep transitions between speakers smooth (e.g., *"I will now hand it over to..."*).
4. **Time Check:** Practice once with a stopwatch. The total target is between 8 and 12 minutes (9 to 10 minutes is the sweet spot).
