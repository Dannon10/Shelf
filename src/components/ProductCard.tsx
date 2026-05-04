import React, { useRef } from 'react';
import {
    View, Text, Image, TouchableOpacity, Animated, Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Product } from '../types';
import tw from 'twrnc';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 52) / 2;

interface ProductCardProps {
    product: Product;
    index: number;
    onPress: () => void;
    onLongPress: () => void;
}

export default function ProductCard({ product, index, onPress, onLongPress }: ProductCardProps) {
    const scaleAnim = useRef(new Animated.Value(1)).current;

    const handlePressIn = () => {
        Animated.spring(scaleAnim, { toValue: 0.95, useNativeDriver: true, tension: 300, friction: 10 }).start();
    };

    const handlePressOut = () => {
        Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true, tension: 300, friction: 10 }).start();
    };

    const stripeColors = ['#7C3AED', '#0891B2', '#059669', '#D97706', '#DB2777'];
    const stripeColor = stripeColors[index % stripeColors.length];

    return (
        <Animated.View style={[{ width: CARD_WIDTH, margin: 6 }, { transform: [{ scale: scaleAnim }] }]}>
            <TouchableOpacity
                activeOpacity={1}
                onPress={onPress}
                onLongPress={onLongPress}
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
                style={tw`bg-[#1A1A1A] rounded-2xl overflow-hidden border border-[#2A2A2A]`}
            >
                <View style={[tw`h-1 w-full`, { backgroundColor: stripeColor }]} />
                <View style={[tw`bg-[#222] overflow-hidden`, { height: CARD_WIDTH * 0.8 }]}>
                    {product.imageUri ? (
                        <Image source={{ uri: product.imageUri }} style={tw`w-full h-full`} resizeMode="cover" />
                    ) : (
                        <View style={tw`flex-1 items-center justify-center bg-[#1E1E1E]`}>
                            <Ionicons name="cube-outline" size={40} color="#2A2A2A" />
                        </View>
                    )}
                </View>
                <View style={tw`p-3`}>
                    <Text style={tw`text-sm font-semibold text-white mb-1.5 leading-5`} numberOfLines={2}>
                        {product.name}
                    </Text>
                    <Text style={[tw`text-base font-bold`, { color: stripeColor }]}>
                        {product.currency}{parseFloat(String(product.price)).toFixed(2)}
                    </Text>
                </View>
            </TouchableOpacity>
        </Animated.View>
    );
}
