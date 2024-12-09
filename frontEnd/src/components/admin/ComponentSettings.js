import React from 'react';
import {
  Box,
  FormControl,
  FormLabel,
  Input,
  Select,
  Textarea,
  IconButton,
} from '@chakra-ui/react';
import { AddIcon } from '@chakra-ui/icons';

const ComponentSettings = ({ component, index, handleChange, addNestedComponent }) => {
  return (
    <Box p={5} borderWidth="1px" borderRadius="lg" mb={4}>
      <FormControl mb={2}>
        <FormLabel>Title</FormLabel>
        <Input
          placeholder="Component Title"
          value={component.title}
          onChange={(e) => handleChange(index, 'title', e.target.value)}
        />
      </FormControl>

      <FormControl mb={2}>
        <FormLabel>Description</FormLabel>
        <Textarea
          placeholder="Component Description"
          value={component.description}
          onChange={(e) => handleChange(index, 'description', e.target.value)}
        />
      </FormControl>

      <FormControl mb={2}>
        <FormLabel>Background Color</FormLabel>
        <Input
          placeholder="Background Color"
          value={component.backgroundColor}
          onChange={(e) => handleChange(index, 'backgroundColor', e.target.value)}
        />
      </FormControl>

      <FormControl mb={2}>
        <FormLabel>Text Color</FormLabel>
        <Input
          placeholder="Text Color"
          value={component.textColor}
          onChange={(e) => handleChange(index, 'textColor', e.target.value)}
        />
      </FormControl>

      <FormControl mb={2}>
        <FormLabel>Content</FormLabel>
        <Textarea
          placeholder="Content (optional)"
          value={component.content}
          onChange={(e) => handleChange(index, 'content', e.target.value)}
        />
      </FormControl>

      <FormControl mb={2}>
        <FormLabel>Component Type</FormLabel>
        <Select
          placeholder="Select component type"
          value={component.type}
          onChange={(e) => handleChange(index, 'type', e.target.value)}
        >
          {['navbar', 'card', 'header', 'footer', 'button', 'hero', 'carousel', 'image', 'video', 'list', 'accordion', 'tabs', 'testimonial', 'badge', 'notification', 'banner', 'modal', 'avatar', 'dropdown', 'calendar', 'chat-widget', 'pricing-table', 'search-bar', 'table', 'breadcrumbs', 'progress-bar', 'timeline', 'divider', 'rating', 'media-player', 'grid'].map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </Select>
      </FormControl>

      {/* Button to add a nested component */}
      <IconButton
        mt={3}
        icon={<AddIcon />}
        aria-label="Add nested component"
        onClick={() => addNestedComponent(index)}
      />
    </Box>
  );
};

export default ComponentSettings;
