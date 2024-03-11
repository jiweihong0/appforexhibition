import { Button, Center, HStack, IconButton, Image, Text, VStack, View } from "native-base";
import Header from "@/components/Header2";
import { Dimensions, LayoutChangeEvent, StyleSheet, PanResponder, PanResponderInstance } from "react-native";
import { useRouter } from "expo-router";
import { AntDesign, MaterialIcons } from '@expo/vector-icons';
import { Camera, CameraType } from 'expo-camera';
import { useEffect, useRef, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImageManipulator from 'expo-image-manipulator';

type Props = {
  direction: "front" | "back" | "left" | "right"
}

type PhotoData = {
  uri: string
  width: number
  height: number
}

const getDirection = (direction: Props["direction"]) => {
  switch (direction) {
    case "front":
      return {
        number: 1,
        directionString: "正面",
        nextNavigation: "/camera/back",
        prevNavigation: "..",
        localStorageKey: "frontPhoto",
        alignPosition: "鎖骨"
      }
    case "back":
      return {
        number: 2,
        directionString: "背面",
        nextNavigation: "/camera/left",
        prevNavigation: "/camera/front",
        localStorageKey: "backPhoto",
        alignPosition: "頸椎第七節"
      }
    case "left":
      return {
        number: 3,
        directionString: "左側",
        nextNavigation: "/camera/right",
        prevNavigation: "/camera/back",
        localStorageKey: "leftPhoto",
        alignPosition: "肩峰"
      }
    case "right":
      return {
        number: 4,
        directionString: "右側",
        nextNavigation: "/camera/finish",
        prevNavigation: "/camera/left",
        localStorageKey: "rightPhoto",
        alignPosition: "肩峰"
      }
  }
}

export default function TakePhotoScreen({ direction }: Props) {
  const cameraRef = useRef<Camera>(null)
  const panResponderRef = useRef<PanResponderInstance | null>(null);
  const [type, setType] = useState(CameraType.back);
  const [permission, requestPermission] = Camera.useCameraPermissions();
  const [photo, setPhoto] = useState<PhotoData>({
    uri: "",
    width: 0,
    height: 0
  })
  const [auxiliaryBorderDimensions, setAuxiliaryBorderDimensions] = useState({ width: 0, height: 0 })
  const [zoomValue, setZoomValue] = useState(0)
  const directionData = getDirection(direction)

  const width = Dimensions.get('window').width;

  const router = useRouter()

  function toggleCameraType() {
    setType(current => (current === CameraType.back ? CameraType.front : CameraType.back));
  }

  async function handleTakePhoto() {
    if (cameraRef.current === null) return
    const photo = await cameraRef.current.takePictureAsync();
    const manipResult = await ImageManipulator.manipulateAsync(
      photo.uri,
      [
        {
        crop: {
          originX: photo.width * 0.21, // Start cropping from 5% of the original width
          originY: photo.height * 0.04, // Start cropping from 5% of the original height
          width: photo.width * 0.6, // Crop the photo to 90% of the original width
          height: photo.height * 0.95, // Crop the photo to 90% of the original height
        }
        }
      ],
      { compress: 1, format: ImageManipulator.SaveFormat.JPEG }
    );

    setPhoto({
      uri: manipResult.uri,
      width: manipResult.width,
      height: manipResult.height
    })
  }

  async function handleConfirm() {
    if (photo.uri === "") return
    await AsyncStorage.setItem(directionData.localStorageKey, photo.uri)
    router.push(directionData.nextNavigation as any)
  }

  function onAuxiliaryBorderWidthLayout(event: LayoutChangeEvent) {
    setAuxiliaryBorderDimensions({ width: event.nativeEvent.layout.width, height: event.nativeEvent.layout.height })
  }

  useEffect(() => {
  panResponderRef.current = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderMove: (_, gestureState) => {
      if (gestureState.dy < 0) {
        // User is scrolling up
        setZoomValue(val => {
          const newVal = val + 0.01
          if (newVal >= 1) return val
          return newVal
        })
      } else {
        // User is scrolling down
        setZoomValue(val => {
          const newVal = val - 0.01
          if (newVal <= 0) return val
          return newVal
        })

      }
    },
  });
  }, []);

  return (
    <>
      <Header />
      <View style={styles.container}>
        <VStack style={styles.Vstack}>
          <VStack>
            <HStack style={styles.titleTextHStack}>
              <IconButton
                icon={<AntDesign name="arrowleft" size={24} color="white" />}
                onPress={() => router.push(directionData.prevNavigation as any)}
              />
              <IconButton
                icon={<AntDesign name="arrowright" size={24} color="white" />}
                onPress={() => router.push(directionData.nextNavigation as any)}
              />
              <Text style={styles.title}>第{directionData.number}張照片：{directionData.directionString}</Text>
            </HStack>
            {photo.uri === "" && <Text color="white" textAlign={"center"} fontSize={"xs"} lineHeight={"sm"}>請將人保持在框線內，並{directionData.alignPosition}對齊十字交叉處</Text>}
          </VStack>
          {permission && !permission.granted ? (
            <Button onPress={requestPermission}>申請使用相機權限</Button>
          ) : photo.uri === "" ? (
            <VStack alignItems={"center"} style={{ rowGap: 10 }}>
                <Camera
                  ref={cameraRef}
                  style={styles.camera}
                  type={type}
                  zoom={zoomValue}
                  {...panResponderRef.current?.panHandlers}
                >
                <View
                  onLayout={onAuxiliaryBorderWidthLayout}
                  borderColor={"#00acc0"}
                  style={{
                    ...styles.cameraAuxiliaryBorder,
                    transform: [
                      { translateX: -auxiliaryBorderDimensions.width / 2 },
                      { translateY: -auxiliaryBorderDimensions.height / 2 },
                    ]
                  }}
                >
                  <View
                    position={"absolute"}
                    left="50%"
                    top="20%"
                    width={auxiliaryBorderDimensions.width / 2}
                    borderWidth={3}
                    borderColor={"#00acc0"}
                    style={{ transform: [{ translateX: -auxiliaryBorderDimensions.width / 4 }] }}
                  />
                  <View
                    position={"absolute"}
                    left="50%"
                    top="40%"
                    height={auxiliaryBorderDimensions.height / 5 * 4}
                    borderWidth={3}
                    borderColor={"#00acc0"}
                    style={{ transform: [{ translateY: -auxiliaryBorderDimensions.height / 3 }] }}
                  />
                </View>
                </Camera>
                <HStack style={{ columnGap: 10}} >
                  <IconButton
                    style={styles.actionButton}
                    icon={<MaterialIcons name="photo-camera" size={24} color="gray" />}
                    onPress={handleTakePhoto}
                  />
                  <IconButton
                    style={styles.actionButton}
                  icon={<AntDesign name="sync" size={24} color="gray" />}
                  onPress={toggleCameraType}
                  />
                </HStack>
            </VStack>
          ) : (
                <VStack style={{ rowGap: 0, width: '100%' }}>
                  <Center>
                    <Image
                      source={{ uri: photo.uri }}
                      style={{
                        width: '70%',
                        height: "85%",
                        borderRadius: 20,
                        resizeMode: 'stretch',
                      }}
                      alt={directionData.directionString}
                    />
                  </Center>
              <HStack alignItems={"center"} justifyContent={"space-evenly"}>
                <IconButton
                  style={styles.actionButton}
                  icon={<AntDesign name="reload1" size={24} color="red" />}
                  onPress={() => setPhoto({ uri: "", width: 0, height: 0 })}
                />
                <IconButton
                  style={styles.actionButton}
                  icon={<AntDesign name="check" size={24} color="green" />}
                  // Might have seriouse problem here
                  onPress={(handleConfirm)}
                />
              </HStack>
            </VStack>
          )}
        </VStack>
      </View>
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#00000069",
    justifyContent: "center",
    width: "100%",
    paddingHorizontal: "5%",
  },
  Vstack: {
    width: "100%",
    rowGap: 5,
  },
  titleTextHStack: {
    width: "100%",
    rowGap: 10,
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    paddingTop: 24 - (24 * 0.75),
    color: "white",
  },
  input: {
    width: "100%",
    height: 50,
    backgroundColor: "#D9D9D9",
    borderRadius: 10,
  },
  camera: {
    width: "100%",
    height: "80%",
    borderRadius: 30,
    position: "relative",
  },
  cameraAuxiliaryBorder: {
    position: "absolute",
    top: "50%",
    left: "50%",
    borderWidth: 5,
    width: "60%",
    height: "96%",
    opacity: 0.8,
  },
  actionButton: {
    width: 50,
    height: 50,
    borderRadius: 100,
    backgroundColor: "#D9D9D9",
  }
})