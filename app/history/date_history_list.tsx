import Header from "@/components/Header2";
import Colors from "@/constants/Colors";
import { FlatList, HStack, Icon, IconButton, Input, Pressable, Spinner, Text, View, useToast } from "native-base";
import { useEffect, useState } from "react";
import { StyleSheet } from "react-native";
import { FontAwesome, MaterialIcons, Entypo } from '@expo/vector-icons';
import { useRouter } from "expo-router";
import { readUserId } from "@/lib/store/userId";
import getEnvironmentVariable from "@/lib/getEnvironmentVariable";
import AsyncStorage from "@react-native-async-storage/async-storage";

let originalFetchDates: string[] = []
export default function DateHistoryListScreen() {

  const router = useRouter()
  const [searchString, setSearchString] = useState('')
  const [dates, setdates] = useState<string[]>([])
  const [sort, setSort] = useState<"asc" | "desc">("asc")
  const toast = useToast()
  const [isLoading, setisLoading] = useState(false)
  const [noData, setNoData] = useState(false)

  const handleSearch = () => {
    const filteredDates = originalFetchDates.filter(date => date.includes(searchString))
    if (filteredDates.length === 0) {
      setdates([])
      setNoData(true)
      return
    }

    if (searchString === '') {
      setdates(originalFetchDates)
      setNoData(false)
      return
    }

    setdates(filteredDates)
  }

  useEffect(() => {
    (async () => {
      try {
        const patienId = await AsyncStorage.getItem("patientId")
        if (typeof patienId !== "string") {
          router.push("/")
          return
        }
        setisLoading(true)
        const { API_URL } = getEnvironmentVariable()
        const res = await fetch(`${API_URL}/getUserImages/${patienId}`)
        const data = await res.json()

        if (data.hasOwnProperty("error") || data.userRelatedDatetime.length === 0) {
          setNoData(true)
          setisLoading(false)
          return
        }

        const { userRelatedDatetime } = data
        setdates(userRelatedDatetime)
        originalFetchDates = userRelatedDatetime        
        setisLoading(false)
      } catch (error) {
        console.log(error)
        toast.show({
          title: "發生錯誤",
          description: "請稍後再試",
          placement: "top",
        })
        setisLoading(false)
      }
    })()
  }, [])

  useEffect(() => {
      setdates(dates => dates.sort((a, b) => {
        const aDate = new Date(a)
        const bDate = new Date(b)
        if (sort === "asc") {
          return aDate.getTime() - bDate.getTime()
        }
        return aDate.getTime() - bDate.getTime()
      }))
  }, [sort])

  return (
    <>
      <Header title="歷史紀錄查看" />
      <View style={styles.container}>
        <HStack justifyContent={"center"} alignItems={"center"}>
          <Text style={{ color: Colors.light.primary[200], fontSize: 18 }}>日期</Text>
          {sort === "asc" ?
            <IconButton icon={<FontAwesome name="sort-numeric-asc" size={24} color={Colors.light.primary[200]} />} onPress={() => setSort("desc")} /> :
            <IconButton icon={<FontAwesome name="sort-numeric-desc" size={24} color={Colors.light.primary[200]} />} onPress={() => setSort("asc")} />
          }
          <View w={{
            base: "75%",
            md: "25%"
          }}
            position={"relative"}
          >
            <Input
              value={searchString}
              onChangeText={setSearchString}
              style={{
                borderRadius: 10,
                backgroundColor: "#D9D9D9",
              }}
              type={"text"}
            />
            <Pressable
              onPress={handleSearch}
              position={"absolute"}
              right={"0"}
              top="1/2"
              style={{
                transform: [{ translateY: -18 }],
              }}
            >
              <Icon as={<Entypo name="magnifying-glass" size={24} color="black" />} size={5} mr="2" color="muted.400" />
            </Pressable>
          </View>
        </HStack>
        {isLoading && <Spinner size={"lg"} />}
        {noData && <Text fontSize={"2xl"} textAlign={"center"}>查無資料</Text>}
        {dates && dates?.length !== 0 && !isLoading && <Text>共 {dates.length} 筆資料</Text>}
        <FlatList
          data={dates}
          renderItem={({ item }) => <FolderItem date={item} />}
          keyExtractor={item => item}
        />
      </View >
    </>
  )

}

function FolderItem({ date }: { date: string }) {

  const router = useRouter()

  return (
    <Pressable
      style={{
        paddingVertical: 40,
        paddingHorizontal: 20,
        marginVertical: 10,
        backgroundColor: "#E0D6C6",
        flexDirection: "row",
        columnGap: 10,
        alignItems: "center",
      }}
      onPress={() => {
        router.push(`/history/view_image?date=${date}`)
      }}
    >
      <Icon
        as={<Entypo name={"folder"} />}
        size={8}
        color="yellow.100"
      />
      <Text style={{ fontSize: 18 }}>{date}</Text>
    </Pressable>
  )

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.bg,
    justifyContent: "center",
    width: "100%",
    paddingHorizontal: "5%",
    paddingVertical: "5%",
  },
  stack: {
    width: "100%",
    rowGap: 10,
  },
  title: {
    fontSize: 24,
    paddingTop: 24 - (24 * 0.75)
  },
  input: {
    width: "100%",
    height: 50,
    backgroundColor: "#D9D9D9",
    borderRadius: 10,
  },
  button: {
    width: "40%",
    backgroundColor: Colors.light.primary[200],
    borderRadius: 30,
    alignSelf: "flex-end",
  }
})