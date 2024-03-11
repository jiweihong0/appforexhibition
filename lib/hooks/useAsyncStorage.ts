import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';

export default function useAsyncStorage<T>(key: string, initialValue: T) {

  const [data, setData] = useState<T>(initialValue);

  useEffect(() => {
    (async () => {
      try {
        const jsonValue = await AsyncStorage.getItem(key)
        if (jsonValue !== null) {
          setData(JSON.parse(jsonValue))
        } else {
          setData(initialValue)
        }
      } catch (e) {
        console.log(e)
      }
    })()
  }, [])


  const storeData = async (value: T) => {
    try {
      const jsonValue = JSON.stringify(value)
      await AsyncStorage.setItem(key, jsonValue)
      setData(value)
    } catch (e) {
      console.log(e)
    }
  }

  return { data, storeData }

}