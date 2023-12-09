import { people01, people02, people03, facebook, instagram, linkedin, twitter, airbnb, binance, coinbase, dropbox, send, shield, star,dataPic,model, configuration  } from "../assets";

export const navLinks = [
  {
    id: "home",
    title: "Home",
    redirect: "/landing",
  },
  {
    id: "marketplace",
    title: "Marketplace",
    redirect: "/uploaddata",
  },
  {
    id: "job",
    title: "Jobs",
    redirect: "/jobs",
  },
];

export const features = [
  {
    id: "feature-1",
    icon: star,
    title: "Choose Data",
    content:
      "Choose the data on which you want to train your model you can choose from our marketplace or upload your own data.",
  },
  {
    id: "feature-2",
    icon: shield,
    title: "Choose Model",
    content:"Choose the model you want to train your data with. You can choose from our marketplace or upload your own model.",
  },
  {
    id: "feature-3",
    icon: dataPic,
    title: "Set Job Configuration",
    content:
      "Set the configuration of your job like the price and computation resource.",
  },
];

export const steps = [
  {
    id: "step-1",
    title : "Choose data",
    content:
      "Choose the data on which you want to train your model you can choose from our marketplace or upload your own data.",
    img: dataPic,
  },
  {
    id: "step-2",
    title:"Choose model",
    content:
      "Choose the model you want to train your data with. You can choose from our marketplace or upload your own model.",

    img: model,
  },
  {
    id: "step-3",
    title:"Set job config",
    content:
      "Set the configuration of your job like the price and computation resource.",
    img: configuration,
  },
];

export const stats = [
  {
    id: "stats-1",
    title: "User Active",
    value: "3800+",
  },
  {
    id: "stats-2",
    title: "Trusted by Company",
    value: "230+",
  },
  {
    id: "stats-3",
    title: "Transaction",
    value: "$230M+",
  },
];

export const footerLinks = [
  {
    title: "Useful Links",
    links: [
      {
        name: "Content",
        link: "https://www.hoobank.com/content/",
      },
      {
        name: "How it Works",
        link: "https://www.hoobank.com/how-it-works/",
      },
      {
        name: "Create",
        link: "https://www.hoobank.com/create/",
      },
      {
        name: "Explore",
        link: "https://www.hoobank.com/explore/",
      },
      {
        name: "Terms & Services",
        link: "https://www.hoobank.com/terms-and-services/",
      },
    ],
  },
  {
    title: "Community",
    links: [
      {
        name: "Help Center",
        link: "https://www.hoobank.com/help-center/",
      },
      {
        name: "Partners",
        link: "https://www.hoobank.com/partners/",
      },
      {
        name: "Suggestions",
        link: "https://www.hoobank.com/suggestions/",
      },
      {
        name: "Blog",
        link: "https://www.hoobank.com/blog/",
      },
      {
        name: "Newsletters",
        link: "https://www.hoobank.com/newsletters/",
      },
    ],
  },
  {
    title: "Partner",
    links: [
      {
        name: "Our Partner",
        link: "https://www.hoobank.com/our-partner/",
      },
      {
        name: "Become a Partner",
        link: "https://www.hoobank.com/become-a-partner/",
      },
    ],
  },
];

export const socialMedia = [
  {
    id: "social-media-1",
    icon: instagram,
    link: "https://www.instagram.com/",
  },
  {
    id: "social-media-2",
    icon: facebook,
    link: "https://www.facebook.com/",
  },
  {
    id: "social-media-3",
    icon: twitter,
    link: "https://www.twitter.com/",
  },
  {
    id: "social-media-4",
    icon: linkedin,
    link: "https://www.linkedin.com/",
  },
];

export const clients = [
  {
    id: "client-1",
    logo: airbnb,
  },
  {
    id: "client-2",
    logo: binance,
  },
  {
    id: "client-3",
    logo: coinbase,
  },
  {
    id: "client-4",
    logo: dropbox,
  },
];