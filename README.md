# 🎯 Focus-Flow: Mobile Productivity & Focus Tracker

[cite_start]Focus-Flow is a cross-platform mobile application developed with **React Native (Expo)** designed to help users maintain focus using the Pomodoro technique while tracking their digital habits[cite: 105, 109]. [cite_start]The app not only functions as a timer but also monitors distraction levels by detecting when the user leaves the application during a session[cite: 105, 158].

## ✨ Key Features
* [cite_start]**Real-time Focus Tracking:** Monitors device `AppState` to detect and record distractions if the user exits the app during a session[cite: 158, 184].
* [cite_start]**Layered Architecture:** Built using modern software principles with clear separation of Presentation, Application, and Data layers[cite: 111, 113].
* [cite_start]**Interactive UI:** Features a custom dynamic circular timer built with **React Native SVG**[cite: 158, 184].
* [cite_start]**Data Analytics:** A comprehensive reporting module that visualizes focus trends and category distributions using **Line and Pie charts**[cite: 159, 161, 162].
* [cite_start]**Local Persistence:** Uses **AsyncStorage** to securely store user sessions and personalized settings on the device[cite: 113, 158, 184].

## 🛠️ Tech Stack
* [cite_start]**Framework:** React Native (Expo) [cite: 109, 184]
* [cite_start]**State Management:** React Hooks (`useState`, `useEffect`, `useCallback`) [cite: 113]
* [cite_start]**Navigation:** React Navigation / Expo Router [cite: 113, 184]
* [cite_start]**Graphics & Visualization:** React Native SVG, React Native Chart Kit [cite: 158, 162, 184]
* [cite_start]**Storage:** @react-native-async-storage/async-storage [cite: 184]

## 📸 Screenshots & Flow
| Welcome Screen | Focus Timer | Analytics Report |
| :---: | :---: | :---: |
| ![Welcome](https://via.placeholder.com/200x400) | ![Timer](https://via.placeholder.com/200x400) | ![Report](https://via.placeholder.com/200x400) |

> [cite_start]**Note:** Replace the placeholder links above with your actual screenshot URLs from the `/assets` folder.

### Business Logic Flow
[cite_start]The application follows a strict session lifecycle to ensure accurate data tracking[cite: 164]:
1. [cite_start]User selects a category and starts the timer[cite: 167, 168, 169].
2. [cite_start]`AppState` listener monitors background/foreground changes[cite: 158, 177, 184].
3. [cite_start]On session completion, data is persisted to `AsyncStorage`[cite: 158, 160, 161].
4. [cite_start]Confetti animation triggers upon success[cite: 181, 184].

## 🚀 Getting Started
1. [cite_start]Clone the repository: `git clone https://github.com/simalecekazdal/MobilUyg` [cite: 106]
2. Install dependencies: `npm install`
3. Run the project: `npx expo start`

---
[cite_start]Developed by **Şimal Ece Kazdal** as a Mobile Application Development project[cite: 98, 101].
