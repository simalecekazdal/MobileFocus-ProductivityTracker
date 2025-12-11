import React, { useState, useEffect, useRef, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, AppState, Alert, ScrollView, Dimensions, Platform } from 'react-native'; // Platform eklendi
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import Svg, { Circle } from 'react-native-svg';
import ConfettiCannon from 'react-native-confetti-cannon';
import { useFocusEffect, useNavigation } from '@react-navigation/native'; 

const { width } = Dimensions.get('window');
const circleSize = 250;
const strokeWidth = 15;
const radius = (circleSize - strokeWidth) / 2;
const circumference = radius * 2 * Math.PI;

export default function HomeScreen() {
  const navigation = useNavigation();

  const [initialTime, setInitialTime] = useState(25 * 60); 
  const [timeLeft, setTimeLeft] = useState(25 * 60); 
  const [isActive, setIsActive] = useState(false);   
  const [distractionCount, setDistractionCount] = useState(0); 
  const [showConfetti, setShowConfetti] = useState(false);
  const [userName, setUserName] = useState('Aşko'); 
  const [categories, setCategories] = useState(['🎀 Ders']); 
  const [category, setCategory] = useState('🎀 Ders'); 

  const appState = useRef(AppState.currentState);

  useFocusEffect(
    useCallback(() => {
      loadUserData();
    }, [])
  );

  const loadUserData = async () => {
    try {
      const name = await AsyncStorage.getItem('userName');
      const cats = await AsyncStorage.getItem('userCategories');
      if (name) setUserName(name);
      if (cats) {
        const parsedCats = JSON.parse(cats);
        setCategories(parsedCats);
        if (!parsedCats.includes(category) && parsedCats.length > 0) {
            setCategory(parsedCats[0]);
        }
      }
    } catch (e) { console.error("Veri yükleme hatası:", e); }
  };

  // --- ÇIKIŞ VE SİLME İŞLEMİ (ORTAK FONKSİYON) ---
  const performLogout = async () => {
    try {
        await AsyncStorage.clear(); // Her şeyi sil
        navigation.reset({
            index: 0,
            routes: [{ name: 'Welcome' }], // Girişe at
        });
    } catch (e) {
        console.error("Çıkış hatası:", e);
    }
  };

  // --- PLATFORMA GÖRE ÇIKIŞ BUTONU ---
  const handleLogout = () => {
    if (Platform.OS === 'web') {
        // WEB İÇİN BASİT ONAY (Tarayıcı bunu anlar)
        if (window.confirm("Tüm verilerin silinecek ve çıkış yapılacak. Emin misin?")) {
            performLogout();
        }
    } else {
        // MOBİL İÇİN HAVALI UYARI
        Alert.alert(
          "Sıfırla ve Çıkış Yap 🚪",
          "Tüm verilerin (isim, raporlar, ayarlar) silinecek ve başa döneceksin. Emin misin?",
          [
            { text: "Vazgeç", style: "cancel" },
            { 
              text: "Evet, Sil ve Çık", 
              style: 'destructive', 
              onPress: performLogout
            }
          ]
        );
    }
  };

  const progress = timeLeft / initialTime; 
  const validProgress = initialTime > 0 ? progress : 0;
  const strokeDashoffset = circumference * (1 - validProgress);

  const increaseTime = () => {
    if (isActive) return;
    if (initialTime < 25 * 60) { setInitialTime(25 * 60); setTimeLeft(25 * 60); } 
    else { const newTime = initialTime + (25 * 60); setInitialTime(newTime); setTimeLeft(newTime); }
  };

  const decreaseTime = () => {
    if (isActive) return; 
    if (initialTime > 25 * 60) { const newTime = initialTime - (25 * 60); setInitialTime(newTime); setTimeLeft(newTime); } 
    else { setInitialTime(5); setTimeLeft(5); }
  };

  useEffect(() => {
    let interval = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => { setTimeLeft((time) => time - 1); }, 1000);
    } else if (timeLeft === 0 && isActive) {
      setIsActive(false); triggerConfetti();
      Alert.alert("MÜKEMMELSİN! 💖🎉", `Bu seansı başarıyla tamamladın!\nKategori: ${category}\nKaçamak: ${distractionCount}`, [{ text: "Harikayım 💅" }]);
      saveSession(); 
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextAppState => {
      if (appState.current.match(/active/) && nextAppState.match(/inactive|background/)) {
        if (isActive) { setIsActive(false); setDistractionCount((prev) => prev + 1); Alert.alert("Nereye Gittin? 🥺", "Dikkatini topla tatlım, sayaç durdu."); }
      }
      appState.current = nextAppState;
    });
    return () => subscription.remove();
  }, [isActive]);

  const triggerConfetti = () => { setShowConfetti(true); setTimeout(() => setShowConfetti(false), 5000); };

  const saveSession = async () => {
    try {
      const cleanCategory = category.replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F700}-\u{1F77F}\u{1F780}-\u{1F7FF}\u{1F800}-\u{1F8FF}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, '').trim();
      const durationInMins = Math.ceil(initialTime / 60);
      const newSession = { id: Date.now(), date: new Date().toISOString(), duration: durationInMins, category: cleanCategory || category, distractions: distractionCount };
      const existingData = await AsyncStorage.getItem('sessions');
      const sessions = existingData ? JSON.parse(existingData) : [];
      sessions.push(newSession);
      await AsyncStorage.setItem('sessions', JSON.stringify(sessions));
    } catch (error) { console.error("Kaydetme hatası:", error); }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handleStart = () => { if (timeLeft === 0) { setTimeLeft(initialTime); setShowConfetti(false); } setIsActive(true); };
  const handlePause = () => { setIsActive(false); setDistractionCount((prev) => prev + 1); Alert.alert("Mola Verdik ☕", "Ama bu bir dikkat eksikliği sayıldı."); };
  const handleReset = () => { setIsActive(false); setTimeLeft(initialTime); setDistractionCount(0); setShowConfetti(false); };

  return (
    <View style={styles.container}>
      {showConfetti && ( <ConfettiCannon count={200} origin={{x: width / 2, y: -10}} colors={['#FF69B4', '#FFB6C1', '#FFC0CB', '#FFD700', '#FFF']} fadeOut={true} /> )}

      <View style={styles.topBar}>
        <View style={{flex:1}}>
            <Text style={styles.greetingText}>✨ Hoş geldin,</Text>
            <Text style={styles.userNameText}>{userName}! ✨</Text>
        </View>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout} activeOpacity={0.7}>
            <Ionicons name="log-out-outline" size={24} color="#D81B60" />
            <Text style={styles.logoutText}>Çıkış</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.categoryContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.scrollContainer}>
            {categories.map((cat) => (
                <TouchableOpacity key={cat} style={[styles.catButton, category === cat && styles.selectedCat]} onPress={() => !isActive && setCategory(cat)}>
                    <Text style={[styles.catText, category === cat && styles.selectedCatText]}>{cat}</Text>
                </TouchableOpacity>
            ))}
        </ScrollView>
      </View>

      <View style={styles.timerWrapper}>
        <Svg width={circleSize} height={circleSize} style={styles.svg}>
            <Circle cx={circleSize / 2} cy={circleSize / 2} r={radius} stroke="#FFE4E1" strokeWidth={strokeWidth} fill="none" />
            <Circle cx={circleSize / 2} cy={circleSize / 2} r={radius} stroke="#FF69B4" strokeWidth={strokeWidth} fill="none" strokeDasharray={`${circumference} ${circumference}`} strokeDashoffset={strokeDashoffset} strokeLinecap="round" transform={`rotate(-90 ${circleSize / 2} ${circleSize / 2})`} />
        </Svg>
        <View style={styles.timerTextContainer}>
            <Text style={styles.timer}>{formatTime(timeLeft)}</Text>
            <Text style={styles.status}>{isActive ? 'Odaklanılıyor... 💖' : (timeLeft === 0 ? 'Tamamlandı! 🎉' : 'Hazır mısın? 🌸')}</Text>
        </View>
      </View>

      <View style={styles.adjustContainer}>
        <TouchableOpacity style={styles.adjustButton} onPress={decreaseTime} disabled={isActive}><Ionicons name="remove" size={24} color="#FF69B4" /></TouchableOpacity>
        <Text style={styles.adjustText}>Süre Ayarla</Text>
        <TouchableOpacity style={styles.adjustButton} onPress={increaseTime} disabled={isActive}><Ionicons name="add" size={24} color="#FF69B4" /></TouchableOpacity>
      </View>

      <View style={styles.statsContainer}>
         <Text style={styles.statText}>Dikkat Kaçamakları: {distractionCount} 🙈</Text>
      </View>

      <View style={styles.controls}>
        {!isActive ? (
          <TouchableOpacity style={[styles.button, styles.buttonStart]} onPress={handleStart}><Ionicons name="play" size={24} color="#fff" /><Text style={styles.buttonText}>Başlat</Text></TouchableOpacity>
        ) : (
          <TouchableOpacity style={[styles.button, styles.buttonPause]} onPress={handlePause}><Ionicons name="pause" size={24} color="#fff" /><Text style={styles.buttonText}>Duraklat</Text></TouchableOpacity>
        )}
        <TouchableOpacity style={[styles.button, styles.buttonReset]} onPress={handleReset}><Ionicons name="refresh" size={24} color="#FF69B4" /><Text style={[styles.buttonText, {color: '#FF69B4'}]}>Sıfırla</Text></TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 50, backgroundColor: '#FFF0F5', alignItems: 'center' },
  topBar: { flexDirection: 'row', width: '100%', paddingHorizontal: 20, marginBottom: 15, alignItems: 'center', justifyContent: 'space-between' },
  greetingText: { fontSize: 16, color: '#D81B60', fontStyle: 'italic' },
  userNameText: { fontSize: 24, fontWeight: 'bold', color: '#D81B60' },
  logoutButton: { alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff', paddingVertical: 8, paddingHorizontal: 12, borderRadius: 15, elevation: 3, shadowColor: "#FF69B4", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, zIndex: 10 },
  logoutText: { fontSize: 10, color: '#D81B60', fontWeight: 'bold', marginTop: 2 },
  categoryContainer: { height: 60, marginBottom: 10 },
  scrollContainer: { paddingHorizontal: 10 },
  catButton: { paddingVertical: 10, paddingHorizontal: 20, borderRadius: 30, borderWidth: 1, borderColor: '#FFB6C1', marginHorizontal: 5, backgroundColor: '#fff', height: 45, justifyContent: 'center', shadowColor: "#FF69B4", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, elevation: 3 },
  selectedCat: { backgroundColor: '#FF69B4', borderColor: '#FF69B4' },
  catText: { color: '#FF69B4', fontWeight: '600' },
  selectedCatText: { color: '#fff', fontWeight: 'bold' },
  timerWrapper: { width: circleSize, height: circleSize, justifyContent: 'center', alignItems: 'center', marginBottom: 10, position: 'relative' },
  svg: { position: 'absolute', top: 0, left: 0, shadowColor: "#FF69B4", shadowOffset: { width: 0, height: 5 }, shadowOpacity: 0.3, shadowRadius: 10, elevation: 10 },
  timerTextContainer: { justifyContent: 'center', alignItems: 'center', backgroundColor: '#FFC0CB', width: circleSize - strokeWidth * 2 - 10, height: circleSize - strokeWidth * 2 - 10, borderRadius: (circleSize - strokeWidth * 2 - 10) / 2 },
  timer: { fontSize: 50, fontWeight: 'bold', color: '#fff' },
  status: { fontSize: 16, color: '#fff', marginTop: 5, fontWeight: '600' },
  adjustContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: 20, backgroundColor: '#fff', padding: 5, borderRadius: 25, borderWidth: 1, borderColor: '#FFB6C1', width: 200 },
  adjustButton: { padding: 5, backgroundColor: '#FFF0F5', borderRadius: 20 },
  adjustText: { marginHorizontal: 15, color: '#D81B60', fontWeight: 'bold', fontSize: 14 },
  statsContainer: { marginBottom: 30 },
  statText: { fontSize: 18, color: '#C71585', fontWeight: 'bold' },
  controls: { flexDirection: 'row', width: '80%', justifyContent: 'space-between' },
  button: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 15, paddingHorizontal: 25, borderRadius: 30, minWidth: 120, shadowColor: "#000", shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.2, elevation: 5 },
  buttonStart: { backgroundColor: '#FF69B4' },
  buttonPause: { backgroundColor: '#FFB6C1' },
  buttonReset: { backgroundColor: '#fff', borderWidth: 2, borderColor: '#FF69B4' },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold', marginLeft: 8 },
});