#!/bin/bash
SOURCE="mobile/logo_source.png"
RES_DIR="mobile/android/app/src/main/res"

# Arrays of folders and sizes (standard Android sizes)
# mdpi: 48
# hdpi: 72
# xhdpi: 96
# xxhdpi: 144
# xxxhdpi: 192

# Generate mdpi
sips -z 48 48 "$SOURCE" --out "$RES_DIR/mipmap-mdpi/ic_launcher.png"
cp "$RES_DIR/mipmap-mdpi/ic_launcher.png" "$RES_DIR/mipmap-mdpi/ic_launcher_round.png"

# Generate hdpi
sips -z 72 72 "$SOURCE" --out "$RES_DIR/mipmap-hdpi/ic_launcher.png"
cp "$RES_DIR/mipmap-hdpi/ic_launcher.png" "$RES_DIR/mipmap-hdpi/ic_launcher_round.png"

# Generate xhdpi
sips -z 96 96 "$SOURCE" --out "$RES_DIR/mipmap-xhdpi/ic_launcher.png"
cp "$RES_DIR/mipmap-xhdpi/ic_launcher.png" "$RES_DIR/mipmap-xhdpi/ic_launcher_round.png"

# Generate xxhdpi
sips -z 144 144 "$SOURCE" --out "$RES_DIR/mipmap-xxhdpi/ic_launcher.png"
cp "$RES_DIR/mipmap-xxhdpi/ic_launcher.png" "$RES_DIR/mipmap-xxhdpi/ic_launcher_round.png"

# Generate xxxhdpi
sips -z 192 192 "$SOURCE" --out "$RES_DIR/mipmap-xxxhdpi/ic_launcher.png"
cp "$RES_DIR/mipmap-xxxhdpi/ic_launcher.png" "$RES_DIR/mipmap-xxxhdpi/ic_launcher_round.png"
