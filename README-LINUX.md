# 🐧 سراج أطلس السيرة النبوية ﷺ — نسخة سطح المكتب لنظام لينكس (Linux AppImage)

نسخة مكتبية فخمة ومستقلة بالكامل لنظام **Linux (`x86_64`)** بصيغة **`.AppImage`** تعمل مباشرة على جميع توزيعات لينكس (Ubuntu, Debian, Linux Mint, Fedora, Arch, Manjaro, Kali, Zorin, Pop!_OS) **بدون تثبيت وبدون إنترنت**.

---

## 🚀 أولاً: التشغيل الفوري لملف الـ AppImage الجاهز

بعد تنزيل ملف `Sirag-Atlas-Seerah-x86_64.AppImage` (النسخة الكاملة المستقلة بـ Electron) أو `Sirag-Atlas-Lite-x86_64.AppImage` (النسخة المحمولة فائقة الخفة ~9 MB):

```bash
chmod +x Sirag-Atlas-Seerah-x86_64.AppImage
./Sirag-Atlas-Seerah-x86_64.AppImage
```

> **ملاحظة لتوزيعات Ubuntu 22.04 / 24.04 الحديثة:** إذا لم تكن مكتبة `libfuse2` مثبتة لتشغيل حزم AppImage عموماً، يمكنك تثبيتها بأمر واحد:
> `sudo apt install libfuse2t64` (أو `sudo apt install libfuse2`)، أو تشغيل الملف مباشرة بدون FUSE عبر:
> `./Sirag-Atlas-Seerah-x86_64.AppImage --appimage-extract-and-run`

---

## 🛠️ ثانياً: البناء من السورس مباشرة (Build from Source)

يحتوي المستودع على السورس الكامل لبناء تطبيق سطح مكتب لينكس في مجلد `desktop/`:

- `desktop/main.js` — العملية الرئيسية لتطبيق سطح المكتب (نافذة ملكية داكنة، خادم استماع محلي فائق السرعة يدعم تدفق الصوتيات، قوائم عربية أصيلة، واختصارات لوحة مفاتيح).
- `desktop/preload.js` — الجسر الآمن المعزول (`ContextBridge`) لربط الواجهة بسطح المكتب.
- `desktop/icons/` — حزمة أيقونات لينكس القياسية (`16x16` حتى `512x512`).
- `desktop/linux/` — ملفات تكامل سطح المكتب القياسية (`com.sirag.atlas.seerah.desktop` و `appdata.xml`).

### 1. تشغيل السورس مباشرة للتطوير والمعاينة على لينكس:
```bash
npm install
npm run desktop:start
```

### 2. توليد ملف الـ AppImage المستقل الكامل (Electron):
```bash
npm install
npm run linux:appimage
# الناتج: dist/Sirag-Atlas-Seerah-x86_64.AppImage
```

### 3. توليد ملف الـ AppImage الخفيف المحمول (~9 MB):
```bash
npm run linux:lite
# الناتج: dist/Sirag-Atlas-Lite-x86_64.AppImage
```

---

## ⌨️ اختصارات لوحة المفاتيح في نسخة سطح المكتب

| الاختصار | الوظيفة |
|---|---|
| `Ctrl + K` | فتح البحث الفوري الشامل والمحفوظات |
| `Ctrl + ,` | فتح مركز الإعدادات والتحديث المباشر من المستودع |
| `F11` | التبديل إلى وضع ملء الشاشة الملكي |
| `Alt + 1 .. 9` | التنقل الفوري بين أقسام السيرة النبوية |
| `Ctrl + +` / `Ctrl + -` | تكبير وتصغير العرض |
| `Alt` | إظهار/إخفاء شريط القوائم العربي العلوي |

---

**✨ تم التطوير بواسطة محمد صلاح عبد الخالق**
- الموقع الرسمي: https://elkatebmohamadsalah.blogspot.com/?m=1#google_vignette
- المستودع الرسمي: https://github.com/mosalah30688-gif/sirag-atlas
