// App.js - Main application component
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ChakraProvider, Box, Flex, VStack } from '@chakra-ui/react';
import Login from './components/Login';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import CreateTab from './components/CreateTab';
import ConnectTab from './components/ConnectTab';
import ElevateTab from './components/ElevateTab';
import ChatInterface from './components/ChatInterface';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import theme from './theme';

// Protected Route component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" />;
};

const AppContent = () => {
  const { isAuthenticated } = useAuth();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (!isAuthenticated) {
    return <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>;
  }

  return (
    <Flex direction="column" h="100vh">
      <Navbar />
      <Flex flex="1" overflow="hidden">
        {!isMobile && (
          <Box w="250px" borderRight="1px" borderColor="gray.200" h="100%">
            <Sidebar />
          </Box>
        )}
        <Box flex="1" overflow="auto" p={4}>
          <Routes>
            <Route path="/" element={<Navigate to="/create" />} />
            <Route path="/create" element={
              <ProtectedRoute>
                <CreateTab />
              </ProtectedRoute>
            } />
            <Route path="/connect" element={
              <ProtectedRoute>
                <ConnectTab />
              </ProtectedRoute>
            } />
            <Route path="/elevate" element={
              <ProtectedRoute>
                <ElevateTab />
              </ProtectedRoute>
            } />
            <Route path="/chat" element={
              <ProtectedRoute>
                <ChatInterface />
              </ProtectedRoute>
            } />
            <Route path="*" element={<Navigate to="/create" />} />
          </Routes>
        </Box>
      </Flex>
    </Flex>
  );
};

function App() {
  return (
    <ChakraProvider theme={theme}>
      <AuthProvider>
        <Router>
          <AppContent />
        </Router>
      </AuthProvider>
    </ChakraProvider>
  );
}

export default App;