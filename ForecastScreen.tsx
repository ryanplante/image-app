import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useFonts, Inter_400Regular } from '@expo-google-fonts/inter';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome'; // Import FontAwesome icon

const Tab = createBottomTabNavigator();

const ForecastScreen = ({ data }) => {
  const [fontsLoaded] = useFonts({
    Inter_400Regular,
  });

  if (!data || !fontsLoaded) {
    return (
      <View style={styles.container}>
        <Text>Loading forecast data...</Text>
      </View>
    );
  }

  const forecastDays = data.forecast.forecastday;

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tab.Screen
        name="3 Day Forecast"
        component={ForecastTab}
        initialParams={{ data: forecastDays.slice(0, 3) }}
        options={{
          tabBarBadge: 3,
          tabBarIcon: ({ color, size }) => (
            <FontAwesomeIcon name="sun-o" color={color} size={size} /> // Use FontAwesome sunny icon
          ),
        }}
      />
      <Tab.Screen
        name="7 Day Forecast"
        component={ForecastTab}
        initialParams={{ data: forecastDays }}
        options={{
          tabBarBadge: 7,
          tabBarIcon: ({ color, size }) => (
            <FontAwesomeIcon name="sun-o" color={color} size={size} /> // Use FontAwesome sunny icon
          ),
        }}
      />
    </Tab.Navigator>
  );
};

const ForecastTab = ({ route }) => {
  const { data } = route.params;
  const screenWidth = Dimensions.get('window').width;
  const forecastDayWidth = screenWidth * 0.5; // Set each forecast indice to 50% of the screen width

  return (
    <LinearGradient colors={['#B4E1FF', '#1E2A4A']} style={styles.container}>
      <ScrollView horizontal contentContainerStyle={[styles.scrollContent, { alignItems: 'center' }]}>
        {data.map((day) => {
          const date = new Date(day.date);
          console.log(date);
          date.setDate(date.getDate() + 1); // Add 1 day
          const dayOfWeek = date.toLocaleString('en-US', { weekday: 'long' }).split(',')[0];
          return (
            <View key={day.date_epoch} style={[styles.forecastDay, { width: forecastDayWidth }]}>
              <Text style={styles.date}>{dayOfWeek}</Text>
              <Image source={{ uri: `https:${day.day.condition.icon}` }} style={styles.weatherIcon} />
              <Text style={styles.condition}>{day.day.condition.text}</Text>
              <Text style={styles.temp}>High: {day.day.maxtemp_f}°F</Text>
              <Text style={styles.temp}>Low: {day.day.mintemp_f}°F</Text>
              <Text style={styles.infoText}>Precipitation: {day.day.totalprecip_in} in</Text>
              <Text style={styles.infoText}>Humidity: {day.day.avghumidity}%</Text>
              <Text style={styles.infoText}>UV Index: {day.day.uv}</Text>
              <Text style={styles.infoText}>Max Wind Speed: {day.day.maxwind_mph} mph</Text>
              <Text style={styles.infoText}>Avg Visibility: {day.day.avgvis_miles} miles</Text>
            </View>
          );
        })}
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    flexDirection: 'row', // Scroll horizontally
  },
  forecastDay: {
    padding: 10,
    marginRight: 10,
    borderWidth: 1,
    borderColor: 'lightgray',
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 10,
  },
  date: {
    fontFamily: 'Inter_400Regular',
    fontSize: 18,
    marginBottom: 5,
    color: 'white',
  },
  weatherIcon: {
    width: 50,
    height: 50,
    marginTop: 5,
  },
  temp: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    color: 'white',
  },
  condition: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 5,
    color: 'white',
  },
  infoText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    color: 'white',
    marginBottom: 2,
  },
});

export default ForecastScreen;
