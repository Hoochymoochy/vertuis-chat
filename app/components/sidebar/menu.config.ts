import {
  IbmWatsonAssistant,
  Task,
  Settings,
  EarthFilled,
  UserSettings,
  Notification,
  Security,
  ColorPalette,
  DocumentAdd,
  DocumentBlank,
  FolderOpen,
  Upload,
  Portfolio,
  Search,
  Document,
  Chat,
  Time,
} from "@carbon/icons-react";

export const sidebarSections = [
  {
    title: "Main",
    items: [
      { icon: IbmWatsonAssistant, label: "Chat", id: 2, sectionType: "documents", route: "/chat" },
      { icon: Task, label: "Case", id: 3, sectionType: "case", route: "/case" },
    ],
  },
  {
    title: "Settings",
    items: [
      { icon: Settings, label: "Settings", id: 4, sectionType: "settings", route: "/settings" },
    ],
  },
];

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