// src/i18n.ts
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  en: {
    translation: {
      // Dashboard
      dashboard: 'Dashboard',
      financialOverview: 'Financial Overview',
      recentTransactions: 'Recent Transactions',
      expenseCategories: 'Expense Categories',
      totalRevenue: 'Total Revenue',
      totalExpenses: 'Total Expenses',
      payment: 'Payment',
      netProfit: 'Net Profit',
      staffExpenses: 'Staff Expenses',

      // Sidebar
      staff: 'Staff',
      properties: 'Properties',
      expenses: 'Expenses',
      revenue: 'Revenue',
      reports: 'Reports',
      staffManagement: 'Staff Management',
      notifications: 'Notifications',
      settings: 'Settings',
      logout: 'Logout',

      // Staff Details
      staffDetails: {
        title: 'Staff Management',
        addNew: 'Add New Staff',
        totalStaff: 'Total Staff',
        activeNow: 'Active Now',
        pendingReviews: 'Pending Reviews',
        topPerformer: 'Top Performer',
        efficiency: '{{value}}% efficiency',
        performance: 'Staff Performance',
        loading: 'Loading staff data...',
        noStaff: 'No staff members available.',
        none: 'None',
        remove: 'Remove',
        confirm: {
          remove: 'Are you sure you want to remove this staff member?'
        },
        success: {
          added: 'Staff member added successfully!',
          removed: 'Staff member removed successfully!'
        },
        error: {
          failedToLoad: 'Failed to load staff members',
          notAuthenticated: 'Please log in to add staff.',
          fixErrors: 'Please fix the following errors:',
          nameRequired: 'Name is required',
          roleRequired: 'Role is required',
          emailRequired: 'Email is required',
          invalidEmail: 'Invalid Email Format',
          phoneRequired: 'Phone is required',
          invalidPhone: 'Invalid Phone Format (Must be 10 digits)',
          failedToAdd: 'Failed to add staff member',
          unexpected: 'An unexpected error occurred. Please try again.',
          failedToRemove: 'Failed to remove staff member'
        },
        table: {
          staffMember: 'Staff Member',
          role: 'Role',
          status: 'Status',
          performance: 'Performance',
          transactions: 'Transactions',
          lastActive: 'Last Active',
          recentActivity: 'Recent Activity',
          actions: 'Actions'
        },
        modal: {
          title: 'Add New Staff Member',
          fullName: 'Full Name',
          role: 'Role',
          email: 'Email',
          phone: 'Phone',
          placeholder: {
            name: 'Enter full name',
            role: 'Select role',
            email: 'Enter email address',
            phone: 'Enter phone number'
          },
          cancel: 'Cancel',
          add: 'Add Staff Member',
          adding: 'Adding...'
        },
        roles: {
          'Property Manager': 'Property Manager',
          'Maintenance Supervisor': 'Maintenance Supervisor',
          'Front Desk': 'Front Desk',
          'Housekeeper': 'Housekeeper'
        },
        status: {
          active: 'Active',
          inactive: 'Inactive'
        },
        reports: {
          // Reports-specific translations
          title: 'Financial Reports',
          loading: 'Loading Reports...',
          loginRequired: 'Please log in to view reports.',
          noToken: 'No authentication token found.',
          monthlyTrends: 'Monthly Trends',
          expenseBreakdown: 'Expense Breakdown',
          expenseDetails: 'Expense Details',
          staffExpenses: 'Staff Expenses',
          showStaffDetails: 'Show Staff Details',
          hideStaffDetails: 'Hide Staff Details',
          selectProperty: 'Select Property',
          selectYear: 'Select Year',
          amount: 'Amount (₹)',
          month: 'Month',
          staffExpensesPlaceholder:
            "Staff expense data requires a separate endpoint or filtering by category 'Salaries'. Currently showing placeholder: ₹{value} (30% of total expenses).",
          error: {
            failedToFetchProperties: 'Failed to fetch properties',
            failedToFetchMonthlyAnalytics: 'Failed to fetch monthly analytics',
            failedToFetchExpenseCategories: 'Failed to fetch expense categories',
          },
        },
      },

      // Properties Page
      // properties: "Properties",
      gridView: "Grid View",
      listView: "List View",
      totalProperties: "Total Properties",
      totalRooms: "Total Rooms",
      avgOccupancy: "Average Occupancy",
      avgRating: "Average Rating",
      // totalRevenue: "Total Revenue",
      laundrySettings: "Laundry Settings", // Top-level string
      laundry: "Laundry",
      laundrySettingsFor: "Laundry Settings for",
      bedSheets: "Bed Sheets",
      quiltCovers: "Quilt Covers",
      pillowCovers: "Pillow Covers",
      smallTowels: "Small Towels",
      bigTowels: "Big Towels",
      enterBedSheets: "Enter number of bed sheets",
      enterQuiltCovers: "Enter number of quilt covers",
      enterPillowCovers: "Enter number of pillow covers",
      enterSmallTowels: "Enter number of small towels",
      enterBigTowels: "Enter number of big towels",
      checkIn: "Check-In", // Top-level string
      checkInFor: "Check-In for",
      guestName: "Guest Name",
      enterGuestName: "Enter guest name",
      checkInDate: "Check-In Date",
      checkOutDate: "Check-Out Date",
      guestIdUpload: "Guest ID Upload",
      signedFormUpload: "Signed Form Upload",
      viewOnMap: "View on Map",
      save: "Save",
      submit: "Submit",
      cancel: "Cancel",
    }
  },
  hi: {
    translation: {
      // Dashboard
      dashboard: 'डैशबोर्ड',
      financialOverview: 'वित्तीय अवलोकन',
      recentTransactions: 'हाल की लेन-देन',
      expenseCategories: 'व्यय श्रेणियाँ',
      totalRevenue: 'कुल राजस्व',
      totalExpenses: 'कुल व्यय',
      payment: 'भुगतान',
      netProfit: 'नेट लाभ',
      staffExpenses: 'कर्मचारी व्यय',

      // Sidebar
      staff: 'कर्मचारी',
      properties: 'संपत्तियाँ',
      expenses: 'व्यय',
      revenue: 'राजस्व',
      reports: 'रिपोर्ट',
      staffManagement: 'कर्मचारी प्रबंधन',
      notifications: 'सूचनाएं',
      settings: 'सेटिंग्स',
      logout: 'लॉगआउट',

      // Staff Details
      staffDetails: {
        title: 'कर्मचारी प्रबंधन',
        addNew: 'नया कर्मचारी जोड़ें',
        totalStaff: 'कुल कर्मचारी',
        activeNow: 'अब सक्रिय',
        pendingReviews: 'अपूर्ण समीक्षा',
        topPerformer: 'शीर्ष प्रदर्शक',
        efficiency: '{{value}}% कुशलता',
        performance: 'कर्मचारी प्रदर्शन',
        loading: 'कर्मचारी डेटा लोड हो रहा है...',
        noStaff: 'कोई कर्मचारी सदस्य उपलब्ध नहीं हैं।',
        none: 'कोई नहीं',
        remove: 'हटाएँ',
        confirm: {
          remove: 'क्या आप वाकई इस कर्मचारी सदस्य को हटाना चाहते हैं?'
        },
        success: {
          added: 'कर्मचारी सदस्य सफलतापूर्वक जोड़ा गया!',
          removed: 'कर्मचारी सदस्य सफलतापूर्वक हटा दिया गया!'
        },
        error: {
          failedToLoad: 'कर्मचारी सदस्यों को लोड करने में विफल',
          notAuthenticated: 'कृपया कर्मचारी जोड़ने के लिए लॉगिन करें।',
          fixErrors: 'कृपया निम्नलिखित त्रुटियों को ठीक करें:',
          nameRequired: 'नाम आवश्यक है',
          roleRequired: 'भूमिका आवश्यक है',
          emailRequired: 'ईमेल आवश्यक है',
          invalidEmail: 'अमान्य ईमेल प्रारूप',
          phoneRequired: 'फोन आवश्यक है',
          invalidPhone: 'अमान्य फोन प्रारूप (10 अंक होने चाहिए)',
          failedToAdd: 'कर्मचारी सदस्य जोड़ने में विफल',
          unexpected: 'एक अप्रत्याशित त्रुटि हुई है। कृपया पुन: प्रयास करें।',
          failedToRemove: 'कर्मचारी सदस्य को हटाने में विफल'
        },
        table: {
          staffMember: 'कर्मचारी सदस्य',
          role: 'भूमिका',
          status: 'स्थिति',
          performance: 'प्रदर्शन',
          transactions: 'लेन-देन',
          lastActive: 'अंतिम सक्रिय',
          recentActivity: 'हाल की गतिविधि',
          actions: 'कार्रवाइयाँ'
        },
        modal: {
          title: 'नया कर्मचारी सदस्य जोड़ें',
          fullName: 'पूरा नाम',
          role: 'भूमिका',
          email: 'ईमेल',
          phone: 'फ़ोन',
          placeholder: {
            name: 'पूरा नाम दर्ज करें',
            role: 'भूमिका चुनें',
            email: 'ईमेल पता दर्ज करें',
            phone: 'फ़ोन नंबर दर्ज करें'
          },
          cancel: 'रद्द करें',
          add: 'कर्मचारी सदस्य जोड़ें',
          adding: 'जोड़ रहा है...'
        },
        roles: {
          'Property Manager': 'संपत्ति प्रबंधक',
          'Maintenance Supervisor': 'रखरखाव पर्यवेक्षक',
          'Front Desk': 'फ्रंट डेस्क',
          'Housekeeper': 'घरेलू'
        },
        status: {
          active: 'सक्रिय',
          inactive: 'निष्क्रिय'
        },
        reports: {
          // Reports-specific translations
          title: 'वित्तीय रिपोर्ट',
          loading: 'रिपोर्ट लोड हो रही हैं...',
          loginRequired: 'कृपया रिपोर्ट देखने के लिए लॉगिन करें।',
          noToken: 'कोई प्रमाणीकरण टोकन नहीं मिला।',
          monthlyTrends: 'मासिक रुझान',
          expenseBreakdown: 'व्यय विवरण',
          expenseDetails: 'व्यय का विवरण',
          staffExpenses: 'कर्मचारी व्यय',
          showStaffDetails: 'कर्मचारी विवरण दिखाएँ',
          hideStaffDetails: 'कर्मचारी विवरण छिपाएँ',
          selectProperty: 'संपत्ति चुनें',
          selectYear: 'वर्ष चुनें',
          amount: 'राशि (₹)',
          month: 'महीना',
          staffExpensesPlaceholder:
            "कर्मचारी व्यय डेटा के लिए एक अलग एंडपॉइंट या श्रेणी 'वेतन' द्वारा फ़िल्टरिंग की आवश्यकता है। वर्तमान में प्लेसहोल्डर दिखाया जा रहा है: ₹{value} (कुल व्यय का 30%)।",
          error: {
            failedToFetchProperties: 'संपत्तियाँ प्राप्त करने में विफल',
            failedToFetchMonthlyAnalytics: 'मासिक विश्लेषण प्राप्त करने में विफल',
            failedToFetchExpenseCategories: 'व्यय श्रेणियाँ प्राप्त करने में विफल',
          },
        },
      },

      // Properties Page
      // properties: "संपत्तियाँ",
      gridView: "ग्रिड दृश्य",
      listView: "सूची दृश्य",
      totalProperties: "कुल संपत्तियाँ",
      totalRooms: "कुल कमरे",
      avgOccupancy: "औसत अधिभोग",
      avgRating: "औसत रेटिंग",
      // totalRevenue: "कुल राजस्व",
      laundrySettings: "लॉन्ड्री सेटिंग्स",
      laundry: "लॉन्ड्री",
      laundrySettingsFor: "के लिए लॉन्ड्री सेटिंग्स",
      bedSheets: "बेड शीट्स",
      quiltCovers: "रजाई कवर",
      pillowCovers: "तकिया कवर",
      smallTowels: "छोटे तौलिए",
      bigTowels: "बड़े तौलिए",
      enterBedSheets: "बेड शीट्स की संख्या दर्ज करें",
      enterQuiltCovers: "रजाई कवर की संख्या दर्ज करें",
      enterPillowCovers: "तकिया कवर की संख्या दर्ज करें",
      enterSmallTowels: "छोटे तौलियों की संख्या दर्ज करें",
      enterBigTowels: "बड़े तौलियों की संख्या दर्ज करें",
      checkIn: "चेक-इन",
      checkInFor: "के लिए चेक-इन",
      guestName: "अतिथि का नाम",
      enterGuestName: "अतिथि का नाम दर्ज करें",
      checkInDate: "चेक-इन तिथि",
      checkOutDate: "चेक-आउट तिथि",
      guestIdUpload: "अतिथि आईडी अपलोड",
      signedFormUpload: "हस्ताक्षरित फॉर्म अपलोड",
      viewOnMap: "नक्शे पर देखें",
      save: "सहेजें",
      submit: "जमा करें",
      cancel: "रद्द करें",
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    lng: localStorage.getItem('i18nLng') || undefined,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
      formatSeparator: ','
    },
  });

export default i18n;