import Header from '@/components/Header';
import Colors from '@/constants/Colors';
import { AntDesign } from '@expo/vector-icons';
import { Tabs, useRouter } from 'expo-router';
import { Text, View } from 'native-base';
import { Pressable, StyleSheet } from 'react-native';

export default function MainTabsLayout() {

  const router = useRouter()

  return (
    <>
      <Header />
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            backgroundColor: Colors.light.primary[200],
          }
        }}
        initialRouteName='home'
      >
        <Tabs.Screen
          name="home"
          options={{
            title: '主畫面',
            tabBarButton: (props) => {
              return (
                <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                  <Pressable style={styles.tabBarIcon} onPress={() => router.push("/main/home")}>
                    <AntDesign name="home" size={36} color={Colors.light.primary[200]} />
                  </Pressable>
                  <Text style={styles.tabBarText}>主畫面</Text>
                </View>
              )
            }
          }}
        />
      </Tabs>
    </>
  );
}

const styles = StyleSheet.create({
  tabBarIcon: {
    backgroundColor: "white",
    position: "relative",
    top: -10,
    width: 60,
    height: 60,
    borderRadius: 60 / 2,
    borderColor: Colors.light.primary[200],
    borderWidth: 4,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  tabBarText: {
    color: "white",
    fontSize: 14,
    position: "relative",
    top: -10
  }
})