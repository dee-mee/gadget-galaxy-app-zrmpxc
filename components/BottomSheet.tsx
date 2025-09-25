
import React, { useEffect, useRef, useState, useCallback } from 'react';
import { PanGestureHandler, State } from 'react-native-gesture-handler';
import {
  View,
  Text,
  StyleSheet,
  Button,
  Modal,
  Animated,
  TouchableWithoutFeedback,
  Dimensions
} from 'react-native';
import { colors } from '../styles/commonStyles';

interface SimpleBottomSheetProps {
  children?: React.ReactNode;
  isVisible?: boolean;
  onClose?: () => void;
}

const SNAP_POINTS = [0, 0.5, 1];

export default function SimpleBottomSheet({ children, isVisible = false, onClose }: SimpleBottomSheetProps) {
  const [visible, setVisible] = useState(isVisible);
  const translateY = useRef(new Animated.Value(Dimensions.get('window').height)).current;
  const backdropOpacity = useRef(new Animated.Value(0)).current;
  const gestureTranslateY = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isVisible) {
      setVisible(true);
      Animated.parallel([
        Animated.spring(translateY, {
          toValue: 0,
          useNativeDriver: true,
        }),
        Animated.timing(backdropOpacity, {
          toValue: 0.5,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.spring(translateY, {
          toValue: Dimensions.get('window').height,
          useNativeDriver: true,
        }),
        Animated.timing(backdropOpacity, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setVisible(false);
      });
    }
  }, [isVisible, translateY, backdropOpacity]);

  const handleBackdropPress = useCallback(() => {
    onClose?.();
  }, [onClose]);

  const getClosestSnapPoint = (currentY: number, velocityY: number) => {
    const screenHeight = Dimensions.get('window').height;
    const snapPoints = SNAP_POINTS.map(point => point * screenHeight);
    
    let closestPoint = snapPoints[0];
    let minDistance = Math.abs(currentY - snapPoints[0]);
    
    for (const point of snapPoints) {
      const distance = Math.abs(currentY - point);
      if (distance < minDistance) {
        minDistance = distance;
        closestPoint = point;
      }
    }
    
    // Consider velocity for better UX
    if (velocityY > 500) {
      return screenHeight; // Close
    } else if (velocityY < -500) {
      return 0; // Open fully
    }
    
    return closestPoint;
  };

  const onGestureEvent = (event: any) => {
    const { translationY } = event.nativeEvent;
    gestureTranslateY.setValue(Math.max(0, translationY));
  };

  const onHandlerStateChange = (event: any) => {
    if (event.nativeEvent.state === State.END) {
      const { translationY, velocityY } = event.nativeEvent;
      const currentY = translationY;
      const snapPoint = getClosestSnapPoint(currentY, velocityY);
      
      if (snapPoint >= Dimensions.get('window').height * 0.8) {
        onClose?.();
      } else {
        Animated.spring(gestureTranslateY, {
          toValue: 0,
          useNativeDriver: true,
        }).start();
      }
    }
  };

  if (!visible) return null;

  return (
    <Modal
      transparent
      visible={visible}
      animationType="none"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        <TouchableWithoutFeedback onPress={handleBackdropPress}>
          <Animated.View 
            style={[
              styles.backdrop,
              { opacity: backdropOpacity }
            ]} 
          />
        </TouchableWithoutFeedback>
        
        <PanGestureHandler
          onGestureEvent={onGestureEvent}
          onHandlerStateChange={onHandlerStateChange}
        >
          <Animated.View 
            style={[
              styles.sheet,
              {
                transform: [
                  { translateY: Animated.add(translateY, gestureTranslateY) }
                ]
              }
            ]}
          >
            <View style={styles.handle} />
            {children}
          </Animated.View>
        </PanGestureHandler>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'black',
  },
  sheet: {
    backgroundColor: colors.background,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    minHeight: '50%',
    maxHeight: '90%',
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: colors.border,
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: 12,
    marginBottom: 20,
  },
});
