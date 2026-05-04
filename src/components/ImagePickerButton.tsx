import React from 'react';
import { View, Text, Image, TouchableOpacity, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import tw from 'twrnc';

interface ImagePickerButtonProps {
    imageUri: string | null;
    onImageSelected: (uri: string) => void;
}

export default function ImagePickerButton({ imageUri, onImageSelected }: ImagePickerButtonProps) {
    const handlePress = () => {
        Alert.alert('Add Photo', 'Choose how to add a product photo', [
            { text: 'Camera', onPress: () => pickFromCamera() },
            { text: 'Photo Library', onPress: () => pickFromLibrary() },
            { text: 'Cancel', style: 'cancel' },
        ]);
    };

    const pickFromLibrary = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.8,
        });
        if (!result.canceled && result.assets[0]) {
            onImageSelected(result.assets[0].uri);
        }
    };

    const pickFromCamera = async () => {
        const permission = await ImagePicker.requestCameraPermissionsAsync();
        if (!permission.granted) {
            Alert.alert('Permission needed', 'Camera access is required to take photos.');
            return;
        }
        const result = await ImagePicker.launchCameraAsync({
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.8,
        });
        if (!result.canceled && result.assets[0]) {
            onImageSelected(result.assets[0].uri);
        }
    };

    return (
        <TouchableOpacity style={tw`self-center mb-8`} onPress={handlePress} activeOpacity={0.8}>
            {imageUri ? (
                <View>
                    <Image source={{ uri: imageUri }} style={tw`w-36 h-36 rounded-2xl border-2 border-violet-500`} />
                    <View style={tw`absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-[#1A1A1A] items-center justify-center border-2 border-violet-500`}>
                        <Ionicons name="pencil" size={14} color="#7C3AED" />
                    </View>
                </View>
            ) : (
                <View style={tw`w-36 h-36 rounded-2xl bg-[#1A1A1A] border-2 border-dashed border-[#333] items-center justify-center`}>
                    <Ionicons name="camera-outline" size={36} color="#7C3AED" style={tw`mb-2`} />
                    <Text style={tw`text-sm font-semibold text-white`}>Add Photo</Text>
                    <Text style={tw`text-xs text-gray-600 mt-0.5`}>Tap to choose</Text>
                </View>
            )}
        </TouchableOpacity>
    );
}
