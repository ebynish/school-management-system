import { Box, Text, Heading, useBreakpointValue } from "@chakra-ui/react";
import Slider from "react-slick";

const TestimonialSection = () => {
  // Slick settings for the slider
  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: false, // Optionally set to false to hide navigation arrows
  };

  return (
    <Box
      id="fh5co-testimonial"
      backgroundImage="url('/images/school.jpg')"
      backgroundSize="cover"
      backgroundPosition="center"
      py={16}
      position="relative"
    >
      <Box
        position="absolute"
        top="0"
        left="0"
        right="0"
        bottom="0"
        bg="rgba(31, 95, 139, 0.7)"
      />
      <Box position="relative" zIndex={1} textAlign="center" color="white">
        <Heading as="h2" size="2xl">
          Testimonials
        </Heading>
      </Box>

      <Box mt={12} px={4}>
        <Slider {...sliderSettings}>
          {testimonialData.map((testimonial, index) => (
            <Box
              key={index}
              textAlign="center"
              px={{ base: 4, md: 8 }}
              display="flex"
              flexDirection="column"
              justifyContent="center"
              alignItems="center"
              
            >
              <Box
                bgImage={`url('${testimonial.image}')`}
                bgSize="cover"
                bgPosition="center"
                borderRadius="full"
                width={24}
                height={24}
                mx="auto"
                mb={4}
              />
              <Text fontWeight="bold" mt={4}>
                {testimonial.name}
              </Text>
              <Text fontStyle="italic" color="gray.400" mb={4}>
                {testimonial.role}
              </Text>
              <Text width={{ base: "80%", md: "50%" }} mx="auto" color="white">
                {testimonial.quote}
              </Text>
            </Box>
          ))}
        </Slider>
      </Box>
    </Box>
  );
};

const testimonialData = [
  {
    image: 'images/kola_ore.jpg',
    name: 'KOLAWOLE OREOLUWA',
    role: 'Alumni',
    quote: `“I dreamt of a degree programme that could assist me in coping work. The information came from a friend that the University of Ibadan DLC had expanded their degree programme to Arts, Social sciences and Agric. I grabbed the opportunity by obtaining the form and today my dream has become a reality.”`,
  },
  {
    image: 'images/adebowale_alumni.png',
    name: 'Mr. Fulani Anthony Adebowale',
    role: 'Alumni',
    quote: `“Mr. Adebowale graduated 2008/2009 academic session. I thank God for the opportunity to pass through the University of Ibadan Distance learning Centre. I was a registered nurse as at the time I gained admission and I must confess that the most challenging aspect of the whole issue was combining education and work. But then the lectures that taught us contributed to my performance and success, they inspired and motivated me to start scoring high grades from my first year and build on whatever foundation I have laid till I graduate.”`,
  },
  {
    image: 'images/afebabalola.png',
    name: 'Afe Babalola',
    role: 'Foremost Lawyer and Educationist',
    quote: `“I believe in Distance Learning as it has afforded a lot of people a chance and pathway to attain first degree. I am one of the luckiest person on the planet today because if not for the programme my education would have stopped at Standard 6.”`,
  },
  // Add more testimonials here if needed
];

export default TestimonialSection;
