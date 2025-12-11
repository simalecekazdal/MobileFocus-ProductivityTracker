import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useState } from 'react';
import { Dimensions, RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';
import { LineChart, PieChart } from 'react-native-chart-kit';

const screenWidth = Dimensions.get("window").width;

// Rastgele Motivasyon Sözleri
const quotes = [
  "Pozitif bir zihin, pozitif bir hayat yaratır! 💅",
  "Hayatta en önemli şey, kendi şansını yaratmaktır! 💅",
  "Odaklanma kraliçesisin! 👑",
  "Senin ışıltın herkese yeter! ✨",
  "Her yeni gün, yeni bir fırsat getirir! 🌸",
  "Gülümsemek, en güzel enerjidir! 😊",
  "Hayat, sen ne düşünüyorsan onu sana geri verir! 💖",
  "Bugün yine harikalar yaratıyorsun! 💖",
  "Kendine inan; bu, başarının yarısıdır! 🌟",
  "Kahveni al ve odaklan, sahne senin! ☕",
  "Başarı sana çok yakışıyor! 👑"
];

export default function ReportScreen() {
  const [stats, setStats] = useState({
    totalFocus: 0, totalSessions: 0, totalDistractions: 0, 
    worstCategory: '-', worstDay: '-', averageDistraction: 0,
    rank: 'Baby Girl 🍼', score: 0,
    userName: 'Güzellik'
  });
  
  const [chartData, setChartData] = useState({
    pieData: [], 
    lineData: { labels: [], datasets: [{ data: [] }] } 
  });
  
  const [quote, setQuote] = useState(quotes[0]);
  const [refreshing, setRefreshing] = useState(false);

  useFocusEffect(useCallback(() => { 
      loadData(); 
      setQuote(quotes[Math.floor(Math.random() * quotes.length)]); 
  }, []));

  const loadData = async () => {
    try {
      const storedName = await AsyncStorage.getItem('userName');
      const jsonValue = await AsyncStorage.getItem('sessions');
      const sessions = jsonValue != null ? JSON.parse(jsonValue) : [];
      
      calculateStats(sessions, storedName || 'Güzellik');
    } catch (e) { console.error(e); }
  };

  const calculateStats = (sessions, name) => {
    let totalFocus = 0; let totalDistractions = 0;
    const catDurationCounts = {}; 
    const catDistractionCounts = {}; 
    
    const last7Days = Array(7).fill(0);
    const dayLabels = [];
    const today = new Date();
    
    for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(today.getDate() - i);
        const dayName = d.toLocaleDateString('tr-TR', { weekday: 'short' });
        dayLabels.push(dayName);
    }

    sessions.forEach(session => {
      totalFocus += session.duration; 
      totalDistractions += session.distractions;
      
      catDurationCounts[session.category] = (catDurationCounts[session.category] || 0) + session.duration;
      catDistractionCounts[session.category] = (catDistractionCounts[session.category] || 0) + session.distractions;

      const sessionDate = new Date(session.date);
      const diffTime = Math.abs(today - sessionDate);
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays < 7) {
          last7Days[6 - diffDays] += session.duration; 
      }
    });

    let worstCategory = '-'; let maxDistractionVal = 0;
    Object.keys(catDistractionCounts).forEach(key => {
        if (catDistractionCounts[key] > maxDistractionVal) { maxDistractionVal = catDistractionCounts[key]; worstCategory = key; }
    });

    const averageDistraction = sessions.length > 0 ? (totalDistractions / sessions.length).toFixed(1) : 0;

    // --- PUAN HESAPLAMA (GÜNCELLENDİ) ---
    // Dakika başına 10 Puan!
    let score = (totalFocus * 10) - (totalDistractions * 10);
    if (score < 0) score = 0;
    
    let rank = 'Baby Girl 🍼';
    if (score > 100) rank = 'Prenses 🎀';
    if (score > 500) rank = 'Queen 👑';
    if (score > 1000) rank = 'Goddess 🧚‍♀️';

    const pieChartData = Object.keys(catDurationCounts).map((key, index) => {
        const pastelColors = ['#FF9AA2', '#FFB7B2', '#FFDAC1', '#E2F0CB', '#B5EAD7', '#C7CEEA'];
        return {
            name: key, population: catDurationCounts[key],
            color: pastelColors[index % pastelColors.length],
            legendFontColor: "#D81B60", legendFontSize: 12
        };
    });

    setStats({ 
        totalFocus, totalSessions: sessions.length, totalDistractions, 
        worstCategory, averageDistraction, rank, score, userName: name 
    });
    
    setChartData({ 
        pieData: pieChartData, 
        lineData: {
            labels: dayLabels,
            datasets: [{ data: last7Days }]
        }
    });
  };

  return (
    <ScrollView style={styles.container} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={loadData} />}>
      
      <View style={styles.headerContainer}>
        <Text style={styles.mainHeader}>✨ {stats.userName}'nin Işıltısı ✨</Text>
        <Text style={styles.subHeader}>Haftalık Raporun Hazır!</Text>
        <View style={styles.quoteBox}>
            <Text style={styles.quoteText}>"{quote}"</Text>
        </View>
      </View>

      <View style={styles.rankCard}>
        <View>
            <Text style={styles.rankLabel}>Şu Anki Seviyen</Text>
            <Text style={styles.rankTitle}>{stats.rank}</Text>
        </View>
        <View style={styles.scoreCircle}>
            <Text style={styles.scoreText}>{stats.score}</Text>
            <Text style={styles.scoreLabel}>Puan</Text>
        </View>
      </View>

      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>💖 Verimlilik Özeti</Text>
        <View style={styles.statsRow}>
            <View style={[styles.statBox, {backgroundColor: '#FFF0F5'}]}>
                <Ionicons name="time" size={24} color="#FF69B4" />
                <Text style={styles.statValue}>{stats.totalFocus} dk</Text>
                <Text style={styles.statLabel}>Toplam Odak</Text>
            </View>
            <View style={[styles.statBox, {backgroundColor: '#F0FFF4'}]}>
                <Ionicons name="checkmark-circle" size={24} color="#98FB98" />
                <Text style={styles.statValue}>{stats.totalSessions}</Text>
                <Text style={styles.statLabel}>Seans</Text>
            </View>
            <View style={[styles.statBox, {backgroundColor: '#FFF5E6'}]}>
                <Ionicons name="alert-circle" size={24} color="#FFB347" />
                <Text style={styles.statValue}>{stats.totalDistractions}</Text>
                <Text style={styles.statLabel}>Kaçamak</Text>
            </View>
        </View>
      </View>

      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>📈 Yükseliş Trendin</Text>
        <Text style={styles.subTitle}>Harika gidiyorsun {stats.userName}! İşte grafiğin:</Text>
        
        {chartData.lineData.datasets[0].data.length > 0 && (
            <LineChart
                data={chartData.lineData}
                width={screenWidth - 60}
                height={220}
                yAxisLabel=""
                yAxisSuffix=" dk"
                chartConfig={{
                backgroundColor: "#fff",
                backgroundGradientFrom: "#fff",
                backgroundGradientTo: "#fff",
                decimalPlaces: 0,
                color: (opacity = 1) => `rgba(255, 105, 180, ${opacity})`, 
                labelColor: (opacity = 1) => `rgba(136, 136, 136, ${opacity})`,
                style: { borderRadius: 16 },
                propsForDots: { r: "6", strokeWidth: "2", stroke: "#ffa726" }
                }}
                bezier 
                style={styles.chart}
            />
        )}
      </View>

      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>🍰 Neye Vakit Harcadın?</Text>
        {chartData.pieData.length > 0 ? (
          <PieChart 
            data={chartData.pieData} 
            width={screenWidth - 60} 
            height={200} 
            chartConfig={chartConfig} 
            accessor={"population"} 
            backgroundColor={"transparent"} 
            paddingLeft={"15"} 
            absolute 
          />
        ) : <Text style={styles.noData}>Henüz veri yok tatlım. 🌸</Text>}
      </View>

      <View style={[styles.sectionContainer, {borderColor: '#FFB7B2', borderWidth: 1}]}>
        <Text style={[styles.sectionTitle, {color: '#E57373'}]}>🧿 Nazar Boncuğu Raporu</Text>
        <View style={styles.detailRow}>
             <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>En Çok Gözün Kaydığı</Text>
                <Text style={styles.detailValue}>{stats.worstCategory}</Text>
            </View>
            <View style={styles.separator} />
            <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Ortalama Kaçamak</Text>
                <Text style={styles.detailValue}>{stats.averageDistraction}</Text>
            </View>
        </View>
        <Text style={styles.adviceText}>
            {stats.averageDistraction > 2 
            ? `Biraz daha dikkatli olalım mı ${stats.userName}? Telefonu uzağa koy! 📵` 
            : `Harika gidiyorsun ${stats.userName}, kimse odağını bozamaz! 💅`}
        </Text>
      </View>

      <View style={{height: 50}} />
    </ScrollView>
  );
}

const chartConfig = {
  backgroundGradientFrom: "#fff", backgroundGradientTo: "#fff",
  color: (opacity = 1) => `rgba(216, 27, 96, ${opacity})`,
  strokeWidth: 2, barPercentage: 0.7, decimalPlaces: 0,
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF5F7' },
  headerContainer: { marginTop: 50, marginBottom: 20, paddingHorizontal: 20 },
  mainHeader: { fontSize: 26, fontWeight: 'bold', color: '#D81B60', textAlign: 'center' },
  subHeader: { fontSize: 14, color: '#FF69B4', textAlign: 'center', marginBottom: 15 },
  quoteBox: { backgroundColor: '#fff', padding: 15, borderRadius: 20, alignItems: 'center', shadowColor: "#FF69B4", shadowOpacity: 0.2, elevation: 3 },
  quoteText: { fontSize: 14, fontStyle: 'italic', color: '#888', textAlign: 'center' },
  
  rankCard: { 
      flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
      backgroundColor: '#FF69B4', marginHorizontal: 20, marginBottom: 20, 
      padding: 20, borderRadius: 25, shadowColor: "#000", shadowOpacity: 0.3, elevation: 8 
  },
  rankLabel: { color: 'rgba(255,255,255,0.8)', fontSize: 12, fontWeight: 'bold' },
  rankTitle: { color: '#fff', fontSize: 22, fontWeight: 'bold' },
  scoreCircle: { width: 60, height: 60, borderRadius: 30, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center' },
  scoreText: { color: '#FF69B4', fontWeight: 'bold', fontSize: 18 },
  scoreLabel: { color: '#FF69B4', fontSize: 10 },

  sectionContainer: {
    backgroundColor: '#fff', marginHorizontal: 20, marginBottom: 20, padding: 20, borderRadius: 25,
    shadowColor: "#FFB6C1", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 5, elevation: 4,
  },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 15, color: '#C71585' },
  subTitle: { fontSize: 12, color: 'gray', marginBottom: 10, marginTop: -10 },
  
  statsRow: { flexDirection: 'row', justifyContent: 'space-between' },
  statBox: { width: '30%', padding: 10, borderRadius: 15, alignItems: 'center', justifyContent: 'center' },
  statValue: { fontSize: 16, fontWeight: 'bold', color: '#555', marginTop: 5 },
  statLabel: { fontSize: 10, color: '#888' },

  detailRow: { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', marginBottom: 15 },
  detailItem: { alignItems: 'center', flex: 1 },
  detailLabel: { fontSize: 12, color: '#888', marginBottom: 5 },
  detailValue: { fontSize: 16, fontWeight: 'bold', color: '#E57373' },
  separator: { width: 1, height: '100%', backgroundColor: '#FFCDD2' },
  adviceText: { textAlign: 'center', color: '#888', fontStyle: 'italic', fontSize: 13, marginTop: 5 },

  chart: { marginVertical: 8, borderRadius: 16 },
  noData: { textAlign: 'center', color: '#FFB6C1', marginVertical: 20, fontStyle: 'italic' }
});