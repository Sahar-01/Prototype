import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { compareTwoStrings } from 'string-similarity';

const ChatScreen = () => {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [showFAQ, setShowFAQ] = useState(true);
  const [lastFAQ, setLastFAQ] = useState(null);

  const faqData = [
    { question: "How do I add an expense?", answer: "Go to the 'Add Expense' screen and fill in the form.", followUp: "Tap the '+' icon on the dashboard to get started." },
    { question: "Where can I view my past expenses?", answer: "Use the 'History' or 'Expenses' tab.", followUp: "You'll see a list organized by date, with filters available." },
    { question: "How can I edit an expense?", answer: "Tap on the expense entry and choose 'Edit'.", followUp: "Make your changes and press 'Save'." },
    { question: "How do I delete an expense?", answer: "Swipe left on the expense entry and tap 'Delete'.", followUp: "Confirm the deletion when prompted." },
    { question: "Can I categorize my expenses?", answer: "Yes, you can assign categories like Food, Travel, etc.", followUp: "Use the category dropdown when adding or editing." },
  ];

  const generalResponses = [
    {
      triggers: ["what can you do", "what are you", "what's your job"],
      response: "I can help you manage your expenses, answer questions about using the app, and keep you on top of your finances.",
    },
    {
      triggers: ["who made you", "who created you", "who built you"],
      response: "I was created by a developer who wants to make expense tracking easier for everyone!",
    },
    {
      triggers: ["tell me a joke", "make me laugh"],
      response: "Why don’t programmers like nature? It has too many bugs. 🐛",
    },
    {
      triggers: ["what's the weather", "is it raining", "is it hot"],
      response: "I can't check live weather yet, but I hope it's sunny where you are! ☀️",
    },
    {
      triggers: ["thank you", "thanks", "appreciate it"],
      response: "You're welcome! 😊 I'm here to help anytime.",
    },
    {
      triggers: ["hello", "hi", "hey"],
      response: "Hey there! 👋 How can I help you today?",
    },
  ];

  const checkGeneralResponse = (message) => {
    const lower = message.toLowerCase();
    for (const entry of generalResponses) {
      if (entry.triggers.some((trigger) => lower.includes(trigger))) {
        return entry.response;
      }
    }
    return null;
  };

  const sendMessage = (message) => {
    if (!message.trim()) return;

    const newMessage = { text: message, sender: 'user' };
    setMessages((prev) => [...prev, newMessage]);
    setInputText('');

    const generalReply = checkGeneralResponse(message);
    if (generalReply) {
      setMessages((prev) => [...prev, { text: generalReply, sender: 'bot' }]);
      return;
    }

    const matchedFAQ = findBestFAQMatch(message);
    if (matchedFAQ) {
      setLastFAQ(matchedFAQ);
      setMessages((prev) => [...prev, { text: matchedFAQ.answer, sender: 'bot' }]);
    } else {
      setMessages((prev) => [...prev, { text: "Sorry, I don’t have that information.", sender: 'bot' }]);
    }

    setShowFAQ(false);
  };

  const findBestFAQMatch = (input) => {
    let bestMatch = null;
    let highestScore = 0;

    faqData.forEach((faq) => {
      const score = compareTwoStrings(input.toLowerCase(), faq.question.toLowerCase());
      if (score > highestScore && score >= 0.5) {
        highestScore = score;
        bestMatch = faq;
      }
    });

    return bestMatch;
  };

  const handleFAQClick = (answer, question, followUp) => {
    const faq = { question, answer, followUp };
    setMessages((prev) => [
      ...prev,
      { text: question, sender: 'user' },
      { text: answer, sender: 'bot' },
    ]);
    setLastFAQ(faq);
    setShowFAQ(false);
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.container}>
      <ScrollView contentContainerStyle={styles.chatContainer}>
        {messages.map((item, index) => (
          <View
            key={index}
            style={[
              styles.messageBubble,
              item.sender === 'user' ? styles.userBubble : styles.botBubble,
            ]}
          >
            <Text style={styles.messageText}>{item.text}</Text>
          </View>
        ))}
      </ScrollView>

      {showFAQ && (
        <View style={styles.faqContainer}>
          <Text style={styles.faqHeading}>Need help? Tap a question:</Text>
          <FlatList
            data={faqData}
            keyExtractor={(item, index) => `faq-${index}`}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.faqButton}
                onPress={() => handleFAQClick(item.answer, item.question, item.followUp)}
              >
                <Text style={styles.faqText}>{item.question}</Text>
              </TouchableOpacity>
            )}
          />
        </View>
      )}

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={inputText}
          onChangeText={setInputText}
          placeholder="Type a message..."
          placeholderTextColor="#888"
        />
        <TouchableOpacity style={styles.sendButton} onPress={() => sendMessage(inputText)}>
          <Text style={styles.sendText}>Send</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f2f5',
  },
  chatContainer: {
    padding: 16,
    paddingBottom: 100,
  },
  messageBubble: {
    maxWidth: '80%',
    padding: 12,
    marginVertical: 5,
    borderRadius: 18,
  },
  userBubble: {
    backgroundColor: '#C6FF00',
    alignSelf: 'flex-end',
  },
  botBubble: {
    backgroundColor: '#e6e6e6',
    alignSelf: 'flex-start',
  },
  messageText: {
    fontSize: 15,
    color: '#1D2A32',
  },
  faqContainer: {
    paddingHorizontal: 20,
    paddingBottom: 10,
  },
  faqHeading: {
    fontSize: 16,
    fontWeight: '600',
    marginVertical: 10,
    color: '#1D2A32',
  },
  faqButton: {
    backgroundColor: '#fff',
    padding: 14,
    borderRadius: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  faqText: {
    fontSize: 15,
    color: '#333',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 10,
    borderTopWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#fff',
  },
  input: {
    flex: 1,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ccc',
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginRight: 10,
    backgroundColor: '#fff',
    fontSize: 15,
  },
  sendButton: {
    backgroundColor: '#1D2A32',
    paddingHorizontal: 20,
    borderRadius: 20,
    justifyContent: 'center',
  },
  sendText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 15,
  },
});

export default ChatScreen;
