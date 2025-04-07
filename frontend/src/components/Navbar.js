// components/Navbar.js
import React from 'react';
import {
  Box,
  Flex,
  HStack,
  IconButton,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  useDisclosure,
  useColorModeValue,
  Stack,
  Avatar,
  Text,
  Icon
} from '@chakra-ui/react';
import { FaBars, FaBell, FaChevronDown, FaUser, FaCog, FaSignOutAlt } from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';

const Navbar = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { user, logout } = useAuth();
  
  const bg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  
  return (
    <Box
      bg={bg}
      borderBottom="1px"
      borderColor={borderColor}
      px={4}
    >
      <Flex h={16} alignItems="center" justifyContent="space-between">
        <IconButton
          size="md"
          icon={<FaBars />}
          aria-label="Open Menu"
          display={{ md: 'none' }}
          onClick={isOpen ? onClose : onOpen}
        />
        <HStack spacing={8} alignItems="center">
          <Box fontSize="xl" fontWeight="bold" color="teal.500">
            Elevate
          </Box>
        </HStack>
        <Flex alignItems="center">
          <HStack spacing={4}>
            <IconButton
              variant="ghost"
              aria-label="Notifications"
              icon={<FaBell />}
            />
            <Menu>
              <MenuButton
                as={Button}
                rightIcon={<FaChevronDown />}
                variant="ghost"
                px={2}
              >
                <Flex align="center">
                  <Avatar
                    size="sm"
                    name={user?.name || 'User'}
                    mr={2}
                  />
                  <Text display={{ base: 'none', md: 'block' }}>
                    {user?.name || 'User'}
                  </Text>
                </Flex>
              </MenuButton>
              <MenuList>
                <MenuItem icon={<FaUser />}>Profile</MenuItem>
                <MenuItem icon={<FaCog />}>Settings</MenuItem>
                <MenuDivider />
                <MenuItem icon={<FaSignOutAlt />} onClick={logout}>
                  Sign Out
                </MenuItem>
              </MenuList>
            </Menu>
          </HStack>
        </Flex>
      </Flex>
    </Box>
  );
};

export default Navbar;

// components/Sidebar.js
import React from 'react';
import {
  Box,
  VStack,
  HStack,
  Flex,
  Text,
  Icon,
  Divider,
  useColorModeValue
} from '@chakra-ui/react';
import { NavLink, useLocation } from 'react-router-dom';
import { FaClipboard, FaUserFriends, FaChartLine, FaComments, FaHome } from 'react-icons/fa';

const SidebarItem = ({ icon, children, to }) => {
  const location = useLocation();
  const isActive = location.pathname === to;
  
  const activeBg = useColorModeValue('teal.50', 'teal.900');
  const activeColor = useColorModeValue('teal.700', 'teal.200');
  const inactiveColor = useColorModeValue('gray.600', 'gray.400');
  
  return (
    <Box
      as={NavLink}
      to={to}
      w="100%"
      borderRadius="md"
      bg={isActive ? activeBg : 'transparent'}
      color={isActive ? activeColor : inactiveColor}
      _hover={{
        bg: isActive ? activeBg : useColorModeValue('gray.100', 'gray.700'),
        color: isActive ? activeColor : useColorModeValue('gray.800', 'white')
      }}
      transition="all 0.2s"
    >
      <Flex
        align="center"
        p={3}
        fontSize="sm"
        fontWeight={isActive ? 'bold' : 'medium'}
      >
        <Icon as={icon} boxSize={5} mr={3} />
        <Text>{children}</Text>
      </Flex>
    </Box>
  );
};

const Sidebar = () => {
  return (
    <Box
      h="100%"
      py={6}
      overflowY="auto"
    >
      <VStack spacing={2} align="stretch" px={4}>
        <SidebarItem icon={FaClipboard} to="/create">
          Create
        </SidebarItem>
        <SidebarItem icon={FaUserFriends} to="/connect">
          Connect
        </SidebarItem>
        <SidebarItem icon={FaChartLine} to="/elevate">
          Elevate
        </SidebarItem>
        <SidebarItem icon={FaComments} to="/chat">
          Chat
        </SidebarItem>
      </VStack>
      
      <Divider my={6} />
      
      <Box px={4} fontSize="xs" color="gray.500">
        <Text mb={1}>Upcoming 1:1</Text>
        <HStack>
          <Icon as={FaHome} />
          <Text>Manager Check-in</Text>
        </HStack>
        <Text>Tomorrow, 2:00 PM</Text>
      </Box>
    </Box>
  );
};

export default Sidebar;

// components/JiraTicketCard.js
import React from 'react';
import {
  Box,
  Heading,
  Text,
  Badge,
  HStack,
  VStack,
  Button,
  useColorModeValue,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Flex,
  Icon,
  Tooltip
} from '@chakra-ui/react';
import { FaStar, FaCalendarAlt, FaCheck, FaSpinner } from 'react-icons/fa';

const JiraTicketCard = ({ ticket, onGenerateStar, isGenerating, starExists, disabled }) => {
  const statusColor = ticket.status === 'Completed' ? 'green' : 'blue';
  const priorityColor = ticket.priority === 'High' ? 'red' : ticket.priority === 'Medium' ? 'orange' : 'green';
  
  const cardBg = useColorModeValue('white', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  
  return (
    <Card
      bg={cardBg}
      borderColor={borderColor}
      borderWidth="1px"
      borderRadius="lg"
      overflow="hidden"
      transition="all 0.3s"
      _hover={{ shadow: 'md' }}
    >
      <CardHeader pb={2}>
        <Flex justify="space-between" align="center">
          <Badge colorScheme={statusColor}>{ticket.status}</Badge>
          <Badge colorScheme={priorityColor}>{ticket.priority}</Badge>
        </Flex>
        <Heading size="sm" mt={2}>{ticket.title}</Heading>
      </CardHeader>
      
      <CardBody py={2}>
        <VStack align="stretch" spacing={2}>
          <Text fontSize="sm" noOfLines={2}>
            {ticket.description}
          </Text>
          
          <HStack fontSize="xs" color="gray.500" wrap="wrap">
            <Icon as={FaCalendarAlt} />
            <Text>Started: {new Date(ticket.start_date).toLocaleDateString()}</Text>
            {ticket.status === 'Completed' && (
              <>
                <Text>-</Text>
                <Text>Completed: {new Date(ticket.completion_date).toLocaleDateString()}</Text>
              </>
            )}
          </HStack>
          
          <Flex wrap="wrap" gap={1} mt={1}>
            {ticket.components.map((comp, idx) => (
              <Badge key={idx} variant="subtle" colorScheme="blue" fontSize="xs">
                {comp}
              </Badge>
            ))}
          </Flex>
        </VStack>
      </CardBody>
      
      <CardFooter pt={2}>
        {ticket.status === 'Completed' ? (
          <Button
            colorScheme={starExists ? 'green' : 'teal'}
            size="sm"
            width="100%"
            leftIcon={starExists ? <FaCheck /> : <FaStar />}
            onClick={onGenerateStar}
            isLoading={isGenerating}
            loadingText="Generating..."
            disabled={disabled}
          >
            {starExists ? 'STAR Example Created' : 'Generate STAR Example'}
          </Button>
        ) : (
          <Button
            variant="outline"
            size="sm"
            width="100%"
            isDisabled={true}
          >
            Complete ticket to generate STAR
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default JiraTicketCard;

// components/StarExampleCard.js
import React from 'react';
import {
  Box,
  Heading,
  Text,
  Badge,
  VStack,
  Button,
  useColorModeValue,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Flex,
  Icon,
  useClipboard
} from '@chakra-ui/react';
import { FaCopy, FaCheck, FaEdit } from 'react-icons/fa';

const StarExampleCard = ({ example }) => {
  const cardBg = useColorModeValue('white', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  
  const { hasCopied, onCopy } = useClipboard(example.star_description);
  
  return (
    <Card
      bg={cardBg}
      borderColor={borderColor}
      borderWidth="1px"
      borderRadius="lg"
      overflow="hidden"
      transition="all 0.3s"
      _hover={{ shadow: 'md' }}
    >
      <CardHeader pb={2}>
        <Heading size="md">{example.title}</Heading>
        <Text fontSize="sm" color="gray.500" mt={1}>
          Ticket: {example.ticket_id}
        </Text>
      </CardHeader>
      
      <CardBody py={2}>
        <VStack align="stretch" spacing={3}>
          <Box
            whiteSpace="pre-wrap"
            fontSize="sm"
            sx={{
              '& strong': {
                fontWeight: 'bold',
                color: useColorModeValue('teal.600', 'teal.200')
              }
            }}
          >
            {example.star_description}
          </Box>
          
          <Box>
            <Text fontWeight="bold" fontSize="sm" mt={1} mb={2}>
              Skills Demonstrated
            </Text>
            <Flex wrap="wrap" gap={2}>
              {example.skills_demonstrated.map((skill, idx) => (
                <Badge key={idx} colorScheme="purple" variant="subtle">
                  {skill}
                </Badge>
              ))}
            </Flex>
          </Box>
          
          {example.impact_metrics && (
            <Box>
              <Text fontWeight="bold" fontSize="sm" mt={1} mb={1}>
                Impact
              </Text>
              <Text fontSize="sm">{example.impact_metrics}</Text>
            </Box>
          )}
        </VStack>
      </CardBody>
      
      <CardFooter pt={3}>
        <Flex width="100%" gap={2}>
          <Button
            flex={1}
            size="sm"
            leftIcon={hasCopied ? <FaCheck /> : <FaCopy />}
            onClick={onCopy}
            colorScheme={hasCopied ? "green" : "blue"}
          >
            {hasCopied ? 'Copied' : 'Copy'}
          </Button>
          <Button
            flex={1}
            size="sm"
            leftIcon={<FaEdit />}
            colorScheme="teal"
          >
            Edit
          </Button>
        </Flex>
      </CardFooter>
    </Card>
  );
};

export default StarExampleCard;

// components/Login.js
import React, { useState } from 'react';
import {
  Box,
  Flex,
  Stack,
  Heading,
  Text,
  Container,
  Input,
  Button,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Image,
  useColorModeValue,
  Alert,
  AlertIcon
} from '@chakra-ui/react';
import { useAuth } from '../contexts/AuthContext';

const Login = () => {
  const { login, error, isLoading } = useAuth();
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    await login(userId, password);
  };
  
  return (
    <Container maxW="lg" py={{ base: '12', md: '24' }} px={{ base: '0', sm: '8' }}>
      <Stack spacing="8">
        <Stack spacing="6">
          <Flex justify="center">
            <Heading 
              fontSize="4xl" 
              textAlign="center"
              color="teal.500"
            >
              Elevate
            </Heading>
          </Flex>
          <Text color="gray.500" fontSize="lg" textAlign="center">
            Your personal career coach
          </Text>
        </Stack>
        
        <Box
          py={{ base: '0', sm: '8' }}
          px={{ base: '4', sm: '10' }}
          bg={useColorModeValue('white', 'gray.700')}
          boxShadow={{ base: 'none', sm: 'md' }}
          borderRadius={{ base: 'none', sm: 'xl' }}
        >
          <form onSubmit={handleSubmit}>
            <Stack spacing="6">
              <Stack spacing="5">
                {error && (
                  <Alert status="error" borderRadius="md">
                    <AlertIcon />
                    {error}
                  </Alert>
                )}
                
                <FormControl>
                  <FormLabel htmlFor="userId">User ID</FormLabel>
                  <Input
                    id="userId"
                    type="text"
                    value={userId}
                    onChange={(e) => setUserId(e.target.value)}
                    required
                  />
                </FormControl>
                
                <FormControl>
                  <FormLabel htmlFor="password">Password</FormLabel>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </FormControl>
              </Stack>
              
              <Button
                type="submit"
                colorScheme="teal"
                size="lg"
                fontSize="md"
                isLoading={isLoading}
                loadingText="Signing in..."
              >
                Sign in
              </Button>
              
              <Text fontSize="sm" textAlign="center" color="gray.500">
                For demo, use user_id: user123, password: any value
              </Text>
            </Stack>
          </form>
        </Box>
      </Stack>
    </Container>
  );
};

export default Login;

// components/ChatInterface.js
import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Flex,
  Text,
  Input,
  IconButton,
  VStack,
  HStack,
  Avatar,
  Divider,
  Heading,
  Card,
  CardBody,
  Textarea,
  Button,
  List,
  ListItem,
  Spinner,
  useColorModeValue,
  useToast
} from '@chakra-ui/react';
import { FaPaperPlane, FaRobot, FaUser } from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';

const ChatInterface = () => {
  const { user } = useAuth();
  const toast = useToast();
  const messagesEndRef = useRef(null);
  
  const [conversations, setConversations] = useState([]);
  const [activeConversation, setActiveConversation] = useState(null);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingConversations, setIsLoadingConversations] = useState(true);
  
  useEffect(() => {
    const fetchConversations = async () => {
      setIsLoadingConversations(true);
      try {
        const result = await api.getConversations();
        setConversations(result);
        
        // Set the most recent conversation as active if it exists
        if (result.length > 0) {
          setActiveConversation(result[0]);
        }
      } catch (error) {
        console.error('Error fetching conversations:', error);
        toast({
          title: 'Error loading conversations',
          description: 'Please try again later',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      } finally {
        setIsLoadingConversations(false);
      }
    };
    
    fetchConversations();
  }, [toast]);
  
  useEffect(() => {
    // Scroll to bottom whenever messages change
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [activeConversation]);
  
  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;
    
    setIsLoading(true);
    try {
      let updatedConversation;
      
      if (activeConversation) {
        // Add message to existing conversation
        updatedConversation = await api.addMessage(activeConversation.id, newMessage);
      } else {
        // Start a new conversation
        updatedConversation = await api.createConversation(newMessage);
        setConversations(prev => [updatedConversation, ...prev]);
      }
      
      setActiveConversation(updatedConversation);
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: 'Error sending message',
        description: 'Please try again later',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  
  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  return (
    <Flex h="calc(100vh - 130px)" direction={{ base: 'column', md: 'row' }}>
      {/* Conversation List */}
      <Box
        w={{ base: '100%', md: '300px' }}
        borderRight="1px"
        borderColor={useColorModeValue('gray.200', 'gray.700')}
        p={4}
        display={{ base: activeConversation ? 'none' : 'block', md: 'block' }}
      >
        <Heading size="md" mb={4}>
          Conversations
        </Heading>
        
        <Button
          colorScheme="teal"
          width="100%"
          mb={4}
          onClick={() => setActiveConversation(null)}
        >
          New Conversation
        </Button>
        
        {isLoadingConversations ? (
          <Flex justify="center" py={10}>
            <Spinner size="lg" color="teal.500" />
          </Flex>
        ) : (
          <>
            {conversations.length === 0 ? (
              <Text textAlign="center" color="gray.500" py={4}>
                No conversations yet
              </Text>
            ) : (
              <List spacing={2}>
                {conversations.map((conv) => (
                  <ListItem key={conv.id}>
                    <Card
                      variant="outline"
                      cursor="pointer"
                      bg={activeConversation?.id === conv.id ? 'teal.50' : 'transparent'}
                      borderColor={activeConversation?.id === conv.id ? 'teal.200' : 'gray.200'}
                      _hover={{ bg: activeConversation?.id === conv.id ? 'teal.50' : 'gray.50' }}
                      onClick={() => setActiveConversation(conv)}
                    >
                      <CardBody py={2}>
                        <Text fontWeight="medium" noOfLines={1}>
                          {conv.title}
                        </Text>
                        <Text fontSize="xs" color="gray.500">
                          {new Date(conv.updated_at).toLocaleDateString()}
                        </Text>
                      </CardBody>
                    </Card>
                  </ListItem>
                ))}
              </List>
            )}
          </>
        )}
      </Box>
      
      {/* Chat Window */}
      <Box flex="1" p={4} display={{ base: !activeConversation && conversations.length > 0 ? 'none' : 'block', md: 'block' }}>
        {/* Chat Header */}
        <Flex align="center" mb={4}>
          <Heading size="md">
            {activeConversation ? activeConversation.title : 'New Conversation'}
          </Heading>
        </Flex>
        
        <Divider mb={4} />
        
        {/* Messages */}
        <VStack
          spacing={4}
          align="stretch"
          overflowY="auto"
          maxH="calc(100vh - 280px)"
          px={2}
        >
          {!activeConversation ? (
            <Flex
              direction="column"
              align="center"
              justify="center"
              h="100%"
              py={10}
              textAlign="center"
            >
              <Avatar icon={<FaRobot />} bg="teal.500" size="lg" mb={4} />
              <Heading size="md" mb={2}>
                Welcome to Elevate Career Coach
              </Heading>
              <Text color="gray.600" mb={4}>
                Ask me about career development, skills to learn, or how to prepare for your 1:1s.
              </Text>
              <VStack align="stretch" width="100%" maxW="md" spacing={2}>
                <Button variant="outline" onClick={() => setNewMessage("What skills should I focus on developing next?")}>
                  What skills should I focus on developing next?
                </Button>
                <Button variant="outline" onClick={() => setNewMessage("Help me prepare for my next 1:1 with my manager")}>
                  Help me prepare for my next 1:1 with my manager
                </Button>
                <Button variant="outline" onClick={() => setNewMessage("What career paths align with my current skills?")}>
                  What career paths align with my current skills?
                </Button>
              </VStack>
            </Flex>
          ) : (
            <>
              {activeConversation.messages.map((message, index) => (
                <Box
                  key={index}
                  alignSelf={message.is_user ? 'flex-end' : 'flex-start'}
                  maxW={{ base: '90%', md: '70%' }}
                >
                  <HStack align="flex-start" spacing={2}>
                    {!message.is_user && (
                      <Avatar size="sm" bg="teal.500" icon={<FaRobot fontSize="1.25rem" />} />
                    )}
                    <Box>
                      <Text
                        bg={message.is_user ? 'teal.500' : useColorModeValue('gray.100', 'gray.700')}
                        color={message.is_user ? 'white' : 'inherit'}
                        px={4}
                        py={2}
                        borderRadius="lg"
                        borderBottomRightRadius={message.is_user ? 0 : 'lg'}
                        borderBottomLeftRadius={message.is_user ? 'lg' : 0}
                      >
                        {message.content}
                      </Text>
                      <Text fontSize="xs" color="gray.500" mt={1}>
                        {message.timestamp ? formatTimestamp(message.timestamp) : ''}
                      </Text>
                    </Box>
                    {message.is_user && (
                      <Avatar size="sm" name={user?.name} bg="teal.500" />
                    )}
                  </HStack>
                </Box>
              ))}
              <div ref={messagesEndRef} />
            </>
          )}
        </VStack>
        
        {/* Message Input */}
        <Flex mt={4} align="flex-end">
          <Textarea
            flex="1"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Type your message..."
            resize="none"
            rows={3}
            mr={2}
          />
          <IconButton
            colorScheme="teal"
            aria-label="Send message"
            icon={<FaPaperPlane />}
            onClick={handleSendMessage}
            isLoading={isLoading}
            alignSelf="flex-end"
          />
        </Flex>
      </Box>
    </Flex>
  );
};

export default ChatInterface;