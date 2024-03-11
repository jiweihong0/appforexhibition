import Header from "@/components/Header2";
import getEnvironmentVariable from "@/lib/getEnvironmentVariable";
import { readUserId } from "@/lib/store/userId";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Box, CheckIcon, ScrollView, Select, Spinner, View, useToast } from "native-base";
import { useEffect, useState } from "react";
import { Dimensions, Image } from "react-native";
import { Zoom } from 'react-native-reanimated-zoom';

export default function ShowHistoryImageScreen() {
  const { date } = useLocalSearchParams<{ date: string }>();
  const [imageBase64, setImageBase64] = useState<string | null>(null)
  const [dates, setDates] = useState<string[]>([])
  const toast = useToast()
  const router = useRouter()

  const screenWidth = Dimensions.get('window').width
  const photoHeight = Dimensions.get('window').height * 0.8

  useEffect(() => {
    (async () => {
      const userId = await readUserId()
      const patienId = await AsyncStorage.getItem('patientId')

      if (typeof userId !== "string" || patienId === null || date === null) {
        toast.show({
          title: "發生錯誤",
          description: "請重新登入",
          duration: 3000,
        })
        setTimeout(() => {
          router.back()
        }, 3000);
        return
      }

      const [base64, dates] = await Promise.all([
        fetchImage(patienId, date),
        fetchDates(patienId)
      ])

      setDates(dates)
      setImageBase64(base64)

    })()
  }, [])

  const fetchImage = async (patientId: string, date: string) => {
    try {
      const { API_URL } = getEnvironmentVariable()
      const res = await fetch(`${API_URL}/getDateImages/${patientId}?datetime=${date}`)
      const data = await res.json()
      const { userImage } = data
      return userImage
    } catch (error) {
      toast.show({
        title: "發生錯誤",
        description: "請稍後再試",
        placement: "top",
      })
      router.push("/main/home")
    }
  }

  const fetchDates = async (patientId: string) => {
    try {
      const { API_URL } = getEnvironmentVariable()
      const res = await fetch(`${API_URL}/getUserImages/${patientId}`)
      const data = await res.json()
      const { userRelatedDatetime } = data
      return userRelatedDatetime
    } catch (error) {
      console.log(error)
      toast.show({
        title: "發生錯誤",
        description: "請稍後再試",
        placement: "top",
      })
    }
  }

  const ImageURiFromBuffer = () => {
    return `data:image/png;base64,${imageBase64}`;
  };


  return (
    <>
      <Header title="歷史紀錄查看" />
      <View flex={"auto"} alignItems={"center"} paddingTop={"1"} style={{ rowGap: 10 }}>
        <Box maxW="300">
          <Select selectedValue={date} minWidth="200" _selectedItem={{
            bg: "teal.600",
            endIcon: <CheckIcon size="5" />
          }}
            accessibilityLabel={`拍攝日期：${date}`} placeholder={`拍攝日期：${date}`}
            mt={1} onValueChange={itemValue => {
              router.push(`/history/view_image?date=${itemValue}`)
            }}
          >
            {dates?.map((date) => <Select.Item key={date} label={date} value={date} />)}
          </Select>
        </Box>
        <Zoom>
          <ScrollView horizontal>
            {imageBase64 === null && <Spinner size="lg" />}
            {imageBase64 !== null && <Image source={{ uri: ImageURiFromBuffer() }}
              alt="patientImage"
              width={screenWidth * 2.5}
              height={photoHeight}
              resizeMode='contain'
            />
            }
          </ScrollView>
        </Zoom>
      </View >
    </>
  )

}