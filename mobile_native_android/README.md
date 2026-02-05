# Open ERP Android App

Native Android application built with Kotlin and Jetpack Compose.

## Requirements
- Android Studio Hedgehog | 2023.1.1 or newer
- JDK 17
- Android SDK 34
- Minimum Android version: 7.0 (API 24)

## Tech Stack
- **Language**: Kotlin
- **UI**: Jetpack Compose + Material Design 3
- **Architecture**: MVVM (Clean Architecture)
- **DI**: Hilt
- **Networking**: Retrofit + OkHttp
- **Database**: Room
- **Images**: Coil

## Project Structure
```
app/
├── data/              # Data layer (API, Database, Repository)
├── domain/            # Business logic (Models, UseCases)
├── presentation/      # UI layer (Screens, ViewModels)
│   ├── auth/         # Login screens
│   ├── dashboard/    # Dashboard
│   ├── theme/        # Material theme
│   └── navigation/   # Navigation setup
└── di/               # Dependency Injection modules
```

## Setup Instructions

1. **Open in Android Studio**:
   ```bash
   # From Android Studio: File > Open > Select mobile_native_android folder
   ```

2. **Sync Project**:
   - Click "Sync Project with Gradle Files" in toolbar
   - Wait for dependencies to download

3. **Run**:
   - Connect Android device or start emulator
   - Click "Run" button (green play icon)

## Features
✅ Material Design 3 UI  
✅ Login screen  
✅ Dashboard with statistics  
✅ Bottom navigation  
✅ Smooth animations  

## Build APK
```bash
cd mobile_native_android
./gradlew assembleRelease
```
APK will be generated at: `app/build/outputs/apk/release/app-release.apk`

## Backend API
Backend URL: `https://open-erp.netlify.app`

To configure, update `ApiConfig.kt`:
```kotlin
const val BASE_URL = "https://your-backend-url.com/api/"
```

## Next Steps
- [ ] Implement API integration with Retrofit
- [ ] Add Room database for offline storage
- [ ] Build Products screen
- [ ] Build Sales/POS module
- [ ] Add push notifications
