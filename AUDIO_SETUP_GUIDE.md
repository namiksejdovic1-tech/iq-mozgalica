# 🎵 Audio Setup Guide - IQPlay Brain Games

## ✅ Šta je urađeno

### 1. Generisan Ambient Track

- **Fajl**: `Cognitive Flow.mp3` (iz Envato AI)
- **Lokacija**: Tvoj Downloads folder
- **Akcija**: Preimenuj u `ambient-focus.mp3` i premjesti u `public/assets/audio/music/`

## 🔊 Preostali Audio Fajlovi

Pošto nemamo pristup ElevenLabs API-u za bosanski glas, koristićemo placeholder audio ili ćeš morati ručno generisati:

### Opcija A: Generiši sam u ElevenLabs

Idi na [ElevenLabs](https://elevenlabs.io) i generiši ove tekstove:

**Voice Files (`public/assets/audio/voice/`):**

1. `v_welcome.mp3`: "Sistem je online. Drago mi je da te vidim."
2. `v_new_record.mp3`: "Analiza završena. Čestitam! Oborio si lični rekord."
3. `v_error_retry.mp3`: "Neuspjeh je samo podatak za učenje. Pokušaj ponovo."
4. `v_logic_master.mp3`: "Sistemska greška izbjegnuta. Tvoja dedukcija je besprijekorna."
5. `v_break_time.mp3`: "Detektujem blagi pad u pažnji. Vrijeme je za kratku pauzu."

### Opcija B: Koristi Web Speech API (Privremeno)

Aplikacija će automatski koristiti browser TTS ako fajlovi ne postoje.

## 🎮 SFX Fajlovi

Za SFX, možeš koristiti:

- [Freesound.org](https://freesound.org) - Besplatni zvučni efekti
- [Zapsplat](https://www.zapsplat.com) - Free sound effects

**Potrebni SFX (`public/assets/audio/sfx/`):**

1. `click-modern.mp3` - UI click sound
2. `success-shimmer.mp3` - Success/win sound
3. `error-thud.mp3` - Error sound
4. `sfx_startup.mp3` - App startup
5. `sfx_victory_shimmer.mp3` - Victory
6. `sfx_soft_thud.mp3` - Soft error
7. `sfx_precision_click.mp3` - Precision click
8. `sfx_air_release.mp3` - Break time

## 🚀 Brzi Upload na GitHub

Kada budeš spreman:

```bash
# Provjeri status
git status

# Dodaj sve izmjene
git add .

# Commit
git commit -m "Premium UI + Audio system"

# Push
git push origin main
```

## 📝 Napomena

Aplikacija će raditi i bez audio fajlova - samo neće imati zvuk. Možeš ih dodati kasnije.
