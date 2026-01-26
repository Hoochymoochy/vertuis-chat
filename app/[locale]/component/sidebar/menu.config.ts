import {
    Home,
    Dashboard,
    Task,
  } from "@carbon/icons-react";
  
  export const menuSections = [
    {
      title: "Main",
      items: [
        { icon: Home, label: "Home", isActive: true, id: 1 },
        { icon: Dashboard, label: "Research", id: 2 },
        { icon: Task, label: "Document Management", id: 3 },
      ],
    },
  ];
  
  export default menuSections  