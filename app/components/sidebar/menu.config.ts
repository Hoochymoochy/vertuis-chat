import {
  Home,
  IbmWatsonAssistant,
  Task,
  Settings,
  EarthFilled, // Import Settings icon
} from "@carbon/icons-react";

export const sidebarSections = [
  {
    title: "Main",
    items: [
      { icon: IbmWatsonAssistant, label: "Chat", id: 2, sectionType: "documents", route: "/chat" },
      { icon: Task, label: "Case", id: 3, sectionType: "case", route: "/case" },
      { icon: Document, label: "Documents", id: 5, sectionType: "documents", route: "/case/3" }, // Add this
    ],
  },
  {
    title: "Settings",
    items: [
      { icon: Settings, label: "Settings", id: 4, sectionType: "settings", route: "/settings" },
    ],
  },
];

// Keep your existing chatbarSections and casebarSections
import {
  Chat,
  Time,
} from "@carbon/icons-react";

export const chatbarSections = [
  {
    title: "Chat",
    items: [
      { icon: Chat, label: "New Chat", isActive: true, id: 1 },
      { icon: Time, label: "Chat History", id: 2 },
      { icon: EarthFilled, label: "Jurisdiction Selection", id: 3 },
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

// In menu.config.ts - Add this for documents
import {
  DocumentAdd,
  DocumentBlank,
  FolderOpen,
  Upload,
} from "@carbon/icons-react";

export const documentsbarSections = [
  {
    title: "Documents",
    items: [
      { icon: DocumentBlank, label: "All Documents", isActive: true, id: 1 },
      { icon: FolderOpen, label: "By Case", id: 2 },
      { icon: Upload, label: "Recent Uploads", id: 3 },
      { icon: DocumentAdd, label: "Add Document", id: 4 },
    ],
  },
];