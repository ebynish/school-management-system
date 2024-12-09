import React, { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { Box, Heading, Text, Spinner, Flex } from '@chakra-ui/react';
import useApi from '../hooks/useApi';
import { fetchData } from '../api';
import Layout from './Layout';

// Import Admin Components
import GridComponent from './admin/GridComponent';
import TabsComponent from './admin/TabComponent';
import ButtonComponent from './admin/ButtonComponent';
import HeroComponent from './admin/HeroComponent';
import CarouselComponent from './admin/CarouselComponent';
import AccordionComponent from './admin/AccordionComponent';
import ImageComponent from './admin/ImageComponent';
import VideoComponent from './admin/VideoComponent';
import ListComponent from './admin/ListComponent';
import TestimonialComponent from './admin/TestimonialComponent';
import BadgeComponent from './admin/BadgeComponent';
import NotificationComponent from './admin/NotificationComponent';
import BannerComponent from './admin/BannerComponent';
import ModalComponent from './admin/ModalComponent';
import AvatarComponent from './admin/AvatarComponent';
import DropdownComponent from './admin/DropdownComponent';
import PricingTableComponent from './admin/PricingTableComponent';
import SearchBarComponent from './admin/SearchBarComponent';
import TableComponent from './admin/TableComponent';
import BreadcrumbsComponent from './admin/BreadcrumbsComponent';
import ProgressBarComponent from './admin/ProgressBarComponent';
import TimelineComponent from './admin/TimelineComponent';
import DividerComponent from './admin/DividerComponent';
import RatingComponent from './admin/RatingComponent';
import ComponentSettings from './admin/ComponentSettings';
import ManageSearch from './admin/ManageSearch';
import Display from './admin/Display';
import TypesCard from './admin/TypesCard';
import DynamicTable from './DynamicTable';

// Helper Functions
const findMenuItem = (menu, fullSlug) => {
  for (const item of menu) {
    if (item.route === fullSlug) return item;
    if (item.subItems) {
      const found = findMenuItem(item.subItems, fullSlug);
      if (found) return found;
    }
  }
  return null;
};

const splitCamelCase = (str) => {
  return str
    .replace(/([a-z])([A-Z])/g, '$1 $2') // Split camel case
    .replace(/\b\w/g, (char) => char.toUpperCase()); // Capitalize words
};

const createHeadersArray = (additionalProps) => {
  const keys = Object.values(additionalProps);

  return keys.map((key) => {
    if (key.includes('.')) {
      // Handle nested fields
      const parts = key.split('.'); // Split by dot notation
      const simplifiedLabel = splitCamelCase(parts[0]); // Use only the parent field for the label
      return { key, label: simplifiedLabel }; // Return key and user-friendly label
    }

    // Handle non-nested fields
    return { key, label: splitCamelCase(key) };
  });
};




// Render Component Based on Type
const renderComponentByType = (component, searchResults, onSearch) => {
  
  switch (component.type) {
    case 'grid':
      return <GridComponent data={component} />;
    case 'tabs':
      return <TabsComponent data={component} />;
    case 'button':
      return <ButtonComponent data={component} />;
    case 'hero':
      return <HeroComponent data={component} />;
    case 'carousel':
      return <CarouselComponent data={component} />;
    case 'accordion':
      return <AccordionComponent data={component} />;
    case 'image':
      return <ImageComponent data={component} />;
    case 'video':
      return <VideoComponent data={component} />;
    case 'list':
      return <ListComponent data={component} />;
    case 'testimonial':
      return <TestimonialComponent data={component} />;
    case 'badge':
      return <BadgeComponent data={component} />;
    case 'notification':
      return <NotificationComponent data={component} />;
    case 'banner':
      return <BannerComponent data={component} />;
    case 'modal':
      return <ModalComponent data={component} />;
    case 'avatar':
      return <AvatarComponent data={component} />;
    case 'dropdown':
      return <DropdownComponent data={component} />;
    case 'pricing':
      return <PricingTableComponent data={component} />;
    case 'search':
      return <SearchBarComponent data={component} />;
    case 'table':
      return (
        <DynamicTable
          apiUrl={searchResults ? null : component.linkUrl}
          source={searchResults || null}
          headers={createHeadersArray(component?.additionalProps)}
          search={component.search}
          action={component.action}
          buttons={[
            { view: component?.view },
            { edit: component?.edit, editModal: component?.editModal, modalSlug: component?.modalSlug },
            { disable: component?.disable },
          ]}
        />
      );
    case 'display':
      return <Display data={component} value={{ firstName: 'Ibadan', lastName: 'Oyo', accountNumber: '309435905' }} />;
    case 'breadcrumbs':
      return <BreadcrumbsComponent data={component} />;
    case 'progress':
      return <ProgressBarComponent data={component} />;
    case 'timeline':
      return <TimelineComponent data={component} />;
    case 'divider':
      return <DividerComponent />;
    case 'rating':
      return <RatingComponent data={component} />;
    case 'manage':
      return <ManageSearch data={component} onSearch={onSearch} />;
    case 'types':
      return <TypesCard data={component.nestedComponents} />;
    default:
      return <Text></Text>;
  }
};

// Main Component
const DataDisplayPage = () => {
  const location = useLocation();
  const fullSlug = `/${location.pathname.slice(1)}`;
  const lastPart = location.pathname.split('/').pop().split('-').pop();
  const [searchResults, setSearchResults] = useState(null);
  const [data, setData] = useState(null);
  const [menu, setMenu] = useState([]);
  const [loading, setLoading] = useState(true);
  const { execute } = useApi(fetchData);
  
  const onSearch = async (searchFields) => {
    
    setSearchResults(searchFields);
  };
  // Load Menu Data
  useEffect(() => {
    const loadMenuData = async () => {
      try {
        const menuResponse = await execute('menu/findMenu');
        setMenu(menuResponse);
      } catch (error) {
        console.error('Failed to load menu data:', error);
      }
    };
    loadMenuData();
  }, [execute]);

  // Load Data Based on Menu
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const menuItem = findMenuItem(menu, fullSlug);
        console.log(menuItem?.itemType)
        const displayType = menuItem ? menuItem?.itemType : lastPart;
        
        if (displayType) {
          const response = await execute(`check/${displayType}${fullSlug}`);
          setData(response);
        } else {
          throw new Error('Display type not found');
        }
      } catch (error) {
        console.error('Failed to load data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (menu?.length > 0) loadData();
  }, [fullSlug, menu, lastPart, execute]);

  if (loading) return <Spinner />;

  return (
    <Layout>
      <Box p={5} width="100%">
        {data ? (
          <Box spacing={4}>
            <Heading size="sm">{data.title}</Heading>
            <Text>{data.description}</Text>
            <Box>{renderComponentByType(data, searchResults, onSearch)}</Box>
            {data?.nestedComponents?.map((component, index) => (
              <Box key={index} mb={4}>
                {renderComponentByType(component, searchResults, onSearch)}
              </Box>
            ))}
          </Box>
        ) : (
          <Flex minHeight="80vh" justifyContent="center" alignItems="center">
            <Text>Error 404: Page not found.</Text>
          </Flex>
        )}
      </Box>
    </Layout>
  );
};

export default DataDisplayPage;
