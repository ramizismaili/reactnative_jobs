import { Stack } from "expo-router";
import { useCallback } from "react";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";

// Prevents splash screen from auto hiding
SplashScreen.preventAutoHideAsync();

// Defining a functional component called Layout
const Layout = () => {
  // Load the custom fonts using useFonts hook and assign the status to fontsLoaded variable
  const [fontsLoaded] = useFonts({
    DMBold: require("../assets/fonts/DMSans-Bold.ttf"),
    DMMedium: require("../assets/fonts/DMSans-Medium.ttf"),
    DMRegular: require("../assets/fonts/DMSans-Regular.ttf"),
  });

  // Define a memoized callback function, called onLayoutRootView
  const onLayoutRootView = useCallback(async () => {
    // If all the custom fonts are loaded, then hide the Splash screen
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  // If the custom fonts are not loaded, return null
  if (!fontsLoaded) return null;

  // Render the Stack component and pass the callback function at the time of root view layout
  return <Stack onLayout={onLayoutRootView} />;
};

export default Layout;
