import React, { useRef, useState, useEffect } from 'react';
import { StyleSheet, View, ActivityIndicator, Alert, BackHandler, Text } from 'react-native';
import { WebView } from 'react-native-webview';

const App = () => {
  const webviewRef = useRef<WebView>(null);
  const [canGoBack, setCanGoBack] = useState(false);
  const [loading, setLoading] = useState(true);

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
    Alert.alert(
      'Connection Error',
      'Failed to load page. Please check your internet connection.',
      [{ text: 'Retry', onPress: () => webviewRef.current?.reload() }]
    );
  };

  return (
    <View style={styles.container}>
      <WebView
        ref={webviewRef}
        source={{ uri: 'https://opn-erp.netlify.app' }}
        onNavigationStateChange={(navState) => setCanGoBack(navState.canGoBack)}
        onLoadStart={() => setLoading(true)}
        onLoadEnd={() => setLoading(false)}
        onError={onError}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        startInLoadingState={true}
        renderLoading={() => <Loading />}
      />
      {loading && <Loading />}
    </View>
  );
};

const Loading = () => (
  <View style={styles.loading}>
    <ActivityIndicator size="large" color="#0000ff" />
    <Text style={{ marginTop: 10 }}>Loading OpenERP...</Text>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  loading: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    zIndex: 999
  }
});

export default App;
