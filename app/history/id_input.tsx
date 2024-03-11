import { Button, Input, Text, VStack, View } from "native-base";
import Header from "@/components/Header2";
import { StyleSheet } from "react-native";
import Colors from "@/constants/Colors";
import { useRouter } from "expo-router";
import { useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function PatienIdInputScreen() {

  const [patienId, setPatienId] = useState("")
  const router = useRouter()

  const handleSubmit = async () => {
    if (patienId !== "") {
      await AsyncStorage.setItem("patientId", patienId)
      router.push("/history/date_history_list")
    }
  }

  return (
    <>
      <Header title="歷史紀錄查看" />
      <View style={styles.container}>
        <VStack style={styles.stack}>
          <Text style={styles.title}>請輸入病患編號：</Text>
          <Input style={styles.input} placeholder="病患編號" onChangeText={(val) => setPatienId(val)} />
          <Button style={styles.button} onPress={handleSubmit}>
            確認
          </Button>
        </VStack>
      </View>
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.bg,
    justifyContent: "center",
    width: "100%",
    paddingHorizontal: "5%",
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