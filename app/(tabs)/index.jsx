import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Alert, ScrollView, Image } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import * as Location from 'expo-location';
import { supabase } from '../../supabase/supabaseClient';
import { Picker } from '@react-native-picker/picker'; 

export default function HomeScreen() {
  const [region, setRegion] = useState(null);
  const [locationSubscription, setLocationSubscription] = useState(null);
  const [mapType, setMapType] = useState('standard');
  const [movementPoints, setMovementPoints] = useState([]); // Points de déplacement

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission refusée', 'L\'accès à la localisation est nécessaire pour afficher votre position.');
        return;
      }

      // Surveiller la position en temps réel
      const subscription = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: 10000, // Mettre à jour la position toutes les 10 secondes
          distanceInterval: 5, // Mettre à jour la position toutes les 5 m
        },
        async (location) => {
          const currentRegion = {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            latitudeDelta: 0.00922,
            longitudeDelta: 0.00421,
          };
          setRegion(currentRegion);

          // Ajouter la nouvelle position à la liste des points de déplacement
          setMovementPoints((prevPoints) => [
            ...prevPoints,
            { latitude: currentRegion.latitude, longitude: currentRegion.longitude }
          ]);

          // Enregistrer la localisation dans Supabase
          const { error } = await supabase
            .from('localisation')
            .insert([
              {
                latitude: currentRegion.latitude,
                longitude: currentRegion.longitude,
              },
            ]);

          if (error) {
            Alert.alert('Erreur', 'Impossible d\'enregistrer la localisation.');
          }
        }
      );

      setLocationSubscription(subscription);
    })();

    return () => {
      if (locationSubscription) {
        locationSubscription.remove();
      }
    };
  }, []);

  if (!region) {
    return (
      <View style={styles.loading}>
        <Text>Chargement de la carte...</Text>
      </View>
    );
  }

  // "config": {
//         "googleMaps": {
//           "apikey": "AIzaSyDn7wCqY0h0vSdKp5jVJg4QVfTz5KsOy0"
//         }
//       },4519460003705888

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Localisation actuelle</Text>
        <Image
          source={{ uri: 'https://plus.unsplash.com/premium_photo-1681487829842-2aeff98f8b63?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' }}
          style={styles.logo}
        />
      </View>

      <View style={styles.pickerContainer}>
        <Text style={styles.pickerLabel}>Changer le type de carte :</Text>
        <Picker
          selectedValue={mapType}
          style={styles.picker}
          onValueChange={(itemValue) => setMapType(itemValue)}
        >
          <Picker.Item label="Standard" value="standard" />
          <Picker.Item label="Satellite" value="satellite" />
          <Picker.Item label="Terrain" value="terrain" />
          <Picker.Item label="Hybride" value="hybrid" />
        </Picker>
      </View>

      <View style={styles.mapContainer}>
        <MapView
          style={styles.map}
          region={region} 
          mapType={mapType}
          showsUserLocation={true}
          followsUserLocation={true}
        >
          <Marker
            title="Vous êtes ici"
            coordinate={{ latitude: region.latitude, longitude: region.longitude }}
            pinColor="red"
          />

          {/* Tracer une ligne pour les points de déplacement */}
          {movementPoints.length > 1 && (
            <Polyline
              coordinates={movementPoints} // Tableau de points de déplacement
              strokeColor="blue" // Couleur de la ligne
              strokeWidth={3} // Largeur de la ligne
            />
          )}
        </MapView>
      </View>

      <View style={styles.infoContainer}>
        <Text style={styles.infoTitle}>Détails de votre position :</Text>
        <Text style={styles.infoText}>Latitude: {region.latitude.toFixed(6)}</Text>
        <Text style={styles.infoText}>Longitude: {region.longitude.toFixed(6)}</Text>
        <Text style={styles.infoText}>Zoom: {region.latitudeDelta.toFixed(5)} / {region.longitudeDelta.toFixed(5)}</Text>
      </View>

      <View style={styles.additionalInfo}>
        <Text style={styles.additionalText}>
          La carte montre votre position actuelle. Vous pouvez zoomer et explorer les alentours en déplaçant la carte.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f0f0f5',
    alignItems: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
    marginTop: 20,
  },
  logo: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  mapContainer: {
    width: '100%',
    height: 300,
    borderRadius: 15,
    overflow: 'hidden',
    borderColor: '#ddd',
    borderWidth: 1,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 3,
    marginBottom: 20,
  },
  map: {
    width: '100%',
    height: '100%',
  },
  pickerContainer: {
    marginVertical: 10,
    width: '100%',
    alignItems: 'center',
  },
  pickerLabel: {
    fontSize: 16,
    marginBottom: 5,
  },
  picker: {
    width: '100%',
    height: 44,
    backgroundColor: '#eaeaea',
    borderRadius: 8,
  },
  infoContainer: {
    width: '100%',
    marginBottom: 20,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  infoText: {
    fontSize: 16,
    marginBottom: 5,
  },
  additionalInfo: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 10,
    alignItems: 'center',
    marginTop: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  additionalText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
});
