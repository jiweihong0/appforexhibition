import Colors from "@/constants/Colors";
import { Card, HStack, Pressable, Text } from "native-base";
import { StyleSheet } from "react-native";

type Props = {
  // expo vector icons
  icon: any,
  title: string,
  onPress: () => void
}

export default function UtilButton({ icon, title, onPress }: Props) {
  return (
    <Card style={styles.card}>
      <Pressable onPress={onPress}>
        <HStack style={styles.stack}>
          {icon}
          <Text fontSize={18} style={styles.text}>{title}</Text>
        </HStack>
      </Pressable>
    </Card>
  )
}

const styles = StyleSheet.create({
  card: {
    width: "100%",
    padding: 2,
    marginTop: 2,
    marginBottom: 2,
    borderColor: Colors.light.primary[200],
    borderWidth: 1,
    borderRadius: 10,
    backgroundColor: Colors.light.primary[100]
  },
  text: {
    color: Colors.light.primary[200]
  },
  stack: {
    alignItems: "center",
    justifyContent: "flex-start",
    columnGap: 14
  }
})