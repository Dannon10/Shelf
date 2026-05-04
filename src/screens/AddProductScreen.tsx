import React, { useState, useRef } from 'react';
import {
    View, Text, TextInput, TouchableOpacity,
    ScrollView, KeyboardAvoidingView, Platform, Animated, Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useProducts } from '../context/ProductContext';
import { Product, ProductFormData, CURRENCIES } from '../types';
import ImagePickerButton from '../components/ImagePickerButton';
import * as Haptics from 'expo-haptics';
import * as Crypto from 'expo-crypto';
import tw from 'twrnc';

export default function AddProductScreen() {
    const navigation = useNavigation();
    const { addProduct } = useProducts();

    const [form, setForm] = useState<ProductFormData>({
        name: '',
        price: '',
        imageUri: null,
        currency: '$',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [focusedField, setFocusedField] = useState<string | null>(null);

    const shakeAnim = useRef(new Animated.Value(0)).current;

    const shake = () => {
        Animated.sequence([
            Animated.timing(shakeAnim, { toValue: 10, duration: 60, useNativeDriver: true }),
            Animated.timing(shakeAnim, { toValue: -10, duration: 60, useNativeDriver: true }),
            Animated.timing(shakeAnim, { toValue: 6, duration: 60, useNativeDriver: true }),
            Animated.timing(shakeAnim, { toValue: 0, duration: 60, useNativeDriver: true }),
        ]).start();
    };

    const handleSubmit = async () => {
        if (isSubmitting) return;

        const trimmedName = form.name.trim();
        const priceNum = parseFloat(form.price);

        if (!trimmedName) {
            shake();
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
            Alert.alert('Missing name', 'Please give your product a name.');
            return;
        }
        if (!form.price || isNaN(priceNum) || priceNum < 0) {
            shake();
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
            Alert.alert('Invalid price', 'Please enter a valid price.');
            return;
        }

        setIsSubmitting(true);
        try {
            const newProduct: Product = {
                id: Crypto.randomUUID(),
                name: trimmedName,
                price: priceNum,
                imageUri: form.imageUri,
                createdAt: new Date().toISOString(),
                currency: form.currency,
            };
            await addProduct(newProduct);
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            navigation.goBack();
        } catch (e) {
            Alert.alert('Error', 'Something went wrong. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const isValid = form.name.trim().length > 0 && form.price.length > 0;

    return (
        <KeyboardAvoidingView style={tw`flex-1 bg-[#0A0A0A]`} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
            <ScrollView style={tw`flex-1`} contentContainerStyle={tw`pb-16 px-5`} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>

                <View style={tw`flex-row items-center justify-between pt-14 pb-8`}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={tw`flex-row items-center gap-1`}>
                        <Ionicons name="chevron-back" size={18} color="#7C3AED" />
                        <Text style={tw`text-violet-400 text-base font-semibold`}>Back</Text>
                    </TouchableOpacity>
                    <Text style={tw`text-white text-lg font-bold`}>New Product</Text>
                    <View style={tw`w-16`} />
                </View>

                <ImagePickerButton
                    imageUri={form.imageUri}
                    onImageSelected={(uri) => setForm((f) => ({ ...f, imageUri: uri }))}
                />

                <Animated.View style={{ transform: [{ translateX: shakeAnim }] }}>
                    <Text style={tw`text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 mt-1`}>
                        Product Name
                    </Text>
                    <TextInput
                        style={[
                            tw`bg-[#1A1A1A] rounded-2xl px-4 py-4 text-base text-white mb-6 border border-[#2A2A2A]`,
                            focusedField === 'name' && tw`border-violet-500`,
                        ]}
                        placeholder="e.g. Wireless Headphones"
                        placeholderTextColor="#444"
                        value={form.name}
                        onChangeText={(t) => setForm((f) => ({ ...f, name: t }))}
                        onFocus={() => setFocusedField('name')}
                        onBlur={() => setFocusedField(null)}
                        returnKeyType="next"
                        maxLength={60}
                    />

                    <Text style={tw`text-xs font-bold text-gray-500 uppercase tracking-widest mb-2`}>
                        Currency
                    </Text>
                    <View style={tw`flex-row mb-6 flex-wrap gap-2`}>
                        {CURRENCIES.map((c) => (
                            <TouchableOpacity
                                key={c}
                                style={[
                                    tw`px-4 py-2 rounded-full bg-[#1A1A1A] border border-[#2A2A2A]`,
                                    form.currency === c && tw`border-violet-500 bg-violet-950`,
                                ]}
                                onPress={() => { Haptics.selectionAsync(); setForm((f) => ({ ...f, currency: c })); }}
                            >
                                <Text style={[tw`text-base font-semibold text-gray-500`, form.currency === c && tw`text-violet-400`]}>
                                    {c}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    <Text style={tw`text-xs font-bold text-gray-500 uppercase tracking-widest mb-2`}>
                        Price
                    </Text>
                    <View style={tw`flex-row items-center gap-2 mb-2`}>
                        <View style={tw`bg-[#1A1A1A] rounded-2xl px-4 py-4 border border-[#2A2A2A] min-w-[50px] items-center`}>
                            <Text style={tw`text-violet-400 text-lg font-bold`}>{form.currency}</Text>
                        </View>
                        <TextInput
                            style={[
                                tw`flex-1 bg-[#1A1A1A] rounded-2xl px-4 py-3 text-2xl font-semibold text-white border border-[#2A2A2A]`,
                                focusedField === 'price' && tw`border-violet-500`,
                            ]}
                            placeholder="0.00"
                            placeholderTextColor="#444"
                            value={form.price}
                            onChangeText={(t) => { if (/^\d*\.?\d{0,2}$/.test(t)) setForm((f) => ({ ...f, price: t })); }}
                            onFocus={() => setFocusedField('price')}
                            onBlur={() => setFocusedField(null)}
                            keyboardType="decimal-pad"
                            returnKeyType="done"
                        />
                    </View>
                </Animated.View>

                <TouchableOpacity
                    style={[tw`rounded-2xl py-5 items-center mt-8 flex-row justify-center gap-2`, isValid && !isSubmitting ? tw`bg-violet-600` : tw`bg-[#2A2A2A]`]}
                    onPress={handleSubmit}
                    disabled={isSubmitting || !isValid}
                    activeOpacity={0.85}
                >
                    {isSubmitting
                        ? <Ionicons name="hourglass-outline" size={20} color="#fff" />
                        : <Ionicons name="add-circle-outline" size={20} color={isValid ? '#fff' : '#555'} />
                    }
                    <Text style={[tw`text-base font-bold tracking-wide`, isValid ? tw`text-white` : tw`text-gray-600`]}>
                        {isSubmitting ? 'Adding...' : 'Add to Shelf'}
                    </Text>
                </TouchableOpacity>

                <View style={tw`flex-row items-center justify-center gap-1.5 mt-5`}>
                    <Ionicons name="hand-left-outline" size={12} color="#333" />
                    <Text style={tw`text-center text-[#333] text-xs`}>Long-press a card to remove it</Text>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}
