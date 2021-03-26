import React, {useState} from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  Text,
  View,
  Animated,
  PanResponder,
  Dimensions,
} from 'react-native';

const windowHeight = Dimensions.get('window').height;

const App = () => {
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [translateValue, setTranslateValue] = useState(
    new Animated.Value(windowHeight),
  );
  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderMove: (event, gestureState) => {
      translateValue.setValue(Math.max(0, 0 + gestureState.dy));
    },
    onPanResponderRelease: (e, gesture) => {
      const shouldOpen = gesture.vy <= 0;
      setIsPopupVisible(shouldOpen);
      Animated.spring(translateValue, {
        toValue: shouldOpen ? 0 : windowHeight,
        velocity: gesture.vy,
        tension: 2,
        friction: 8,
        useNativeDriver: true,
      }).start();
    },
  });

  const toggleDetails = shouldOpen => {
    let toValue = 0;
    setIsPopupVisible(shouldOpen);
    if (!shouldOpen) {
      toValue = windowHeight;
    }
    Animated.spring(translateValue, {
      toValue,
      velocity: 3,
      tension: 2,
      friction: 8,
      useNativeDriver: true,
    }).start();
  };

  return (
    <>
      <View style={styles.mainView}>
        <TouchableOpacity
          onPress={() => toggleDetails(true)}
          style={styles.openButton}>
          <Text style={styles.openButtonText}>Open details</Text>
        </TouchableOpacity>
      </View>
      {isPopupVisible ? (
        <Animated.View
          {...panResponder.panHandlers}
          style={[styles.subView, {transform: [{translateY: translateValue}]}]}>
          <TouchableOpacity
            style={styles.closeButtonContainer}
            onPress={() => toggleDetails(false)}>
            <View style={styles.closeButton} />
          </TouchableOpacity>
          <View style={styles.detailsContainer}>
            <Text style={styles.detailsText}>Some random product details</Text>
          </View>
        </Animated.View>
      ) : null}
    </>
  );
};

const styles = StyleSheet.create({
  mainView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#85F6F8',
  },
  openButton: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 100,
    height: 40,
    backgroundColor: '#5B87E5',
  },
  openButtonText: {
    fontSize: 12,
    color: 'white',
  },
  subView: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'white',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    height: '100%',
  },
  closeButtonContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 18,
    paddingBottom: 12,
  },
  closeButton: {
    height: 7,
    width: 62,
    backgroundColor: '#8D8D8D',
    borderRadius: 3.5,
  },
  detailsContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  detailsText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#4A4A4A',
  },
});

export default App;
