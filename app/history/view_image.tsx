import Header from "@/components/Header2";
import getEnvironmentVariable from "@/lib/getEnvironmentVariable";
import { readUserId } from "@/lib/store/userId";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Box, CheckIcon, ScrollView, Select, Spinner, View, useToast, Text } from "native-base";
import { useEffect, useState } from "react";
import { Dimensions, Image } from "react-native";
import { Zoom } from 'react-native-reanimated-zoom';

export default function ShowHistoryImageScreen() {
  const { date } = useLocalSearchParams<{ date: string }>();
  const [imageBase64, setImageBase64] = useState<string | null>(null)
  const [dates, setDates] = useState<string[]>([])
  const [text, setText] = useState<{data: string,dataangle: string, result:string, suggest:string} | null>(null)
  const toast = useToast()
  const router = useRouter()

  const screenWidth = Dimensions.get('window').width
  const photoHeight = Dimensions.get('window').height * 0.8

  const [loading, setLoading] = useState(true);

  const handleLoadStart = () => {
    setLoading(true);
  };

  const handleLoadEnd = () => {
    setLoading(false);
  };

  const handleLoadError = () => {
    // 處理圖片加載失敗的情況
    console.log('Image loading failed');
  };

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

      const [url,dates,text] = await Promise.all([
        fetchImage(patienId),
        fetchDates(patienId),
        fetchText(patienId, date)
      ])

      setDates(dates)
      setImageBase64(url)
      setText(text)
      setLoading(true);

    })()
  }, [])

  const fetchText = async (patientId: string, date: string) => {
    try {
      const { API_URL } = getEnvironmentVariable()
      const res = await fetch(`${API_URL}/getText/${patientId}?datetime=${date}`)
      const data = await res.json()
      console.log(data.data);
      
      return data.data
    } catch (error) {
      toast.show({
        title: "發生錯誤",
        description: "請稍後再試",
        placement: "top",
      })
    
    }
  }

 

  const fetchImage = (patientId: string) => {
      const { API_URL } = getEnvironmentVariable()
      const res =`${API_URL}/get-image/${patientId}`
      return res
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
        <Text>判定結果：{
          text === null && "加載中"
          }{
            text !== null && text?.result
          }</Text>
        <Text>傾斜角度（脊椎）：{
          text === null && "加載中"
          }{
            text!== null && text?.dataangle
          }
          </Text>
        <Text>
          建議：{
            text === null && "加載中"
          }{
            text !== null && text?.suggest
          }
        </Text>
        <Zoom>
          <ScrollView horizontal >
          {loading && <Spinner size="lg" />}
          {imageBase64 && (
            <Image
              source={{ uri: imageBase64}}
              alt="patientImage"
              width={screenWidth * 2.5}
              height={photoHeight}
              onLoadStart={handleLoadStart}
              onLoadEnd={handleLoadEnd}
              onError={handleLoadError}
              resizeMode='contain'
            />
          )}
           
          </ScrollView>
        </Zoom>
      </View >
    </>
  )

}