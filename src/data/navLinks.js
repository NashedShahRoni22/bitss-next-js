export const staticNavLinks = [
  {
    name: "Home",
    path: "/",
  },
  {
    name: "Products",
    children: [
      {
        name: "Online Products",
        link: "/products",
      },
      {
        name: "BITSS Retail Packs",
        link: "/bitss-retail-packs",
      },
    ],
  },
  {
    name: "Hosting",
    children: [
      {
        icon: "https://img.icons8.com/ios/50/domain.png",
        name: "Web Hosting",
        link: "https://bfinit.com/web-hosting",
        description: "Reliable and affordable web hosting solutions.",
      },
      {
        icon: "https://img.icons8.com/ios/50/database--v1.png",
        name: "VPS Hosting",
        link: "https://bfinit.com/vps-hosting",
        description: "Scalable and secure virtual private servers.",
      },
      {
        icon: "https://img.icons8.com/badges/50/server.png",
        name: "Dedicated Server",
        link: "https://bfinit.com/dedicated-server",
        description: "High-performance servers for demanding applications.",
      },
      {
        icon: "https://img.icons8.com/windows/50/maintenance.png",
        name: "Custom VPS",
        link: "https://bfinit.com/build-your-own-vps",
        description: "Customize resources for your exact needs.",
      },
    ],
  },
  {
    name: "About us",
    path: "/about",
  },
  {
    name: "Contact Us",
    path: "/contact",
  },
];
