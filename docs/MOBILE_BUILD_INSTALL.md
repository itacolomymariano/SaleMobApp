# Mobile Build And Install — Comando App

## Angular (Windows ou Mac)

```powershell
cd D:\Ita\git\angular_moderno\modern-angular-main
ng build --configuration production
xcopy /E /I /Y dist\modern-angular\browser\* D:\Ita\git\SaleMobApp\www\
```

## Android (Windows)

```powershell
adb devices
cd D:\Ita\git\SaleMobApp
cordova run android --device
```

## iOS (apenas Mac)

Ver [IOS_BUILD_MAC.md](./IOS_BUILD_MAC.md).

Bundle: `com.itacolomysma.app` | Versao: **1.0.5** (build 10005)
