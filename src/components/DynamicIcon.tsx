'use client';

import React from 'react';
import {
  Image, CurrencyExchange, ColorLens, Transform, Thermostat, Straighten,
  FitnessCenter, LocalDrink, Speed, SquareFoot, ElectricBolt,
  Compress, Storage, Architecture, Power, LocalGasStation, MyLocation,
  Language, PublicOff, DateRange, Timer, Cake, AccessTime, CalendarMonth, ViewWeek,
  Calculate, Percent, House, CreditCard, Receipt, RestaurantMenu,
  LocalOffer, TrendingUp, Payments, MonetizationOn,
  PhotoSizeSelectLarge, PhotoSizeSelectActual, Crop, RotateRight,
  AutoFixHigh, ContentCut, Web, SentimentVerySatisfied, DataObject,
  Devices, GridOn, Draw,
  FormatListNumbered, TextFormat, TextFields, Article, Compare, FlipToFront,
  PlaylistRemove, SortByAlpha, Edit, FindReplace, Translate,
  RecordVoiceOver, ManageSearch,
  Password, Fingerprint, Tag, QrCode, ViewColumn, Face, Gradient,
  Palette, Person, Casino, DataArray, Link,
  Code, Css, Javascript, Html, TableView, Schedule, Http,
  InsertDriveFile, ViewQuilt, GridView, VpnKey, SwapVert,
  Colorize, GitHub,
  Functions, BarChart, AutoGraph, Pin, Looks3, ShowChart, CallSplit,
  FilterAlt, Balance,
  MonitorWeight, LocalDining, Scale, WaterDrop, Bedtime, MonitorHeart,
  Accessibility, ChildFriendly,
  AccountBalanceWallet, Insights, TrendingDown, ElderlyWoman, Savings,
  Shield, MarkEmailRead, LinkOff, Router, PhoneAndroid, Verified,
  Cyclone, Toll, Shuffle, Psychology, Groups, HourglassEmpty,
  Lock, MoreHoriz, Memory, EmojiSymbols,
  Contrast, BlurOn, PhotoCamera, Style, DesignServices,
  TravelExplore, Share, SmartToy, AccountTree, Title, Analytics,
  Lan, Hub, DeviceHub, SettingsEthernet, DevicesOther,
  Kitchen, IceSkating, Checkroom, Monitor, Description,
  AvTimer, Checklist, StickyNote2, MenuBook, Keyboard,
  GraphicEq, MusicNote, Waves, AspectRatio,
  SwapHoriz, Build, Home, Search, DarkMode, LightMode,
  SettingsBrightness, Close, ArrowForward, Star, Construction,
  NavigateNext, Security, AccountBalance, AutoAwesome, TaskAlt,
  LockOpen, QrCode2,
} from '@mui/icons-material';
import { SvgIconProps } from '@mui/material';

const iconMap: Record<string, React.ComponentType<SvgIconProps>> = {
  Image, CurrencyExchange, ColorLens, Transform, Thermostat, Straighten,
  FitnessCenter, LocalDrink, Speed, SquareFoot, ElectricBolt,
  Compress, Storage, Architecture, Power, LocalGasStation, MyLocation,
  Language, PublicOff, DateRange, Timer, Cake, AccessTime, CalendarMonth, ViewWeek,
  Calculate, Percent, House, CreditCard, Receipt, RestaurantMenu,
  LocalOffer, TrendingUp, Payments, MonetizationOn,
  PhotoSizeSelectLarge, PhotoSizeSelectActual, Crop, RotateRight,
  AutoFixHigh, ContentCut, Web, SentimentVerySatisfied, DataObject,
  Devices, GridOn, Draw,
  FormatListNumbered, TextFormat, TextFields, Article, Compare, FlipToFront,
  PlaylistRemove, SortByAlpha, Edit, FindReplace, Translate,
  RecordVoiceOver, ManageSearch,
  Password, Fingerprint, Tag, QrCode, ViewColumn, Face, Gradient,
  Palette, Person, Casino, DataArray, Link,
  Code, Css, Javascript, Html, TableView, Schedule, Http,
  InsertDriveFile, ViewQuilt, GridView, VpnKey, SwapVert,
  Colorize, GitHub,
  Functions, BarChart, AutoGraph, Pin, Looks3, ShowChart, CallSplit,
  FilterAlt, Balance,
  MonitorWeight, LocalDining, Scale, WaterDrop, Bedtime, MonitorHeart,
  Accessibility, ChildFriendly,
  AccountBalanceWallet, Insights, TrendingDown, ElderlyWoman, Savings,
  Shield, MarkEmailRead, LinkOff, Router, PhoneAndroid, Verified,
  Cyclone, Toll, Shuffle, Psychology, Groups, HourglassEmpty,
  Lock, MoreHoriz, Memory, EmojiSymbols,
  Contrast, BlurOn, PhotoCamera, Style, DesignServices,
  TravelExplore, Share, SmartToy, AccountTree, Title, Analytics,
  Lan, Hub, DeviceHub, SettingsEthernet, DevicesOther,
  Kitchen, IceSkating, Checkroom, Monitor, Description,
  AvTimer, Checklist, StickyNote2, MenuBook, Keyboard,
  GraphicEq, MusicNote, Waves, AspectRatio,
  SwapHoriz, Build, Home, Search, DarkMode, LightMode,
  SettingsBrightness, Close, ArrowForward, Star, Construction,
  NavigateNext, Security, AccountBalance, AutoAwesome, TaskAlt,
  LockOpen, QrCode2,
};

interface DynamicIconProps extends SvgIconProps {
  name: string;
}

export default function DynamicIcon({ name, ...props }: DynamicIconProps) {
  const IconComponent = iconMap[name];
  if (!IconComponent) return <Build {...props} />;
  return <IconComponent {...props} />;
}
