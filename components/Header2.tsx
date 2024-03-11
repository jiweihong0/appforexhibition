import Colors from "@/constants/Colors";
import { MaterialIcons, AntDesign } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Box, HStack, Icon, IconButton, StatusBar, Text, View } from "native-base";

export default function Header({ title }: { title?: string }) {

  const router = useRouter()

  return (

    <>
      <StatusBar backgroundColor={Colors.light.primary[200]} barStyle="light-content" />
      <Box safeAreaTop bg={Colors.light.primary[200]} />
      <HStack bg={Colors.light.primary[200]} px="1" py="3" justifyContent="space-between" alignItems="center" w="100%">
        <View>
          <IconButton icon={<Icon size="xl" as={AntDesign} name="back" color="white" />} onPress={() => {
            router.back()
          }} />
        </View>
        <View alignItems="center">
          <Text color="white" fontSize="2xl" fontWeight="bold">
            {title ?? "陽昇整復中心"}
          </Text>
        </View>
        <HStack>
          <IconButton
            icon={
              <Icon as={MaterialIcons}
                name="logout"
                size="xl"
                color="white"
              />
            }
            onPress={() => router.replace("/")}
          />
        </HStack>
      </HStack>
    </>

  )
}