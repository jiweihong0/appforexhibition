import { Keyboard, StyleSheet, TouchableWithoutFeedback } from 'react-native';
import Logo from "@/components/svg-components/Logo"
import { Button, FormControl, Heading, Input, KeyboardAvoidingView, Text, View } from 'native-base';
import { useState } from 'react';
import { writeUserId } from '@/lib/store/userId';
import { useRouter } from 'expo-router';

type FormData = {
  id?: string
}

export default function IndexLoginScreen() {

  const [formData, setFormData] = useState<FormData>({})
  const router = useRouter()

  const handleLogin = async () => {
    const { id } = formData

    if (!id) {
      return
    }

    // save to local storage
    await writeUserId(id)

    // redirect to home
    router.push("/main/home")
  }

  return (
    <View style={styles.container}
    >
      <TouchableWithoutFeedback
        style={styles.dissmissKeyboardContainer}
        onPressOut={(event: any) => {
          event.stopPropagation();
          Keyboard.dismiss()
        }}
      >
        <KeyboardAvoidingView
          style={styles.keybardAvoidingViewContainer}
        >
          <Logo />
          <Heading style={styles.title} size={"3xl"}>登入</Heading>
          <FormControl isRequired>
            <FormControl.Label _text={{
              bold: true
            }}>
              員工編號
            </FormControl.Label>
            <Input placeholder="00000000" keyboardType='numeric' onChangeText={value => setFormData({
              ...formData,
              id: value
            })} />
            <FormControl.HelperText style={styles.helperTextContainer}>
              <Text style={styles.helperText}>
                字數限制
              </Text>
              <Text style={styles.helperText}>
                {formData.id?.length ?? 0}/12
              </Text>
            </FormControl.HelperText>
            <FormControl.ErrorMessage _text={{
              fontSize: 'xs'
            }}>
              錯誤的員工編號
            </FormControl.ErrorMessage>
            <Button
              onPress={handleLogin}
            >
              登入
            </Button>
          </FormControl>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </View >
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: "10%",
  },
  dissmissKeyboardContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  keybardAvoidingViewContainer: {
    width: "100%",
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: "auto",
    gap: 20
  },
  title: {
    alignSelf: "flex-start"
  },
  helperTextContainer: {
    flexDirection: "row",
    justifyContent: "space-between"
  },
  helperText: {
    fontSize: 12,
    color: "gray"
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
});
