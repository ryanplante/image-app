import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Vibration, Button } from 'react-native';
import { Accelerometer } from 'expo-sensors';
import * as Battery from 'expo-battery';

const ShakeToCharge = () => {
  const [batteryLevel, setBatteryLevel] = useState<number>(-1);
  const [batteryColor, setBatteryColor] = useState<string>('green');
  const [isSimulatingDrain, setIsSimulatingDrain] = useState<boolean>(false);

  useEffect(() => {
    let subscription: any; 
    
    const updateBatteryStatus = async () => {
      if (batteryLevel === -1) { // If the battery level is at -1, then force it to read from device sensor
        const level = await Battery.getBatteryLevelAsync();
        setBatteryLevel(level);
        updateBatteryColor(level);
      }
    };

    updateBatteryStatus();

    subscription = Accelerometer.addListener(({ x, y, z }) => {
      const acceleration: number = Math.sqrt(x ** 2 + y ** 2 + z ** 2);
      if (!isSimulatingDrain && acceleration > 10) {
        Vibration.vibrate(2000);
        if (batteryLevel < 1) {
          setBatteryLevel(prevLevel => {
            const newLevel = prevLevel + 0.01;
            updateBatteryColor(newLevel);
            return newLevel > 1 ? 1 : newLevel; // Prevent the battery from going above 100%
          });
        }
      }
    });

    return () => {
      if (subscription) {
        subscription.remove();
      }
    };
  }, [isSimulatingDrain, batteryLevel]);

  const updateBatteryColor = (level: number) => {
    if (level <= 0.2) {
      setBatteryColor('red');
    } else if (level <= 0.5) {
      setBatteryColor('yellow');
    } else {
      setBatteryColor('green');
    }
  };

  const handleToggleSimulateDrain = () => {
    setIsSimulatingDrain(prevState => !prevState);
  };

  const handleRefresh = () => {
    setBatteryLevel(-1); // -1 will force the battery to reset
  };

  const simulateDrain = () => {
    if (batteryLevel > 0) {
      setBatteryLevel(prevLevel => {
        const newLevel = prevLevel - 0.01;
        updateBatteryColor(newLevel);
        return newLevel < 0 ? 0 : newLevel; // Prevent the battery from going below 0%
      });
    } else {
      setIsSimulatingDrain(false);
    }
  };

  useEffect(() => {
    if (isSimulatingDrain) {
      const interval = setInterval(simulateDrain, 1000);
      return () => clearInterval(interval);
    }
  }, [isSimulatingDrain]);

  return (
    <View style={styles.container}>
      <View style={styles.battery}>
        <View
          style={[
            styles.batteryFill,
            { width: `${batteryLevel * 100}%`, backgroundColor: batteryColor },
          ]}
        />
      </View>
      <Text style={styles.batteryText}>Battery Level: {Math.round(batteryLevel * 100)}%</Text>
      <Button
        title={isSimulatingDrain ? 'Stop Simulating Drain' : 'Simulate Drain'}
        onPress={handleToggleSimulateDrain}
      />
      <Button title="Refresh" onPress={handleRefresh} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  battery: {
    width: 200,
    height: 30,
    borderColor: 'black',
    borderWidth: 2,
    overflow: 'hidden',
  },
  batteryFill: {
    height: '100%',
  },
  batteryText: {
    fontSize: 20,
    marginTop: 20,
  },
});

export default ShakeToCharge;
