import React, { useEffect, useRef } from 'react';
import {
    View, Text, Image, TouchableOpacity,
    Animated, Alert, ScrollView,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useProducts } from '../context/ProductContext';
import { RootStackParamList } from '../types';
import * as Haptics from 'expo-haptics';
import tw from 'twrnc';

type DetailRouteProp = RouteProp<RootStackParamList, 'ProductDetail'>;

export default function ProductDetailScreen() {
    const navigation = useNavigation();
    const route = useRoute<DetailRouteProp>();
    const { state, removeProduct } = useProducts();
    const product = state.products.find((p) => p.id === route.params.productId);

    const slideAnim = useRef(new Animated.Value(60)).current;
    const opacityAnim = useRef(new Animated.Value(0)).current;
    const imageAnim = useRef(new Animated.Value(0.85)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.spring(slideAnim, { toValue: 0, tension: 60, friction: 10, useNativeDriver: true }),
            Animated.timing(opacityAnim, { toValue: 1, duration: 300, useNativeDriver: true }),
            Animated.spring(imageAnim, { toValue: 1, tension: 60, friction: 10, useNativeDriver: true }),
        ]).start();
    }, []);

    if (!product) {
        return (
            <View style={tw`flex-1 bg-[#0A0A0A] items-center justify-center`}>
                <Text style={tw`text-white text-lg`}>Product not found</Text>
                <TouchableOpacity onPress={() => navigation.goBack()} style={tw`mt-4`}>
                    <Text style={tw`text-violet-400`}>Go back</Text>
                </TouchableOpacity>
            </View>
        );
    }

    const formattedDate = new Date(product.createdAt).toLocaleDateString('en-US', {
        month: 'long', day: 'numeric', year: 'numeric',
    });

    const handleDelete = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
        Alert.alert('Remove from Shelf', `Are you sure you want to remove "${product.name}"?`, [
            { text: 'Cancel', style: 'cancel' },
            {
                text: 'Remove', style: 'destructive',
                onPress: () => {
                    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                    removeProduct(product.id);
                    navigation.goBack();
                },
            },
        ]);
    };

    return (
        <ScrollView style={tw`flex-1 bg-[#0A0A0A]`} contentContainerStyle={tw`pb-12`} bounces={false}>
            <TouchableOpacity
                onPress={() => navigation.goBack()}
                style={tw`pt-14 px-5 pb-5 flex-row items-center gap-1`}
            >
                <Ionicons name="chevron-back" size={18} color="#7C3AED" />
                <Text style={tw`text-violet-400 text-base font-semibold`}>Back</Text>
            </TouchableOpacity>

            <Animated.View style={[tw`mx-5 rounded-3xl overflow-hidden h-64 bg-[#1A1A1A] mb-6`, { transform: [{ scale: imageAnim }], opacity: opacityAnim }]}>
                {product.imageUri ? (
                    <Image source={{ uri: product.imageUri }} style={tw`w-full h-full`} resizeMode="cover" />
                ) : (
                    <View style={tw`flex-1 items-center justify-center bg-[#1E1E1E]`}>
                        <Ionicons name="cube-outline" size={72} color="#2A2A2A" />
                    </View>
                )}
            </Animated.View>

            <Animated.View style={[tw`mx-5 bg-[#1A1A1A] rounded-3xl p-5 border border-[#2A2A2A] mb-6`, { transform: [{ translateY: slideAnim }], opacity: opacityAnim }]}>
                <Text style={tw`text-3xl font-black text-white mb-5 tracking-tight`}>{product.name}</Text>

                <View style={tw`flex-row justify-between items-center mb-5`}>
                    <Text style={tw`text-sm text-gray-500 font-semibold`}>Price</Text>
                    <Text style={tw`text-3xl font-black text-violet-400 tracking-tight`}>
                        {product.currency}{parseFloat(String(product.price)).toFixed(2)}
                    </Text>
                </View>

                <View style={tw`h-px bg-[#2A2A2A] mb-5`} />

                <View style={tw`flex-row justify-between items-center mb-3`}>
                    <View style={tw`flex-row items-center gap-2`}>
                        <Ionicons name="calendar-outline" size={15} color="#4B5563" />
                        <Text style={tw`text-sm text-gray-600`}>Added on</Text>
                    </View>
                    <Text style={tw`text-sm text-white font-semibold`}>{formattedDate}</Text>
                </View>

                <View style={tw`flex-row justify-between items-center`}>
                    <View style={tw`flex-row items-center gap-2`}>
                        <Ionicons name="barcode-outline" size={15} color="#4B5563" />
                        <Text style={tw`text-sm text-gray-600`}>Product ID</Text>
                    </View>
                    <Text style={tw`text-sm text-white font-semibold`}>{product.id.split('-')[0].toUpperCase()}</Text>
                </View>
            </Animated.View>

            <TouchableOpacity
                style={tw`mx-5 py-4 rounded-2xl bg-[#1A1A1A] items-center border border-red-900 flex-row justify-center gap-2`}
                onPress={handleDelete}
                activeOpacity={0.8}
            >
                <Ionicons name="trash-outline" size={18} color="#ef4444" />
                <Text style={tw`text-red-500 text-base font-bold`}>Remove from Shelf</Text>
            </TouchableOpacity>
        </ScrollView>
    );
}
