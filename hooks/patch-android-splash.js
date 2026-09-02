#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');

function patchThemesXml(file) {
  if (!fs.existsSync(file)) {
    return;
  }

  let xml = fs.readFileSync(file, 'utf8');
  const original = xml;

  if (!xml.includes('@drawable/splash_fullscreen')) {
    xml = xml.replace(
      /(<style name="Theme\.App\.SplashScreen"[^>]*>)/,
      '$1\n        <item name="android:windowBackground">@drawable/splash_fullscreen</item>'
    );
    xml = xml.replace(
      /(<style name="Theme\.Cordova\.App\.DayNight"[^>]*>)/,
      '$1\n        <item name="android:windowBackground">@drawable/splash_fullscreen</item>'
    );
  }

  if (xml !== original) {
    fs.writeFileSync(file, xml, 'utf8');
    console.log('[patch-android-splash] temas atualizados:', file);
    return;
  }

  console.log('[patch-android-splash] temas ja atualizados:', file);
}

function copySplashAsset(root, srcName, destRel) {
  const src = path.join(root, 'res', 'splash', srcName);
  const dest = path.join(root, 'platforms', 'android', 'app', 'src', 'main', 'res', destRel);
  if (!fs.existsSync(src)) {
    console.log('[patch-android-splash] origem ausente:', src);
    return;
  }
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.copyFileSync(src, dest);
}

function patchAndroidSplash(ctx) {
  const root = (ctx && ctx.opts && ctx.opts.projectRoot) || process.cwd();
  const themes = path.join(
    root,
    'platforms',
    'android',
    'app',
    'src',
    'main',
    'res',
    'values',
    'cdv_themes.xml'
  );

  patchThemesXml(themes);
  copySplashAsset(root, 'splash_fullscreen.png', path.join('drawable-nodpi', 'splash_fullscreen.png'));
  copySplashAsset(root, 'ic_splash.png', path.join('drawable-nodpi', 'ic_cdv_splashscreen.png'));
}

module.exports = patchAndroidSplash;

if (require.main === module) {
  patchAndroidSplash({ opts: { projectRoot: process.cwd() } });
}
