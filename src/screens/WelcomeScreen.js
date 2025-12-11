import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert, Dimensions } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import ConfettiCannon from 'react-native-confetti-cannon';

const { width } = Dimensions.get('window');

const allCategories = [
  '🎀 Ders', '💻 Kodlama', '📚 Kitap', '🧘‍♀️ Yoga', 
  '💅 Bakım', '🎨 Sanat', '🧹 Temizlik', '🍳 Yemek', 
  '🗣️ Dil', '🎬 Film', '💼 İş', '🎸 Müzik', 
  '🛒 Alışveriş', '✍️ Yazı'
];

export default function WelcomeScreen({ navigation }) {
  const [name, setName] = useState('');
  const [selectedCats, setSelectedCats] = useState([]);
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    checkExistingUser();
  }, []);

  const checkExistingUser = async () => {
    try {
      // Sadece aktif oturum var mı diye bakıyoruz
      const savedName = await AsyncStorage.getItem('userName');
      if (savedName) {
        navigation.replace('MainApp');
      }
    } catch (e) {
      console.error(e);
    }
  };

  const toggleCategory = (cat) => {
    if (selectedCats.includes(cat)) {
      setSelectedCats(selectedCats.filter(c => c !== cat));
    } else {
      setSelectedCats([...selectedCats, cat]);
    }
  };

  const handleSave = async () => {
    if (name.trim() === '' || selectedCats.length === 0) {
      Alert.alert("Eksik Bilgi Aşko 🥺", "Lütfen adını yaz ve en az bir kategori seç.");
      return;
    }

    try {
      // --- YENİ MANTIK BURADA ---
      // 1. En son giriş yapan kişinin adını kontrol et
      const lastUser = await AsyncStorage.getItem('lastSessionUser');
      
      // 2. Eğer daha önce biri girdiyse VE şu an giren kişi farklıysa:
      if (lastUser && lastUser !== name) {
          // Eski kullanıcının raporlarını temizle
          await AsyncStorage.removeItem('sessions');
          console.log("Kullanıcı değiştiği için raporlar sıfırlandı.");
      }

      // 3. Yeni verileri kaydet
      await AsyncStorage.setItem('userName', name); // Aktif oturum
      await AsyncStorage.setItem('lastSessionUser', name); // Geçmiş kontrolü için
      await AsyncStorage.setItem('userCategories', JSON.stringify(selectedCats));
      
      setShowConfetti(true);
      
      setTimeout(() => {
        navigation.replace('MainApp');
      }, 1500);
      
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <View style={styles.container}>
      {showConfetti && <ConfettiCannon count={200} origin={{x: width/2, y: 0}} fadeOut={true} />}
      
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.header}>✨ Merhaba Güzelim ✨</Text>
        <Text style={styles.subHeader}>Seni daha yakından tanıyalım!</Text>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Adın Ne?</Text>
          <TextInput
            style={styles.input}
            placeholder="İsmini buraya yaz prenses..."
            placeholderTextColor="#FFB6C1"
            value={name}
            onChangeText={setName}
          />
        </View>

        <View style={styles.catSection}>
          <Text style={styles.label}>Nelerle İlgileniyorsun?</Text>
          <Text style={styles.subLabel}>(Ana sayfada sadece bunlar görünecek)</Text>
          
          <View style={styles.catGrid}>
            {allCategories.map((cat) => (
              <TouchableOpacity
                key={cat}
                style={[styles.catButton, selectedCats.includes(cat) && styles.selectedCat]}
                onPress={() => toggleCategory(cat)}
              >
                <Text style={[styles.catText, selectedCats.includes(cat) && styles.selectedCatText]}>
                  {cat}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Başlayalım 💖</Text>
          <Ionicons name="arrow-forward" size={24} color="#fff" />
        </TouchableOpacity>
      
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF0F5', paddingTop: 60 },
  scrollContent: { paddingHorizontal: 20, paddingBottom: 50, alignItems: 'center' },
  header: { fontSize: 32, fontWeight: 'bold', color: '#D81B60', marginBottom: 10 },
  subHeader: { fontSize: 16, color: '#C71585', marginBottom: 40 },
  inputContainer: { width: '100%', marginBottom: 30 },
  label: { fontSize: 18, fontWeight: 'bold', color: '#D81B60', marginBottom: 10, alignSelf: 'flex-start' },
  subLabel: { fontSize: 12, color: '#FF69B4', marginBottom: 15, alignSelf: 'flex-start' },
  input: { 
    backgroundColor: '#fff', width: '100%', padding: 15, borderRadius: 20, 
    borderWidth: 1, borderColor: '#FFB6C1', fontSize: 16, color: '#D81B60',
    shadowColor: "#FF69B4", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, elevation: 2
  },
  catSection: { width: '100%', marginBottom: 40 },
  catGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center' },
  catButton: {
    paddingVertical: 10, paddingHorizontal: 15, borderRadius: 25,
    borderWidth: 1, borderColor: '#FFB6C1', margin: 5, backgroundColor: '#fff',
  },
  selectedCat: { backgroundColor: '#FF69B4', borderColor: '#FF69B4' },
  catText: { color: '#FF69B4', fontWeight: '600' },
  selectedCatText: { color: '#fff', fontWeight: 'bold' },
  saveButton: {
    backgroundColor: '#D81B60', flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    paddingVertical: 15, paddingHorizontal: 40, borderRadius: 30,
    shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, elevation: 5
  },
  saveButtonText: { color: '#fff', fontSize: 18, fontWeight: 'bold', marginRight: 10 }
});