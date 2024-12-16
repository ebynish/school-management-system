import React, { useState } from 'react';
import { Box, Button, VStack, Text, Select } from '@chakra-ui/react';
import Layout from '../../components/Layout';
import GridComponent from '../../components/admin/GridComponent';
import TabsComponent from '../../components/admin/TabComponent';
import ButtonComponent from '../../components/admin/ButtonComponent';
import HeroComponent from '../../components/admin/HeroComponent';
import CarouselComponent from '../../components/admin/CarouselComponent';
import AccordionComponent from '../../components/admin/AccordionComponent';
import ImageComponent from '../../components/admin/ImageComponent';
import VideoComponent from '../../components/admin/VideoComponent';
import ListComponent from '../../components/admin/ListComponent';
import TestimonialComponent from '../../components/admin/TestimonialComponent';
import BadgeComponent from '../../components/admin/BadgeComponent';
import NotificationComponent from '../../components/admin/NotificationComponent';
import BannerComponent from '../../components/admin/BannerComponent';
import ModalComponent from '../../components/admin/ModalComponent';
import AvatarComponent from '../../components/admin/AvatarComponent';
import DropdownComponent from '../../components/admin/DropdownComponent';
// import CalendarComponent from '../../components/admin/CalendarComponent';
// import ChatWidgetComponent from '../../components/admin/ChatWidgetComponent';
import PricingTableComponent from '../../components/admin/PricingTableComponent';
import SearchBarComponent from '../../components/admin/SearchBarComponent';
import TableComponent from '../../components/admin/TableComponent';
import BreadcrumbsComponent from '../../components/admin/BreadcrumbsComponent';
import ProgressBarComponent from '../../components/admin/ProgressBarComponent';
import TimelineComponent from '../../components/admin/TimelineComponent';
import DividerComponent from '../../components/admin/DividerComponent';
import RatingComponent from '../../components/admin/RatingComponent';
// import MediaPlayerComponent from '../../components/admin/MediaPlayerComponent';
import ComponentSettings from '../../components/admin/ComponentSettings';

const componentTypes = [
  'grid',
  'tabs',
  'button',
  'hero',
  'carousel',
  'accordion',
  'image',
  'video',
  'list',
  'testimonial',
  'badge',
  'notification',
  'banner',
  'modal',
  'avatar',
  'dropdown',
  'calendar',
  'chat',
  'pricing',
  'search',
  'table',
  'display',
  'breadcrumbs',
  'progress',
  'timeline',
  'divider',
  'rating',
  'manage',
  'types'
];

const DynamicPageDesigner = ({config}) => {
  const [components, setComponents] = useState([]);
  const [selectedComponentType, setSelectedComponentType] = useState('');

  const addComponent = () => {
    if (!selectedComponentType) return;

    const newComponent = { type: selectedComponentType, props: {} };
    setComponents([...components, newComponent]);
    setSelectedComponentType(''); // Reset selection after adding
  };
  const addNestedComponent = (index) => {
    const updatedComponents = [...components];
    const nestedComponent = { type: 'nested', props: {} };
    updatedComponents[index].nestedComponents = updatedComponents[index].nestedComponents || [];
    updatedComponents[index].nestedComponents.push(nestedComponent);
    setComponents(updatedComponents);
  };
  

  const handleChange = (index, newProps) => {
    const updatedComponents = components?.map((component, i) =>
      i === index ? { ...component, props: newProps } : component
    );
    setComponents(updatedComponents);
  };

  const moveComponentUp = (index) => {
    if (index === 0) return;
    const updatedComponents = [...components];
    const temp = updatedComponents[index];
    updatedComponents[index] = updatedComponents[index - 1];
    updatedComponents[index - 1] = temp;
    setComponents(updatedComponents);
  };

  const moveComponentDown = (index) => {
    if (index === components.length - 1) return;
    const updatedComponents = [...components];
    const temp = updatedComponents[index];
    updatedComponents[index] = updatedComponents[index + 1];
    updatedComponents[index + 1] = temp;
    setComponents(updatedComponents);
  };

  return (
    <Layout config={config}>
      <VStack spacing={4}>
        <Select 
          placeholder="Select component type"
          value={selectedComponentType}
          onChange={(e) => setSelectedComponentType(e.target.value)}
          mb={4}
        >
          {componentTypes?.map((type) => (
            <option key={type} value={type}>
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </option>
          ))}
        </Select>
        <Button onClick={addComponent} colorScheme="blue">Add Component</Button>

        {components?.map((component, index) => (
          <Box key={index} p={5} borderWidth="1px" borderRadius="lg" mb={4}>
            <Text fontWeight="bold">Component Type: {component.type}</Text>
            <ComponentSettings 
              component={component} 
              index={index} 
              handleChange={handleChange} 
              addNestedComponent={addNestedComponent}
            />
            <Button onClick={() => moveComponentUp(index)} isDisabled={index === 0}>Move Up</Button>
            <Button onClick={() => moveComponentDown(index)} isDisabled={index === components.length - 1}>Move Down</Button>
          </Box>
        ))}

        <Box p={5} borderWidth="1px" borderRadius="lg" w="100%">
          <Text fontWeight="bold" fontSize="xl" mb={4}>Rendered Components:</Text>
          {components?.map((component, index) => (
            <Box key={index} mb={4}>
              {component.type === 'grid' && <GridComponent component={component.props} />}
              {component.type === 'tabs' && <TabsComponent component={component.props} />}
              {component.type === 'button' && <ButtonComponent component={component.props} />}
              {component.type === 'hero' && <HeroComponent component={component.props} />}
              {component.type === 'carousel' && <CarouselComponent component={component.props} />}
              {component.type === 'accordion' && <AccordionComponent component={component.props} />}
              {component.type === 'image' && <ImageComponent component={component.props} />}
              {component.type === 'video' && <VideoComponent component={component.props} />}
              {component.type === 'list' && <ListComponent component={component.props} />}
              {component.type === 'testimonial' && <TestimonialComponent component={component.props} />}
              {component.type === 'badge' && <BadgeComponent component={component.props} />}
              {component.type === 'notification' && <NotificationComponent component={component.props} />}
              {component.type === 'banner' && <BannerComponent component={component.props} />}
              {component.type === 'modal' && <ModalComponent component={component.props} />}
              {component.type === 'avatar' && <AvatarComponent component={component.props} />}
              {component.type === 'dropdown' && <DropdownComponent component={component.props} />}
              {/* {component.type === 'calendar' && <CalendarComponent component={component.props} />}
              {component.type === 'chat' && <ChatWidgetComponent component={component.props} />} */}
              {component.type === 'pricing' && <PricingTableComponent component={component.props} />}
              {component.type === 'search' && <SearchBarComponent component={component.props} />}
              {component.type === 'table' && <TableComponent component={component.props} />}
              {component.type === 'breadcrumbs' && <BreadcrumbsComponent component={component.props} />}
              {component.type === 'progress' && <ProgressBarComponent component={component.props} />}
              {component.type === 'timeline' && <TimelineComponent component={component.props} />}
              {component.type === 'divider' && <DividerComponent />}
              {component.type === 'rating' && <RatingComponent component={component.props} />}
              {/* {component.type === 'media' && <MediaPlayerComponent component={component.props} />} */}
            </Box>
          ))}
        </Box>
      </VStack>
    </Layout>
  );
};

export default DynamicPageDesigner;
