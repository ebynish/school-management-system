import { Box, Button, FormLabel, Input, Textarea, Checkbox, Tabs, TabList, TabPanels, Tab, TabPanel } from "@chakra-ui/react";
import { useState } from "react";

const ConfigForm = () => {
  const [activeTab, setActiveTab] = useState('general');
  const [formData, setFormData] = useState({
    general: { siteName: '', siteUrl: '', adminEmail: '' },
    payment: { callbackUrl: '' },
    aboutUs: { title: '', description: '' },
    typography: { bodyFont: '', headingFont: '', fontSizeBase: '', lineHeightBase: '' },
    seo: { metaDescription: '', metaKeywords: '', metaAuthor: '', ogImage: '' },
    apiEndpoints: { getUserData: '', getCourses: '', getPaymentStatus: '' },
    maintenanceMode: false,
    menu: [],
    footer: { text: '', grid: [] }
  });

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleCheckboxChange = (field) => {
    setFormData({
      ...formData,
      [field]: !formData[field]
    });
  };

  return (
    <form>
      <Tabs onChange={(index) => setActiveTab(Tabs[index].props.children)} variant="enclosed">
        <TabList>
          <Tab>General</Tab>
          <Tab>Payment</Tab>
          <Tab>About Us</Tab>
          <Tab>Typography</Tab>
          <Tab>SEO</Tab>
          <Tab>API Endpoints</Tab>
          <Tab>Maintenance</Tab>
          <Tab>Menu</Tab>
          <Tab>Footer</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <FormLabel>Site Name:</FormLabel>
            <Input name="general.siteName" value={formData.general.siteName} onChange={handleChange} />
            <FormLabel>Site URL:</FormLabel>
            <Input name="general.siteUrl" value={formData.general.siteUrl} onChange={handleChange} />
            <FormLabel>Admin Email:</FormLabel>
            <Input name="general.adminEmail" value={formData.general.adminEmail} onChange={handleChange} />
          </TabPanel>
          <TabPanel>
            <FormLabel>Callback URL:</FormLabel>
            <Input name="payment.callbackUrl" value={formData.payment.callbackUrl} onChange={handleChange} />
          </TabPanel>
          <TabPanel>
            <FormLabel>Title:</FormLabel>
            <Input name="aboutUs.title" value={formData.aboutUs.title} onChange={handleChange} />
            <FormLabel>Description:</FormLabel>
            <Textarea name="aboutUs.description" value={formData.aboutUs.description} onChange={handleChange} />
          </TabPanel>
          <TabPanel>
            <FormLabel>Body Font:</FormLabel>
            <Input name="typography.bodyFont" value={formData.typography.bodyFont} onChange={handleChange} />
            <FormLabel>Heading Font:</FormLabel>
            <Input name="typography.headingFont" value={formData.typography.headingFont} onChange={handleChange} />
            <FormLabel>Font Size Base:</FormLabel>
            <Input name="typography.fontSizeBase" value={formData.typography.fontSizeBase} onChange={handleChange} />
            <FormLabel>Line Height Base:</FormLabel>
            <Input name="typography.lineHeightBase" value={formData.typography.lineHeightBase} onChange={handleChange} />
          </TabPanel>
          <TabPanel>
            <FormLabel>Meta Description:</FormLabel>
            <Textarea name="seo.metaDescription" value={formData.seo.metaDescription} onChange={handleChange} />
            <FormLabel>Meta Keywords:</FormLabel>
            <Input name="seo.metaKeywords" value={formData.seo.metaKeywords} onChange={handleChange} />
            <FormLabel>Meta Author:</FormLabel>
            <Input name="seo.metaAuthor" value={formData.seo.metaAuthor} onChange={handleChange} />
            <FormLabel>OG Image:</FormLabel>
            <Input name="seo.ogImage" value={formData.seo.ogImage} onChange={handleChange} />
          </TabPanel>
          <TabPanel>
            <FormLabel>Get User Data:</FormLabel>
            <Input name="apiEndpoints.getUserData" value={formData.apiEndpoints.getUserData} onChange={handleChange} />
            <FormLabel>Get Courses:</FormLabel>
            <Input name="apiEndpoints.getCourses" value={formData.apiEndpoints.getCourses} onChange={handleChange} />
            <FormLabel>Get Payment Status:</FormLabel>
            <Input name="apiEndpoints.getPaymentStatus" value={formData.apiEndpoints.getPaymentStatus} onChange={handleChange} />
          </TabPanel>
          <TabPanel>
            <FormLabel>Maintenance Mode:</FormLabel>
            <Checkbox name="maintenanceMode" isChecked={formData.maintenanceMode} onChange={() => handleCheckboxChange('maintenanceMode')} />
          </TabPanel>
          <TabPanel>
            <FormLabel>Menu Items:</FormLabel>
            <Input name="menu" value={formData.menu.join(', ')} onChange={(e) => setFormData({ ...formData, menu: e.target.value.split(', ') })} />
          </TabPanel>
          <TabPanel>
            <FormLabel>Footer Text:</FormLabel>
            <Textarea name="footer.text" value={formData.footer.text} onChange={handleChange} />
            <FormLabel>Footer Grid:</FormLabel>
            <Textarea name="footer.grid" value={formData.footer.grid.join(', ')} onChange={(e) => setFormData({ ...formData, footer: { ...formData.footer, grid: e.target.value.split(', ') } })}></Textarea>
          </TabPanel>
        </TabPanels>
      </Tabs>

      <Button type="submit" mt={4} colorScheme="blue">Save Configuration</Button>
    </form>
  );
};

export default ConfigForm;
