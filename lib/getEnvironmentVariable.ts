export default function getEnvironmentVariable() {
  return {
    API_URL: process.env.EXPO_PUBLIC_API_URL as string,
  };

}