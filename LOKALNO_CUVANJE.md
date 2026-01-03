# ✅ LOKALNO ČUVANJE PODATAKA - DODANO

## 🎉 **ŠTA JE DODANO:**

### 1. **Unos Imena Korisnika**

- Pri prvom pokretanju aplikacije, traži se unos imena
- Ime se čuva lokalno na uređaju
- Prikazuje se na početnom ekranu i profilu

### 2. **Lokalno Čuvanje Statistike (localStorage)**

Svi podaci se čuvaju na uređaju:

- ✅ **Ime korisnika**
- ✅ **Broj odigranih igara**
- ✅ **Ukupni bodovi**
- ✅ **Procenat uspjeha (win rate)**
- ✅ **Trenutni niz (streak)**
- ✅ **Vještine (Memorija, Logika, Brzina)** - automatski se povećavaju sa igrama

### 3. **Opcije u Profilu**

Na **Profil** ekranu dodane dvije opcije:

- ✏️ **Promijeni Ime** - Omogućava promjenu imena
- 🔄 **Resetuj Sve Podatke** - Resetuje sve na 0

---

## 📊 **KAKO RADI:**

### **Automatsko Čuvanje:**

Podaci se **automatski čuvaju** nakon svake igre:

- Bodovi se dodaju na ukupne bodove
- Broj igara se povećava
- Win rate se ažurira
- Vještine se poboljšavaju na osnovu uspjeha
- Stri fink se održava ili resetuje

### **Vještine se Razvijaju:**

- Ako igraš **Memory** igre → Memorija raste
- Ako igraš **Logic** igre → Logika raste
- Ako igraš **Speed** igre → Brzina raste
- Što bolja tačnost, brže rasteš!

### **Lokalno Čuvanje:**

Svi podaci se čuvaju u:

```
localStorage → 'iqplay_userdata'
```

**Prednosti:**

- ✅ Ne treba internet
- ✅ Podaci ostaju na uređaju
- ✅ Radi offline
- ✅ Brzo i sigurno

---

## 🎮 **KAKO KORISTITI:**

### **Pri prvom pokretanju:**

1. Aplikacija pita: "Unesite vaše ime"
2. Unesi ime (npr. "Namik")
3. Sve statistike počinju od 0

### **Po svakoj igri:**

- Statistika se automatski ažurira
- Bodovi se dodaju
- Vještine rastu
- Sve se čuva lokalno

### **Promjena Imena:**

1. Idi na **Profil** (donje meni, ikona 👤)
2. Skroluj dole do **Opcije**
3. Klikni **"Promijeni Ime"**
4. Unesi novo ime
5. Potvr di

### **Reset Podataka:**

1. Idi na **Profil**
2. Skroluj dole do **Opcije**
3. Klikni **"Resetuj Sve Podatke"** (crveno dugme)
4. Potvrdi (pazi - ovo briše sve!)
5. Sve se vraća na 0:
   - Bodovi: 0
   - Igre: 0
   - Win rate: 0%
   - Streak: 0
   - Sve vještine: 0%

---

## 📱 **ŠTA SE ČUVA:**

### **Korisnički Podaci:**

```json
{
  "userName": "Namik",
  "userProfile": {
    "memory": 0.15,    // 0 do 1 (0% do 100%)
    "logic": 0.08,
    "speed": 0.22,
    "fatigue_level": 0.3
  },
  "stats": {
    "gamesPlayed": 25,
    "totalPoints": 1250,
    "winRate": 75,      // Procenat
    "streak": 5
  }
}
```

Sve ovo se automatski čuva na uređaju!

---

## 🔐 **SIGURNOST PODATAKA:**

### **Gdje su podaci:**

- Čuvaju se **samo na tvom uređaju**
- Niko drugi ne može pristupiti
- Ne šalju se na server
- Potpuno privatno

### **Šta ako obrišem aplikaciju:**

- Ako obrišeš aplikaciju → podaci se brišu
- Ako obrišeš cache → podaci se brišu
- **Reset dugme** → ručno brisanje podataka

### **Kako se čuvaju:**

- HTML5 localStorage API
- Siguran i brz
- Podržan na svim uređajima

---

## ✨ **NOVE FUNKCIJE:**

### **1. Automatsko Praćenje Napretka:**

```javascript
// Svaki put kada završiš igru:
- Igre: +1
- Bodovi: + ostvareni bodovi
- Win Rate: automatski izračunava prosek
- Streak: održava se ako si dobar (>60%)
```

### **2. Rast Vještina:**

```javascript
// Na osnovu tačnosti:
- 90%+ tačnost → Vještina +0.09
- 70%+ tačnost → Vještina +0.07
- 50%+ tačnost → Vještina +0.05
```

### **3. Personalizacija:**

```javascript
// Promijeni ime bilo kada
app.changeUserName() → Unesi novo ime
```

### **4. Potpuni Reset:**

```javascript
// Resetuj sve na početak
app.resetUserData() → Potvrdi → Sve na 0
```

---

## 📂 **GDJE SU IZMJENE:**

### **Fajlovi Ažurirani:**

#### **1. `public/app.js`** - Glavna logika

```javascript
// Dodato:
- loadUserData()       → Učitava podatke sa uređaja
- saveUserData()       → Čuva podatke na uređaj
- resetUserData()      → Resetuje sve
- changeUserName()     → Mijenja ime
- updateUI()           → Ažurira prikaz
- promptUserName()     → Traži unos imena
```

#### **2. `public/index.html`** - UI

```html
<!-- Dodato: -->
- Settings sekcija u Profile ekranu
- Dugme "Promijeni Ime"
- Dugme "Resetuj Sve Podatke"
- Footer "Powered by Namik Sejdovic 2026"
```

---

## 🎯 **TESTIRANJE:**

### **Test Scenario 1: Prvo Pokretanje**

1. Otvori aplikaciju
2. Unesi ime
3. Igraj par igara
4. Provjeri da se statistika povećava

### **Test Scenario 2: Ponovno Pokretanje**

1. Zatvori aplikaciju
2. Ponovo otvori
3. Provjeri da su podaci sačuvani

### **Test Scenario 3: Promjena Imena**

1. Idi na Profil
2. Klikni "Promijeni Ime"
3. Unesi novo ime
4. Provjeri da se mijenja svuda

### **Test Scenario 4: Reset**

1. Idi na Profil
2. Klikni "Resetuj Sve Podatke"
3. Potvrdi
4. Provjeri da je sve 0

---

## 🚀 **DEPLOYMENT:**

Kada uploaduješ ažurirane fajlove na Netlify/GitHub:

1. Novi korisnici će unijeti ime
2. Stari korisnici će zadržati podatke (ako su već koristili)
3. Svi će imati opciju Reset-a

---

## ✅ **GOTOVO!**

Sve je spremno i funkcionalno:

- ✅ Unos imena
- ✅ Lokalno čuvanje
- ✅ Automatsko praćenje statistike
- ✅ Rast vještina
- ✅ Promjena imena
- ✅ Reset podataka
- ✅ Footer dodan

**Sve radi offline i privatno na uređaju!** 🎉

---

## 📋 **SLJEDEĆI KORACI:**

1. **Upload fajlove na GitHub:**
   - `public/app.js` (ažuriran)
   - `public/index.html` (ažuriran)

2. **Deploy na Netlify**
   - Automatski će se ažurirati

3. **Testiraj na telefonu**
   - Otvori aplikaciju
   - Unesi ime
   - Igraj igre
   - Provjeri reset

**Ready to deploy!** 🚀
