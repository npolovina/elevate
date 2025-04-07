// components/ElevateTab.js
import React, { useState, useEffect } from 'react';
import {
  Box,
  Heading,
  Flex,
  Grid,
  Button,
  Text,
  Divider,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Badge,
  HStack,
  VStack,
  Progress,
  Stack,
  Tag,
  useToast,
  Spinner,
  useColorModeValue,
  Icon,
  Tooltip,
  Select,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Avatar,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useDisclosure
} from '@chakra-ui/react';
import { 
  FaBriefcase, 
  FaMapMarkerAlt, 
  FaCalendarAlt, 
  FaChevronDown, 
  FaCheck, 
  FaTimes, 
  FaStar, 
  FaExternalLinkAlt,
  FaChartLine,
  FaBookmark,
  FaShare
} from 'react-icons/fa';
import api from '../services/api';
import { useAuth } from '../contexts/AuthContext';

// Job Card Component
const JobCard = ({ job, onViewDetails }) => {
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
      _hover={{ shadow: 'md', borderColor: 'purple.300' }}
    >
      <CardHeader pb={3}>
        <HStack spacing={4} align="center">
          <Badge 
            colorScheme={job.job.internal_only ? "green" : "blue"} 
            fontSize="xs"
          >
            {job.job.internal_only ? "Internal Only" : "Open Position"}
          </Badge>
          <Badge 
            colorScheme="purple" 
            fontSize="sm" 
            px={2} 
            borderRadius="full"
          >
            {job.match_score}% Match
          </Badge>
        </HStack>
        <Heading size="md" mt={2} noOfLines={2}>{job.job.title}</Heading>
      </CardHeader>
      
      <CardBody py={2}>
        <VStack align="stretch" spacing={3}>
          <HStack fontSize="sm" color="gray.600">
            <Icon as={FaBriefcase} />
            <Text>{job.job.department}</Text>
          </HStack>
          
          <HStack fontSize="sm" color="gray.600">
            <Icon as={FaMapMarkerAlt} />
            <Text>{job.job.location}</Text>
          </HStack>
          
          <HStack fontSize="sm" color="gray.600">
            <Icon as={FaCalendarAlt} />
            <Text>Posted: {new Date(job.job.posted_date).toLocaleDateString()}</Text>
          </HStack>
          
          <Text fontSize="sm" mt={1} color="gray.700" noOfLines={2}>
            {job.job.description}
          </Text>
          
          <Box>
            <Text fontWeight="bold" fontSize="sm" mb={2}>
              Your Matching Skills
            </Text>
            <Flex wrap="wrap" gap={2}>
              {job.matches.current_skills_match.slice(0, 5).map((skill, index) => (
                <Tag key={index} size="sm" colorScheme="green" variant="subtle">
                  <Icon as={FaCheck} mr={1} fontSize="xs" />
                  {skill}
                </Tag>
              ))}
              {job.matches.current_skills_match.length > 5 && (
                <Tooltip label={job.matches.current_skills_match.slice(5).join(', ')}>
                  <Tag size="sm" colorScheme="green" variant="subtle">
                    +{job.matches.current_skills_match.length - 5} more
                  </Tag>
                </Tooltip>
              )}
            </Flex>
          </Box>
          
          {job.matches.missing_requirements.length > 0 && (
            <Box>
              <Text fontWeight="bold" fontSize="sm" mb={2} color="orange.500">
                Skills You're Developing
              </Text>
              <Flex wrap="wrap" gap={2}>
                {job.matches.missing_requirements.slice(0, 3).map((skill, index) => (
                  <Tag key={index} size="sm" colorScheme="orange" variant="subtle">
                    {skill}
                  </Tag>
                ))}
                {job.matches.missing_requirements.length > 3 && (
                  <Tooltip label={job.matches.missing_requirements.slice(3).join(', ')}>
                    <Tag size="sm" colorScheme="orange" variant="subtle">
                      +{job.matches.missing_requirements.length - 3} more
                    </Tag>
                  </Tooltip>
                )}
              </Flex>
            </Box>
          )}
          
          <Box>
            <Text fontSize="sm" fontWeight="bold">Salary Range</Text>
            <Text fontSize="md" color="green.600">{job.job.salary_range}</Text>
          </Box>
        </VStack>
      </CardBody>
      
      <CardFooter pt={2}>
        <Button
          colorScheme="purple"
          width="100%"
          onClick={() => onViewDetails(job)}
        >
          View Details
        </Button>
      </CardFooter>
    </Card>
  );
};

// Job Detail Modal Component
const JobDetailModal = ({ isOpen, onClose, job }) => {
  if (!job) return null;
  
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl" scrollBehavior="inside">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          <HStack>
            <Text>{job.job.title}</Text>
            <Badge 
              colorScheme={job.job.internal_only ? "green" : "blue"} 
              ml={2}
            >
              {job.job.internal_only ? "Internal Only" : "Open Position"}
            </Badge>
          </HStack>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          <VStack spacing={4} align="stretch">
            <Card p={4} variant="outline">
              <HStack wrap="wrap" spacing={6}>
                <Box>
                  <Text fontWeight="bold" fontSize="sm" color="gray.500">Department</Text>
                  <HStack>
                    <Icon as={FaBriefcase} color="gray.500" />
                    <Text>{job.job.department}</Text>
                  </HStack>
                </Box>
                
                <Box>
                  <Text fontWeight="bold" fontSize="sm" color="gray.500">Location</Text>
                  <HStack>
                    <Icon as={FaMapMarkerAlt} color="gray.500" />
                    <Text>{job.job.location}</Text>
                  </HStack>
                </Box>
                
                <Box>
                  <Text fontWeight="bold" fontSize="sm" color="gray.500">Posted Date</Text>
                  <HStack>
                    <Icon as={FaCalendarAlt} color="gray.500" />
                    <Text>{new Date(job.job.posted_date).toLocaleDateString()}</Text>
                  </HStack>
                </Box>
                
                <Box>
                  <Text fontWeight="bold" fontSize="sm" color="gray.500">Salary Range</Text>
                  <Text color="green.600" fontWeight="bold">{job.job.salary_range}</Text>
                </Box>
              </HStack>
            </Card>
            
            <Divider />
            
            <Box>
              <Heading size="sm" mb={2}>Job Description</Heading>
              <Text>{job.job.description}</Text>
            </Box>
            
            <Divider />
            
            <HStack spacing={6} align="flex-start">
              <Box flex="1">
                <Heading size="sm" mb={2}>Requirements</Heading>
                <VStack align="stretch" spacing={2}>
                  {job.job.requirements.map((req, idx) => (
                    <HStack key={idx} align="flex-start">
                      <Icon 
                        as={job.matches.current_skills_match.some(skill => 
                          req.toLowerCase().includes(skill.toLowerCase())
                        ) ? FaCheck : FaTimes} 
                        color={job.matches.current_skills_match.some(skill => 
                          req.toLowerCase().includes(skill.toLowerCase())
                        ) ? "green.500" : "red.500"} 
                        mt={1}
                      />
                      <Text>{req}</Text>
                    </HStack>
                  ))}
                </VStack>
              </Box>
              
              <Box flex="1">
                <Heading size="sm" mb={2}>Preferred Skills</Heading>
                <VStack align="stretch" spacing={2}>
                  {job.job.preferred_skills.map((skill, idx) => (
                    <HStack key={idx} align="flex-start">
                      <Icon 
                        as={job.matches.current_skills_match.some(s => 
                          skill.toLowerCase().includes(s.toLowerCase())
                        ) ? FaCheck : FaTimes} 
                        color={job.matches.current_skills_match.some(s => 
                          skill.toLowerCase().includes(s.toLowerCase())
                        ) ? "green.500" : "red.500"} 
                        mt={1}
                      />
                      <Text>{skill}</Text>
                    </HStack>
                  ))}
                </VStack>
              </Box>
            </HStack>
            
            <Divider />
            
            <Box>
              <Heading size="sm" mb={3}>Your Match Analysis</Heading>
              <HStack mb={3}>
                <Text fontWeight="bold">Overall Match:</Text>
                <Badge colorScheme="purple" fontSize="md" px={2}>
                  {job.match_score}%
                </Badge>
              </HStack>
              
              <VStack spacing={4} align="stretch">
                <Box>
                  <Text fontWeight="bold" mb={1}>Skills You Have</Text>
                  <Flex wrap="wrap" gap={2}>
                    {job.matches.current_skills_match.map((skill, index) => (
                      <Badge key={index} colorScheme="green" variant="solid" px={2} py={1}>
                        {skill}
                      </Badge>
                    ))}
                    {job.matches.current_skills_match.length === 0 && (
                      <Text fontSize="sm" color="gray.500">No direct skill matches found.</Text>
                    )}
                  </Flex>
                </Box>
                
                <Box>
                  <Text fontWeight="bold" mb={1}>Skills You're Developing</Text>
                  <Flex wrap="wrap" gap={2}>
                    {job.matches.desired_skills_match.map((skill, index) => (
                      <Badge key={index} colorScheme="blue" variant="solid" px={2} py={1}>
                        {skill}
                      </Badge>
                    ))}
                    {job.matches.desired_skills_match.length === 0 && (
                      <Text fontSize="sm" color="gray.500">None of your desired skills match this role.</Text>
                    )}
                  </Flex>
                </Box>
                
                <Box>
                  <Text fontWeight="bold" mb={1}>Skills to Develop</Text>
                  <Flex wrap="wrap" gap={2}>
                    {job.matches.missing_requirements.map((skill, index) => (
                      <Badge key={index} colorScheme="orange" variant="solid" px={2} py={1}>
                        {skill}
                      </Badge>
                    ))}
                    {job.matches.missing_requirements.length === 0 && (
                      <Text fontSize="sm" color="gray.500">You have all the required skills!</Text>
                    )}
                  </Flex>
                </Box>
              </VStack>
            </Box>
            
            <Divider />
            
            <HStack spacing={4}>
              <Button 
                colorScheme="purple" 
                leftIcon={<FaExternalLinkAlt />}
                flex="1"
              >
                Apply Now
              </Button>
              <Button 
                variant="outline" 
                leftIcon={<FaBookmark />}
              >
                Save
              </Button>
              <Button 
                variant="outline" 
                leftIcon={<FaShare />}
              >
                Share
              </Button>
            </HStack>
          </VStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

const ElevateTab = () => {
  const { user } = useAuth();
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedJob, setSelectedJob] = useState(null);
  
  // State for data
  const [jobRecommendations, setJobRecommendations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sortBy, setSortBy] = useState("match");
  const [filterInternal, setFilterInternal] = useState("all");
  
  useEffect(() => {
    const fetchJobRecommendations = async () => {
      setIsLoading(true);
      try {
        const result = await api.getJobRecommendations();
        setJobRecommendations(result);
      } catch (error) {
        console.error('Error fetching job recommendations:', error);
        toast({
          title: 'Error fetching job recommendations',
          description: 'Please try again later',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchJobRecommendations();
  }, [toast]);
  
  const handleViewDetails = (job) => {
    setSelectedJob(job);
    onOpen();
  };
  
  // Sort and filter jobs
  const filteredAndSortedJobs = [...jobRecommendations]
    .filter(job => {
      if (filterInternal === "internal") return job.job.internal_only;
      if (filterInternal === "external") return !job.job.internal_only;
      return true; // "all"
    })
    .sort((a, b) => {
      if (sortBy === "match") return b.match_score - a.match_score;
      if (sortBy === "date") return new Date(b.job.posted_date) - new Date(a.job.posted_date);
      if (sortBy === "salary") {
        // Extract max salary for comparison (crude but works for demo)
        const getMaxSalary = (salaryRange) => {
          const match = salaryRange.match(/\$([0-9,]+)/g);
          if (match && match.length > 1) {
            return parseInt(match[1].replace(/[$,]/g, ''));
          }
          return 0;
        };
        return getMaxSalary(b.job.salary_range) - getMaxSalary(a.job.salary_range);
      }
      return 0;
    });
  
  return (
    <Box>
      <Heading as="h1" size="xl" mb={6}>
        Elevate Your Career
      </Heading>
      
      <Card mb={6} p={5} bg="purple.50">
        <Flex direction={{ base: 'column', md: 'row' }} align="center">
          <Icon as={FaChartLine} boxSize={10} color="purple.500" mr={{ base: 0, md: 4 }} mb={{ base: 4, md: 0 }} />
          <Box>
            <Heading as="h2" size="md" mb={2}>
              Career Growth Opportunity Analysis
            </Heading>
            <Text>
              Based on your skills, completed projects, and interests, we've identified 
              job opportunities that align with your career path. These recommendations
              include both positions you're ready for today and roles you could grow into
              with some additional skill development.
            </Text>
          </Box>
        </Flex>
      </Card>
      
      <Flex 
        mb={6} 
        direction={{ base: 'column', md: 'row' }} 
        justify="space-between"
        align={{ base: 'flex-start', md: 'center' }}
        gap={4}
      >
        <Heading as="h2" size="md">
          Recommended Job Opportunities
        </Heading>
        
        <HStack spacing={4}>
          <Select 
            size="sm" 
            value={filterInternal}
            onChange={(e) => setFilterInternal(e.target.value)}
            width="150px"
          >
            <option value="all">All Jobs</option>
            <option value="internal">Internal Only</option>
            <option value="external">External</option>
          </Select>
          
          <Select 
            size="sm" 
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            width="150px"
          >
            <option value="match">Sort by Match</option>
            <option value="date">Sort by Date</option>
            <option value="salary">Sort by Salary</option>
          </Select>
        </HStack>
      </Flex>
      
      {isLoading ? (
        <Flex justify="center" align="center" h="300px">
          <Spinner size="xl" color="purple.500" />
        </Flex>
      ) : (
        <>
          {filteredAndSortedJobs.length === 0 ? (
            <Box textAlign="center" p={6} bg="gray.50" borderRadius="md">
              <Text fontSize="lg">No job recommendations available with the current filters.</Text>
              <Text fontSize="md" mt={2}>Try adjusting your filters or check back later for new opportunities.</Text>
            </Box>
          ) : (
            <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }} gap={6}>
              {filteredAndSortedJobs.map((job, index) => (
                <JobCard 
                  key={index} 
                  job={job} 
                  onViewDetails={handleViewDetails}
                />
              ))}
            </Grid>
          )}
        </>
      )}
      
      {/* Job Detail Modal */}
      <JobDetailModal 
        isOpen={isOpen} 
        onClose={onClose}
        job={selectedJob}
      />
    </Box>
  );
};

export default ElevateTab;