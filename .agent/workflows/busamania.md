---
description: Busamania RC Azerbaijan saytı ilə işləmək — admin panel, deploy, dəyişikliklər
---

# Busamania RC Azerbaijan — Layihə Konteksti

## Layihə Haqqında
Busamania RC Azerbaijan motosiklet klubunun rəsmi saytıdır. Sayt statik HTML/CSS/JS ilə yazılıb və Netlify-da host olunur.

## Əsas Məlumatlar

| Məlumat | Dəyər |
|---------|-------|
| **GitHub Repo** | `shahmuradovk/busamania-netlify` |
| **Netlify URL** | `https://inspiring-selkie-171394.netlify.app` |
| **Lokal qovluq** | `C:\Users\kanan.shahmuradov\.gemini\antigravity\playground\primordial-flare\busamania-netlify` |
| **Admin Panel** | `/admin/dashboard.html` (Login: admin / busamania2017) |
| **Deploy** | Netlify Serverless Function (`/.netlify/functions/deploy`) |

## Texniki Arxitektura

```
Admin Panel → localStorage-da saxla → POST /.netlify/functions/deploy
→ Serverless function GitHub API-yə commit (data/site-data.json)
→ Netlify avtomatik rebuild → Sayt yenilənir
```

## Fayl Strukturu
- `index.html` — Ana səhifə
- `structure.html` — Club Structure (dinamik, site-data.json-dan render)
- `gallery.html` — Qalereya
- `about.html` — Haqqımızda
- `charter.html` — Nizamnamə
- `admin/` — Admin panel (dashboard.html, admin.js, login.html)
- `data/site-data.json` — Bütün sayt datası (admin paneldən deploy olunur)
- `netlify/functions/deploy.mjs` — Serverless deploy function
- `js/main.js` — Əsas frontend JS
- `js/gallery.js` — Qalereya JS
- `js/i18n.js` — 3 dil dəstəyi (AZ, EN, RU)
- `css/style.css` — Əsas stillər

## Netlify Environment Variables
- `GITHUB_TOKEN` — GitHub API token
- `REPO_OWNER` — `shahmuradovk`
- `REPO_NAME` — `busamania-netlify`

## Admin Panel Bölmələri
1. **Ümumi Baxış** — Statistika
2. **Haqqımızda** — Klub haqqında mətn
3. **Klub Strukturu** — Üzvlər (President, VP, Katib, Mexanik, Xəzinədar, Üzv)
4. **Qalereya** — Şəkillər
5. **Nizamnamə** — Qaydalar
6. **Parametrlər** — Parol dəyişmək, deploy, məlumatları sıfırlamaq

## İş Qaydası
// turbo-all
1. Layihə ilə işləyərkən əvvəlcə `git pull` edin ki remote dəyişiklikləri alasınız
2. Dəyişiklik edib `git commit` + `git push origin main` edin
3. Netlify avtomatik deploy edəcək (1-2 dəq)
