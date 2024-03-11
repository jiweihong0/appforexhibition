import Colors from '@/constants/Colors';
import { Card, HStack, Image, Text, VStack, View } from 'native-base';
import { Dimensions, StyleSheet } from 'react-native';
import Carousel from "react-native-reanimated-carousel";
import RedRectangle from "@/components/svg-components/RedRectangle"
import UtilButton from '@/components/UtilButton';
import { Entypo, Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { readUserId } from '@/lib/store/userId';

export default function TabMainScreen() {
  const [userId, setUserId] = useState<string>("")
  const width = Dimensions.get('window').width;
  const router = useRouter()

  const carouselData = [
    {
      image: require("@/assets/images/slide1.png")
    },
    {
      image: require("@/assets/images/slide2.png")
    },
    {
      image: require("@/assets/images/slide3.png")
    },
  ]

  useEffect(() => {
    (async () => {
      const userId = await readUserId()
      if (typeof userId !== "string") {
        router.push("/")
        return
      }
      setUserId(userId)
    })()
  }, [])


  return (
    <View style={styles.container}>
      <VStack>
        <Text fontSize="xl" fontWeight="bold" style={styles.title}>員工編號：{userId}</Text>
        <Carousel
          loop
          style={styles.carousel}
          width={width}
          height={width / 2}
          data={carouselData}
          scrollAnimationDuration={1000}
          renderItem={({ item }) => (
            <View
              style={styles.imageContainer}
            >
              <Image source={item.image} alt={"宣傳照片"} style={styles.image} />
            </View>
          )}
        />
        <Card style={styles.card}>
          <VStack style={{ rowGap: 6 }}>
            <HStack style={{ alignItems: "center", columnGap: 3 }}>
              <RedRectangle />
              <Text fontSize="xl" color={Colors.light.primary[200]}>常用功能</Text>
            </HStack>
            <UtilButton icon={<Feather name="camera" size={48} color={Colors.light.primary[200]} />} title={"開啟體態偵測"} onPress={() => {
              router.push("/camera/id-input")
            }} />
            <UtilButton icon={<Entypo name="list" size={48} color={Colors.light.primary[200]} />} title={"查看歷史紀錄"} onPress={() => {
              router.push("/history/id_input")
            }} />
          </VStack>
        </Card>
      </VStack >
    </View >
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: "10%",
    gap: 20,
    backgroundColor: Colors.light.bg
  },
  carousel: {
    marginVertical: 10,
  },
  imageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: "90%",
    height: "100%",
    borderRadius: 10
  },
  card: {
    flex: 1,
    width: "auto",
    height: "100%",
    borderRadius: 10,
    backgroundColor: "#ffffff",
    shadowColor: "#000000",
    shadowOpacity: 1,
    shadowRadius: 100,
    shadowOffset: {
      width: 0,
      height: -10
    },
    elevation: 5,
  },
  title: {
    fontWeight: "bold",
    paddingHorizontal: 25,
    paddingVertical: 10,
  }
});
