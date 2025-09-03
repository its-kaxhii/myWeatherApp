 import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  StatusBar,
  ScrollView,
  Alert,
  RefreshControl,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Location from 'expo-location';

import WeatherCard from '../components/WeatherCard';
import SearchBar from '../components/SearchBar';
import LoadingSpinner from '../components/LoadingSpinner';
import { getCurrentWeather, getForecast } from '../services/weatherService';

export default function App() {
  const [currentWeather, setCurrentWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [isCelsius, setIsCelsius] = useState(true);

  useEffect(() => {
    loadWeatherData();
  }, []);

  const loadWeatherData = async () => {
    try {
      setLoading(true);
      
      // Request location permission
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission denied', 'Location permission is required for weather data');
        return;
      }

      // Get current location
      const location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;

      // Fetch weather data
      const [weather, forecastData] = await Promise.all([
        getCurrentWeather(latitude, longitude),
        getForecast(latitude, longitude)
      ]);

      setCurrentWeather(weather);
      setForecast(forecastData);
    } catch (error) {
      Alert.alert('Error', 'Failed to load weather data');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const searchWeather = async (city) => {
    try {
      setLoading(true);
      const [weather, forecastData] = await Promise.all([
        getCurrentWeather(null, null, city),
        getForecast(null, null, city)
      ]);
      setCurrentWeather(weather);
      setForecast(forecastData);
    } catch (error) {
      Alert.alert('Error', 'City not found or failed to load weather data');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadWeatherData();
    setRefreshing(false);
  };

  const toggleTemperatureUnit = () => {
    setIsCelsius(!isCelsius);
  };

  const getGradientColors = () => {
    if (!currentWeather) return ['#4c669f', '#3b5998', '#192f6a'];
    
    const temp = isCelsius ? currentWeather.temperature : (currentWeather.temperature * 9/5) + 32;
    const condition = currentWeather.condition.toLowerCase();

    if (condition.includes('rain') || condition.includes('storm')) {
      return ['#373B44', '#4286f4', '#73A4F6'];
    } else if (condition.includes('cloud')) {
      return ['#83a4d4', '#b6fbff'];
    } else if (condition.includes('snow')) {
      return ['#E6DADA', '#274046'];
    } else if (temp > (isCelsius ? 25 : 77)) {
      return ['#FF7300', '#FEF253'];
    } else {
      return ['#4c669f', '#3b5998', '#192f6a'];
    }
  };

  if (loading && !currentWeather) {
    return (
      <LinearGradient colors={['#4c669f', '#3b5998', '#192f6a']} style={styles.container}>
        <SafeAreaView style={styles.safeArea}>
          <LoadingSpinner />
        </SafeAreaView>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient colors={getGradientColors()} style={styles.container}>
      <StatusBar barStyle="light-content" />
      <SafeAreaView style={styles.safeArea}>
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#fff" />
          }
        >
          <SearchBar onSearch={searchWeather} />
          
          {loading ? (
            <LoadingSpinner />
          ) : (
            <>
              <WeatherCard
                weather={currentWeather}
                isCelsius={isCelsius}
                onToggleUnit={toggleTemperatureUnit}
              />
              
              <View style={styles.forecastContainer}>
                <Text style={styles.forecastTitle}>5-Day Forecast</Text>
                {forecast.map((day, index) => (
                  <View key={index} style={styles.forecastItem}>
                    <Text style={styles.forecastDay}>{day.day}</Text>
                    <Text style={styles.forecastCondition}>{day.condition}</Text>
                    <Text style={styles.forecastTemp}>
                      {isCelsius 
                        ? `${Math.round(day.high)}° / ${Math.round(day.low)}°`
                        : `${Math.round(day.high * 9/5 + 32)}° / ${Math.round(day.low * 9/5 + 32)}°`
                      }
                    </Text>
                  </View>
                ))}
              </View>
            </>
          )}
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 20,
  },
  forecastContainer: {
    marginTop: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 15,
    padding: 20,
  },
  forecastTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 15,
    textAlign: 'center',
  },
  forecastItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.2)',
  },
  forecastDay: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
    flex: 1,
  },
  forecastCondition: {
    color: '#fff',
    fontSize: 14,
    flex: 2,
    textAlign: 'center',
  },
  forecastTemp: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'right',
  },
});