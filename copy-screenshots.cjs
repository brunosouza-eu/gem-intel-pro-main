// Run: node copy-screenshots.cjs
const fs = require('fs');
const path = require('path');

const src = String.raw`C:\Users\Windows\.gemini\antigravity\brain\7caa25c8-fa22-43dd-b87d-a48f30de5902`;
const dst = path.join(__dirname, 'public', 'screenshots');
fs.mkdirSync(dst, { recursive: true });

const map = {
    'radar_1772659023380.png': 'radar.png',
    'trademaster_1772659050280.png': 'trademaster.png',
    'sniper_1772659076774.png': 'sniper.png',
    'alertas_1772659101354.png': 'alertas.png',
    'chat_1772659122496.png': 'chat.png',
    'autopilot_1772659146094.png': 'autopilot.png',
};

Object.entries(map).forEach(([s, d]) => {
    try {
        fs.copyFileSync(path.join(src, s), path.join(dst, d));
        console.log('OK ' + d);
    } catch (e) { console.log('FAIL ' + d + ': ' + e.message); }
});
console.log('Done! Screenshots are in public/screenshots/');
