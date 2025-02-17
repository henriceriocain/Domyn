// components / BouncyBox.tsx

import React, { useRef } from 'react';
import { Animated, TouchableWithoutFeedback, ViewStyle, StyleSheet, TouchableOpacityProps, View } from 'react-native';

interface BouncyBoxProps extends TouchableOpacityProps {
  children: React.ReactNode;
  containerStyle?: ViewStyle;
  onPress?: () => void;
  bounceScale?: number;
  friction?: number;
  tension?: number;
  disable?: boolean;
}

export const BouncyBox: React.FC<BouncyBoxProps> = ({
  children,
  containerStyle,
  onPress,
  bounceScale = 0.97,
  friction = 20,
  tension = 200,
  disable = false,
  ...touchableProps
}) => {
  const scaleValue = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    if (disable) return;
    Animated.spring(scaleValue, {
      toValue: bounceScale,
      friction,
      tension,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    if (disable) return;
    Animated.spring(scaleValue, {
      toValue: 1,
      friction,
      tension,
      useNativeDriver: true,
    }).start();
  };

  const handlePress = () => {
    if (disable || !onPress) return;
    onPress();
  };

  return (
    <TouchableWithoutFeedback
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={handlePress}
      {...touchableProps}
    >
      <Animated.View
        style={[
          styles.container,
          containerStyle,
          {
            transform: [{ scale: scaleValue }]
          }
        ]}
      >
        <View style={styles.contentContainer}>
          {children}
        </View>
      </Animated.View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    minHeight: 40,
  },
  contentContainer: {
    flex: 1,
    padding: 10,
  }
});
