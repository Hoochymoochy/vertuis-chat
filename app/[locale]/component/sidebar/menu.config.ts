import {
  Home,
  IbmWatsonAssistant,
  Task,
  Settings, // Import Settings icon
} from "@carbon/icons-react";

export const sidebarSections = [
  {
    title: "Main",
    items: [
      { icon: Home, label: "Home", isActive: true, id: 1, sectionType: "home" },
      { icon: IbmWatsonAssistant, label: "Chat", id: 2, sectionType: "chat" },
      { icon: Task, label: "Case", id: 3, sectionType: "case" },
    ],
  },
  {
    title: "Settings", // Add Settings section
    items: [
      { icon: Settings, label: "Settings", id: 4, sectionType: "settings" },
    ],
  },
];

// Keep your existing chatbarSections and casebarSections
import {
  Chat,
  WatsonHealthAiResults,
  KeepDry,
} from "@carbon/icons-react";

export const chatbarSections = [
  {
    title: "Chat",
    items: [
      { icon: Chat, label: "Messages", isActive: true, id: 1 },
      { icon: WatsonHealthAiResults, label: "AI Assistant", id: 2 },
      { icon: KeepDry, label: "Notifications", id: 3 },
    ],
  },
];

import {
  Portfolio,
  Search,
  Document,
} from "@carbon/icons-react";

export const casebarSections = [
  {
    title: "Cases",
    items: [
      { icon: Portfolio, label: "All Cases", isActive: true, id: 1 },
      { icon: Search, label: "Search Cases", id: 2 },
      { icon: Document, label: "Case Documents", id: 3 },
    ],
  },
];

// Add a home section
import {
  Dashboard,
  Analytics,
  Report,
} from "@carbon/icons-react";

export const homebarSections = [
  {
    title: "Home",
    items: [
      { icon: Dashboard, label: "Dashboard", isActive: true, id: 1 },
      { icon: Analytics, label: "Analytics", id: 2 },
      { icon: Report, label: "Reports", id: 3 },
    ],
  },
];
// In menu.config.ts - Add this
import {
  UserSettings,
  Notification,
  Security,
  ColorPalette,
} from "@carbon/icons-react";

export const settingsbarSections = [
  {
    title: "Settings",
    items: [
      { icon: UserSettings, label: "Profile", isActive: true, id: 1 },
      { icon: Notification, label: "Notifications", id: 2 },
      { icon: Security, label: "Privacy & Security", id: 3 },
      { icon: ColorPalette, label: "Appearance", id: 4 },
    ],
  },
];
