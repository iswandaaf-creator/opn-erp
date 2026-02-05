import React, { useRef, useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  ActivityIndicator,
  Alert,
  BackHandler,
  Text,
  Animated,
  Image,
  StatusBar
} from 'react-native';
import { WebView } from 'react-native-webview';

const App = () => {
  const webviewRef = useRef<WebView>(null);
  const [canGoBack, setCanGoBack] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showSplash, setShowSplash] = useState(true);
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  // Splash screen animation
  useEffect(() => {
    Animated.parallel([
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      })
    ]).start(() => {
      // Hide splash after animation + 1 second
      setTimeout(() => {
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }).start(() => setShowSplash(false));
      }, 1000);
    });
  }, []);

  // Handle Back Button
  useEffect(() => {
    const onBackPress = () => {
      if (canGoBack && webviewRef.current) {
        webviewRef.current.goBack();
        return true;
      }
      return false;
    };
    BackHandler.addEventListener('hardwareBackPress', onBackPress);
    return () => BackHandler.removeEventListener('hardwareBackPress', onBackPress);
  }, [canGoBack]);

  const onError = (syntheticEvent: any) => {
    const { nativeEvent } = syntheticEvent;
    setLoading(false);
    Alert.alert(
      'Connection Error',
      'Unable to connect to Open ERP. Please check your internet connection.',
      [
        { text: 'Retry', onPress: () => webviewRef.current?.reload() },
        { text: 'Cancel', style: 'cancel' }
      ]
    );
  };

  const onLoadProgress = ({ nativeEvent }: any) => {
    // Auto-hide loading when 80% loaded for smoother UX
    if (nativeEvent.progress > 0.8) {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

      {/* Splash Screen */}
      {showSplash && (
        <Animated.View style={[styles.splash, { opacity: fadeAnim }]}>
          <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
            <Image
              source={{ uri: 'https://open-erp.netlify.app/logo_long.png' }}
              style={styles.logo}
              resizeMode="contain"
            />
            <Text style={styles.brandText}>Open ERP</Text>
            <ActivityIndicator
              size="small"
              color="#1976d2"
              style={{ marginTop: 20 }}
            />
          </Animated.View>
        </Animated.View>
      )}

      {/* Main WebView */}
      {!showSplash && (
        <>
          <WebView
            ref={webviewRef}
            source={{ uri: 'https://open-erp.netlify.app' }}
            onNavigationStateChange={(navState) => setCanGoBack(navState.canGoBack)}
            onLoadStart={() => setLoading(true)}
            onLoadProgress={onLoadProgress}
            onLoadEnd={() => setLoading(false)}
            onError={onError}
            javaScriptEnabled={true}
            domStorageEnabled={true}
            cacheEnabled={true}
            sharedCookiesEnabled={true}
          />

          {/* Loading Bar */}
          {loading && (
            <View style={styles.loadingBar}>
              <View style={styles.loadingBarInner} />
            </View>
          )}
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff'
  },
  splash: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
    zIndex: 9999,
  },
  logo: {
    width: 200,
    height: 80,
    marginBottom: 10,
  },
  brandText: {
    fontSize: 24,
    fontWeight: '600',
    color: '#1976d2',
    textAlign: 'center',
    letterSpacing: 1,
  },
  loadingBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 3,
    backgroundColor: '#e0e0e0',
  },
  loadingBarInner: {
    height: 3,
    backgroundColor: '#1976d2',
    width: '70%',
  }
});

export default App;
