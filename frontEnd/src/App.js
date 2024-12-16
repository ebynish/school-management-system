import React, { useEffect, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Center, Spinner } from '@chakra-ui/react'; // Chakra UI imports
import HomePage from './pages/index';
import ProfilePage from './pages/ProfilePage';
import SettingsPage from './pages/Settings';
import LoginPage from './pages/LoginPage';
import { ThemeProvider } from './themeProvider';
import Loader from './components/Loader';
import NotificationPage from './pages/Notification';
import NewsDetail from './pages/NewsDetail';
import NewsGrid from './pages/NewsGrid';
import AddForm from './pages/admin/CreateForm';
import FormPage from './pages/admin/FormPage';
import DataDisplayPage from './components/DataDisplayPage';
import ApprovalRules from './pages/admin/ApprovalRules';
import DynamicPageDesigner from './pages/admin/DynamicPageDesigner';
import ProtectedRoute from './components/ProtectedRoute';
import FormInfo from './components/FormInfo';
import Dashboard from './pages/Dashboard';
import ApplyPage from './pages/apply';
import StartPage from './pages/startPage';
import CreateInvoicePage from './pages/InvoicePage';
import CheckAdmissionStatusPage from './pages/AdmissionStatus';
import CourseRegistration from './pages/CourseRegistration';
import DocumentPage from './pages/Documents';
import PaymentPage from './pages/PaymentPage';
import useApi from './hooks/useApi';
import { fetchData } from './api'; // Implement this API service
import CompleteApplication from './pages/CompleteApplication';
import ApplicationPage from './pages/ApplicationPage';
import Results from './pages/Result';
import Verify from './pages/Verify';
import Transcript from './pages/Transcript';
import ForgotPasswordPage from './pages/ForgotPassword';
import ResetPasswordPage from './pages/ResetPassword';
import ContactUs from './pages/ContactUs';
import AboutUsPage from './pages/AboutUs';
import ConfigForm from './pages/ConfigPage';
import ResultUploadPage from './pages/ResultUpload';
import ClearancePage from './pages/ClearancePage';
import StudentProfile from './pages/StudentProfile';
// Default configuration
const defaultConfig = {
  "primaryColor": "#5c8018",
  "email": [
    "info@dlc.sms.edu.ng",
    "dr@dlc.sms.edu.ng",
    "record@dlc.sms.edu.ng"
  ],
  "phoneNumber": [
    "07037637583",
    "07082807899",
    "07052349309"
  ],
  "buttonColor": "#5c8018",
  "apply": "/apply",
  "remita": {
    "remitaLive": true,
    "remitaTest": false,
    "serviceTypeId": "12345",
    "remitaMerchantId": "merchant_123",
    "remitaApiKey": "your_api_key_here"
  },
  "slides": [
    {
      "id": 1,
      "image": "/images/w5.jpg",
      "title": "The key to achievement:",
      "description": "A fully equipped CBT center empowering students on the journey to success.",
      "buttonText": "Start Learning Now!",
      "buttonLink": "https://modeofstudy.sms.edu.ng/"
    },
    {
      "id": 2,
      "image": "/images/ui.jpg",
      "title": "The path to achievement:",
      "description": "The university gate, a symbol of educational excellence.",
      "buttonText": "Learn more",
      "buttonLink": "https://ui.edu.ng"
    }
  ],
  "siteTitle": "University Learning Center",
  "logoUrl": "/images/logo.png",
  "faviconUrl": "/images/favicon.ico",
  "socialLinks": {
    "facebook": "https://facebook.com/yourpage",
    "twitter": "https://twitter.com/yourpage",
    "instagram": "https://instagram.com/yourpage",
    "linkedin": "https://linkedin.com/company/yourpage"
  },
  "analytics": {
    "googleAnalyticsId": "UA-XXXXX-X",
    "facebookPixelId": "1234567890"
  },
  "payment": {
    "gateway": "Remita",
    "paymentPageUrl": "/payment",
    "callbackUrl": "/payment/callback"
  },
  "aboutUs": {
    "title": "About Us",
    "description": "We are a leading center focused on empowering students through state-of-the-art learning facilities and academic support."
  },
  "contactUs": {
    "address": "123 University Road, City, Country",
    "email": "contact@dlc.sms.edu.ng",
    "phoneNumber": "07037637583",
    "workingHours": "Mon-Fri: 9:00 AM - 5:00 PM"
  },
  "typography": {
    "bodyFont": "Arial, sans-serif",
    "headingFont": "Georgia, serif",
    "fontSizeBase": "16px",
    "lineHeightBase": "1.5"
  },
  "footer": {
    "text": "© 2024 University Learning Center - All rights reserved.",
    "grid": [
      { "title": "About School",
        "aboutText": "We are a leading center focused on empowering students through state-of-the-art learning facilities and academic support."},
      {
        
        "title": "Quick Links",
        "links": [
          { "text": "About Us", "url": "/about-us" },
          { "text": "Careers", "url": "/careers" },
          { "text": "Blog", "url": "/blog" },
          { "text": "Press", "url": "/press" }
        ]
      },
      {
        "title": "Support",
        "links": [
          { "text": "Help", "url": "/help" },
          { "text": "FAQs", "url": "/faqs" },
          { "text": "Contact Us", "url": "/contact-us" }
        ]
      },
      {
        "title": "Social",
        "links": [
          { "text": "Facebook", "url": "https://facebook.com/yourpage" },
          { "text": "Twitter", "url": "https://twitter.com/yourpage" },
          { "text": "Instagram", "url": "https://instagram.com/yourpage" },
          { "text": "LinkedIn", "url": "https://linkedin.com/company/yourpage" }
        ]
      }
    ],},
  "seo": {
    "metaDescription": "University Learning Center provides students with the tools, knowledge, and resources they need to succeed in their academic journey.",
    "metaKeywords": "university, learning, education, CBT center, online learning, university services",
    "metaAuthor": "University Learning Center",
    "ogImage": "/images/og-image.jpg"
  },
  "apiEndpoints": {
    "getUserData": "/api/user/data",
    "getCourses": "/api/courses",
    "getPaymentStatus": "/api/payment/status"
  },
  "maintenanceMode": false,
  "siteTheme": "light",
  "maxFileUploadSize": 10485760,
  "menu": [
    { "name": "Home", "href": "/" },
    { "name": "About Us", "href": "/about-us" },
    { "name": "Online Resources", "href": "/online-resources" },
    { "name": "Student Portal", "href": "/login" },
    { "name": "LMS Portal", "href": "https://fugalms.com.ng" },
    { "name": "News", "href": "/latest-news" },
    { "name": "Contact Us", "href": "/contact-us" }
  ]
};

// Merging config with defaultConfig
const mergeConfig = (userConfig) => {
  return { ...defaultConfig, ...userConfig };
};

const App = () => {
  const { data: config, loading, error, execute } = useApi(fetchData);

  useEffect(() => {
    const fetchDataAsync = async () => {
      await execute("config"); // Fetch config when app loads
    };
  
    fetchDataAsync();
  }, [execute]);
  

  const finalConfig = mergeConfig(config || {});

  if (loading) {
    return (
      <Center h="100vh">
        <Spinner size="xl" />
      </Center>
    );
  }
  console.log(finalConfig, "1")
  return (
    <ThemeProvider>
      <Router>
        <Suspense fallback={<Loader />}>
          <Routes>
          <Route path="/news/:id" element={<NewsDetail config={finalConfig} />} />
            <Route path="/dashboard" element={<ProtectedRoute element={<Dashboard config={finalConfig} />} />} />
            <Route path="/user-courses"  element={<ProtectedRoute element={<CourseRegistration config={finalConfig} />} />} />
            <Route path="/user-documents" element={<ProtectedRoute element={<DocumentPage config={finalConfig} />} />} />
            <Route path="/user-profile" element={<ProtectedRoute element={<ProfilePage config={finalConfig} />} />} />
            <Route path="/user-profile/:id" element={<ProtectedRoute element={<StudentProfile config={finalConfig} />} />} />
            <Route path="/user-payments" element={<ProtectedRoute element={<PaymentPage config={finalConfig} />} />} />
            <Route path="/" element={<HomePage config={finalConfig} />} />
            <Route path="/user-transcripts" element={<ProtectedRoute element={<Transcript config={finalConfig} />} />} />
            <Route path="/user-results" element={<ProtectedRoute element={<Results config={finalConfig} />} />} />
            <Route path="/verify-result" element={<ProtectedRoute element={<Verify config={finalConfig} />} />} />
            <Route path="/latest-news" element={<NewsGrid config={finalConfig} />} />
            <Route path="/apply" element={<ApplyPage config={finalConfig} />} />
            <Route path="/about-us" element={<AboutUsPage config={finalConfig} />} />
            <Route path="/contact-us" element={<ContactUs config={finalConfig} />} />
            <Route path="/admission/status" element={<CheckAdmissionStatusPage config={finalConfig} />} />
            <Route path="/start" element={<StartPage config={finalConfig} />} />
            <Route path="/configuration"  element={<ProtectedRoute element={<ConfigForm config={finalConfig} />} />} />
            <Route path="/upload-results"  element={<ProtectedRoute element={<ResultUploadPage config={finalConfig} />} />} />
            <Route path="/user-clearance"  element={<ProtectedRoute element={<ClearancePage config={finalConfig} />} />} />
            <Route path="/continue-application" element={<CompleteApplication config={finalConfig} />} />
            <Route path="/application-form/:id" element={<ApplicationPage config={finalConfig} />} />
            <Route path="/preview-form/:id" element={<ApplicationPage config={finalConfig} />} />
            <Route path="/pay-invoice" element={<CreateInvoicePage config={finalConfig} />} />
            <Route path="/login" element={<LoginPage config={finalConfig} />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage config={finalConfig} />} />
            <Route path="/reset-password/:token" element={<ResetPasswordPage config={finalConfig} />} />
            <Route path="/profile/:username" element={<ProtectedRoute element={<ProfilePage config={finalConfig} />} />} />
            <Route path="/settings" element={<ProtectedRoute element={<SettingsPage config={finalConfig} />} />} />
            <Route path="/forms/:id" element={<ProtectedRoute element={<FormPage config={finalConfig} />} />} />
            <Route path="/create-form" element={<ProtectedRoute element={<AddForm config={finalConfig} />}  />} />
            <Route path="/create-pages" element={<ProtectedRoute element={<DynamicPageDesigner config={finalConfig} />} />} />
            <Route path="/create-approval" element={<ProtectedRoute element={<ApprovalRules config={finalConfig} />} />} />
            <Route path="/notifications" element={<NotificationPage config={finalConfig} />} />
            <Route path="/details/:slug/:id" element={<FormInfo config={finalConfig} />} /> {/* Capture dynamic slugs */}
            <Route path="/edit/:slug/:id" element={<FormInfo config={finalConfig} />} /> {/* Capture dynamic slugs */}
            <Route path=":slug/*" element={<ProtectedRoute element={<DataDisplayPage config={finalConfig} />}  />} /> {/* Capture dynamic slugs */}
          </Routes>
        </Suspense>
      </Router>
    </ThemeProvider>
  );
};

export default App;
