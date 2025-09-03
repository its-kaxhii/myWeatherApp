import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { getWeatherIcon } from '../utils/weatherIcons';

const WeatherCard = ({ weather, isCelsius, onToggleUnit }) => {
  if (!weather) return null;

  const temperature = isCelsius 
    ? Math.round(weather.temperature)
    : Math.round((weather.temperature * 9/5) + 32);

  const feelsLike = isCelsius 
    ? Math.round(weather.feelsLike)
    : Math.round((weather.feelsLike * 9/5) + 32);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.city}>{weather.city}</Text>
        <Text style={styles.country}>{weather.country}</Text>
      </View>

      <View style={styles.mainWeather}>
        <MaterialCommunityIcons
          name={getWeatherIcon(weather.condition)}
          size={120}
          color="#fff"
        />
        <TouchableOpacity onPress={onToggleUnit}>
          <Text style={styles.temperature}>
            {temperature}°{isCelsius ? 'C' : 'F'}
          </Text>
        </TouchableOpacity>
        <Text style={styles.condition}>{weather.condition}</Text>
        <Text style={styles.feelsLike}>
          Feels like {feelsLike}°{isCelsius ? 'C' : 'F'}
        </Text>
      </View>

      <View style={styles.details}>
        <View style={styles.detailItem}>
          <MaterialCommunityIcons name="water-percent" size={24} color="#fff" />
          <Text style={styles.detailLabel}>Humidity</Text>
          <Text style={styles.detailValue}>{weather.humidity}%</Text>
        </View>

        <View style={styles.detailItem}>
          <MaterialCommunityIcons name="weather-windy" size={24} color="#fff" />
          <Text style={styles.detailLabel}>Wind</Text>
          <Text style={styles.detailValue}>{weather.windSpeed} km/h</Text>
        </View>

        <View style={styles.detailItem}>
          <MaterialCommunityIcons name="gauge" size={24} color="#fff" />
          <Text style={styles.detailLabel}>Pressure</Text>
          <Text style={styles.detailValue}>{weather.pressure} hPa</Text>
        </View>

        <View style={styles.detailItem}>
          <MaterialCommunityIcons name="eye" size={24} color="#fff" />
          <Text style={styles.detailLabel}>Visibility</Text>
          <Text style={styles.detailValue}>{weather.visibility} km</Text>
        </View>
      </View>

      <View style={styles.sunTimes}>
        <View style={styles.sunItem}>
          <MaterialCommunityIcons name="weather-sunset-up" size={24} color="#fff" />
          <Text style={styles.sunLabel}>Sunrise</Text>
          <Text style={styles.sunTime}>{weather.sunrise}</Text>
        </View>
        <View style={styles.sunItem}>
          <MaterialCommunityIcons name="weather-sunset-down" size={24} color="#fff" />
          <Text style={styles.sunLabel}>Sunset</Text>
          <Text style={styles.sunTime}>{weather.sunset}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 20,
    padding: 20,
    marginVertical: 10,
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  city: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
  },
  country: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 5,
  },
  mainWeather: {
    alignItems: 'center',
    marginBottom: 30,
  },
  temperature: {
    fontSize: 64,
    fontWeight: '300',
    color: '#fff',
    marginVertical: 10,
  },
  condition: {
    fontSize: 20,
    color: '#fff',
    textTransform: 'capitalize',
    marginBottom: 5,
  },
  feelsLike: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  details: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  detailItem: {
    width: '48%',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
    marginBottom: 10,
  },
  detailLabel: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 12,
    marginTop: 5,
  },
  detailValue: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 2,
  },
  sunTimes: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  sunItem: {
    alignItems: 'center',
  },
  sunLabel: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 12,
    marginTop: 5,
  },
  sunTime: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 2,
  },
});

export default WeatherCard;