import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Alert, ScrollView, Image } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import * as Location from 'expo-location';
import { supabase } from '../../supabase/supabaseClient';
import { Picker } from '@react-native-picker/picker'; // Import corrigé

export default function HomeScreen() {
  const [region, setRegion] = useState(null);
  const [locationSubscription, setLocationSubscription] = useState(null);
  const [mapType, setMapType] = useState('standard'); // État pour le type de carte
  const [routeCoordinates, setRouteCoordinates] = useState([]); // Stocker les positions pour tracer le chemin
  const [previousLocation, setPreviousLocation] = useState(null); // Stocker la position précédente pour calculer la distance

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
          timeInterval: 1000, // 1 seconde
          distanceInterval: 1, // 1 mètre
        },
        async (location) => {
          const newLocation = {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
          };

          const currentRegion = {
            latitude: newLocation.latitude,
            longitude: newLocation.longitude,
            latitudeDelta: 0.00922,
            longitudeDelta: 0.00421,
          };
          setRegion(currentRegion);

          // Enregistrer la nouvelle position dans Supabase
          const { error } = await supabase
            .from('locations')
            .insert([
              {
                latitude: newLocation.latitude,
                longitude: newLocation.longitude,
              },
            ]);

          if (error) {
            Alert.alert('Erreur', 'Impossible d\'enregistrer la localisation.');
          }

          // Vérifier si la position a changé de plus de 10 mètres
          if (previousLocation) {
            const distance = calculateDistance(previousLocation, newLocation);
            if (distance >= 10) {
              setRouteCoordinates((prev) => [...prev, newLocation]); // Ajouter la nouvelle position au chemin
              setPreviousLocation(newLocation); // Mettre à jour la position précédente
            }
          } else {
            setPreviousLocation(newLocation);
            setRouteCoordinates([newLocation]); // Initialiser le chemin avec la première position
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
  }, [previousLocation]);

  // Fonction pour calculer la distance entre deux points géographiques
  const calculateDistance = (prevLoc, newLoc) => {
    const toRad = (value) => (value * Math.PI) / 180;
    const R = 6371e3; // Rayon de la Terre en mètres

    const dLat = toRad(newLoc.latitude - prevLoc.latitude);
    const dLon = toRad(newLoc.longitude - prevLoc.longitude);
    const lat1 = toRad(prevLoc.latitude);
    const lat2 = toRad(newLoc.latitude);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    const distance = R * c; // Distance en mètres
    return distance;
  };

  if (!region) {
    return (
      <View style={styles.loading}>
        <Text>Chargement de la carte...</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Localisation actuelle</Text>
        <Image
          source={{ uri: 'https://plus.unsplash.com/premium_photo-1681487829842-2aeff98f8b63?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' }}
          style={styles.logo}
        />
      </View>

      {/* Sélecteur pour changer le type de carte */}
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
          region={region} // La carte reste centrée sur la position actuelle
          mapType={mapType} // Utilisation du type de carte sélectionné
          showsUserLocation={true} // Affiche un indicateur de position utilisateur
          followsUserLocation={true} // La carte suit automatiquement la position de l'utilisateur
        >
          <Marker
            title="Vous êtes ici"
            coordinate={{ latitude: region.latitude, longitude: region.longitude }}
            pinColor="red" // Couleur du marqueur
          />

          {/* Polyline pour tracer le chemin */}
          <Polyline
            coordinates={routeCoordinates} // Utiliser les positions enregistrées
            strokeWidth={4}
            strokeColor="blue" // Couleur de la ligne
          />
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
  // Styles inchangés...
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
    shadowRadius: 6,
    elevation: 3,
    marginBottom: 20,
  },
  map: {
    width: '100%',
    height: '100%',
  },
  infoContainer: {
    width: '100%',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 3,
    elevation: 2,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  infoText: {
    fontSize: 16,
    color: '#555',
  },
  additionalInfo: {
    padding: 15,
    backgroundColor: '#e0f7fa',
    borderRadius: 10,
    width: '100%',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 3,
    elevation: 2,
  },
  additionalText: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pickerContainer: {
    marginBottom: 20,
    width: '100%',
  },
  pickerLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  picker: {
    height: 50,
    width: '100%',
  },
});
