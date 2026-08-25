#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');

function walk(dir, acc, fileName) {
  if (!dir || !fs.existsSync(dir)) {
    return acc;
  }
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(full, acc, fileName);
    } else if (entry.name === fileName) {
      acc.push(full);
    }
  }
  return acc;
}

function collect(root, fileName) {
  const files = [];
  walk(path.join(root, 'node_modules', 'cordova-plugin-fingerprint-aio'), files, fileName);
  walk(path.join(root, 'plugins', 'cordova-plugin-fingerprint-aio'), files, fileName);
  walk(path.join(root, 'platforms', 'ios'), files, fileName);
  walk(path.join(root, 'platforms', 'android'), files, fileName);
  return [...new Set(files)];
}

function patchSwift(content) {
  let next = content;
  let changed = false;

  const oldSwitch = `switch(authenticationContext.biometryType) {
                case .none:
                    biometryType = "none";
                case .touchID:
                    biometryType = "finger";
                case .faceID:
                    biometryType = "face"
                @unknown default:
                    errorResponse["message"] = "Unkown biometry type"
                }`;

  const newSwitch = `switch(authenticationContext.biometryType) {
                case .touchID:
                    biometryType = "finger";
                case .faceID:
                    biometryType = "face"
                default:
                    biometryType = "biometric"
                }`;

  if (next.includes(oldSwitch)) {
    next = next.replace(oldSwitch, newSwitch);
    changed = true;
  }

  const oldLoad = `        let query: [String: Any] = [kSecClass as String: kSecClassGenericPassword,
                                    kSecAttrAccount as String: Secret.keyName,
                                    kSecMatchLimit as String: kSecMatchLimitOne,
                                    kSecReturnData as String : kCFBooleanTrue,
                                    kSecAttrAccessControl as String: getBioSecAccessControl(invalidateOnEnrollment: true),
                                    kSecUseOperationPrompt as String: prompt]`;

  const newLoad = `        let context = LAContext()
        context.localizedReason = prompt
        let query: [String: Any] = [kSecClass as String: kSecClassGenericPassword,
                                    kSecAttrAccount as String: Secret.keyName,
                                    kSecMatchLimit as String: kSecMatchLimitOne,
                                    kSecReturnData as String : kCFBooleanTrue,
                                    kSecUseAuthenticationContext as String: context]`;

  if (next.includes(oldLoad)) {
    next = next.replace(oldLoad, newLoad);
    changed = true;
  }

  return { next, changed };
}

function patchAndroid(content) {
  let next = content;
  let changed = false;

  if (!next.includes('import androidx.biometric.BiometricManager;')
      && next.includes('import androidx.biometric.BiometricPrompt;')) {
    next = next.replace(
      'import androidx.biometric.BiometricPrompt;',
      'import androidx.biometric.BiometricManager;\nimport androidx.biometric.BiometricPrompt;'
    );
    changed = true;
  }

  const oldPrompt = `        } else {
            promptInfoBuilder.setNegativeButtonText(mPromptInfo.getCancelButtonTitle());
        }
        return promptInfoBuilder.build();`;

  const newPrompt = `        } else {
            promptInfoBuilder.setNegativeButtonText(mPromptInfo.getCancelButtonTitle());
            if (mPromptInfo.getType() == BiometricActivityType.JUST_AUTHENTICATE) {
                promptInfoBuilder.setAllowedAuthenticators(
                        BiometricManager.Authenticators.BIOMETRIC_STRONG
                                | BiometricManager.Authenticators.BIOMETRIC_WEAK);
            }
        }
        return promptInfoBuilder.build();`;

  if (next.includes(oldPrompt)) {
    next = next.replace(oldPrompt, newPrompt);
    changed = true;
  }

  return { next, changed };
}

function applyPatch(files, patchFn, label) {
  if (files.length === 0) {
    console.log(`[patch-fingerprint] ${label} nao encontrado (ok se o prepare ainda nao rodou).`);
    return;
  }
  for (const file of files) {
    const original = fs.readFileSync(file, 'utf8');
    const { next, changed } = patchFn(original);
    if (!changed) {
      console.log('[patch-fingerprint] ja atualizado:', file);
      continue;
    }
    fs.writeFileSync(file, next, 'utf8');
    console.log('[patch-fingerprint] patch aplicado:', file);
  }
}

function patchFingerprint(ctx) {
  const root = (ctx && ctx.opts && ctx.opts.projectRoot) || process.cwd();
  applyPatch(collect(root, 'Fingerprint.swift'), patchSwift, 'Fingerprint.swift');
  applyPatch(collect(root, 'BiometricActivity.java'), patchAndroid, 'BiometricActivity.java');
}

module.exports = patchFingerprint;

if (require.main === module) {
  patchFingerprint({ opts: { projectRoot: process.cwd() } });
}
