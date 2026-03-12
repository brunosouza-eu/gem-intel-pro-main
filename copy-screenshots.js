// Script to copy screenshots to public directory
const fs = require('fs');
const path = require('path');

const srcDir = 'C:\\Users\\Windows\\.gemini\\antigravity\\brain\\7caa25c8-fa22-43dd-b87d-a48f30de5902';
const destDir = path.join(__dirname, 'public', 'screenshots');

// Create directory
fs.mkdirSync(destDir, { recursive: true });

const files = {
    'tool_radar_1772658466038.png': 'radar.png',
    'tool_trademaster_1772658482794.png': 'trademaster.png',
    'tool_sniper_1772658499262.png': 'sniper.png',
    'tool_alertas_1772658516992.png': 'alertas.png',
    'tool_chat_1772658530189.png': 'chat.png',
    'autopilot_screenshot_1772656787705.png': 'autopilot.png',
};

for (const [src, dest] of Object.entries(files)) {
    const srcPath = path.join(srcDir, src);
    const destPath = path.join(destDir, dest);
    try {
        fs.copyFileSync(srcPath, destPath);
        console.log(`✅ Copied ${dest}`);
    } catch (err) {
        console.log(`❌ Failed ${dest}: ${err.message}`);
    }
}
console.log('Done!');
