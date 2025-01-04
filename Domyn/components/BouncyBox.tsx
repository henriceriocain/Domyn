import React from 'react';
import { 
  Animated, 
  TouchableOpacity, 
  ViewStyle, 
  StyleSheet,
  TouchableOpacityProps 
} from 'react-native';

interface BouncyBoxProps extends TouchableOpacityProps {
  children: React.ReactNode;
  containerStyle?: ViewStyle;
  onPress?: () => void;
  bounceScale?: number;
  friction?: number;
  tension?: number;
  delay?: number;
}

export const BouncyBox: React.FC<BouncyBoxProps> = ({
  children,
  containerStyle,
  onPress,
  bounceScale = 0.97,
  friction = 20,
  tension = 200,
  delay = 100,
  ...touchableProps
}) => {
  const scaleValue = new Animated.Value(1);

  const handlePressIn = () => {
    Animated.spring(scaleValue, {
      toValue: bounceScale,
      friction,
      tension,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleValue, {
      toValue: 1,
      friction,
      tension,
      useNativeDriver: true,
    }).start();
  };

  const handlePress = () => {
    if (onPress) {
      // Complete bounce animation first
      Animated.sequence([
        Animated.spring(scaleValue, {
          toValue: bounceScale,
          friction,
          tension,
          useNativeDriver: true,
        }),
        Animated.spring(scaleValue, {
          toValue: 1,
          friction,
          tension,
          useNativeDriver: true,
        })
      ]).start();

      // Execute onPress with delay
      setTimeout(onPress, delay);
    }
  };

  return (
    <Animated.View
      style={[
        styles.container,
        containerStyle,
        {
          transform: [{ scale: scaleValue }]
        }
      ]}
    >
      <TouchableOpacity
        activeOpacity={1}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={handlePress}
        style={styles.touchable}
        {...touchableProps}
      >
        {children}
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    minHeight: 40, // Added default minimum height
    padding: 10, // Added padding for better content spacing
  },
  touchable: {
    width: '100%',
    height: '100%',
    justifyContent: 'center', // Added to center content vertically
    alignItems: 'flex-start', // Changed to flex-start to align text left
  },
});