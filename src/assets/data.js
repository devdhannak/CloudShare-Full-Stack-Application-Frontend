import {
  CloudUpload,
  ShieldCheck,
  Share2,
  Folder,
  Clock,
  Smartphone,
  Wallet,
  Zap,
  Crown,
  Quote,
} from "lucide-react";
import { LayoutDashboard, Upload, CreditCard, Receipt } from "lucide-react";

export const SIDE_MENU_DATA = [
  {
    id: "01",
    label: "Dashboard",
    icon: LayoutDashboard,
    path: "/dashboard",
  },
  {
    id: "02",
    label: "Upload",
    icon: Upload,
    path: "/upload",
  },
  {
    id: "03",
    label: "My Files",
    icon: Folder,
    path: "/my-files",
  },
  {
    id: "04",
    label: "Subscription",
    icon: CreditCard,
    path: "/subscription",
  },
  {
    id: "05",
    label: "Transactions",
    icon: Receipt,
    path: "/transactions",
  },
];

export const features = [
  {
    id: 1,
    title: "Secure File Upload",
    description:
      "Upload files safely with encrypted cloud storage and advanced protection.",
    icon: CloudUpload,
    color: "text-purple-500",
  },
  {
    id: 2,
    title: "End-to-End Security",
    description:
      "Your files are protected with strong encryption and secure access control.",
    icon: ShieldCheck,
    color: "text-green-500",
  },
  {
    id: 3,
    title: "Easy File Sharing",
    description:
      "Generate shareable links instantly and send files to anyone easily.",
    icon: Share2,
    color: "text-blue-500",
  },
  {
    id: 4,
    title: "Smart File Management",
    description:
      "Organize your files with folders, tags, and quick search functionality.",
    icon: Folder,
    color: "text-yellow-500",
  },
  {
    id: 5,
    title: "Access Anytime",
    description:
      "Access your files from anywhere at any time using secure cloud access.",
    icon: Clock,
    color: "text-red-500",
  },
  {
    id: 6,
    title: "Mobile Friendly",
    description:
      "Upload and share files seamlessly across desktop, tablet, and mobile.",
    icon: Smartphone,
    color: "text-indigo-500",
  },
];

export const pricingPlans = [
  {
    id: 1,
    name: "Starter",
    price: "Free",
    billing: "Forever",
    description: "Perfect for individuals getting started with cloud storage.",
    icon: Wallet,
    color: "text-gray-600",
    highlighted: false,
    cta: "Get Started",
    features: [
      "5 GB Cloud Storage",
      "Basic File Sharing",
      "Secure Uploads",
      "Access from Any Device",
      "Community Support",
    ],
  },
  {
    id: 2,
    name: "Pro",
    price: "$9",
    billing: "per month",
    description: "Best for professionals who need more storage and sharing.",
    icon: Zap,
    color: "text-purple-500",
    highlighted: true,
    cta: "Go Premium",
    features: [
      "100 GB Cloud Storage",
      "Advanced File Sharing",
      "Password Protected Links",
      "Priority Upload Speed",
      "Email Support",
    ],
  },
  {
    id: 3,
    name: "Enterprise",
    price: "$29",
    billing: "per month",
    description: "Ideal for teams and businesses with large storage needs.",
    icon: Crown,
    color: "text-yellow-500",
    highlighted: false,
    cta: "Go Ultimate",
    features: [
      "1 TB Cloud Storage",
      "Team Collaboration",
      "Advanced Security Controls",
      "Unlimited File Sharing",
      "Priority Customer Support",
    ],
  },
];

export const testimonials = [
  {
    id: 1,
    name: "Rahul Sharma",
    role: "Product Manager",
    company: "TechNova",
    message:
      "CloudShare made file sharing extremely simple for our team. The security and speed are excellent.",
    avatar: "/avatars/user1.jpg",
    rating: 5,
    icon: Quote,
  },
  {
    id: 2,
    name: "Emily Carter",
    role: "UI/UX Designer",
    company: "DesignFlow",
    message:
      "I love how easy it is to upload and share large design files with clients. CloudShare saves me so much time.",
    avatar: "/avatars/user2.jpg",
    rating: 5,
    icon: Quote,
  },
  {
    id: 3,
    name: "Arjun Mehta",
    role: "Software Engineer",
    company: "DevStack",
    message:
      "The interface is clean and the performance is impressive. It's now our go-to tool for sharing project files.",
    avatar: "/avatars/user3.jpg",
    rating: 4,
    icon: Quote,
  },
  {
    id: 4,
    name: "Sophia Williams",
    role: "Marketing Lead",
    company: "GrowthHub",
    message:
      "Sharing campaign assets with our distributed team has never been easier. CloudShare works flawlessly.",
    avatar: "/avatars/user4.jpg",
    rating: 5,
    icon: Quote,
  },
];
