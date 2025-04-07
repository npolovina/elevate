// components/CreateTab.js
import React, { useState, useEffect } from 'react';
import {
  Box,
  Heading,
  Flex,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Grid,
  Button,
  Textarea,
  Input,
  FormControl,
  FormLabel,
  useToast,
  VStack,
  Text,
  Divider,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Badge,
  Select,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Spinner,
  IconButton
} from '@chakra-ui/react';
import { FaPlus, FaSearch, FaFileUpload, FaEdit, FaCheck, FaComment, FaRegCommentDots } from 'react-icons/fa';
import api from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import JiraTicketCard from './JiraTicketCard';
import StarExampleCard from './StarExampleCard';

const CreateTab = () => {
  const { user } = useAuth();
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [activeTicketId, setActiveTicketId] = useState(null);
  
  // State for data
  const [jiraTickets, setJiraTickets] = useState([]);
  const [starExamples, setStarExamples] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [additionalNotes, setAdditionalNotes] = useState('');
  const [question, setQuestion] = useState('');
  const [askResponse, setAskResponse] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isAsking, setIsAsking] = useState(false);
  
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Fetch user's JIRA tickets
        const tickets = await api.getJiraTickets();
        setJiraTickets(tickets);
        
        // Fetch existing STAR examples
        const stars = await api.getStarExamples();
        setStarExamples(stars);
      } catch (error) {
        console.error('Error fetching data:', error);
        toast({
          title: 'Error fetching data',
          description: 'Please try again later',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [toast]);
  
  const handleGenerateStar = async (ticketId) => {
    setActiveTicketId(ticketId);
    setIsGenerating(true);
    try {
      const result = await api.generateStar(ticketId);
      // Add the new STAR example to the list
      setStarExamples(prevExamples => {
        // Replace if exists, otherwise add
        const exists = prevExamples.some(ex => ex.ticket_id === ticketId);
        if (exists) {
          return prevExamples.map(ex => ex.ticket_id === ticketId ? result : ex);
        } else {
          return [...prevExamples, result];
        }
      });
      
      toast({
        title: 'STAR example generated',
        description: 'Your example has been successfully created',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      
    } catch (error) {
      console.error('Error generating STAR example:', error);
      toast({
        title: 'Error generating STAR example',
        description: 'Please try again later',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsGenerating(false);
      setActiveTicketId(null);
    }
  };
  
  const handleAskQuestion = async () => {
    if (!question.trim()) {
      toast({
        title: 'Empty question',
        description: 'Please enter a question',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    
    setIsAsking(true);
    try {
      const result = await api.askQuestion(question, additionalNotes);
      setAskResponse(result);
      onOpen(); // Open the modal with the response
    } catch (error) {
      console.error('Error asking question:', error);
      toast({
        title: 'Error processing question',
        description: 'Please try again later',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsAsking(false);
    }
  };
  
  // Filter tickets by status
  const inProgressTickets = jiraTickets.filter(ticket => ticket.status === 'In Progress');
  const completedTickets = jiraTickets.filter(ticket => ticket.status === 'Completed');
  
  return (
    <Box>
      <Heading as="h1" size="xl" mb={6}>
        Create & Prepare for Your 1:1
      </Heading>
      
      <Tabs variant="enclosed" colorScheme="teal">
        <TabList>
          <Tab>Current Work</Tab>
          <Tab>Completed Work</Tab>
          <Tab>Ask Questions</Tab>
        </TabList>
        
        <TabPanels>
          {/* Current Work Tab */}
          <TabPanel>
            <Heading as="h2" size="md" mb={4}>
              In Progress Work
            </Heading>
            
            {isLoading ? (
              <Flex justify="center" align="center" h="200px">
                <Spinner size="xl" color="teal.500" />
              </Flex>
            ) : (
              <>
                {inProgressTickets.length === 0 ? (
                  <Box textAlign="center" p={6} bg="gray.50" borderRadius="md">
                    <Text fontSize="lg">No active JIRA tickets found.</Text>
                  </Box>
                ) : (
                  <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }} gap={4}>
                    {inProgressTickets.map(ticket => (
                      <JiraTicketCard 
                        key={ticket.ticket_id} 
                        ticket={ticket} 
                        isGenerating={isGenerating && activeTicketId === ticket.ticket_id}
                        onGenerateStar={() => handleGenerateStar(ticket.ticket_id)}
                        disabled={true} // Can't generate STAR for in-progress tickets
                      />
                    ))}
                  </Grid>
                )}
              </>
            )}
          </TabPanel>
          
          {/* Completed Work Tab */}
          <TabPanel>
            <Heading as="h2" size="md" mb={4}>
              Completed Work and STAR Examples
            </Heading>
            
            <FormControl mb={4}>
              <FormLabel>Additional Context for Your 1:1</FormLabel>
              <Textarea
                value={additionalNotes}
                onChange={(e) => setAdditionalNotes(e.target.value)}
                placeholder="Add any additional notes or context for your 1:1 discussion..."
                rows={3}
              />
            </FormControl>
            
            {isLoading ? (
              <Flex justify="center" align="center" h="200px">
                <Spinner size="xl" color="teal.500" />
              </Flex>
            ) : (
              <>
                <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }} gap={4} mb={6}>
                  {completedTickets.map(ticket => (
                    <JiraTicketCard 
                      key={ticket.ticket_id} 
                      ticket={ticket} 
                      isGenerating={isGenerating && activeTicketId === ticket.ticket_id}
                      onGenerateStar={() => handleGenerateStar(ticket.ticket_id)}
                      starExists={starExamples.some(ex => ex.ticket_id === ticket.ticket_id)}
                    />
                  ))}
                </Grid>
                
                <Divider my={6} />
                
                <Heading as="h3" size="md" mb={4}>
                  Your STAR Examples for 1:1 Discussion
                </Heading>
                
                {starExamples.length === 0 ? (
                  <Box textAlign="center" p={6} bg="gray.50" borderRadius="md">
                    <Text fontSize="lg">No STAR examples generated yet.</Text>
                    <Text fontSize="md" mt={2}>Generate examples from your completed tickets above.</Text>
                  </Box>
                ) : (
                  <VStack spacing={4} align="stretch">
                    {starExamples.map(example => (
                      <StarExampleCard key={example.ticket_id} example={example} />
                    ))}
                  </VStack>
                )}
              </>
            )}
          </TabPanel>
          
          {/* Ask Questions Tab */}
          <TabPanel>
            <Heading as="h2" size="md" mb={4}>
              Ask About Company Policies and Documentation
            </Heading>
            
            <VStack spacing={4} align="stretch">
              <FormControl>
                <FormLabel>Your Question</FormLabel>
                <Textarea
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder="Ask about HR policies, compliance requirements, technical documentation, etc."
                  rows={4}
                />
              </FormControl>
              
              <Button
                colorScheme="teal"
                rightIcon={<FaSearch />}
                onClick={handleAskQuestion}
                isLoading={isAsking}
                loadingText="Searching..."
              >
                Find Answer
              </Button>
              
              <Box p={4} bg="gray.50" borderRadius="md" fontSize="sm">
                <Text fontWeight="bold">Example questions:</Text>
                <Text mt={2}>• What is our remote work policy?</Text>
                <Text>• How do I request time off?</Text>
                <Text>• What are the security compliance requirements for customer data?</Text>
                <Text>• What is the performance review process?</Text>
              </Box>
            </VStack>
          </TabPanel>
        </TabPanels>
      </Tabs>
      
      {/* Answer Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Answer to Your Question</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            {askResponse && (
              <>
                <Box p={4} borderRadius="md" bg="blue.50" mb={4}>
                  <Text fontWeight="bold">Q: {question}</Text>
                </Box>
                
                <Text mb={4}>{askResponse.answer}</Text>
                
                {askResponse.documents && askResponse.documents.length > 0 && (
                  <>
                    <Heading as="h4" size="sm" mb={2}>
                      Relevant Documentation:
                    </Heading>
                    <VStack spacing={3} align="stretch">
                      {askResponse.documents.map(doc => (
                        <Card key={doc.doc_id} variant="outline" size="sm">
                          <CardHeader pb={2}>
                            <Flex justify="space-between" align="center">
                              <Heading size="xs">{doc.title}</Heading>
                              <Badge colorScheme="blue">{doc.category}</Badge>
                            </Flex>
                          </CardHeader>
                          <CardBody pt={0}>
                            <Text fontSize="sm">{doc.content_summary}</Text>
                            <Text fontSize="xs" color="gray.500" mt={1}>
                              Last updated: {new Date(doc.last_updated).toLocaleDateString()}
                            </Text>
                          </CardBody>
                        </Card>
                      ))}
                    </VStack>
                  </>
                )}
              </>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default CreateTab;