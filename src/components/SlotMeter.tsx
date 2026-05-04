// src/components/SlotMeter.tsx
import React, { useEffect, useRef } from 'react';
import { View, Text, Animated } from 'react-native';
import { MAX_PRODUCTS } from '../types';
import tw from 'twrnc';

interface SlotMeterProps {
    used: number;
}

export default function SlotMeter({ used }: SlotMeterProps) {
    const pulseAnim = useRef(new Animated.Value(1)).current;
    const isFull = used >= MAX_PRODUCTS;

    useEffect(() => {
        if (isFull) {
            Animated.loop(
                Animated.sequence([
                    Animated.timing(pulseAnim, { toValue: 1.05, duration: 600, useNativeDriver: true }),
                    Animated.timing(pulseAnim, { toValue: 1, duration: 600, useNativeDriver: true }),
                ])
            ).start();
        } else {
            pulseAnim.setValue(1);
        }
    }, [isFull]);

    const getSlotColor = (index: number) => {
        if (index >= used) return '#2A2A2A';
        if (used >= MAX_PRODUCTS) return '#ef4444';
        if (used >= MAX_PRODUCTS - 1) return '#f59e0b';
        return '#7C3AED';
    };

    return (
        <Animated.View style={[tw`items-center py-3 px-5 bg-[#141414] rounded-2xl mx-5 mb-4 border border-[#1E1E1E]`, { transform: [{ scale: pulseAnim }] }]}>
            <View style={tw`flex-row mb-2`}>
                {Array.from({ length: MAX_PRODUCTS }).map((_, i) => (
                    <View
                        key={i}
                        style={[
                            tw`h-1.5 w-9 rounded-full`,
                            i < MAX_PRODUCTS - 1 && tw`mr-1.5`,
                            { backgroundColor: getSlotColor(i) },
                        ]}
                    />
                ))}
            </View>
            <Text style={[tw`text-xs font-bold uppercase tracking-widest`, isFull ? tw`text-red-500` : tw`text-gray-600`]}>
                {isFull ? 'SHELF FULL' : `${MAX_PRODUCTS - used} of ${MAX_PRODUCTS} slots open`}
            </Text>
        </Animated.View>
    );
}
