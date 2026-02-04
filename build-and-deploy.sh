#!/bin/bash

echo "🚀 Starting Android Build & Deploy Process..."

# 1. Navigate to Android Project
cd mobile/android || exit

# 2. Build the APK
echo "📦 Building APK (this may take a few minutes)..."
./gradlew assembleRelease

if [ $? -ne 0 ]; then
    echo "❌ Build Failed! Please check the errors above."
    exit 1
fi

# 3. Move APK to Web Public Folder
echo "✅ Build Success! Moving APK to Web..."
cp app/build/outputs/apk/release/app-release.apk ../../web/public/android-app.apk

# 4. Commit and Push
echo "⬆️ Uploading to Git (Deployment)..."
cd ../..
git add web/public/android-app.apk
git commit -m "Feat: Update Android APK Binary"
git push origin main

echo "🎉 Done! Your new APK is deploying to the website."
