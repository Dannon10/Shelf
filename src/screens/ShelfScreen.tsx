import React, { useEffect, useRef, useCallback } from 'react';
import {
    View, Text, FlatList, TouchableOpacity,
    Animated, Alert, StatusBar,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { useProducts } from '../context/ProductContext';
import { RootStackParamList, MAX_PRODUCTS } from '../types';
import ProductCard from '../components/ProductCard';
import SlotMeter from '../components/SlotMeter';
import EmptyShelf from '../components/EmptyShelf';
import * as Haptics from 'expo-haptics';
import tw from 'twrnc';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Shelf'>;

export default function ShelfScreen() {
    const navigation = useNavigation<NavigationProp>();
    const { state, removeProduct } = useProducts();
    const { products } = state;

    const fabAnim = useRef(new Animated.Value(0)).current;
    const headerAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.spring(fabAnim, { toValue: 1, delay: 300, tension: 60, friction: 8, useNativeDriver: true }),
            Animated.timing(headerAnim, { toValue: 1, duration: 400, useNativeDriver: true }),
        ]).start();
    }, []);

    const handleAddPress = useCallback(() => {
        if (products.length >= MAX_PRODUCTS) {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
            Alert.alert('Shelf Full', `You can only store up to ${MAX_PRODUCTS} products. Remove one to make room.`, [{ text: 'Got it' }]);
            return;
        }
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        navigation.navigate('AddProduct');
    }, [products.length, navigation]);

    const handleLongPress = useCallback((id: string, name: string) => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
        Alert.alert('Remove Product', `Remove "${name}" from your shelf?`, [
            { text: 'Cancel', style: 'cancel' },
            {
                text: 'Remove', style: 'destructive',
                onPress: () => {
                    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                    removeProduct(id);
                },
            },
        ]);
    }, [removeProduct]);

    const isFull = products.length >= MAX_PRODUCTS;

    return (
        <View style={tw`flex-1 bg-[#0A0A0A]`}>
            <StatusBar barStyle="light-content" />

            <Animated.View
                style={[
                    tw`flex-row items-center justify-between px-5 pt-14 pb-5`,
                    {
                        opacity: headerAnim,
                        transform: [{ translateY: headerAnim.interpolate({ inputRange: [0, 1], outputRange: [-20, 0] }) }],
                    },
                ]}
            >
                <View>
                    <Text style={tw`text-4xl font-black text-white tracking-tight`}>Shelf</Text>
                    <Text style={tw`text-sm text-gray-600 mt-0.5`}>
                        {products.length === 0 ? 'No products yet' : `${products.length} product${products.length !== 1 ? 's' : ''}`}
                    </Text>
                </View>
                <View style={tw`bg-[#1A1A1A] px-4 py-2 rounded-full border border-[#2A2A2A] flex-row items-center gap-1.5`}>
                    <Ionicons name="layers-outline" size={14} color="#7C3AED" />
                    <Text style={tw`text-violet-400 font-bold text-sm`}>{products.length}/{MAX_PRODUCTS}</Text>
                </View>
            </Animated.View>

            <SlotMeter used={products.length} />

            {products.length === 0 ? (
                <EmptyShelf />
            ) : (
                <FlatList
                    data={products}
                    keyExtractor={(item) => item.id}
                    numColumns={2}
                    contentContainerStyle={tw`px-2.5 pb-24`}
                    columnWrapperStyle={tw`justify-center`}
                    showsVerticalScrollIndicator={false}
                    renderItem={({ item, index }) => (
                        <ProductCard
                            product={item}
                            index={index}
                            onPress={() => navigation.navigate('ProductDetail', { productId: item.id })}
                            onLongPress={() => handleLongPress(item.id, item.name)}
                        />
                    )}
                />
            )}

            <Animated.View style={[tw`absolute bottom-9 right-6`, { transform: [{ scale: fabAnim }] }]}>
                <TouchableOpacity
                    style={[
                        tw`w-16 h-16 rounded-full items-center justify-center`,
                        isFull ? tw`bg-[#2A2A2A]` : tw`bg-violet-600`,
                    ]}
                    onPress={handleAddPress}
                    activeOpacity={0.85}
                >
                    <Ionicons
                        name={isFull ? 'lock-closed' : 'add'}
                        size={28}
                        color="#fff"
                    />
                </TouchableOpacity>
            </Animated.View>
        </View>
    );
}
