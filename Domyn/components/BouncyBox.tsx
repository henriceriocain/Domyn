import React, { useRef, useCallback } from 'react';
import { 
  Animated, 
  TouchableOpacity, 
  ViewStyle, 
  StyleSheet,
  TouchableOpacityProps,
  View 
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
  // Use useRef for animation value to prevent recreation
  const scaleValue = useRef(new Animated.Value(1)).current;
  const isAnimating = useRef(false);

  // Cache animation configs
  const shrinkAnimation = useRef(
    Animated.spring(scaleValue, {
      toValue: bounceScale,
      friction,
      tension,
      useNativeDriver: true,
    })
  ).current;

  const expandAnimation = useRef(
    Animated.spring(scaleValue, {
      toValue: 1,
      friction,
      tension,
      useNativeDriver: true,
    })
  ).current;

  const handlePressIn = useCallback(() => {
    if (!isAnimating.current) {
      isAnimating.current = true;
      shrinkAnimation.start();
    }
  }, [shrinkAnimation]);

  const handlePressOut = useCallback(() => {
    if (isAnimating.current) {
      expandAnimation.start(() => {
        isAnimating.current = false;
      });
    }
  }, [expandAnimation]);

  const handlePress = useCallback(() => {
    if (!onPress) return;

    if (!isAnimating.current) {
      isAnimating.current = true;
      Animated.sequence([shrinkAnimation, expandAnimation]).start(() => {
        isAnimating.current = false;
        setTimeout(onPress, delay);
      });
    }
  }, [onPress, delay, shrinkAnimation, expandAnimation]);

  return (
    <View style={[styles.container, containerStyle]}>
      <Animated.View
        style={[
          styles.animatedContainer,
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    minHeight: 40,
  },
  animatedContainer: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  touchable: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'flex-start',
    padding: 10,
  },
});