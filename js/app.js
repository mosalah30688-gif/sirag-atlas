/**
 * Sirag Atlas — Main Application Router, Hijri Memory Sync & Explorer Mastery Tracker
 */
(function () {
  const STORAGE_KEY = 'sirag_atlas_progress_v1';

  class ExplorerTracker {
    constructor() {
      this.state = this.load();
    }

    load() {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) return JSON.parse(raw);
      } catch (_) {}
      return {
        stations: [],
        battles: [],
        scenarios: [],
        companions: [],
        relics: []
      };
    }

    save() {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
      } catch (_) {}
      this.renderScore();
    }

    addUnique(bucket, id) {
      if (!this.state[bucket].includes(id)) {
        this.state[bucket].push(id);
        this.save();
      } else {
        this.renderScore();
      }
    }

    markStationVisited(id) { this.addUnique('stations', id); }
    markBattleExplored(id) { this.addUnique('battles', id); }
    markScenarioSolved(id) { this.addUnique('scenarios', id); }
    markCompanionVisited(id) { this.addUnique('companions', id); }
    markRelicOpened(id) { this.addUnique('relics', id); }

    renderScore() {
      const totalPossible =
        (window.SEERAH_EVENTS?.length || 18) +
        (window.SEERAH_BATTLES?.length || 3) +
        (window.SEERAH_SCENARIOS?.length || 5) +
        (window.SEERAH_COMPANIONS?.length || 16) +
        (window.SEERAH_RELICS?.length || 6);

      const achieved =
        this.state.stations.length +
        this.state.battles.length +
        this.state.scenarios.length +
        this.state.companions.length +
        this.state.relics.length;

      const pct = Math.min(100, Math.round((achieved / totalPossible) * 100));
      const el = document.getElementById('explorer-score');
      if (el) {
        el.textContent = `${pct}% مستكشف (${achieved}/${totalPossible})`;
      }
    }
  }

  class SiragApplication {
    constructor() {
      this.currentView = 'atlas';
      this.memoryStationId = 'mutah-expedition';
    }

    init() {
      window.SiragTracker = new ExplorerTracker();

      this.initHijriSync();
      this.bindNavigation();
      this.bindAudioToggle();

      window.SiragAtlas?.init();
      window.SiragHijrahQuiz?.init();
      window.SiragBattles?.init();
      window.SiragSanctuaries?.init();
      window.SiragScenarios?.init();
      window.SiragConstellation?.init();
      window.SiragLineage?.init();
      window.SiragDiwanLexicon?.init();
      window.SiragOmni?.init();
      window.SiragMuseum?.init();
      window.SiragKhatmah?.init();

      window.SiragTracker.renderScore();
      this.bindInstallAppModal();
      this.registerPWA();
    }

    bindInstallAppModal() {
      let deferredPrompt = null;
      window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        deferredPrompt = e;
      });

      document.getElementById('install-apk-btn')?.addEventListener('click', () => {
        if (window.SiragAudio) window.SiragAudio.playClick(580);
        const modal = document.getElementById('relic-modal');
        const content = document.getElementById('relic-modal-content');
        if (!modal || !content) return;

        content.innerHTML = `
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:14px;">
            <div>
              <span class="inspector-date">📲 النسخة الاحترافية للهواتف والأجهزة اللوحية</span>
              <h3 class="inspector-title">تطبيق «سراج أطلس السيرة النبوية»</h3>
            </div>
            <button class="btn-outline" id="close-install-modal">✕ إغلاق</button>
          </div>

          <div style="display:flex; flex-direction:column; align-items:center; text-align:center; padding:18px; background:rgba(7,12,20,0.68); border:1px solid var(--border-gold); border-radius:18px; margin-bottom:16px;">
            <img src="assets/icon-512.png" alt="سراج أطلس السيرة النبوية" style="width:118px; height:118px; border-radius:26px; box-shadow:0 12px 32px rgba(212,175,55,0.35); border:2px solid var(--gold-bright); margin-bottom:12px;" />
            <strong style="font-family:var(--font-serif); font-size:1.5rem; color:var(--gold-bright);">سراج أطلس السيرة النبوية</strong>
            <span style="font-size:0.84rem; color:var(--text-secondary); margin-top:4px;">الإصدار v1.0.0 • يعمل أوفلاين بالكامل • حزمة com.sirag.atlas.seerah</span>
          </div>

          <div style="display:grid; gap:10px;">
            <a href="https://github.com/mosalah30688-gif/sirag-atlas/releases/latest/download/sirag-atlas-seerah.apk"
               target="_blank" rel="noopener" class="btn-gold" style="text-decoration:none; padding:13px 18px; font-size:0.95rem;">
              🤖 تحميل ملف الأندرويد المباشر (sirag-atlas-seerah.apk)
            </a>
            <button class="btn-outline" id="pwa-direct-install-btn" style="padding:11px 18px;">
              ⚡ تثبيت فوري كتطبيق ويب تقدّمي (PWA) على جهازك الحالي
            </button>
            <a href="https://github.com/mosalah30688-gif/sirag-atlas/releases"
               target="_blank" rel="noopener" class="btn-outline" style="text-decoration:none; text-align:center; font-size:0.82rem;">
              🔗 فتح صفحة الإصدارات الرسمية (GitHub Releases)
            </a>
          </div>
          <p id="pwa-install-hint" style="text-align:center; font-size:0.8rem; color:var(--teal-wahi); margin-top:10px;"></p>
        `;

        modal.classList.add('open');

        document.getElementById('close-install-modal')?.addEventListener('click', () => {
          modal.classList.remove('open');
        });

        document.getElementById('pwa-direct-install-btn')?.addEventListener('click', async () => {
          const hint = document.getElementById('pwa-install-hint');
          if (deferredPrompt) {
            deferredPrompt.prompt();
            await deferredPrompt.userChoice;
            deferredPrompt = null;
          } else if (hint) {
            hint.textContent = 'من قائمة المتصفح اختر «إضافة إلى الشاشة الرئيسية / Install App» ليظهر بأيقونته الذهبية الكاملة!';
          }
        });
      });
    }

    bindNavigation() {
      document.querySelectorAll('[data-view]').forEach((btn) => {
        btn.addEventListener('click', () => {
          const target = btn.getAttribute('data-view');
          this.switchView(target);
        });
      });
    }

    switchView(viewName) {
      this.currentView = viewName;
      if (window.SiragAudio) window.SiragAudio.playClick(490);

      // Stop background autoplays when switching tabs
      if (viewName !== 'atlas') window.SiragAtlas?.stopAutoPlay();
      if (viewName !== 'battles') window.SiragBattles?.stopPlay();
      if (viewName !== 'hijrah') window.SiragHijrahQuiz?.stopHijrahAuto();
      if (viewName !== 'diwan') window.SiragDiwanLexicon?.stopAudio();

      document.querySelectorAll('.view-section').forEach((sec) => {
        sec.classList.toggle('active', sec.id === `view-${viewName}`);
      });

      document.querySelectorAll('.nav-tab, .dock-btn').forEach((btn) => {
        btn.classList.toggle('active', btn.getAttribute('data-view') === viewName);
      });

      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    bindAudioToggle() {
      const btn = document.getElementById('audio-toggle-btn');
      const icon = document.getElementById('audio-icon');
      const label = document.getElementById('audio-label');
      btn?.addEventListener('click', () => {
        const on = window.SiragAudio?.toggle();
        btn.classList.toggle('active', Boolean(on));
        if (icon) icon.textContent = on ? '🔊' : '🔇';
        if (label) label.textContent = on ? 'الأجواء مفعّلة' : 'أجواء طبيعية';
      });
    }

    initHijriSync() {
      const pillText = document.getElementById('hijri-date-text');
      const memoryBadge = document.getElementById('memory-badge');
      const memoryText = document.getElementById('memory-text');
      const jumpBtn = document.getElementById('memory-jump-btn');

      let hijriMonthNum = 5;
      try {
        const now = new Date();
        const formatted = new Intl.DateTimeFormat('ar-SA-u-ca-islamic-umalqura', {
          day: 'numeric',
          month: 'long',
          year: 'numeric'
        }).format(now);
        if (pillText) pillText.textContent = formatted;

        const mNumStr = new Intl.DateTimeFormat('en-u-ca-islamic-umalqura', {
          month: 'numeric'
        }).format(now);
        const parsed = parseInt(mNumStr, 10);
        if (!isNaN(parsed) && parsed >= 1 && parsed <= 12) hijriMonthNum = parsed;
      } catch (_) {
        if (pillText) pillText.textContent = 'التقويم الهجري النبوي';
      }

      const events = window.SEERAH_EVENTS || [];
      const matched =
        events.find((e) => e.hijriMonth === hijriMonthNum) ||
        events.find((e) => e.id === 'hijrah-thawr') ||
        events[0];

      if (matched) {
        this.memoryStationId = matched.id;
        if (memoryBadge) memoryBadge.textContent = 'في مثل هذا الشهر الهجري';
        if (memoryText) {
          memoryText.textContent = `تزامن شهري: «${matched.title}» (${matched.yearLabel}) — في ${matched.locationName}`;
        }
      }

      jumpBtn?.addEventListener('click', () => {
        this.switchView('atlas');
        window.SiragAtlas?.jumpToEventById(this.memoryStationId);
      });
    }

    registerPWA() {
      if ('serviceWorker' in navigator && location.protocol.startsWith('http')) {
        navigator.serviceWorker.register('./sw.js').catch(() => {});
      }
    }
  }

  window.SiragApp = new SiragApplication();
  document.addEventListener('DOMContentLoaded', () => {
    window.SiragApp.init();
  });
})();
