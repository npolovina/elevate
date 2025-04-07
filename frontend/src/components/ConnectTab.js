// components/ConnectTab.js
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
  Text,
  Divider,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Avatar,
  Badge,
  HStack,
  VStack,
  Progress,
  Link,
  useToast,
  Spinner,
  useColorModeValue,
  Icon,
  Tooltip
} from '@chakra-ui/react';
import { FaUser, FaEnvelope, FaClock, FaStar, FaBookOpen, FaVideo, FaLaptop, FaUsers, FaLightbulb } from 'react-icons/fa';
import api from '../services/api';
import { useAuth } from '../contexts/AuthContext';

// Person Card Component
const PersonCard = ({ person }) => {
  const cardBg = useColorModeValue('white', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  
  return (
    <Card 
      direction="column" 
      variant="outline"
      bg={cardBg}
      borderColor={borderColor}
      borderWidth="1px"
      borderRadius="lg"
      overflow="hidden"
      transition="all 0.3s"
      _hover={{ shadow: 'md', borderColor: 'teal.300' }}
    >
      <CardHeader pb={2}>
        <Flex spacing="4">
          <Flex flex="1" gap="4" alignItems="center" flexWrap="wrap">
            <Avatar name={person.user.name} size="md" bg="teal.500" />
            <Box>
              <Heading size="md">{person.user.name}</Heading>
              <Text color="gray.500">{person.user.role}</Text>
            </Box>
          </Flex>
          <Badge colorScheme="green" fontSize="md" px={2} borderRadius="full">
            {person.match_score}% Match
          </Badge>
        </Flex>
      </CardHeader>
      
      <CardBody py={2}>
        <VStack align="stretch" spacing={3}>
          <Box>
            <Text fontWeight="bold" fontSize="sm" mb={1}>
              Department
            </Text>
            <Text>{person.user.department}</Text>
          </Box>
          
          <Box>
            <Text fontWeight="bold" fontSize="sm" mb={1}>
              Shared Skills
            </Text>
            <Flex wrap="wrap" gap={2}>
              {person.matching_skills.map((skill, index) => (
                <Badge key={index} colorScheme="blue" variant="subtle">
                  {skill}
                </Badge>
              ))}
            </Flex>
          </Box>
          
          <Box>
            <Text fontWeight="bold" fontSize="sm" mb={1}>
              Shared Interests
            </Text>
            <Flex wrap="wrap" gap={2}>
              {person.matching_interests.map((interest, index) => (
                <Badge key={index} colorScheme="purple" variant="subtle">
                  {interest}
                </Badge>
              ))}
            </Flex>
          </Box>
        </VStack>
      </CardBody>
      
      <CardFooter pt={2}>
        <Button
          colorScheme="blue"
          width="100%"
          as={Link}
          href={material.material.url}
          isExternal
        >
          Start Learning
        </Button>
      </CardFooter>
    </Card>
  );
};

// Spacer component
const Spacer = () => <Box flex="1" />;

const ConnectTab = () => {
  const { user } = useAuth();
  const toast = useToast();
  
  // State for data
  const [peopleRecommendations, setPeopleRecommendations] = useState([]);
  const [learningRecommendations, setLearningRecommendations] = useState([]);
  const [isLoadingPeople, setIsLoadingPeople] = useState(true);
  const [isLoadingLearning, setIsLoadingLearning] = useState(true);
  
  useEffect(() => {
    const fetchPeopleRecommendations = async () => {
      setIsLoadingPeople(true);
      try {
        const result = await api.getPeopleRecommendations();
        setPeopleRecommendations(result);
      } catch (error) {
        console.error('Error fetching people recommendations:', error);
        toast({
          title: 'Error fetching recommendations',
          description: 'Please try again later',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      } finally {
        setIsLoadingPeople(false);
      }
    };
    
    const fetchLearningRecommendations = async () => {
      setIsLoadingLearning(true);
      try {
        const result = await api.getLearningRecommendations();
        setLearningRecommendations(result);
      } catch (error) {
        console.error('Error fetching learning recommendations:', error);
        toast({
          title: 'Error fetching learning materials',
          description: 'Please try again later',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      } finally {
        setIsLoadingLearning(false);
      }
    };
    
    fetchPeopleRecommendations();
    fetchLearningRecommendations();
  }, [toast]);
  
  return (
    <Box>
      <Heading as="h1" size="xl" mb={6}>
        Connect & Develop
      </Heading>
      
      <Tabs variant="enclosed" colorScheme="teal">
        <TabList>
          <Tab>People to Meet</Tab>
          <Tab>Learning Opportunities</Tab>
        </TabList>
        
        <TabPanels>
          {/* People to Meet Tab */}
          <TabPanel>
            <Heading as="h2" size="md" mb={6}>
              Recommended Connections Based on Skills & Interests
            </Heading>
            
            {isLoadingPeople ? (
              <Flex justify="center" align="center" h="200px">
                <Spinner size="xl" color="teal.500" />
              </Flex>
            ) : (
              <>
                {peopleRecommendations.length === 0 ? (
                  <Box textAlign="center" p={6} bg="gray.50" borderRadius="md">
                    <Text fontSize="lg">No recommendations available at this time.</Text>
                    <Text fontSize="md" mt={2}>Check back later as we expand our network.</Text>
                  </Box>
                ) : (
                  <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }} gap={6}>
                    {peopleRecommendations.map((person, index) => (
                      <PersonCard key={index} person={person} />
                    ))}
                  </Grid>
                )}
              </>
            )}
            
            <Box mt={6} p={4} bg="blue.50" borderRadius="md">
              <Flex align="center" mb={2}>
                <Icon as={FaLightbulb} color="blue.500" boxSize={5} mr={2} />
                <Heading as="h3" size="sm">
                  Why Connect?
                </Heading>
              </Flex>
              <Text>
                Building a strong professional network can accelerate your career growth. 
                These connections can provide mentorship, collaborate on projects, and 
                share valuable insights about different career paths within the organization.
              </Text>
            </Box>
          </TabPanel>
          
          {/* Learning Opportunities Tab */}
          <TabPanel>
            <Heading as="h2" size="md" mb={2}>
              Recommended Learning Materials
            </Heading>
            <Text mb={6} color="gray.600">
              Based on your desired skills: {user?.desired_skills?.join(', ')}
            </Text>
            
            {isLoadingLearning ? (
              <Flex justify="center" align="center" h="200px">
                <Spinner size="xl" color="blue.500" />
              </Flex>
            ) : (
              <>
                {learningRecommendations.length === 0 ? (
                  <Box textAlign="center" p={6} bg="gray.50" borderRadius="md">
                    <Text fontSize="lg">No learning recommendations available at this time.</Text>
                    <Text fontSize="md" mt={2}>Update your desired skills to get personalized recommendations.</Text>
                  </Box>
                ) : (
                  <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }} gap={6}>
                    {learningRecommendations.map((material, index) => (
                      <LearningMaterialCard key={index} material={material} />
                    ))}
                  </Grid>
                )}
                
                <Divider my={6} />
                
                <Flex direction={{ base: 'column', md: 'row' }} gap={4}>
                  <Card flex="1" p={4} bg="purple.50" borderRadius="md">
                    <VStack align="flex-start" spacing={3}>
                      <Heading as="h3" size="sm">
                        External Resources
                      </Heading>
                      <Text fontSize="sm">
                        Looking beyond internal training? We can reimburse external courses 
                        that align with your development plan. Speak with your manager to learn more.
                      </Text>
                      <Button colorScheme="purple" size="sm" variant="outline">
                        View Reimbursement Policy
                      </Button>
                    </VStack>
                  </Card>
                  
                  <Card flex="1" p={4} bg="green.50" borderRadius="md">
                    <VStack align="flex-start" spacing={3}>
                      <Heading as="h3" size="sm">
                        Learning Time
                      </Heading>
                      <Text fontSize="sm">
                        Remember that you can use up to 4 hours per week for professional 
                        development. Block this time in your calendar!
                      </Text>
                      <Button colorScheme="green" size="sm" variant="outline">
                        Add to Calendar
                      </Button>
                    </VStack>
                  </Card>
                </Flex>
              </>
            )}
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
};

export default ConnectTab;
      <CardFooter pt={2}>
        <HStack spacing={4} width="100%">
          <Button
            flex={1}
            variant="outline"
            colorScheme="teal"
            leftIcon={<FaEnvelope />}
            size="sm"
          >
            Message
          </Button>
          <Button
            flex={1}
            colorScheme="teal"
            leftIcon={<FaUser />}
            size="sm"
          >
            Schedule 1:1
          </Button>
        </HStack>
      </CardFooter>
    </Card>
  );
};

// Learning Material Card Component
const LearningMaterialCard = ({ material }) => {
  const cardBg = useColorModeValue('white', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  
  // Icon based on material type
  const getIcon = (type) => {
    switch (type.toLowerCase()) {
      case 'course':
        return FaLaptop;
      case 'workshop':
        return FaUsers;
      case 'webinar':
        return FaVideo;
      case 'mentorship program':
        return FaUser;
      default:
        return FaBookOpen;
    }
  };
  
  return (
    <Card 
      direction="column" 
      variant="outline"
      bg={cardBg}
      borderColor={borderColor}
      borderWidth="1px"
      borderRadius="lg"
      overflow="hidden"
      transition="all 0.3s"
      _hover={{ shadow: 'md', borderColor: 'blue.300' }}
    >
      <CardHeader pb={2}>
        <Flex alignItems="center" mb={2}>
          <Icon as={getIcon(material.material.type)} color="blue.500" boxSize={5} mr={2} />
          <Badge colorScheme="blue" fontSize="sm" px={2} borderRadius="full">
            {material.material.type}
          </Badge>
          <Spacer />
          <HStack>
            <Icon as={FaStar} color="yellow.400" />
            <Text fontWeight="bold">{material.material.rating.toFixed(1)}</Text>
          </HStack>
        </Flex>
        <Heading size="md" noOfLines={2}>{material.material.title}</Heading>
      </CardHeader>
      
      <CardBody py={2}>
        <VStack align="stretch" spacing={3}>
          <Text noOfLines={2} fontSize="sm" color="gray.600">
            {material.material.description}
          </Text>
          
          <Box>
            <Text fontWeight="bold" fontSize="sm" mb={1}>
              Skills You'll Gain
            </Text>
            <Flex wrap="wrap" gap={2}>
              {material.material.skills.map((skill, index) => (
                <Badge 
                  key={index} 
                  colorScheme={material.matching_skills.includes(skill) ? "green" : "gray"} 
                  variant="subtle"
                >
                  {skill}
                </Badge>
              ))}
            </Flex>
          </Box>
          
          <HStack fontSize="sm" color="gray.500">
            <Icon as={FaClock} />
            <Text>{material.material.duration}</Text>
            <Spacer />
            <Text>{material.material.completion_count} completions</Text>
          </HStack>
          
          <HStack>
            <Text fontWeight="bold" fontSize="sm">Relevance:</Text>
            <Badge colorScheme="green">{material.relevance_score}%</Badge>
          </HStack>
        </VStack>
      </CardBody>