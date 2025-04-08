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

  // Minimal visible FAQs
  const faqData = [
    {
      question: "How do I add an expense?",
      answer: "Go to the 'Add Expense' screen and fill in the form.",
      followUp: "Tap the '+' icon on the dashboard to get started.",
    },
    {
      question: "Where can I view my past expenses?",
      answer: "Use the 'History' or 'Expenses' tab.",
      followUp: "You'll see a list organized by date, with filters available.",
    },
    {
      question: "How can I edit an expense?",
      answer: "Tap on the expense entry and choose 'Edit'.",
      followUp: "Make your changes and press 'Save'.",
    },
    {
      question: "How do I delete an expense?",
      answer: "Swipe left on the expense entry and tap 'Delete'.",
      followUp: "Confirm the deletion when prompted.",
    },
    {
      question: "Can I categorize my expenses?",
      answer: "Yes, you can assign categories like Food, Travel, etc.",
      followUp: "Use the category dropdown when adding or editing.",
    },
  ];

  // Extended question bank (not shown visually)
  const extendedQA = [
    { question: "Can I create custom categories?", answer: "Yes, type a new category name in the field.", followUp: "It will be saved for future use." },
    { question: "How do I view a monthly summary?", answer: "Check the 'Dashboard' for summaries.", followUp: "Each month shows totals and top categories." },
    { question: "Is there a budget feature?", answer: "Yes, you can set monthly spending limits.", followUp: "Find it under 'Budget Settings' in your profile." },
    { question: "How can I track spending trends?", answer: "Use the charts in the 'Dashboard'.", followUp: "Trends are grouped by month and category." },
    { question: "Can I export my data?", answer: "Yes, go to 'Settings' > 'Export'.", followUp: "You can export to CSV or PDF." },
    { question: "Can I import expenses from another app?", answer: "Yes, we support CSV imports.", followUp: "Use the template provided in the import section." },
    { question: "Is there a search function?", answer: "Yes, use the magnifying glass icon in 'Expenses'.", followUp: "Search by keyword, amount, or category." },
    { question: "Can I filter by category or date?", answer: "Yes, tap the 'Filter' button in the Expenses screen.", followUp: "Apply one or more filters for detailed views." },
    { question: "How do I backup my data?", answer: "Data is auto-backed up to the cloud.", followUp: "You can also export data manually." },
    { question: "Can I restore deleted expenses?", answer: "Currently, deleted items cannot be restored.", followUp: "Make sure to double-check before deletion." },
    { question: "Is there dark mode support?", answer: "Yes! Enable it in Settings.", followUp: "It applies app-wide immediately." },
    { question: "How do I change my email?", answer: "Go to Profile > Edit Info.", followUp: "You'll need to verify the new email." },
    { question: "Can I use the app offline?", answer: "Yes, but syncing happens only online.", followUp: "Your data is stored locally until reconnected." },
    { question: "How do I change currency?", answer: "Go to Settings > Currency.", followUp: "All amounts will convert using latest rates." },
    { question: "Can I set reminders?", answer: "Yes, in Settings > Notifications.", followUp: "Reminders help you log expenses regularly." },
    { question: "Does the app support multiple users?", answer: "One account per user is recommended.", followUp: "Multi-user support is coming soon." },
    { question: "Is my data encrypted?", answer: "Yes, both at rest and during sync.", followUp: "Your privacy and security are priorities." },
    { question: "Can I tag expenses?", answer: "Yes, tags help group related expenses.", followUp: "Add tags when creating or editing an entry." },
    { question: "How do I log income?", answer: "Use the 'Add Income' option in Dashboard.", followUp: "It appears alongside expenses in reports." },
    { question: "Is there a desktop version?", answer: "A web version is in development.", followUp: "Join the waitlist to get early access." },
    { question: "Can I attach receipts?", answer: "Yes, add photos while creating/editing.", followUp: "Use your camera or gallery." },
    { question: "What if I forget to log an expense?", answer: "You can add past dates when entering manually.", followUp: "Just choose the date before saving." },
    { question: "How do I change my password?", answer: "Go to Settings > Security > Change Password.", followUp: "You may need to verify your current password." },
    { question: "Can I customize categories?", answer: "Yes, add/edit categories in Settings.", followUp: "Tap 'Manage Categories'." },
    { question: "Can I disable notifications?", answer: "Yes, toggle them in Settings.", followUp: "You can silence them temporarily or permanently." },
    { question: "Can I hide certain expenses?", answer: "Not yet, but a private mode is coming.", followUp: "You’ll be able to mark entries as 'Private'." },
    { question: "How do I report a bug?", answer: "Shake your phone or go to Help > Report Bug.", followUp: "Add a screenshot and brief description." },
    { question: "How do I contact support?", answer: "Go to Help > Contact Support.", followUp: "We usually reply within 24 hours." },
    { question: "How can I reset the app?", answer: "Use 'Reset App Data' in Settings.", followUp: "This deletes all entries permanently." },
    { question: "How do I log mileage or travel?", answer: "Use the 'Travel' category and add distance in notes.", followUp: "You can calculate mileage reimbursements manually." },
    { question: "Can I switch accounts?", answer: "Log out from Profile > Logout and sign into another account.", followUp: "All data is account-specific." },
    { question: "Is there a referral program?", answer: "Yes! Share your referral code under Profile > Refer & Earn.", followUp: "Earn rewards when friends sign up." },
    { question: "How do I delete my account?", answer: "Request account deletion in Settings > Privacy.", followUp: "This process is irreversible." },
    { question: "Can I export only one category?", answer: "Yes, apply a filter first then export.", followUp: "Only filtered data will be included." },
    { question: "Can I see total expenses this year?", answer: "Go to Dashboard > Yearly Summary.", followUp: "You’ll see total and category breakdown." },
    { question: "Can I rename a category?", answer: "Yes, long-press the category in Settings > Manage Categories.", followUp: "Changes apply to existing entries too." },
    { question: "How do I lock the app?", answer: "Enable App Lock in Settings > Security.", followUp: "Use fingerprint or passcode." },
    { question: "What happens if I uninstall the app?", answer: "Data is saved to your account if you're logged in.", followUp: "Reinstall and log in to recover." },
    { question: "Can I use this for business tracking?", answer: "Yes! You can separate personal and business with tags.", followUp: "Export only business-tagged entries." },
    { question: "Can I split an expense?", answer: "Yes, choose 'Split' when adding an expense.", followUp: "Assign portions to different categories." },
    { question: "Can I set a default category?", answer: "Yes, choose it under Settings > Preferences.", followUp: "It saves you time during entry." },
    { question: "How do I view pending reimbursements?", answer: "Tag them as 'Pending' and view under the 'Reimbursement' filter.", followUp: "Update the tag once reimbursed." },
    { question: "Can I sort expenses by amount?", answer: "Yes, tap the sort icon in 'Expenses' tab.", followUp: "Sort by amount, date, or category." },
    { question: "Is there a quick-add widget?", answer: "Yes, enable it from your home screen widgets.", followUp: "It lets you log expenses in one tap." },
    { question: "Can I schedule recurring expenses?", answer: "Yes, when creating an expense, turn on 'Repeat'.", followUp: "Choose weekly, monthly, etc." },
    { question: "Can I change the language of the app?", answer: "Yes, go to Settings > Language to select your preferred language.", followUp: "The app will instantly switch to the selected language." },
    { question: "How do I switch the interface language?", answer: "Navigate to Settings and tap on 'Language'.", followUp: "Choose from available languages to localize your experience." },
    { question: "Does the app support multiple currencies?", answer: "Yes, you can track expenses in different currencies.", followUp: "The app converts totals to your base currency automatically." },
    { question: "Can I track expenses in a different currency?", answer: "Yes, select a currency when entering an expense.", followUp: "Exchange rates are updated daily to stay accurate." },
    { question: "How do I convert currency when traveling?", answer: "Select the foreign currency while adding your expense.", followUp: "The app uses live exchange rates to calculate your totals." },
    { question: "Can I update an old expense with a new category?", answer: "Yes, tap the expense in the History screen to edit it.", followUp: "You can change the category and save the update." },
    { question: "How do I mark an expense as reimbursed?", answer: "Add a 'Reimbursed' tag or status to the expense.", followUp: "It will be moved out of pending reports." },
    { question: "Can I duplicate a previous expense?", answer: "Yes, open any expense and tap the 'Duplicate' button.", followUp: "You can then modify it before saving." },
    { question: "Where do I view my top spending categories?", answer: "Go to Dashboard > Insights.", followUp: "It shows a breakdown of where you spend the most." },
    { question: "How can I compare this month's spending to last month?", answer: "Visit the Dashboard > Monthly Comparison section.", followUp: "It visually compares your current and previous spending." },
    { question: "Can I group expenses by project?", answer: "Yes, use tags to associate expenses with projects.", followUp: "You can filter by tag later to view totals." },
    { question: "How do I mark an expense as recurring?", answer: "Enable the 'Recurring' option when creating an expense.", followUp: "Set the frequency: daily, weekly, or monthly." },
    { question: "What is the best way to record cash payments?", answer: "Select 'Cash' as the payment method while entering the expense.", followUp: "This helps differentiate them from card expenses." },
    { question: "How do I archive old expenses?", answer: "Tap 'Archive' from the expense options.", followUp: "Archived expenses are moved out of the active list." },
    { question: "Is there a way to tag work vs personal expenses?", answer: "Yes, use tags like #work or #personal.", followUp: "You can filter by these tags any time." },
    { question: "Can I view expenses by location?", answer: "Yes, if location is enabled, it’s saved with the expense.", followUp: "Filter by location in the History tab." },
    { question: "Can I hide certain categories from reports?", answer: "Yes, go to Report Settings and deselect categories.", followUp: "Hidden categories won’t appear in charts or totals." },
    { question: "How do I undo a recent change?", answer: "If unsaved, just press back. If saved, re-edit the entry.", followUp: "We’re working on adding an 'Undo' button soon." },
    { question: "Is there a notification when my budget is close to the limit?", answer: "Yes, you’ll receive alerts when nearing the threshold.", followUp: "You can enable or disable this in Notification Settings." },
    { question: "Can I restore a backup from a different device?", answer: "Yes, log in to the same account on the new device.", followUp: "Your data will sync from the cloud automatically." },
    { question: "Can I mark an expense as private?", answer: "Private mode is being developed.", followUp: "Soon you’ll be able to hide expenses from shared views." },
    { question: "How do I exclude a category from the budget?", answer: "Go to Budget Settings > Exclusions.", followUp: "Select the categories to exclude from calculations." },
    { question: "Is there a tutorial for new users?", answer: "Yes, the tutorial runs on first login or can be replayed from Help.", followUp: "You can access it anytime from the Help Center." },
    { question: "Where can I find FAQs inside the app?", answer: "Go to Help > FAQs.", followUp: "It covers common setup and usage topics." },
    { question: "What is the fastest way to log a recurring bill?", answer: "Use the Quick Add button and enable 'Recurring'.", followUp: "You can schedule the frequency during setup." },
    { question: "Can I set daily spending limits?", answer: "Yes, in Settings > Daily Limits.", followUp: "You'll get alerts if you exceed your daily target." },
    { question: "How do I see expenses from last year?", answer: "Go to History > Filter > Date Range.", followUp: "Select custom dates to view historical data." },
    { question: "Can I receive monthly summary emails?", answer: "Yes, enable it under Profile > Notification Preferences.", followUp: "Summaries will be sent at the end of each month." },
    { question: "Is there an expense approval workflow?", answer: "Not yet, but this feature is in our roadmap.", followUp: "Soon, managers will be able to approve or reject entries." },
    { question: "How do I update the app to the latest version?", answer: "Check your App Store or Play Store for updates.", followUp: "Enable auto-updates to stay current." },
    { question: "Can I pin important expenses?", answer: "Yes, long press an expense and tap 'Pin'.", followUp: "Pinned items appear at the top of your list." },
    { question: "How do I add tax or tip to an expense?", answer: "Enter the base amount and use the 'Add Tax/Tip' option.", followUp: "It will calculate and add it to the total." },
    { question: "Can I sort by payment method?", answer: "Yes, go to Expenses > Sort > Payment Method.", followUp: "This helps organize entries by how they were paid." },
    { question: "How do I log a refund?", answer: "Add a new entry and choose 'Refund' as the type.", followUp: "It will subtract from your total spend." },
    { question: "Can I merge duplicate expenses?", answer: "Not automatically, but you can delete one and edit the other.", followUp: "We’re working on an auto-merge tool." },
    { question: "Where do I view income vs expenses?", answer: "Go to Dashboard > Net Balance.", followUp: "It compares earnings to your total spending." },
    { question: "Can I track investments separately?", answer: "Use a dedicated tag or category like 'Investments'.", followUp: "Filter them out in reports for a clear view." },
    { question: "Can I see total savings for the month?", answer: "Yes, it's shown on your Dashboard.", followUp: "It’s calculated from income minus expenses." },
    { question: "How do I customize the dashboard?", answer: "Tap 'Edit' on the Dashboard screen.", followUp: "You can rearrange or hide widgets." },
    { question: "Can I download a printable report?", answer: "Yes, export to PDF and print it directly.", followUp: "Find it under Reports > Export > PDF." },
    { question: "Can I view analytics for a specific category?", answer: "Yes, tap any category in the report to drill down.", followUp: "It shows breakdowns and spending over time." },
    { question: "How do I track shared expenses?", answer: "Use tags like #shared and split amounts accordingly.", followUp: "You can add comments to indicate who paid what." },
    { question: "Can I set goals for saving?", answer: "Yes, go to Settings > Goals.", followUp: "Track your progress directly from the dashboard." },
    { question: "How do I connect my bank account?", answer: "This feature is in progress for upcoming releases.", followUp: "Stay tuned for direct sync options." },
    { question: "Is there biometric login?", answer: "Yes, enable fingerprint or Face ID under Security.", followUp: "It adds a fast and secure login method." },
    { question: "Can I log recurring subscriptions?", answer: "Yes, add them like any expense and enable 'Repeat'.", followUp: "Useful for Netflix, Spotify, etc." },
    { question: "How do I rename a saved filter?", answer: "Go to Filter > Saved Filters and tap 'Rename'.", followUp: "Give it a new name and save your changes." },
    { question: "Can I switch themes beyond light/dark?", answer: "Not yet, but theme packs are coming soon.", followUp: "You’ll be able to pick colors and styles." },
    { question: "How do I delete multiple expenses at once?", answer: "Use multi-select in History > Edit Mode.", followUp: "Select items, then tap 'Delete'." },
    { question: "Can I change the order of expense fields?", answer: "Yes, go to Settings > Customize Fields.", followUp: "Drag and drop to reorder them as you like." },
  ];

  const allQuestions = [...faqData, ...extendedQA];

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

  const isFollowUp = (text) => {
    const lower = text.toLowerCase();
    return (
      lower.includes("how") ||
      lower.includes("how do i") ||
      lower.includes("where") ||
      lower.includes("what next") ||
      lower.includes("then what") ||
      lower === "how?" ||
      lower === "where?"
    );
  };

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

    if (isFollowUp(message) && lastFAQ) {
      setMessages((prev) => [...prev, { text: lastFAQ.followUp, sender: 'bot' }]);
      return;
    }

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

    allQuestions.forEach((faq) => {
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
            <Text style={[styles.messageText, { color: item.sender === 'user' ? '#fff' : '#000' }]}>
              {item.text}
            </Text>
          </View>
        ))}
      </ScrollView>

      {showFAQ && (
        <View style={styles.faqContainer}>
          <Text style={styles.faqHeading}>Frequently Asked Questions:</Text>
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
        />
        <TouchableOpacity style={styles.sendButton} onPress={() => sendMessage(inputText)}>
          <Text style={styles.sendText}>Send</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9f9f9' },
  chatContainer: { padding: 15, paddingBottom: 100 },
  messageBubble: { maxWidth: '80%', padding: 12, marginVertical: 5, borderRadius: 15 },
  userBubble: { backgroundColor: '#007bff', alignSelf: 'flex-end' },
  botBubble: { backgroundColor: '#e0e0e0', alignSelf: 'flex-start' },
  messageText: { fontSize: 15 },
  faqContainer: { paddingHorizontal: 20, paddingBottom: 10 },
  faqHeading: { fontSize: 16, fontWeight: 'bold', marginVertical: 10 },
  faqButton: { backgroundColor: '#ffffff', padding: 12, borderRadius: 8, marginBottom: 8, borderWidth: 1, borderColor: '#ccc' },
  faqText: { fontSize: 14, color: '#333' },
  inputContainer: { flexDirection: 'row', padding: 10, borderTopWidth: 1, borderColor: '#ddd', backgroundColor: '#fff' },
  input: { flex: 1, borderRadius: 20, borderWidth: 1, borderColor: '#ccc', paddingHorizontal: 15, paddingVertical: 10, marginRight: 10 },
  sendButton: { backgroundColor: '#007bff', paddingHorizontal: 20, borderRadius: 20, justifyContent: 'center' },
  sendText: { color: '#fff', fontWeight: 'bold' },
});

export default ChatScreen;