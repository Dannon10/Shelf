import React, { useEffect, useRef } from 'react';
import { View, Text, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import tw from 'twrnc';

export default function EmptyShelf() {
    const floatAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(floatAnim, { toValue: -10, duration: 1800, useNativeDriver: true }),
                Animated.timing(floatAnim, { toValue: 0, duration: 1800, useNativeDriver: true }),
            ])
        ).start();
    }, []);

    return (
        <View style={tw`flex-1 items-center justify-center px-10 pb-20`}>
            <Animated.View style={[tw`mb-6 bg-[#1A1A1A] p-6 rounded-3xl border border-[#2A2A2A]`, { transform: [{ translateY: floatAnim }] }]}>
                <Ionicons name="cube-outline" size={56} color="#7C3AED" />
            </Animated.View>
            <Text style={tw`text-2xl font-bold text-white mb-2.5 text-center`}>Your shelf is empty</Text>
            <Text style={tw`text-base text-gray-600 text-center leading-6`}>
                Tap the <Text style={tw`text-violet-400 font-bold text-lg`}>+</Text> button to add your first product
            </Text>
        </View>
    );
}
