# Hopeland Sitesi Deploy Rehberi

Claude Code ile geliştirdiğin Next.js sitesini Vercel'e deploy edip `hopeland.com.tr` domainine bağlamak için adım adım rehber.

**Tahmini toplam süre:** 30–45 dakika
**Maliyet:** 0 ₺ (tüm servisler ücretsiz tier'da yeterli)

---

## Genel akış

1. Kodu GitHub'a push et
2. Vercel'e deploy et
3. Resend API key al ve Vercel'e ekle
4. `hopeland.com.tr` domainini Vercel'e bağla
5. Metunic'te DNS kayıtlarını ekle
6. SSL ve canlı olduğunu doğrula
7. (Opsiyonel) Resend domain doğrulaması ile mailler `contact@hopeland.com.tr` üzerinden gitsin

---

## 1. Kodu GitHub'a Push

Senin GitHub kullanıcı adın: `bumutayt`

```bash
cd hopeland-website
git init
git add .
git commit -m "Initial commit"
```

GitHub'da yeni repo oluştur:
1. https://github.com/new
2. **Repository name:** `hopeland-website`
3. **Private** seç (public yapmana gerek yok)
4. README/gitignore/license **EKLEME** (Next.js zaten ekledi)
5. **Create repository**

GitHub'ın gösterdiği "push existing repository" komutlarını kullan:

```bash
git remote add origin https://github.com/bumutayt/hopeland-website.git
git branch -M main
git push -u origin main
```

Eğer auth sorunu çıkarsa: GitHub'da **Settings → Developer settings → Personal access tokens → Tokens (classic) → Generate new token** ile bir token üret (`repo` permission yeter), parola yerine onu kullan. Veya GitHub Desktop / GitHub CLI (`gh auth login`) ile auth ol.

---

## 2. Vercel'e Deploy

Vercel = Next.js'i ücretsiz host eden platform. Aynı şirket Next.js'in arkasında, dolayısıyla en sorunsuz deploy yolu.

1. https://vercel.com/signup → **Continue with GitHub**
2. GitHub erişimini onayla (Vercel sadece import edeceğin repolara erişim ister)
3. Dashboard'da **Add New… → Project**
4. `hopeland-website` repo'sunu seç → **Import**
5. Framework otomatik **Next.js** olarak tanınacak
6. Environment Variables'ı **şimdilik boş bırak** (Resend key'i 3. adımda ekleyeceğiz)
7. **Deploy** butonu

~2 dakika sonra siten `hopeland-website-xxxxx.vercel.app` adresinde canlı olacak. Test et: hero görünüyor mu, scroll çalışıyor mu? Form henüz çalışmaz (API key yok), o normal.

---

## 3. Resend Hesabı + API Key

Resend = Contact form'dan gelen mesajları `info@hopeland.com.tr`'ye e-posta olarak gönderecek servis. Ücretsiz tier'da ayda 3000 mail var.

1. https://resend.com/signup — Google ile veya email ile kaydol
2. Dashboard → **API Keys** → **Create API Key**
3. **Name:** `Hopeland Website`
4. **Permission:** `Sending access`
5. **Domain:** `All domains` (veya henüz domain doğrulamadıysan default)
6. Oluşan key'i (`re_…` ile başlar) **hemen kopyala** — bir daha göremezsin, güvenli yere kaydet (1Password, Bitwarden, vs.)

---

## 4. Vercel'e Resend API Key'i Ekle

1. Vercel → projeyi aç → **Settings** sekmesi → **Environment Variables**
2. **Add new:**
   - **Key:** `RESEND_API_KEY`
   - **Value:** `re_…` (Resend'den aldığın key)
   - **Environments:** Production, Preview, Development — üçü de işaretli
3. **Save**
4. Şimdi yeniden deploy lazım: **Deployments** sekmesi → en üstteki deployment'ın yanındaki **⋯** menüsü → **Redeploy** → **Redeploy** (use existing build cache açık kalabilir)

Yeniden deploy bittikten sonra `vercel.app` adresinden formu test et — kendine bir mesaj at, `info@hopeland.com.tr`'ye düşmeli.

> **Not:** Şu an mailler `onboarding@resend.dev` adresinden geliyor (Resend'in default sender'ı). Çalışıyor ama spam'e düşme ihtimali var. 7. adımda bunu kendi domaininden gönderir hale getireceğiz.

---

## 5. `hopeland.com.tr`'yi Vercel'e Ekle

1. Vercel → proje → **Settings** → **Domains**
2. **Add** → `hopeland.com.tr` yaz → **Add**
3. Vercel sana 2 DNS kaydı gösterecek. Tipik olarak:

   | Tip | Host | Değer |
   |---|---|---|
   | **A** | `@` | `76.76.21.21` |
   | **CNAME** | `www` | `cname.vercel-dns.com` |

   *(Tam değerleri Vercel ekranından kopyala — Vercel zaman içinde bu IP'yi değiştirebilir.)*

4. Aynı ekranda büyük ihtimalle hem `hopeland.com.tr` hem `www.hopeland.com.tr` görünecek; ikisini de ekle, biri ana domain biri ona redirect olsun. Vercel hangisini default yapacağını sorar — **`hopeland.com.tr`'yi primary** seç, `www` redirect olsun.

Bu noktada Vercel "Invalid Configuration" diyecek — DNS kayıtlarını henüz Metunic'te eklemedik. Sıradaki adım o.

---

## 6. Metunic'te DNS Kayıtlarını Ekle

⚠️ **Çok önemli:** Mevcut MX, SPF, DKIM (CNAME), DMARC kayıtlarını **silme/dokunma**. Onlar Metunic mail servisin için. Sadece A ve CNAME ekleyeceğiz.

1. Metunic paneli → **Hizmetler → Alan Adlarım** (veya doğrudan domain listesi)
2. `hopeland.com.tr` satırı → **DNS Yönetimi** veya **Yönet → DNS** (panel arayüzüne göre değişir, "DNS" yazan butonu bul)
3. **Yeni kayıt ekle:**

   **Kayıt 1 — A record (apex domain):**
   - Tip: `A`
   - Host: `@` (veya boş bırak / `hopeland.com.tr`)
   - Değer: `76.76.21.21` (Vercel'in verdiği IP)
   - TTL: 3600 (varsayılan)

   **Kayıt 2 — CNAME (www subdomain):**
   - Tip: `CNAME`
   - Host: `www`
   - Değer: `cname.vercel-dns.com`
   - TTL: 3600

4. **Kaydet**

DNS yayılması için 5 dakika – 2 saat bekle. Genelde 15 dakikada Vercel'in dashboardunda **"Valid Configuration ✓"** görürsün. Sayfayı ara ara yenile.

> **Eğer Metunic'in DNS panelinde A record için Host alanı `@` kabul etmiyorsa:** Bazı paneller boş bırakmanı ister, bazıları domain adının kendisini (`hopeland.com.tr`). Hata verirse ikisini de dene.

---

## 7. SSL ve Doğrulama

DNS yayıldıktan sonra:

- Vercel SSL sertifikasını otomatik üretir (Let's Encrypt) — senin için ek iş yok
- `https://hopeland.com.tr` aç → siten görünmeli
- `https://www.hopeland.com.tr` aç → ana domaine redirect olmalı
- Tarayıcı kilit ikonuna tıkla → SSL geçerli olmalı

Şu noktada site canlı, form çalışır durumda. **İstersen burada durabilirsin** — alttaki adım (Resend domain doğrulama) opsiyonel.

---

## 8. (Opsiyonel) Resend Domain Doğrulama

Şu an mailler `onboarding@resend.dev` adresinden gidiyor. Daha profesyonel ve spam'e düşmemek için `contact@hopeland.com.tr` adresinden göndermeyi sağlayalım.

1. Resend → **Domains** → **Add Domain** → `hopeland.com.tr` → **Add**
2. Resend sana birkaç DNS kaydı verecek (genelde TXT + DKIM CNAME'leri)
3. Bu kayıtları **Metunic'te ekle** — yine mevcut kayıtlarına dokunmadan

   ⚠️ **DİKKAT — SPF çakışması:**
   Mevcut SPF kaydın şöyle:
   ```
   v=spf1 include:spf.mnic.xion.oxcs.net ~all
   ```

   Resend de SPF eklemeni isteyecek. Bir domainde **sadece tek SPF kaydı** olabilir, ikincisini eklemen yerine mevcut SPF'yi şu şekilde **birleştir**:
   ```
   v=spf1 include:spf.mnic.xion.oxcs.net include:_spf.resend.com ~all
   ```
   (Yani mevcut SPF'yi düzenle, `include:_spf.resend.com` parçasını ekle.)

4. Diğer TXT/CNAME kayıtlarını oldukları gibi ekle
5. Resend → **Verify** butonu → 5–15 dakikada doğrulanır
6. Doğrulandıktan sonra `app/actions.ts` dosyasında `from` alanını değiştir:
   ```typescript
   from: "Hopeland <contact@hopeland.com.tr>",
   ```
7. Commit + push → Vercel otomatik redeploy edecek

Artık formdan gelen mailler `contact@hopeland.com.tr` adresinden `info@hopeland.com.tr`'ye gidecek, çok daha profesyonel görünür.

---

## Sorun Giderme

| Belirti | Çözüm |
|---|---|
| `DNS_PROBE_FINISHED_NXDOMAIN` veya domain açılmıyor | DNS henüz yayılmadı, 1-2 saat ver. `dig hopeland.com.tr` ile A kaydının düştüğünü kontrol edebilirsin |
| Vercel'de "Invalid Configuration" devam ediyor | A record'un host'u doğru mu (`@` veya boş)? CNAME'i www için mi ekledin? Vercel'in gösterdiği değerlerle birebir karşılaştır |
| Site açılıyor ama SSL hatası | Vercel sertifikayı üretirken 5-10 dakika sürer, biraz bekle. Devam ederse Vercel'de domain'in yanındaki **Refresh** butonuna bas |
| Form gönderiliyor ama mail gelmiyor | Vercel → proje → **Logs** → contact action'ın loglarına bak. `RESEND_API_KEY` ortam değişkeni production'da set edilmiş mi? Resend dashboard'unda **Logs** tabından gönderim denemesi görünüyor mu? |
| Mail spam'e düşüyor | 8. adımı uygula (domain doğrulama). DKIM ve SPF düzgünse spam'e düşmez |
| Resend "SPF record verification failed" | Mevcut SPF'yi sildin mi? Birden fazla SPF kaydı mı var? Tek bir SPF olmalı, içine include'ları birleştir |

---

## Sonrası — yapılacaklar listesi

- [ ] Logo SVG'si tasarla → `public/logo.svg` → Header'a entegre et
- [ ] Favicon hazırla → `app/icon.png` (Next.js otomatik kullanır)
- [ ] Open Graph image (`app/opengraph-image.png`) — sosyal medyada link paylaşıldığında görünecek görsel (1200×630)
- [ ] Proje screenshotları çek → `public/work/` → Work component'inde placeholder gradient'leri değiştir
- [ ] LinkedIn şirket sayfası aç → footer'a ve contact'a gerçek URL'i koy
- [ ] Clutch profili aktifleşince footer'a link ekle
- [ ] Resend domain doğrulamasını tamamla (8. adım)
- [ ] (İleride) Plausible/Umami gibi privacy-friendly bir analytics ekleyebilirsin

---

Takıldığın yerde ekran görüntüsü ile mesaj at, hep birlikte hallederiz.
