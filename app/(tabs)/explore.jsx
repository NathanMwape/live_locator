import { StyleSheet, Text, View, Button } from 'react-native';
import { useRouter } from 'expo-router';
import { supabase } from '../../supabase/supabaseClient'; // Assure-toi que le chemin est correct

export default function TabTwoScreen() {
  const router = useRouter();

  // Fonction pour gérer la déconnexion
  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();

    if (error) {
      alert('Erreur lors de la déconnexion');
    } else {
      // Après la déconnexion, rediriger vers l'écran de connexion
      router.replace('/');
    }
  };

  return (
    <View style={styles.container}>
      <Text>Explore</Text>
      {/* Bouton de déconnexion */}
      <Button title="Se déconnecter" onPress={handleLogout} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
