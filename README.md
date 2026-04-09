<div align="center">
  <br />
  <h1>📦 ThingBox</h1>
  <p><strong>A Modern, Web-Based Laboratory & Workshop Inventory Management System</strong></p>
  
  ![Next.js](https://img.shields.io/badge/next.js-%23000000.svg?style=for-the-badge&logo=next.js&logoColor=white)
  ![Prisma](https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white)
  ![SQLite](https://img.shields.io/badge/sqlite-%2307405e.svg?style=for-the-badge&logo=sqlite&logoColor=white)
  <br />
  <p>English | <a href="#tr">Türkçe</a></p>
</div>

<br />

ThingBox is a fast, lightweight, and modern open-source inventory management system designed specifically for electronics labs, maker workshops, university labs, and engineering teams. With its clean glassmorphism UI and fast API, it helps you effortlessly track your electronics components, fixtures, tools, and project-based material consumptions.

## ✨ Features

- 🗄️ **Hierarchical Locations & Categories:** Infinite nesting capabilities (e.g., *Electronics Cabinet > Second Drawer > Left Box*).
- 🔧 **Fixture & Tool Tracking:** Monitor your permanent tools, devices, their models, serial numbers, and physical locations.
- 🔋 **Consumable Materials:** Track components, sensors, and stock counts.
- 🎯 **Project Management Lifecycle:** Transfer raw materials to temporary projects, monitor quantities used purely in the field, return remaining components to the depot, or permanently send them to the "Consumption Archive".
- 📜 **Detailed Audit Logs:** Auto-generated footprint logging for every CRUD operation (who, what, and where).
- 🆔 **Unique Hash IDs:** Auto-generated, highly readable, printable short IDs for every hardware piece (`#A1B2E3`) to pair with physical labeling.
- ⚡ **Modern Stack:** React 19, Next.js App Router, Prisma ORM, and custom CSS variables for ultra-fast rendering with zero bloated UI frameworks.

## 🚀 Quick Start

### Prerequisites
- Node.js (v18+)

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/ThingBox.git
cd ThingBox
```

2. Install dependencies
```bash
npm install
```

3. Database Setup (SQLite by default)
```bash
npx prisma generate
npx prisma db push
```

4. Start the Application
```bash
npm run dev
```
Visit `http://localhost:3000` to start using your local ThingBox. Enjoy!

---

<div id="tr"></div>

# 📦 ThingBox (Türkçe)
**Atölye ve Laboratuvarlar İçin Modern Envanter Yönetim Sistemi**

ThingBox; elektronik atölyeleri, maker laboratuvarları, üniversiteler ve mühendislik takımları için özel olarak tasarlanmış olan, çok hızlı ve açık kaynaklı bir depo ve envanter yönetim web sistemidir. Modern arayüzü sayesinde ekipmanlarınızı, projelerinizi ve sarf malzemelerinizi sıkılmadan kontrol edebilirsiniz.

## ✨ Özellikler

- 🗄️ **Hiyerarşik Konum ve Kategori Altyapısı:** Birbirinin altına yerleşebilen sonsuz ağaçlı alt konum/kategori desteği. (Örn: *Malzeme Dolabı > 2. Çekmece > Mavi Kutu*).
- 🔧 **Demirbaş Takibi:** Sürekli olarak atölyede kalacak aletleri, cihazları, bulundukları konumu, detayı ve modeliyle kayıt altında tutabilme.
- 🔋 **Sarf Malzemesi Kaydı:** Depodaki dirençler, elektronik kartlar ve aklınıza gelecek her türlü bölünebilir malzemenin tam stok kontrolü.
- 🎯 **Proje Yaşam Döngüsü:** Stoktaki malzemeleri kullanım amacıyla devam eden bir Projeye aktarma. Daha sonrasında kullanılmayan ürünleri "Depoya İade Etme" veya kullanılanları kalıcı olarak "Sarf Edildi (Tüketildi)" konumuyla Arşiv paneline gönderme.
- 📜 **Tarihçe ve Log:** Sistem üzerindeki tüm stok eklentileri, cihaz düzenlemeleri ve silmeleri anlık olarak arka planda loglanır.
- 🆔 **Özel Barkod/Kimlik Yapısı:** Sisteme giren tüm lokasyon, cihaz ve malzemelere otomatik oluşturulan şifreli ve temiz ID etiketleri (Örn: `#A1B2E3`). (Fiziksel barkodlarla birleştirilebilir).

## 🚀 Başlarken

ThingBox, kendi başına veya yerel bir ağda (Localhost) çalışmak için ekstra hiçbir zahmet gerektirmeyecek şekilde SQLite altyapısıyla çalışır.

Projeyi bilgisayarınıza klonlayın ve klasöre girin:
```bash
git clone https://github.com/yourusername/ThingBox.git
cd ThingBox
```

Gerekli Node paketlerini indirin:
```bash
npm install
```

Prisma veritabanı şemasını uygulayıp motoru çalıştırın:
```bash
npx prisma generate
npx prisma db push
```

Projeyi ayağa kaldırın:
```bash
npm run dev
```
Uygulamayı tarayıcınızda `http://localhost:3000` üzerinden deneyimleyebilirsiniz! Gelişmeye açık bu repo için "Issue" veya "Pull Request" göndermekten çekinmeyin.
