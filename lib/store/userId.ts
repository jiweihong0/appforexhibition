import AsyncStorage from '@react-native-async-storage/async-storage';

export const writeUserId = async (userId: string) => {
  try {
    await AsyncStorage.setItem('@userId', userId);
  } catch (e) {
    console.log(e);
  }
}

export const readUserId = async () => {
  try {
    const userId = await AsyncStorage.getItem('@userId');
    return userId;
  } catch (e) {
    console.log(e);
  }
}