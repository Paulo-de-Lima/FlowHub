import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();

const patches = [
  {
    file: 'node_modules/expo-router/build/views/Toast.js',
    replacements: [
      [
        "warning && (0, jsx_runtime_1.jsx)(react_native_1.Image, { source: require('expo-router/assets/error.png'), style: styles.icon })",
        "warning && (0, jsx_runtime_1.jsx)(react_native_1.Image, { source: require('expo-router/assets/error.png'), resizeMode: \"contain\", style: styles.icon })",
      ],
      ["icon: { width: 20, height: 20, resizeMode: 'contain' }", 'icon: { width: 20, height: 20 }'],
    ],
  },
  {
    file: 'node_modules/expo-router/build/views/Unmatched.js',
    replacements: [
      [
        "return (0, jsx_runtime_1.jsx)(react_native_1.Image, { source: require('expo-router/assets/unmatched.png'), style: styles.image });",
        "return (0, jsx_runtime_1.jsx)(react_native_1.Image, { source: require('expo-router/assets/unmatched.png'), resizeMode: \"contain\", style: styles.image });",
      ],
      [
        "        resizeMode: 'contain',\n        marginBottom: 28,",
        '        marginBottom: 28,',
      ],
    ],
  },
  {
    file: 'node_modules/expo-router/build/views/Sitemap.js',
    replacements: [
      [
        '    image: { width: 24, height: 24, resizeMode: \'contain\', opacity: 0.6 },',
        '    image: { width: 24, height: 24, opacity: 0.6 },',
      ],
      [
        'return (0, jsx_runtime_1.jsx)(react_native_1.Image, { style: styles.image, source:',
        'return (0, jsx_runtime_1.jsx)(react_native_1.Image, { resizeMode: "contain", style: styles.image, source:',
      ],
      [
        'return ((0, jsx_runtime_1.jsx)(react_native_1.Image, { style: [',
        'return ((0, jsx_runtime_1.jsx)(react_native_1.Image, { resizeMode: "contain", style: [',
      ],
    ],
  },
];

let changed = 0;

for (const patch of patches) {
  const target = path.join(root, patch.file);
  if (!fs.existsSync(target)) {
    console.warn(`[patch-expo-router-image] skip missing ${patch.file}`);
    continue;
  }

  let content = fs.readFileSync(target, 'utf8');
  let fileChanged = false;

  for (const [from, to] of patch.replacements) {
    if (content.includes(from)) {
      content = content.replaceAll(from, to);
      fileChanged = true;
    }
  }

  if (fileChanged) {
    fs.writeFileSync(target, content);
    changed++;
    console.log(`[patch-expo-router-image] patched ${patch.file}`);
  }
}

if (changed === 0) {
  console.log('[patch-expo-router-image] already patched or expo-router layout changed');
}
