#!/usr/bin/env bash
# ==============================================================================
# Build Sirag-Atlas-Lite-x86_64.AppImage (Lightweight Portable Linux AppImage)
# Bundles all offline assets, Arabic poems, icons, and a smart native Linux
# AppRun launcher (~9 MB standalone AppImage!).
# ==============================================================================
set -e

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT_DIR"

bash scripts/build-www.sh

APPDIR="$ROOT_DIR/dist/SiragAtlasLite.AppDir"
rm -rf "$APPDIR"
mkdir -p "$APPDIR/usr/share/sirag-atlas"
mkdir -p "$APPDIR/usr/share/applications"
mkdir -p "$APPDIR/usr/share/metainfo"
mkdir -p "$APPDIR/usr/share/icons/hicolor/512x512/apps"
mkdir -p "$APPDIR/usr/share/icons/hicolor/256x256/apps"
mkdir -p "$APPDIR/usr/share/icons/hicolor/128x128/apps"

cp -r www/* "$APPDIR/usr/share/sirag-atlas/"
cp desktop/icons/512x512.png "$APPDIR/sirag-atlas-seerah.png"
cp desktop/icons/512x512.png "$APPDIR/.DirIcon"
cp desktop/icons/512x512.png "$APPDIR/usr/share/icons/hicolor/512x512/apps/sirag-atlas-seerah.png"
cp desktop/icons/256x256.png "$APPDIR/usr/share/icons/hicolor/256x256/apps/sirag-atlas-seerah.png"
cp desktop/icons/128x128.png "$APPDIR/usr/share/icons/hicolor/128x128/apps/sirag-atlas-seerah.png"
cp desktop/linux/com.sirag.atlas.seerah.desktop "$APPDIR/com.sirag.atlas.seerah.desktop"
cp desktop/linux/com.sirag.atlas.seerah.desktop "$APPDIR/usr/share/applications/com.sirag.atlas.seerah.desktop"
cp desktop/linux/com.sirag.atlas.seerah.appdata.xml "$APPDIR/usr/share/metainfo/com.sirag.atlas.seerah.appdata.xml"

cat > "$APPDIR/AppRun" << 'APPRUN_EOF'
#!/usr/bin/env bash
set -e
HERE="$(dirname "$(readlink -f "${0}")")"
WEB_ROOT="$HERE/usr/share/sirag-atlas"

exec python3 - "$WEB_ROOT" << 'PY_EOF'
import sys, os, socket, threading, subprocess, shutil, time, webbrowser
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer

web_root = sys.argv[1]
os.chdir(web_root)

class QuietHandler(SimpleHTTPRequestHandler):
    def log_message(self, format, *args):
        pass

sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
sock.bind(("127.0.0.1", 0))
port = sock.getsockname()[1]
sock.close()

server = ThreadingHTTPServer(("127.0.0.1", port), QuietHandler)
t = threading.Thread(target=server.serve_forever, daemon=True)
t.start()

url = f"http://127.0.0.1:{port}/index.html"

# 1. Try native GTK WebKit window if PyGObject + WebKit2 are installed on the Linux distro
try:
    import gi
    gi.require_version("Gtk", "3.0")
    try:
        gi.require_version("WebKit2", "4.1")
    except ValueError:
        gi.require_version("WebKit2", "4.0")
    from gi.repository import Gtk, WebKit2, GdkPixbuf

    win = Gtk.Window(title="سراج أطلس السيرة النبوية ﷺ")
    win.set_default_size(1360, 860)
    icon_file = os.path.join(web_root, "assets", "icon-512.png")
    if os.path.exists(icon_file):
        win.set_icon_from_file(icon_file)

    webview = WebKit2.WebView()
    settings = webview.get_settings()
    settings.set_enable_webgl(True)
    settings.set_enable_webaudio(True)
    settings.set_enable_smooth_scrolling(True)

    def on_decide_policy(view, decision, decision_type):
        if decision_type == WebKit2.PolicyDecisionType.NAVIGATION_ACTION or decision_type == WebKit2.PolicyDecisionType.NEW_WINDOW_ACTION:
            nav = decision.get_navigation_action()
            uri = nav.get_request().get_uri()
            if uri and not uri.startswith(f"http://127.0.0.1:{port}"):
                webbrowser.open(uri)
                decision.ignore()
                return True
        return False

    webview.connect("decide-policy", on_decide_policy)
    webview.load_uri(url)
    win.add(webview)
    win.connect("destroy", Gtk.main_quit)
    win.show_all()
    Gtk.main()
    sys.exit(0)
except Exception:
    pass

# 2. Fallback: Dedicated App-Mode window using any installed Chromium/Brave/Edge/Chrome browser
app_browsers = [
    "google-chrome", "google-chrome-stable", "chromium", "chromium-browser",
    "brave-browser", "microsoft-edge", "vivaldi"
]
proc = None
for b in app_browsers:
    exe = shutil.which(b)
    if exe:
        import tempfile
        prof = tempfile.mkdtemp(prefix="sirag-atlas-")
        proc = subprocess.Popen([
            exe, f"--app={url}", f"--user-data-dir={prof}",
            "--window-size=1360,860", "--no-first-run", "--no-default-browser-check"
        ])
        proc.wait()
        shutil.rmtree(prof, ignore_errors=True)
        sys.exit(0)

# 3. Universal browser fallback (Firefox / xdg-open) — keep local server alive while user explores
print(f"🕌 سراج أطلس السيرة النبوية يعمل الآن على: {url}")
print("اضغط Ctrl+C لإغلاق الخادم المحلي عند الانتهاء.")
webbrowser.open(url)
try:
    while True:
        time.sleep(1)
except KeyboardInterrupt:
    pass
PY_EOF
APPRUN_EOF

chmod +x "$APPDIR/AppRun"

mkdir -p "$ROOT_DIR/dist"
APPIMAGETOOL="$ROOT_DIR/dist/appimagetool-x86_64.AppImage"
if [ ! -f "$APPIMAGETOOL" ]; then
  curl -sSL -o "$APPIMAGETOOL" \
    "https://github.com/AppImage/appimagetool/releases/download/continuous/appimagetool-x86_64.AppImage"
  chmod +x "$APPIMAGETOOL"
fi

ARCH=x86_64 "$APPIMAGETOOL" --appimage-extract-and-run --no-appstream "$APPDIR" \
  "$ROOT_DIR/dist/Sirag-Atlas-Lite-x86_64.AppImage"

chmod +x "$ROOT_DIR/dist/Sirag-Atlas-Lite-x86_64.AppImage"
echo "✅ Built dist/Sirag-Atlas-Lite-x86_64.AppImage successfully!"
