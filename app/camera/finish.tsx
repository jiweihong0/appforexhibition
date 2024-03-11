import Header from "@/components/Header2";
import { AntDesign } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { HStack, Heading, IconButton, Image, Spinner, Text, VStack, View, useToast } from "native-base";
import { useEffect, useState } from "react";
import { StyleSheet, TouchableWithoutFeedback } from "react-native";
import * as FileSystem from "expo-file-system";
import { Buffer } from 'buffer';
import { readUserId } from "@/lib/store/userId";

export default function FinishedScreen() {

  const router = useRouter()
  const toast = useToast()
  const [isLoading, setisLoading] = useState(false)
  const [loadingBlockWidth, setLoadingBlockWidth] = useState(0)

  const [photos, setPhotos] = useState({
    frontPhoto: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7c/Black_image.jpg/450px-Black_image.jpg",
    backPhoto: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7c/Black_image.jpg/450px-Black_image.jpg",
    leftPhoto: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7c/Black_image.jpg/450px-Black_image.jpg",
    rightPhoto: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7c/Black_image.jpg/450px-Black_image.jpg",
  })

  useEffect(() => {
    (async () => {
      const frontPhoto = await AsyncStorage.getItem("frontPhoto")
      const backPhoto = await AsyncStorage.getItem("backPhoto")
      const leftPhoto = await AsyncStorage.getItem("leftPhoto")
      const rightPhoto = await AsyncStorage.getItem("rightPhoto")
      setPhotos({
        frontPhoto: frontPhoto ?? photos.frontPhoto,
        backPhoto: backPhoto ?? photos.backPhoto,
        leftPhoto: leftPhoto ?? photos.leftPhoto,
        rightPhoto: rightPhoto ?? photos.rightPhoto,
      })
    })()
  }, [])

  const handleReset = async () => {
    await AsyncStorage.removeItem("frontPhoto")
    await AsyncStorage.removeItem("backPhoto")
    await AsyncStorage.removeItem("leftPhoto")
    await AsyncStorage.removeItem("rightPhoto")
    router.push("/camera/id-input")
  }

  async function fileToBuffer(filePath: string) {
    const data = await FileSystem.readAsStringAsync(filePath, { encoding: FileSystem.EncodingType.Base64 });
    return Buffer.from(data, 'base64');
  }

  const handleToastAndNavigation = ({ isSuccess, toastTitle }: {
    isSuccess: boolean,
    toastTitle: string,
  }) => {
    toast.show({
      title: toastTitle,
      duration: 3000,
      placement: "top",
      render: () => {
        return (
          <VStack space={2} bg={isSuccess ? "green.500" : "red.500"} px={4} py={3} borderRadius={10}>
            <HStack space={2} alignItems="center">
              <AntDesign name="closecircleo" size={24} color="white" />
              <Text color="white" fontWeight="medium">{toastTitle}</Text>
            </HStack>
          </VStack>
        )
      }
    })
    setisLoading(false)
    router.push("/main/home")
  }


  const handleSubmit = async () => {

    setisLoading(true)

    // call api to upload photos
    const { frontPhoto, backPhoto, leftPhoto, rightPhoto } = photos
    try {
      const [frontPhotoBase64, backPhotoBase64, leftPhotoBase64, rightPhotoBase64] = await Promise.all([
        fileToBuffer(frontPhoto),
        fileToBuffer(backPhoto),
        fileToBuffer(leftPhoto),
        fileToBuffer(rightPhoto),
      ])

      const userId = await readUserId()
      const patienId = await AsyncStorage.getItem("patientId")

      const res = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/upimage`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          f_image: frontPhotoBase64,
          b_image: backPhotoBase64,
          l_image: leftPhotoBase64,
          r_image: rightPhotoBase64,
          employee_name: userId,
          user_name: patienId,
        })
      })

      const data = await res.json()

      if (res.status !== 200) {
        handleToastAndNavigation({
          isSuccess: false,
          toastTitle: "照片辨識失敗",
        })
        return
      }

      handleToastAndNavigation({
        isSuccess: true,
        toastTitle: "上傳成功",
      })
    } catch (error) {
      console.log(error);
      handleToastAndNavigation({
        isSuccess: false,
        toastTitle: "照片上傳伺服器失敗",
      })
    }

  }

  return (
    <>
      <Header />
      {isLoading && (
        <View style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: [
            { translateX: -loadingBlockWidth / 2 },
          ],
        }}
          onLayout={(e) => setLoadingBlockWidth(e.nativeEvent.layout.width)}
        >
          <HStack space={2} justifyContent="center">
            <Spinner size={"lg"} accessibilityLabel="Loading posts" />
            <Heading color="primary.500" fontSize="xl">
              上傳中...
            </Heading>
          </HStack>
        </View>
      )}
      <View style={{ ...styles.container, opacity: isLoading ? 0.5 : 1 }}>
        <Text style={styles.title}>照片導覽</Text>
        <HStack style={styles.twoImageContainer}>
          <VStack style={styles.imageAndLabelContainer}>
            <TouchableWithoutFeedback onPress={() => router.push("/camera/front")}>
              <Image style={styles.image} source={{ uri: photos.frontPhoto }} alt="frontPhoto" />
            </TouchableWithoutFeedback>
            <Text style={styles.imageLabel}>正面</Text>
          </VStack>
          <VStack style={styles.imageAndLabelContainer}>
            <TouchableWithoutFeedback onPress={() => router.push("/camera/back")}>
              <Image style={styles.image} source={{ uri: photos.backPhoto }} alt="backPhoto" />
            </TouchableWithoutFeedback>
            <Text style={styles.imageLabel}>背面</Text>
          </VStack>
        </HStack>
        <HStack style={styles.twoImageContainer}>
          <VStack style={styles.imageAndLabelContainer}>
            <TouchableWithoutFeedback onPress={() => router.push("/camera/left")}>
              <Image style={styles.image} source={{ uri: photos.leftPhoto }} alt="leftPhoto" />
            </TouchableWithoutFeedback>
            <Text style={styles.imageLabel}>左側</Text>
          </VStack>
          <VStack style={styles.imageAndLabelContainer}>
            <TouchableWithoutFeedback onPress={() => router.push("/camera/right")}>
              <Image style={styles.image} source={{ uri: photos.rightPhoto }} alt="rightPhoto" />
            </TouchableWithoutFeedback>
            <Text style={styles.imageLabel}>右側</Text>
          </VStack>
        </HStack>
        <HStack style={{ width: "100%" }} alignItems={"center"} justifyContent={"space-evenly"}>
          <IconButton
            style={styles.actionButton}
            icon={<AntDesign name="reload1" size={24} color="red" />}
            onPress={handleReset}
          />
          <IconButton
            style={styles.actionButton}
            icon={<AntDesign name="check" size={24} color="green" />}
            onPress={handleSubmit}
          />
        </HStack>
      </View>
    </>
  )
}

const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    lineHeight: 24 + 24 * 0.25,
    marginBottom: 10,
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
  },
  image: {
    flex: 1,
    width: "100%",
    height: "100%",
    resizeMode: "contain",
    borderRadius: 10,
  },
  twoImageContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "50%",
    height: "100%",
    columnGap: 10,
  },
  imageAndLabelContainer: {
    width: "100%",
    height: "100%",
    alignItems: "center",
  },
  imageLabel: {
    fontSize: 18,
    lineHeight: 18 + 18 * 0.25,
  },
  actionButton: {
    width: 50,
    height: 50,
    borderRadius: 100,
    backgroundColor: "#D9D9D9",
  }
})