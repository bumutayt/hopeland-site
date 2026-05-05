# Hopeland Site — Windows Geliştirme Geçiş Rehberi

Bu rehber, mevcut macOS setup'taki **kod yazma + yayınlama** akışını evdeki Windows PC'ne taşımak içindir.

**Tahmini süre:** 30-45 dk (ilk kurulum). Sonrasında her gün sadece `git push` ile çalışırsın.

---

## 1. Sistemin Genel Mimarisi (anlamak için)

```
┌─────────────────────────┐                ┌──────────────────────────┐
│   WINDOWS PC (sen)      │                │   CLOUD (otomatik)       │
├─────────────────────────┤                ├──────────────────────────┤
│  • VS Code / Cursor     │  git push      │  GitHub                  │
│  • Node.js + npm        │ ─────────────► │  bumutayt/hopeland-site  │
│  • Git (SSH key)        │                │         │                │
│  • Claude Code (CLI)    │                │         │ webhook        │
│  • .env.local           │                │         ▼                │
│    (RESEND_API_KEY)     │                │  Vercel                  │
│                         │                │  build + deploy          │
│  npm run dev            │                │         │                │
│  → localhost:3000       │                │         ▼                │
│                         │                │  https://hopeland.com.tr │
└─────────────────────────┘                │         │                │
                                            │         │ form submit    │
                                            │         ▼                │
                                            │  Resend                  │
                                            │  contact@hopeland.com.tr │
                                            │         │                │
                                            │         ▼                │
                                            │  info@hopeland.com.tr    │
                                            └──────────────────────────┘

DNS yönetimi:  Metunic (panel.metunic.com.tr)
               → A, CNAME (Vercel için)
               → MX, SPF (Metunic mail için)
               → DKIM, SPF, MX bounce (Resend için)
```

**Akış:** Kodu Windows'ta yaz → `git push` → Vercel otomatik deploy eder → site canlı. Sen Vercel'e elle hiçbir şey atmazsın, GitHub'a push yetiyor.

---

## 2. Hesap & Erişim Envanteri

Windows'a geçmeden önce **hepsinin şifrelerini elinde olduğundan emin ol.** Hiçbiri sıfırdan kurulmayacak — hepsi zaten online aktif.

| Servis | Ne yapıyor | URL | Giriş |
|---|---|---|---|
| **GitHub** | Kod barındırma | https://github.com | `bumutayt` |
| **Vercel** | Otomatik deploy + hosting | https://vercel.com | GitHub ile (`bumutayt's projects` Hobby) |
| **Resend** | Form maillerini gönderim | https://resend.com | (kayıtta kullandığın mail) |
| **Metunic** | Domain + DNS yönetimi | https://panel.metunic.com.tr | Müşteri panelin |
| **Anthropic** | Claude Code (terminal AI) | https://claude.ai | (kullandığın hesap) |

### Kritik Bilgiler (yedekle)

- **Resend API Key** (`re_...` ile başlar): Şu an macOS'taki `hopeland-website/.env.local` içinde. Windows'a taşırken iki seçenek:
  - **(A) Aynı key'i taşı:** macOS'ta dosyayı aç, içeriği 1Password/Bitwarden gibi şifre yöneticisine yapıştır → Windows'tan oradan al
  - **(B) Yeni key üret (önerilen, daha güvenli):** Resend → API Keys → eski key'i Revoke → yeni key oluştur. Ardından Vercel'in env var'ını güncelle (Settings → Environment Variables → düzenle), yeni key'i Windows `.env.local`'una yaz. Vercel'i redeploy et.
- **GitHub repo:** https://github.com/bumutayt/hopeland-site (private)
- **Domain:** hopeland.com.tr (Metunic'te kayıtlı)
- **Vercel proje:** hopeland-site

---

## 3. Windows'ta Kurulum (sıfırdan)

### 3.1 Gerekli yazılımlar

Hepsi ücretsiz, yükle ve "Next, Next, Finish" geç:

| Yazılım | Link | Notlar |
|---|---|---|
| **Git for Windows** | https://git-scm.com/download/win | Kurulum sırasında "Git Bash" da gelir — onu sık kullanacaksın |
| **Node.js LTS** | https://nodejs.org | LTS versiyonu seç (şu an 20+ veya 22+) |
| **VS Code** | https://code.visualstudio.com | veya Cursor (https://cursor.sh) — Cursor önerilir, AI özellikleri var |
| **GitHub CLI** | https://cli.github.com | Opsiyonel ama hayatı kolaylaştırır |
| **Claude Code** | https://claude.ai/code | Sohbette kullandığımız terminal AI; kurulum: Node.js sonrası `npm i -g @anthropic-ai/claude-code` |

### 3.2 Git ve SSH key kurulumu

Git Bash'i aç (Windows menüsünden ara), şu komutları sırayla çalıştır:

```bash
# Git kimliğini ayarla (mevcut macOS'taki ile aynı)
git config --global user.name "Burak Umut Aytekin"
git config --global user.email "burakumutaytekin@gmail.com"

# Yeni SSH key üret (macOS'taki key'i taşımana gerek yok, her cihaz kendi key'i)
ssh-keygen -t ed25519 -C "burakumutaytekin@gmail.com"
# Sorulara Enter, Enter, Enter (varsayılanlar)

# Public key'i kopyala
cat ~/.ssh/id_ed25519.pub
```

Çıktıyı kopyala → https://github.com/settings/ssh/new → yapıştır → "Add SSH key".

Test:
```bash
ssh -T git@github.com
# "Hi bumutayt! You've successfully authenticated..." görmeli
```

### 3.3 Repo'yu klone et

Git Bash'te kodu nereye koyacağın klasöre git, sonra:

```bash
# Örneğin:
mkdir ~/Documents/GitHub
cd ~/Documents/GitHub

git clone git@github.com:bumutayt/hopeland-site.git
cd hopeland-site
```

### 3.4 Bağımlılıkları yükle ve `.env.local` oluştur

```bash
npm install
```

`.env.local` dosyasını oluştur (Git Bash'te):

```bash
cp .env.example .env.local
```

Ardından dosyayı VS Code/Cursor ile aç, içine `RESEND_API_KEY=re_...` yaz (yukarıda bahsedilen Resend key'i).

> ⚠️ **`.env.local` `.gitignore` ile dışlanır** — yani GitHub'a push edilmez. Asla manuel commit'leme.

### 3.5 Test et

```bash
npm run dev
```

Tarayıcıda http://localhost:3000 aç → site görünmeli, contact formundan kendine bir mesaj at → info@hopeland.com.tr'a gelmeli.

---

## 4. Günlük Akış (Windows'ta)

Tek bir akış var, alış:

```bash
# 1. Kod yaz (VS Code / Cursor / Claude Code ile)

# 2. Lokal'de test et
npm run dev

# 3. Beğendiğinde commit et
git add .
git commit -m "değişiklik açıklaması"

# 4. GitHub'a yolla
git push

# 5. Vercel otomatik build + deploy yapar (~1-2 dk)
#    https://hopeland.com.tr canlı güncellenir
```

**Vercel deploy durumunu** https://vercel.com'dan izleyebilirsin (Deployments sekmesi).

---

## 5. Editör Önerileri

### Cursor (önerilen)
https://cursor.sh — VS Code fork'u, içine Claude Sonnet/Opus/GPT-4 entegre. Cmd+K (Windows: Ctrl+K) ile kod düzenleme, Cmd+L ile sohbet.

### VS Code + Eklentiler
- **GitHub Copilot** (yıllık ücretli)
- **Tailwind CSS IntelliSense** (Tailwind v4 önerileri)
- **Prettier** (otomatik formatla)
- **ESLint** (lint hatalarını gösterir)

### Claude Code (terminal'de AI)
Bu sohbette kullandığım araç. Windows'a kurulum:
```bash
npm i -g @anthropic-ai/claude-code
claude
```
Ardından proje dizininde `claude` yazınca terminal'de AI başlar — bu sohbetteki gibi kod yazdırabilir, dosya düzenletebilirsin.

---

## 6. Sorun Giderme

| Belirti | Çözüm |
|---|---|
| `npm install` hata veriyor | Node.js LTS yüklü mü kontrol et: `node -v` (20+ olmalı). PowerShell yerine Git Bash kullan |
| `git push` "Permission denied" | SSH key GitHub'a eklenmemiş. Adım 3.2'yi tekrar yap |
| Form çalışmıyor (lokal) | `.env.local`'da `RESEND_API_KEY` doğru mu? Dev server'ı durdurup yeniden başlat (env değişiklikleri restart ister) |
| Form çalışmıyor (canlı) | Vercel → Settings → Environment Variables → `RESEND_API_KEY` ekli mi? Yoksa ekle, Deployments → Redeploy |
| Vercel deploy başarısız | Vercel'de Deployments → ilgili deploy'a tıkla → Build logs'a bak. Genelde TypeScript hatası ya da eksik npm paketi |
| Site açılmıyor (`hopeland.com.tr`) | DNS sorunu ihtimali düşük (yapılandırma stabil), önce `https://hopeland-site.vercel.app/` aç. Çalışıyorsa Vercel sağlam, sorun DNS/Metunic. Çalışmıyorsa Vercel'de issue var |
| Mailler gelmiyor | Resend dashboard → Logs → son gönderim status'una bak. Domain "Verified" mi kontrol et |

---

## 7. Mevcut Proje Hakkında Hızlı Referans

### Stack
- **Next.js 16** (App Router, server actions)
- **React 19**
- **TypeScript**
- **Tailwind CSS v4**
- **Resend** (mail SDK)

> ⚠️ Next.js 16 görece yenidir, AI'ların eğitim verisinde eksik kalabilir. Kod yazarken `node_modules/next/dist/docs/`'a bak — repo'daki `AGENTS.md` bunu hatırlatır.

### Önemli Dosyalar
| Dosya | Ne yapıyor |
|---|---|
| `app/page.tsx` | Ana sayfa (section'ları bir araya getirir) |
| `app/actions.ts` | Server action — Resend ile mail gönderir |
| `app/layout.tsx` | Root layout, metadata, fontlar |
| `components/Contact.tsx` | İletişim formu |
| `components/Hero.tsx` | Üst bölüm |
| `lib/resend.ts` | Resend client (env var'dan key okur) |
| `.env.local` | Local secrets (asla commit'lenmez) |
| `.env.example` | Template (commit'lenir) |

### DNS Kayıtları (Metunic'te zaten kurulu, dokunma)
Vercel için:
- A `hopeland.com.tr` → `216.198.79.1`
- CNAME `www` → `e300c822738a9fea.vercel-dns-017.com.`

Mail (Metunic) için:
- MX `hopeland.com.tr` → `mx001-004.mnic.xion.oxcs.net`
- TXT (SPF) `hopeland.com.tr` → `v=spf1 include:spf.mnic.xion.oxcs.net ~all`
- CNAME `mail1._domainkey` ve `mail2._domainkey` → Metunic DKIM
- TXT `_dmarc` → `v=DMARC1; p=reject;`

Resend için:
- TXT `resend._domainkey` → DKIM (uzun `p=MIGfMA...` string)
- MX `send` → `feedback-smtp.eu-west-1.amazonses.com` (priority 10)
- TXT `send` → `v=spf1 include:amazonses.com ~all`

### İlgili Dökümanlar (bu klasörde)
- `hopeland-website-brief.md` — projenin kapsamı, marka kimliği
- `hopeland-deploy-guide.md` — adım adım deploy rehberi
- `hopeland-website/AGENTS.md` — AI ajanlarına Next.js 16 uyarısı

---

## 8. Geçiş Sonrası Yapılacaklar Kontrol Listesi

- [ ] Windows'ta tüm yazılımlar yüklü
- [ ] SSH key GitHub'a eklendi, `ssh -T git@github.com` başarılı
- [ ] Repo klone edildi, `npm install` hatasız
- [ ] `.env.local` oluşturuldu, `RESEND_API_KEY` doldu
- [ ] `npm run dev` ile lokal test geçti (form mail gönderdi)
- [ ] (Opsiyonel) macOS'taki `.env.local` ve Resend key güvenli yere yedeklendi
- [ ] (Opsiyonel) Yeni Resend key üretildi, Vercel env güncellendi, eski key revoke edildi

---

## 9. macOS Tarafını Ne Yapacaksın?

Windows'a tam geçince:

- macOS'taki repo: `git push origin main` ile son haldeyse silebilirsin (kod GitHub'da güvende)
- macOS'taki `.env.local`: secret içerir, **dikkatli sil** (Recycle Bin / Trash'i de boşalt)
- macOS'taki SSH key: kullanmıyorsan GitHub'dan da çıkar (https://github.com/settings/keys → eski key'in yanındaki Delete)

---

Soruların olursa Claude Code'u Windows'ta açıp bu dosyayı göster, "bu projeyi Windows'a taşıyorum, [şu noktada takıldım]" de — geri kalanı halleder.

İyi çalışmalar 🚀
