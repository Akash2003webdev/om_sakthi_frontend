# 🖨️ Om Sakthi Printers — Premium Printing Website

A full-featured, production-ready React website for Om Sakthi Printers, Sattur, Tamil Nadu.

---

## ✨ Features

- 🎬 **GSAP ScrollTrigger animations** — hero reveal, scroll-triggered fades, stagger effects, horizontal scroll gallery
- 🎥 **Lenis smooth scroll** — premium feel, synced with GSAP ScrollTrigger
- 🃏 **Three.js 3D invitation cards** — mouse-reactive floating cards in hero
- 🖼️ **Design gallery** with category filter + search + Design ID system
- 📱 **WhatsApp ordering** — pre-filled messages with Design IDs
- 📩 **Enquiry system** — Supabase DB + EmailJS notifications
- 🌐 **Tamil language toggle**
- 🌙 **Dark mode toggle**
- ✨ **Custom cursor** with magnetic hover
- 💎 **Glassmorphism UI** with gold gradient theme
- 🔍 **Local SEO** meta tags + JSON-LD structured data
- 📦 **Netlify / Vercel ready**

---

## 📁 Project Structure

```
om-sakthi-printers/
├── public/
├── src/
│   ├── components/
│   │   ├── Navbar.jsx          # Sticky nav with lang + theme toggles
│   │   ├── Footer.jsx          # Full footer with links + contact
│   │   ├── CustomCursor.jsx    # Gold custom cursor
│   │   ├── Loader.jsx          # Animated loading screen
│   │   ├── ThreeCards.jsx      # Three.js 3D rotating cards
│   │   ├── WhatsAppFloat.jsx   # Floating WhatsApp button
│   │   ├── DesignCard.jsx      # 3D tilt card with overlay
│   │   ├── DesignModal.jsx     # Full-screen design preview
│   │   └── EnquiryModal.jsx    # Enquiry form + WhatsApp
│   ├── pages/
│   │   ├── Home.jsx            # Full hero, stats, h-scroll, services, CTA
│   │   ├── Gallery.jsx         # Filterable grid gallery
│   │   ├── Services.jsx        # Service pages with process
│   │   ├── About.jsx           # Story, values, testimonials
│   │   └── Contact.jsx         # Form, map, quick actions
│   ├── context/
│   │   ├── LangContext.jsx     # Tamil/English toggle
│   │   └── ThemeContext.jsx    # Dark/light mode
│   ├── hooks/
│   │   ├── useAnimations.js    # GSAP hooks: reveal, stagger, parallax, h-scroll, text
│   │   └── useSmoothScroll.js  # Lenis + GSAP integration
│   ├── data/
│   │   └── index.js            # Designs catalog, services, translations
│   ├── utils/
│   │   ├── supabase.js         # Supabase client + submitEnquiry
│   │   └── email.js            # EmailJS sendEnquiryEmail
│   ├── App.jsx                 # Router + context providers + Loader
│   ├── main.jsx
│   └── index.css               # Tailwind + global styles
├── index.html                  # SEO meta + fonts + JSON-LD
├── vite.config.js
├── tailwind.config.js
├── .env.example
└── netlify.toml
```

---

## 🚀 Quick Start

### 1. Install dependencies
```bash
npm install
```

### 2. Environment setup
```bash
cp .env.example .env
# Fill in your Supabase + EmailJS credentials
```

### 3. Run dev server
```bash
npm run dev
```

### 4. Build for production
```bash
npm run build
```

---

## 🗄️ Supabase Setup

### Create project at [supabase.com](https://supabase.com)

### Run this SQL in the Supabase SQL Editor:

```sql
-- Enquiries table
create table enquiries (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  phone text not null,
  message text,
  design_id text,
  created_at timestamptz default now()
);

-- Enable Row Level Security
alter table enquiries enable row level security;

-- Allow anyone (anon) to submit an enquiry
create policy "Allow anon insert"
  on enquiries for insert
  to anon
  with check (true);

-- Only authenticated users (you) can read enquiries
create policy "Owner can read all"
  on enquiries for select
  using (auth.role() = 'authenticated');
```

### Get your credentials:
1. Go to **Project Settings → API**
2. Copy `Project URL` → `VITE_SUPABASE_URL`
3. Copy `anon public` key → `VITE_SUPABASE_ANON_KEY`

---

## 📧 EmailJS Setup

1. Sign up at [emailjs.com](https://emailjs.com) (free tier: 200 emails/month)
2. Create an **Email Service** (connect your Gmail/Outlook)
3. Create an **Email Template** with this content:

**Subject:**
```
New Enquiry from {{from_name}} — Design {{design_id}}
```

**Body:**
```
Hello Om Sakthi Printers,

You have a new printing enquiry!

━━━━━━━━━━━━━━━━━━
Name:      {{from_name}}
Phone:     {{phone}}
Design ID: {{design_id}}
━━━━━━━━━━━━━━━━━━

Message:
{{message}}

Please respond within 24 hours.
Best regards,
Om Sakthi Printers Website
```

4. Go to **Account → General** → copy your **Public Key**
5. Fill `.env`:
```
VITE_EMAILJS_SERVICE_ID=service_xxxxxxx
VITE_EMAILJS_TEMPLATE_ID=template_xxxxxxx
VITE_EMAILJS_PUBLIC_KEY=xxxxxxxxxxxxxxx
```

---

## 📸 Replacing Design Images

In `src/data/index.js`, update the `image` field for each design with your actual product photos:

```js
{
  id: 'WED-101',
  title: 'Royal Ivory Elegance',
  category: 'wedding',
  image: '/images/wedding/wed-101.jpg',  // ← Your actual photo
  ...
}
```

Place images in `/public/images/` for best performance.

**Recommended image specs:**
- Size: 600×750px (4:5 ratio)
- Format: WebP or JPG
- Quality: 80–85%
- Max file size: 150KB per image

---

## 📞 Update Business Details

In `src/data/index.js`:
```js
export const WHATSAPP_NUMBER = '919876543210' // Your actual WhatsApp number (no +)
export const SHOP_PHONE = '+91 98765 43210'   // Display phone
export const SHOP_ADDRESS = 'Your full address here'
```

In `index.html`, update the JSON-LD structured data with your real phone and address.

---

## 🌐 Deploy to Netlify

### Option A: Netlify CLI
```bash
npm install -g netlify-cli
npm run build
netlify deploy --prod --dir=dist
```

### Option B: Netlify Dashboard
1. Push to GitHub
2. Go to [netlify.com](https://netlify.com) → **New Site from Git**
3. Set build command: `npm run build`
4. Set publish directory: `dist`
5. Add environment variables in **Site Settings → Environment**
6. Deploy!

The `netlify.toml` handles React Router SPA redirects automatically.

---

## 🚀 Deploy to Vercel

```bash
npm install -g vercel
vercel --prod
```

Or connect your GitHub repo in the Vercel dashboard. Add env vars in Project Settings.

---

## 🎨 Customization

### Colors (in `tailwind.config.js` and `index.css`)
```css
:root {
  --gold: #c98810;       /* Primary gold */
  --gold-light: #e4a420; /* Lighter gold */
  --ink: #0a0705;        /* Near-black background */
  --cream: #fdf5e4;      /* Cream text */
}
```

### Fonts (in `index.html`)
- Display: `Playfair Display` — elegant headings
- Body: `DM Sans` — clean readable text
- Accent: `Cormorant Garamond` — decorative labels

### Adding new designs
Simply add to the `DESIGNS` array in `src/data/index.js`:
```js
{
  id: 'WED-107',             // Unique ID
  title: 'Design Name',
  category: 'wedding',       // 'wedding' | 'visiting' | 'banner'
  image: '/images/wed-107.webp',
  tag: 'New',                // 'Trending' | 'Featured' | 'New' | 'Popular' | ''
  description: 'Description text here.',
}
```

---

## 📊 GSAP Animation Reference

| Hook | Usage | Effect |
|------|-------|--------|
| `useReveal()` | Attach ref to any element | Fade + slide up on scroll |
| `useStagger('.selector')` | Attach ref to parent | Children stagger in |
| `useParallax(0.3)` | Attach ref to background element | Parallax scroll |
| `useHorizontalScroll()` | Attach trackRef + containerRef | Pin + horizontal scroll |
| `useTextReveal()` | Attach ref to heading | Character-by-character reveal |

---

## 💡 Production Checklist

- [ ] Replace all Unsplash images with real product photos
- [ ] Update WhatsApp number in `src/data/index.js`
- [ ] Update phone and address in `src/data/index.js`
- [ ] Fill in Supabase credentials in `.env`
- [ ] Fill in EmailJS credentials in `.env`
- [ ] Update Google Maps embed URL in `Contact.jsx`
- [ ] Update JSON-LD in `index.html` with real business details
- [ ] Add Google Analytics / Meta Pixel if needed
- [ ] Test WhatsApp links on mobile
- [ ] Test enquiry form submission
- [ ] Submit sitemap to Google Search Console

---

## 📄 License

Built for Om Sakthi Printers, Sattur, Tamil Nadu.
