# Comando App — Build iOS e App Store (executar no Mac)

O build e a publicacao iOS **nao podem** ser feitos no Windows. Use este guia em um Mac com Xcode.

## Pre-requisitos no Mac

- Xcode (App Store) + Command Line Tools
- Node.js (alinhar com o time, ex.: v22 LTS)
- Cordova CLI 12.x: `npm install -g cordova@12`
- CocoaPods: `sudo gem install cocoapods` ou `brew install cocoapods`
- Conta **Apple Developer Program** ativa
- Arquivo `GoogleService-Info.plist` na raiz de `SaleMobApp` (ver `GoogleService-Info.plist.README.md`)

## 1. Atualizar www a partir do Angular

No Windows (ou no Mac, apos clone):

```powershell
cd modern-angular-main
ng build --configuration production
xcopy /E /I /Y dist\modern-angular\browser\* ..\SaleMobApp\www\
```

## 2. Instalar dependencias e plataforma iOS

```bash
cd SaleMobApp
npm install
cordova platform add ios@8.1.0
cordova prepare ios
```

## 3. Abrir no Xcode

```bash
open platforms/ios/*.xcworkspace
```

Sempre use o `.xcworkspace`, nunca o `.xcodeproj` isolado (CocoaPods).

## 4. Signing e capabilities

No target do app:

- **Team**: sua conta Apple Developer
- **Bundle Identifier**: `com.itacolomysma.app`
- **Automatically manage signing**: ligado (inicio) ou perfis manuais para Release
- **Capabilities**: Push Notifications (Firebase), Keychain se necessario

## 5. Testar

- Simulador: Run no Xcode
- iPhone fisico: registrar UDID no Developer portal se usar perfil ad hoc

## 6. Archive e upload

1. Scheme: **Any iOS Device (arm64)**
2. **Product → Archive**
3. **Distribute App → App Store Connect**
4. Aguardar processamento no **TestFlight**

## 7. App Store Connect

- Criar app com bundle `com.itacolomysma.app` (se ainda nao existir)
- Screenshots, descricao, politica de privacidade, App Privacy
- Enviar build do TestFlight para **App Review**

## Versoes

Manter alinhado:

- `config.xml`: `version` e `ios-CFBundleVersion`
- `package.json`: `version`
- Angular `environment.prod.ts`: `appVersion`

Versao atual do widget: **1.0.5** (build **10005**).

## Troubleshooting

| Problema | Acao |
|----------|------|
| `pod install` falha | `cd platforms/ios && pod repo update && pod install` |
| Firebase iOS | Conferir `GoogleService-Info.plist` e APNs no Firebase |
| Assinatura | Revogar/regenerar certificados no developer.apple.com |
| ATS / HTTPS | API usa `https://app.comandoap.com.br` — em geral sem excecao ATS |
