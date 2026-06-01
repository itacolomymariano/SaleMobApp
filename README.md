# SaleMobApp — Comando App (Cordova)

Shell nativo **Android** e **iOS** do [Comando App](https://github.com/itacolomymariano/modern-angular-main) (Angular).

- **Bundle ID:** `com.itacolomysma.app`
- **Versão:** 1.0.5 (build 10005)

## Repositórios

| Projeto | GitHub |
|---------|--------|
| Frontend Angular | [modern-angular-main](https://github.com/itacolomymariano/modern-angular-main) |
| Cordova (este repo) | [SaleMobApp](https://github.com/itacolomymariano/SaleMobApp) |

## Build local

### Android (Windows)

Ver regra em `modern-angular-main/.cursor/rules/mobile-build-install.mdc`.

### iOS (Mac)

Ver [docs/IOS_BUILD_MAC.md](docs/IOS_BUILD_MAC.md).

### iOS (GitHub Actions)

O workflow está em `modern-angular-main` — [docs/IOS_GITHUB_ACTIONS.md](https://github.com/itacolomymariano/modern-angular-main/blob/main/docs/IOS_GITHUB_ACTIONS.md).

## Firebase

- Android: `google-services.json`
- iOS: substituir `GoogleService-Info.plist` pelo arquivo do Firebase Console (ver `GoogleService-Info.plist.README.md`)
