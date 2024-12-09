import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true }) // Automatically adds createdAt and updatedAt fields
export class Config extends Document {
  @Prop({ required: true })
  collections: {
    name: string;
    conditions: Record<string, any>;
  }[];

  @Prop({ required: true })
  primaryColor: string;

  @Prop({ required: true })
  email: string[];

  @Prop({ required: true, unique: true, lowercase: true })
  adminEmail: string;

  @Prop({ required: true })
  phoneNumber: string[];

  @Prop({ required: true })
  buttonColor: string;

  @Prop({ required: true })
  apply: string;

  @Prop({ type: Object, required: true })
  remita: {
    remitaLive: boolean;
    remitaTest: boolean;
    serviceTypeId: string;
    remitaMerchantId: string;
    remitaApiKey: string;
  };

  @Prop({ required: true })
  slides: [{
    id: number;
    image: string;
    title: string;
    description: string;
    buttonText: string;
    buttonLink: string;
  }];

  @Prop({ required: true })
  siteTitle: string;

  @Prop({ required: true })
  logoUrl: string;

  @Prop({ required: true })
  faviconUrl: string;

  @Prop({ type: Object, required: true })
  socialLinks: {
    facebook: string;
    twitter: string;
    instagram: string;
    linkedin: string;
  };

  @Prop({ type: Object, required: true })
  analytics: {
    googleAnalyticsId: string;
    facebookPixelId: string;
  };

  @Prop({ type: Object,  required: true })
  payment: {
    gateway: string;
    paymentPageUrl: string;
    callbackUrl: string;
  };

  @Prop({ type: Object, required: true })
  aboutUs: {
    title: string;
    description: string;
  };

  @Prop({ type: Object, required: true })
  contactUs: {
    address: string;
    email: string;
    phoneNumber: string;
    workingHours: string;
  };

  @Prop({ type: Object,  required: true })
  typography: {
    bodyFont: string;
    headingFont: string;
    fontSizeBase: string;
    lineHeightBase: string;
  };

  @Prop({ type: Object,  required: true })
  footer: {
    text: string;
    grid: [{
      title: string;
      aboutText?: string;
      links?: {
        text: string;
        url: string;
      }[];
    }];
  };

  @Prop({ type: Object,  required: true })
  seo: {
    metaDescription: string;
    metaKeywords: string;
    metaAuthor: string;
    ogImage: string;
  };

  @Prop({ type: Object,  required: true })
  apiEndpoints: {
    getUserData: string;
    getCourses: string;
    getPaymentStatus: string;
  };

  @Prop({ required: true })
  maintenanceMode: boolean;

  @Prop({ required: true })
  siteTheme: string;

  @Prop({ required: true })
  maxFileUploadSize: number;

  @Prop({ type: Object,  required: true })
  menu: [{
    name: string;
    href: string;
  }];
}

export const ConfigSchema = SchemaFactory.createForClass(Config);
