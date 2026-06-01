# Firebase iOS — GoogleService-Info.plist

Este arquivo **nao** vai no Git (contem chaves do projeto Firebase).

## Passos

1. Acesse o [Firebase Console](https://console.firebase.google.com) do projeto do Comando App.
2. Adicione um app **iOS** com Bundle ID: `com.itacolomysma.app`.
3. Baixe `GoogleService-Info.plist`.
4. Copie para a raiz desta pasta: `D:\Ita\git\SaleMobApp\GoogleService-Info.plist`
5. Configure a chave **APNs** (.p8) no Firebase (Apple Developer → Keys → Apple Push Notifications).

O `config.xml` ja referencia `GoogleService-Info.plist` via `<resource-file>` na plataforma iOS.

Depois, no **Mac**:

```bash
cd SaleMobApp
cordova prepare ios
```
