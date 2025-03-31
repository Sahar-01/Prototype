import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet } from 'react-native';

const ChatScreen = () => {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');

  // FAQ data
  const faqData = [
    {
      question: "How do I add an expense?",
      answer: "To add an expense, go to the 'Add Expense' screen and fill in the details like the amount, category, and date.",
    },
    {
      question: "How can I track my expenses?",
      answer: "You can track your expenses by navigating to the 'Expenses' tab, where all your recorded expenses are listed.",
    },
    {
      question: "Can I categorize my expenses?",
      answer: "Yes, you can categorize your expenses into various categories such as Food, Travel, and Entertainment.",
    },
    {
      question: "How do I delete an expense?",
      answer: "To delete an expense, swipe left on the expense entry and tap the 'Delete' button.",
    },
    {
      question: "What do I do if I make an error in an entry?",
      answer: "You can edit any expense by tapping on it, correcting the details, and saving the changes.",
    },
  ];

  const sendMessage = (message) => {
    if (!message.trim()) return;

    const newMessage = { text: message, sender: 'user' };
    setMessages((prev) => [...prev, newMessage]);

    // Clear input text after sending
    setInputText('');

    // Check if the message is similar to any FAQ question
    const matchedFAQ = faqData.find(faq =>
      message.toLowerCase().includes(faq.question.toLowerCase())
    );

    if (matchedFAQ) {
      // If a match is found, respond with the corresponding answer
      setMessages((prev) => [...prev, { text: matchedFAQ.answer, sender: 'bot' }]);
    } else {
      // If no match is found, provide a default response
      setMessages((prev) => [...prev, { text: 'Sorry, I don’t have that information.', sender: 'bot' }]);
    }
  };

  const handleFAQClick = (answer) => {
    // Simulate sending the FAQ answer as bot message
    setMessages((prev) => [...prev, { text: answer, sender: 'bot' }]);
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={messages}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <Text style={item.sender === 'user' ? styles.userText : styles.botText}>
            {item.text}
          </Text>
        )}
      />

      <FlatList
        data={faqData}
        keyExtractor={(item, index) => `faq-${index}`}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.faqButton}
            onPress={() => handleFAQClick(item.answer)}
          >
            <Text style={styles.faqText}>{item.question}</Text>
          </TouchableOpacity>
        )}
      />

      <TextInput
        style={styles.input}
        value={inputText}
        onChangeText={setInputText}
        placeholder="Type a message..."
      />
      <TouchableOpacity style={styles.button} onPress={() => sendMessage(inputText)}>
        <Text style={styles.buttonText}>Send</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f9f9f9' },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 10, marginTop: 10 },
  button: { backgroundColor: '#007bff', padding: 10, marginTop: 10 },
  buttonText: { color: '#fff', textAlign: 'center' },
  userText: { color: '#007bff', alignSelf: 'flex-end', marginVertical: 4 },
  botText: { color: '#000', alignSelf: 'flex-start', marginVertical: 4 },
  faqButton: {
    padding: 10,
    backgroundColor: '#ddd',
    borderRadius: 5,
    marginTop: 10,
    marginBottom: 5,
  },
  faqText: { color: '#333', fontSize: 16 },
});

export default ChatScreen;
