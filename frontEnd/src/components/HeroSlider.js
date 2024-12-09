import React from "react";
import { Box, Text, Button, useTheme } from "@chakra-ui/react";
import Slider from "react-slick";

const HeroSlider = ({ config }) => {
  const theme = useTheme(); // Use Chakra's theme
  const { slides, primaryColor } = config || {};

  if (!slides || !Array.isArray(slides)) {
    return <Text color="red.500">No slides available!</Text>;
  }

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
    autoplay: true,
    autoplaySpeed: 5000,
  };

  return (
    <Box id="fh5co-hero" mb={10} maxW={"100%"}>
      <Slider {...settings}>
        {slides.map((slide) => (
          <Box
            p={5}
            key={slide.id}
            className="slider-item"
            bgImage={`url(${slide.image})`}
            bgPosition="center"
            bgSize="cover"
            position="relative"
            height="100vh"
            maxWidth={"100%"}
          >
            {/* Overlay */}
            <Box
              position="absolute"
              top="0"
              left="0"
              width="100%"
              height="100%"
              bg="rgba(0, 0, 0, 0.5)"
              zIndex={1}
            />

            {/* Content */}
            <Box
              position="relative"
              zIndex={2}
              display="flex"
              flexDirection="column"
              alignItems="center"
              justifyContent="center"
              height="100%"
              textAlign="center"
            >
              <Text
                color="white"
                fontWeight="300"
                fontSize={["30px", "40px"]}
                lineHeight="1.3"
                fontFamily={theme.fonts.heading}
              >
                {slide.title}
              </Text>
              <Text 
                fontFamily={theme.fonts.body}
              fontSize="20px" color="white" maxWidth="80%" mx="auto" mt={4}>
                {slide.description}
              </Text>
              <Button
                as="a"
                href={slide.buttonLink}
                target="_blank"
                bg={config.buttonColor || theme.colors.teal[500]} // Use default from theme if undefined
                color={config.buttonColor !== "white" ? "white" : "black"}
                size="lg"
                mt={5}
              >
                {slide.buttonText}
              </Button>
            </Box>
          </Box>
        ))}
      </Slider>
    </Box>
  );
};

export default HeroSlider;
