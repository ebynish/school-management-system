import { useEffect, useState } from 'react';
import {
  useDisclosure,
} from '@chakra-ui/react';

import useApi from '../hooks/useApi';

import { fetchData } from "../api";
import { useSelector } from 'react-redux';

import HeroSlider from '../components/HeroSlider';
import CourseCategories from '../components/CourseCategories';
import CounterSection from '../components/CounterSection';
import TestimonialSection from '../components/TestimonialSection';
import AdmissionCountdown from '../components/AdmissionCountdown';
import MainLayout from '../components/MainLayout';
import LatestNews from '../components/LatestNews';



const HomePage = ({config}) => {

  const user = useSelector((state) => state.auth.user);
  console.log(config, 2)
  return (

   
      <MainLayout config={config}>
      
      
        <HeroSlider config={config} />
        <CourseCategories config={config} />
        <CounterSection config={config} />
        <LatestNews config={config} />
        <TestimonialSection config={config} />
        <AdmissionCountdown config={config} />

        
        </MainLayout>
    ); 
  };

export default HomePage;
