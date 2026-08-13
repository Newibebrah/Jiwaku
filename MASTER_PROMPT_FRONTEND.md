# MASTER PROMPT — Perombakan Frontend JIWAKU

> Cara pakai: salin blok di bawah (antara garis `---`) ke sesi vibe coding (Claude Code, opencode, Cursor, dll). Prompt ini menginstruksikan AI untuk melakukan perombakan penuh pada frontend situs Astro "JIWAKU" dengan tema lautan: compact, solid, kontras tinggi, palet biru lautan + emerald.

---

## 1. KONTEKS PROYEK

Ini adalah situs pribadi bernama **JIWAKU** — portal untuk puisi, fotografi, dan tulisan.

- **Framework:** Astro 5 (static build, output ke Vercel).
- **Struktur:**
  - `src/layouts/BaseLayout.astro` — layout induk (head, font, ikon, Navbar, Footer, spotlight, fragment).
  - `src/components/Navbar.astro` — nav sticky (logo, menu, tombol "Let's Be Friends", toggle mobile).
  - `src/components/Footer.astro` — footer ink gelap 3 kolom.
  - `src/pages/index.astro` — landing: 5 section scroll-snap (hero + Puisi + Photography + Menulis + Epilog), layout fullscreen tiap section, parallax + reveal.
  - `src/pages/poem.astro`, `src/pages/writing.astro` — halaman daftar (list card satu kolom, lebar max 720px).
  - `src/pages/photography.astro` — galeri foto (grid `repeat(auto-fill, minmax(260px,1fr))`, card aspect 4/3, overlay on hover).
  - `src/pages/poem/[slug].astro`, `src/pages/writing/[slug].astro` — halaman detail (max-width 680px, body typography).
  - `src/pages/contact.astro` — form kontak (grid 1fr/1.5fr).
  - `src/styles/global.css` — SATU-SATUNYA file CSS seluruh situs. SEMUA style ada di sini.
  - `src/scripts/main.js` — JS interaksi (navbar toggle, reveal, parallax, spotlight, toast, dll).
- **Font:** Space Grotesk (dari Google Fonts, sudah diload di BaseLayout).
- **Ikon:** Boxicons (`bx bx-...`, `bx bxs-...`, `bx bxl-...`) dari CDN, sudah diload.
- **Aturan penting:** JANGAN menambah file CSS baru, JANGAN ubah file JS kecuali wajib, JANGAN ubah struktur HTML di .astro kecuali untuk perbaikan yang sangat diperlukan. Fokus utama adalah desain ulang `src/styles/global.css` dan penyempurnaan markup/tata letak di komponen & halaman.

## 2. ARAH DESAIN (WAJIB DIKUTI)

Tema: **"Lautan dalam"** — nuansa laut yang indah, dalam, dan tenang. Bukan tema "tropis"; bayangkan kedalaman samudra: permukaan terang, kedalaman gelap, sorotan saphire, kilau emerald.

- **Compact & solid** — bukan minimalis longgar. Padding proporsional, ketat tapi tidak sumpek. Semua card/kotak terasa kokoh (solid), punya struktur yang jelas.
- **Kontras WAJIB tinggi** — TIDAK BOLEH ada teks yang menempel di background dengan warna senada sehingga tak terbaca. Setiap teks harus lolos kontras WCAG AA terhadap background-nya. Periksa setiap kombinasi: teks-warna vs latar.
- **Depth berlapis** — gunakan hierarki latar: laut paling dalam (hampir hitam navy) → laut tengah (navy/saphire gelap) → permukaan (biru muda pucat) → highlight emerald. Elemen kunci boleh "tenggelam" tapi elemen aksi/teks utama harus "mengapung" dengan kontras.
- **Nuansa warna:** biru muda, biru tua, hitam (navy gelap), saphire, dan **sedikit** emerald sebagai aksen (jangan berlebihan — emerald hanya untuk highlight/CTA/titik fokus).

## 3. PALET WARNA (GANTI SELURUH VARIABEL DI :root)

Ganti blok `:root` di `src/styles/global.css` dengan palet berikut (boleh disetel halus, tapi pertahankan prinsip kontras):

```
--color-deep:        #051A2E    (laut paling dalam / background gelap)
--color-abyss:       #0A2440    (navy gelap — card gelap, footer, navbar gelap)
--color-navy:        #0E2F52    (laut tengah — permukaan gelap sekunder)
--color-sapphire:    #155E9E    (saphire — batas, aksen netral, link)
--color-ocean:       #2E9BD6    (biru lautan terang — aksen primer, tombol)
--color-sky:         #8FD3F4    (biru muda — highlight, teks terang)
--color-foam:        #E8F6FE    (buih — background terang / surface)
--color-mist:        #BFE3F5    (kabut — border terang)
--color-ink:         #041220    (hitam-biru pekat — teks pada latar terang)
--color-text-light:  #DCEAF7    (teks terang pada latar gelap)
--color-muted-light: #8FB0C9    (teks redup pada latar gelap)
--color-muted:       #48688C    (teks redup pada latar terang)
--color-emerald:     #1FBF8F    (emerald — CTA/highlight, gunakan hemat)
```

- `--color-bg`: permukaan terang = `--color-foam` (atau gradient laut halus dari `#F2FAFF` ke `#E8F6FE`).
- `--color-text` (teks umum): jangan biru muda terang! Untuk body utama pilih `--color-ink` pada latar terang, atau `--color-text-light` pada latar gelap. Pastikan `--color-text` tidak pernah sama/mendekati warna background di mana ia dipakai.
- Hapus/rapikan varian lama yang tidak dipakai (accent-pink, accent-violet, accent-amber → ganti ke spektrum laut).

## 4. PRIORITAS PEROMBAKAN (kerjakan berurutan)

### 4.1. VARIABEL & RESET
1. Ganti palet `:root` sesuai bagian 3.
2. Buat utility kontras: `.surface-light`, `.surface-dark`, `.card-solid`, `.card-glass` dsb. bila membantu konsistensi.
3. Pastikan `color-scheme`, fokus outline tetap jelas (gunakan `--color-sapphire`/`--color-ocean`).

### 4.2. NAVBAR
- Ubah menjadi **solid abyss/dark** (mis. `background: linear-gradient(180deg, #0A2440, #071D35)`) dengan border bawah saphire tipis — tegas, kokoh.
- Logo: putih/biru muda (`.navbar-logo` → `--color-foam`), titik logo emerald/sky.
- Link menu: `--color-muted-light`, hover → `--color-sky`, link aktif → `--color-sky` + underline gradient saphire→emerald.
- Tombol "Let's Be Friends": gradient `--color-emerald` (hemat: satu-satunya emerald dominan di navbar), teks `#041220` gelap — kontras pasti tinggi.
- Mobile menu drawer & backdrop: sesuaikan ke skema gelap, jangan putih mentah.

### 4.3. HERO & SECTION HOME (index.astro)
- Latar body/home: gradient laut berlapis yang LEMBUT namun jelas (mulai foam → deep), mis. radial biru muda atas, radial saphire bawah, dasar foam.
- Judul besar: `--color-ink` di area terang ATAU `--color-foam` jika section memakai latar gelap — pastikan kontras.
- Kicker (JIWAKU, 01 — Puisi, dll): warna ocean/sapphire, huruf spacing lebar (sudah ada), tambah efek garis kecil.
- Parallax & reveal: PERTAHANKAN (sudah bagus), hanya pastikan kontras dan padding.
- Scroll hint chevron: `--color-ocean`.

### 4.4. KARTU DAFTAR (list-item) — poem.astro & writing.astro
Kunci perombakan: dari "kartu putih polos" → **kartu solid berkarakter laut**.
- Card: latar **abu-abu-biru sangat muda** (`--color-foam`) ATAU gradien halus navy→saphire dengan teks terang. Pilih SATU gaya konsisten. Rekomendasi: gelap (abyss→navy) agar nuansa "lautan dalam" kuat, teks `--color-text-light`.
- Border: `--color-sapphire` (translucent). Radius lebih kecil/tegas (12–16px) untuk kesan solid.
- Hover: naik -4px, border emerald, glow saphire lembut, ikon panah muncul.
- Judul card: `--color-foam`/`--color-sky`; excerpt: `--color-muted-light` (jangan abu-abu redup tak terbaca di latar gelap); meta (tanggal): emerald atau sky, uppercase kecil.
- Tambahkan elemen dekoratif kecil (garis aksen samping kiri gradient saphire→emerald, angka urut samar di pojok, ikon kategori) — tetap sopan & compact.

### 4.5. GALERI FOTO (photo-card) — photography.astro
- Grid tetap, tapi card lebih tegas: border saphire, sudut 12–16px, bayangan lapisan gelap.
- Overlay foto: gradient gelap abyss→transparan (sudah ada) → tingkatkan: caption selalu `--color-foam`, lokasi `--color-sky`, plus ikon.
- Tampilkan overlay SETIAP saat (bukan hanya hover) untuk aksesibilitas, atau gunakan gradient permanen tipis di dasar + full overlay saat hover.

### 4.6. HALAMAN DETAIL (poem/[slug].astro, writing/[slug].astro)
- Bungkus konten dalam "kolom kertas" solid: latar foam, border mist, radius, padding; ATAU kertas gelap.
- `.detail-title`: `--color-ink` (latar terang) dengan aksen ocean.
- `.detail-meta`: `--color-muted` + ikon calendar berwarna ocean.
- `.detail-body`: `--color-ink` (bukan biru muda terang!) — ini contoh bug lama: teks body memakai `--color-text` yang muda sehingga kontras rendah di putih. WAJIB perbaiki.
- `.poem-lines`: spasi baris nyaman (line-height 2.1 → pertahankan), teks `--color-ink`.
- Link "Semua Puisi": `--color-sapphire`, hover emerald.

### 4.7. KONTAK (contact.astro)
- Kartu form: surface foam solid, border mist, radius, shadow dalam.
- Label `--color-ink`, input: background putih bersih, border mist→sapphire saat fokus, teks input `--color-ink` (jangan muda).
- Tombol submit: gradient ocean→sapphire ATAU emerald solid, teks putih/foam, shadow.
- Kolom info: judul `--color-ink`, teks `--color-muted`, ikon `--color-ocean`/`--color-emerald`.

### 4.8. FOOTER
- Latar `--color-deep` (paling gelap), border-top saphire/emerald tipis.
- Logo `--color-foam`, deskripsi `--color-muted-light`, heading kolom `--color-sky` (uppercase), link `--color-text-light` hover emerald.
- Bottom bar: border-top rgba putih 0.08, teks `--color-muted-light`.

### 4.9. KOMPONEN LAIN
- `.empty` (state kosong): surface foam, border dashed saphire, ikon ocean, teks `--color-muted` + `--color-ink` utk judul.
- `.toast`: `--color-deep`, teks foam, ikon emerald.
- `.vignette`, `.spotlight`, `.visualizer`: sesuaikan warna ke ocean/sapphire, jangan putih menyilaukan.

## 5. ATURAN KUALITAS (WAJIB)

1. **Kontras dulu.** Untuk setiap pasangan warna yang dipakai, cek manual: teks vs latar harus minimal AA (4.5:1 body, 3:1 teks besar). Jangan pernah menaruh warna muda di atas warna muda, atau warna gelap di atas gelap.
2. **Jangan menduplikasi warna teks & background.** Jika latar `#E8F6FE`, teks tidak boleh `#8FD3F4`-ish muda. Gunakan `--color-ink`.
3. **Compact, tidak boros ruang.** Kurangi padding berlebih di card, pertahankan grid yang rapi. Jangan samakan padding semua elemen secara asal.
4. **Satu-satunya file CSS** tetap `src/styles/global.css`. Semua perubahan ada di sana + penyesuaian markup minimal di `.astro`.
5. **Pertahankan semua behavior JS** (toggle navbar, reveal on scroll, parallax, spotlight, toast, visualizer, scroll-snap). Jangan menghapus/mengubah class yang dijadwalkan JS kecuali benar-benar perlu, dan jika melakukannya, sesuaikan `src/scripts/main.js` juga.
6. **Responsif penuh** (≥768px dan <768px breakpoint), `prefers-reduced-motion` tetap dihormati.
7. **Dark navbar di semua halaman**, konsisten; jangan putih kembali saat scroll/mobile.

## 6. OUTPUT YANG DIHARAPKAN
- File yang diubah: utamanya `src/styles/global.css`; markup opsional di `src/components/*.astro`, `src/layouts/BaseLayout.astro`, `src/pages/*.astro`.
- Ringkasan singkat tiap perubahan + alasan pilihan warna/kontras.
- Verifikasi: jalankan `npm run dev` lokal, cek semua halaman (/, /poem, /photography, /writing, /contact, detail), pastikan tidak ada teks tak terbaca & layout compact solid di desktop & mobile.

## 7. CONTOH MASALAH LAMA YANG HARUS DIPERBAIKI (referensi bug)
- `--color-text: #6cdbd2` (teal muda) dipakai sebagai teks umum → kontras rendah di latar putih. Ganti pendekatan: teks utama = ink gelap di latar terang, foam/sky di latar gelap.
- Card putih polos + border tipis → kurang "solid". Ganti jadi solid/gradient dengan border berkarakter.
- Home section semua putih rata → kurang nuansa laut. Perkaya gradient latar.
- Footer sudah gelap (bagus) → pertahankan, seragamkan tone dengan navbar.

---

## RINGKASAN SATU-KALIMAT
"Rombak total frontend JIWAKU agar tampil compact, solid, kontras tinggi, bergaya lautan dalam (biru muda, biru tua, hitam navy, saphire, sedikit emerald) — utamakan global.css, pertahankan Astro + JS behavior."
