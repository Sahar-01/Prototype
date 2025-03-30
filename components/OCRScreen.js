import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system'; // To handle file system and base64 encoding
import Tesseract from 'tesseract.js'; // Import Tesseract.js

const OCRScreen = () => {
    const [imageUri, setImageUri] = useState(null);
    const [extractedText, setExtractedText] = useState('');
    const [showOptions, setShowOptions] = useState(false);

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
            processImage(result.uri);  // Call the function to process the image
        } else {
            console.log("User cancelled image selection");
        }
    };

    // Process image with Tesseract.js
    const processImage = async (imageUri) => {
        try {
            // Convert the image to base64 format
            const base64Image = await FileSystem.readAsStringAsync(imageUri, {
                encoding: FileSystem.EncodingType.Base64,
            });

            console.log("Starting OCR with Tesseract.js...");
            
            // Start OCR with Tesseract.js
            Tesseract.recognize(
                `data:image/jpeg;base64,${base64Image}`, // Image in base64 format
                'eng', // Language (English in this case)
                {
                    logger: (m) => console.log(m), // Optionally log progress
                }
            ).then(({ data: { text } }) => {
                console.log("OCR Result:", text);
                setExtractedText(text);  // Set the extracted text
            }).catch((error) => {
                console.error("OCR Error:", error);
            });

        } catch (error) {
            console.error("Error processing image:", error);
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
n
export default OCRScreen;