import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';

const OCRScreen = () => {
    const [imageUri, setImageUri] = useState(null);
    const [extractedText, setExtractedText] = useState('');
    const [showOptions, setShowOptions] = useState(false); // For toggle functionality

    // Select image from gallery using Expo's ImagePicker
    const selectImage = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (status !== 'granted') {
            console.log("Permission denied!");
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.cancelled) {
            console.log("Image selected:", result.uri);
            setImageUri(result.uri);
            uploadImage(result);
        } else {
            console.log("User cancelled image selection");
        }
    };

    // Upload image to backend for OCR processing
    const uploadImage = async (image) => {
        console.log("Uploading image:", image.uri);

        const formData = new FormData();
        formData.append('file', {
            uri: image.uri,
            type: 'image/jpeg',
            name: 'receipt.jpg',
        });

        try {
            console.log("Sending image to backend...");
            const response = await axios.post('http://10.0.2.2:3000/ocr', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            console.log("OCR Response:", response.data);
            setExtractedText(response.data.text);
        } catch (error) {
            console.error("Error uploading image:", error);
        }
    };

    return (
        <View style={styles.container}>
            {/* Floating Action Button (FAB) */}
            <TouchableOpacity
                style={styles.fab}
                onPress={() => {
                    console.log("FAB pressed!");
                    setShowOptions(!showOptions);
                }}
            >
                <Text style={styles.fabText}>+</Text>
            </TouchableOpacity>

            {/* Options (Manual and OCR) */}
            {showOptions && (
                <View style={styles.optionsContainer}>
                    <TouchableOpacity
                        style={styles.optionButton}
                        onPress={() => console.log("Manual option selected")}
                    >
                        <Text style={styles.optionText}>Manual</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.optionButton}
                        onPress={selectImage} // Trigger OCR image selection
                    >
                        <Text style={styles.optionText}>OCR</Text>
                    </TouchableOpacity>
                </View>
            )}

            {/* Show Selected Image */}
            {imageUri && <Image source={{ uri: imageUri }} style={styles.imagePreview} />}

            {/* Show Extracted Text */}
            {extractedText ? <Text>{`Extracted Text: ${extractedText}`}</Text> : null}
        </View>
    );
};

// Styling
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    fab: {
        position: 'absolute',
        bottom: 30,
        right: 30,
        backgroundColor: '#ff6347', // Red color
        width: 70, // Increase size
        height: 70, // Increase size
        borderRadius: 35, // Circle shape
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    fabText: {
        color: '#fff',
        fontSize: 30,
        fontWeight: 'bold',
    },
    optionsContainer: {
        position: 'absolute',
        bottom: 110, // Increase this value to make sure options don't overlap FAB
        right: 30,
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    optionButton: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        marginVertical: 5,
        backgroundColor: '#ff6347', // Red color for consistency
        borderRadius: 5,
    },
    optionText: {
        color: '#fff',
        fontSize: 16,
    },
    imagePreview: {
        width: 200,
        height: 200,
        marginTop: 10,
    },
});

export default OCRScreen;
