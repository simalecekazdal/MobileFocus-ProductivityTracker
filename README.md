Focus Timer App (Odaklanma Zamanlayıcısı)
Bu proje, kullanıcıların Pomodoro tekniği veya özel süreler belirleyerek görevlerine odaklanmalarını sağlamak, dikkat dağınıklıklarını kaydetmek ve verimliliklerini takip etmek amacıyla React Native (Expo) ile geliştirilmiş bir mobil odaklanma uygulamasıdır.

Projeyi Çalıştırma Rehberi
Bu talimatlar, projeyi yerel makinenizde geliştirme modunda çalıştırmanıza yardımcı olacaktır.

1. Ön Koşullar
Projeyi çalıştırabilmek için sisteminizde aşağıdaki yazılımların kurulu olması gerekmektedir:

Node.js (LTS Sürümü Önerilir): Node.js resmi web sitesinden indirilebilir.

npm (Node.js ile birlikte gelir) veya Yarn (Tercih edilir).

Expo Go Mobil Uygulaması: iOS veya Android cihazınızda test etmek için Apple App Store veya Google Play Store'dan indirilmelidir.

Bir Kod Düzenleyici: (VS Code önerilir).

2. Kurulum Adımları
A. Depoyu Klonlama
Öncelikle projenin kaynak kodunu yerel makinenize klonlayın:

Bash

git clone https://github.com/simalecekazdal/MobilUyg
cd focus-timer-app
B. Bağımlılıkları Yükleme
Projenin ihtiyaç duyduğu tüm paketleri (bağımlılıkları) yükleyin.

Eğer npm kullanıyorsanız:

Bash

npm install
Eğer yarn kullanıyorsanız:

Bash

yarn install
C. Uyumlu Paket Sürümlerini Kontrol Etme (Önemli)
Daha önce gördüğünüz uyarıları gidermek ve en iyi uyumluluğu sağlamak için Expo'nun otomatik düzeltme komutunu çalıştırın:

Bash

npx expo install --fix
3. Uygulamayı Başlatma
Kurulum tamamlandıktan sonra, geliştirme sunucusunu (Metro Bundler) başlatabilirsiniz:

Bash

npx expo start
# veya
npm start
Bu komutu çalıştırdığınızda, terminalde bir QR Kod içeren bir menü açılacaktır.

4. Geliştirme Ortamında Görüntüleme
Uygulamayı görüntülemek için 3 seçeneğiniz vardır:

A. Mobil Cihazda (Önerilen Yöntem)
Akıllı telefonunuzda Expo Go uygulamasını açın.

Uygulama içinde veya telefonunuzun kamerasıyla terminalde gördüğünüz QR kodu taratın.

Uygulama otomatik olarak cihazınıza yüklenecek ve çalışacaktır.

B. Web Tarayıcısında
Terminal menüsünde w tuşuna basın.

Uygulama, web tarayıcınızda açılacaktır. (Not: Bazı mobil özellikler web'de doğru çalışmayabilir, örneğin AppState.)

C. Simülatör/Emülatörde
Terminal menüsünde i tuşuna basarak iOS Simülatöründe veya a tuşuna basarak Android Emülatöründe uygulamayı çalıştırabilirsiniz (Bu, Xcode veya Android Studio'nun kurulu olmasını gerektirir).

Temel Proje Yapısı
Proje, temiz bir yapı sağlamak için aşağıdaki ana dosya ve klasörleri kullanır:

focus-timer-app/
├── components/           # Yeniden kullanılabilir küçük UI bileşenleri (Oluşturulursa)
├── screens/              # Uygulamanın ana ekranları (HomeScreen, ReportScreen vb.)
│   ├── HomeScreen.js     # Zamanlayıcı mantığı ve UI
│   └── ReportScreen.js   # İstatistik hesaplama ve grafikler
├── hooks/                # Özel React Hook'ları (Örn: useTimer) (Oluşturulursa)
├── node_modules/         # Yüklü bağımlılıklar
├── app.json              # Expo yapılandırma dosyası
├── package.json          # Proje bağımlılıkları ve scriptler
└── README.md             # Bu dosya