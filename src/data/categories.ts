export interface Category {
  id: string;
  name: string;
  description: string;
  subCategories: string[];
  bannerImage: string;
  featuredIcon: string;
}

export const PRODUCT_CATEGORIES: Category[] = [
  {
    id: 'video-surveillance-cameras',
    name: 'Video Surveillance & Cameras',
    description: 'Enterprise grade box, bullet, dome, PTZ, thermal and multisensor cameras.',
    subCategories: [
      'Box Cameras',
      'Bullet Cameras',
      'Dome Cameras',
      'PTZ Cameras',
      'Panoramic Cameras',
      'Fisheye Cameras',
      'Thermal Cameras',
      'Multisensor Cameras',
      'Network Cameras',
      'Explosion-Proof Cameras',
      'Specialty Cameras',
      'Camera Bundles'
    ],
    bannerImage: 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&w=1200&q=80',
    featuredIcon: 'Camera'
  },
  {
    id: 'video-management-recording',
    name: 'Video Management & Recording',
    description: 'Centralized NVR systems, VMS software licenses, AI analytics, encoders and recording servers.',
    subCategories: [
      'Network Video Recorders (NVR)',
      'Video Management Software (VMS)',
      'Video Analytics',
      'AI Analytics',
      'Video Encoders',
      'Video Decoders',
      'Recording Servers',
      'Video Storage',
      'Video Workstations'
    ],
    bannerImage: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80',
    featuredIcon: 'Server'
  },
  {
    id: 'access-control-door-security',
    name: 'Access Control & Door Security',
    description: 'Commercial biometric readers, door controllers, smart cards, electronic locks and visitor management.',
    subCategories: [
      'Access Control Panels',
      'Door Controllers',
      'Access Control Readers',
      'Card Readers',
      'Biometric Readers',
      'Smart Cards',
      'Key Fobs',
      'Access Credentials',
      'Electronic Locks',
      'Wireless Locks',
      'Door Hardware',
      'Visitor Management',
      'Access Control Software',
      'Access Control Accessories'
    ],
    bannerImage: 'https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=1200&q=80',
    featuredIcon: 'KeyRound'
  },
  {
    id: 'intercom-ip-communication',
    name: 'Intercom & IP Communication',
    description: 'High-clarity video and audio intercoms, door stations, master stations and emergency call boxes.',
    subCategories: [
      'IP Intercoms',
      'Video Intercoms',
      'Audio Intercoms',
      'Door Stations',
      'Indoor Stations',
      'Master Stations',
      'IP Phones',
      'Emergency Communication',
      'Intercom Accessories'
    ],
    bannerImage: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80',
    featuredIcon: 'PhoneCall'
  },
  {
    id: 'networking-connectivity',
    name: 'Networking & Connectivity',
    description: 'Managed and industrial PoE switches, rugged enterprise routers, wireless access points and adapters.',
    subCategories: [
      'Network Switches',
      'Managed Switches',
      'Unmanaged Switches',
      'PoE Switches',
      'Industrial Switches',
      'Routers',
      'Wireless Access Points',
      'Wi-Fi Equipment',
      'Network Adapters',
      'Network Accessories'
    ],
    bannerImage: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=1200&q=80',
    featuredIcon: 'Network'
  },
  {
    id: 'security-sensors-detection',
    name: 'Security Sensors & Detection',
    description: 'Microwave radar, PIR motion detectors, perimeter barrier sensors and environmental monitors.',
    subCategories: [
      'Motion Sensors',
      'Intrusion Sensors',
      'Perimeter Sensors',
      'Radar Sensors',
      'Environmental Sensors',
      'Occupancy Sensors',
      'Audio Detection',
      'Emergency Sensors'
    ],
    bannerImage: 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?auto=format&fit=crop&w=1200&q=80',
    featuredIcon: 'Radio'
  },
  {
    id: 'public-address-paga-system',
    name: 'Public Address (PAGA) System',
    description: 'Network IP horn speakers, ceiling speakers, evacuation amplifiers, microphones and controllers.',
    subCategories: [
      'Network Speakers',
      'IP Speakers',
      'Horn Speakers',
      'Ceiling Speakers',
      'Wall Speakers',
      'Amplifiers',
      'Microphones',
      'Audio Controllers',
      'Public Address Systems',
      'Emergency Audio Systems',
      'Audio Accessories'
    ],
    bannerImage: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=1200&q=80',
    featuredIcon: 'Volume2'
  },
  {
    id: 'security-software-licenses',
    name: 'Security Software & Licenses',
    description: 'Perpetual licenses, cloud subscription seats, AI video analytics licenses and integration modules.',
    subCategories: [
      'Video Management Software',
      'Access Control Software',
      'Analytics Software',
      'AI Software',
      'Cloud Software',
      'Software Licenses',
      'Subscription Licenses',
      'Feature Licenses',
      'Integration Licenses'
    ],
    bannerImage: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80',
    featuredIcon: 'ShieldCheck'
  },
  {
    id: 'storage-data-infrastructure',
    name: 'Storage & Data Infrastructure',
    description: 'Surveillance grade NAS, SAN enterprise storage arrays, 24/7 hard drives and expansion shelves.',
    subCategories: [
      'Network Storage',
      'Video Storage',
      'Storage Servers',
      'Hard Drives',
      'Storage Expansion',
      'Storage Appliances',
      'Storage Accessories'
    ],
    bannerImage: 'https://images.unsplash.com/photo-1597852074816-d933c4d2b988?auto=format&fit=crop&w=1200&q=80',
    featuredIcon: 'HardDrive'
  },
  {
    id: 'power-electrical-systems',
    name: 'Power & Electrical Systems',
    description: 'Online double-conversion UPS, centralized CCTV power supplies, PoE injectors and battery banks.',
    subCategories: [
      'Power Supplies',
      'PoE Power Supplies',
      'Power Adapters',
      'UPS Systems',
      'Batteries',
      'Backup Power',
      'Power Distribution',
      'Power Accessories'
    ],
    bannerImage: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&w=1200&q=80',
    featuredIcon: 'Zap'
  },
  {
    id: 'enclosures-housings',
    name: 'Enclosures & Housings',
    description: 'Explosion-proof camera housings, NEMA 4X outdoor junction enclosures and weather-rated back boxes.',
    subCategories: [
      'Camera Housings',
      'Outdoor Housings',
      'Indoor Housings',
      'Explosion-Proof Housings',
      'Environmental Housings',
      'Protective Enclosures',
      'Junction Enclosures',
      'Back Boxes',
      'Equipment Enclosures',
      'Mounting Enclosures'
    ],
    bannerImage: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80',
    featuredIcon: 'Box'
  },
  {
    id: 'mounting-surveillance-accessories',
    name: 'Mounting & Surveillance Accessories',
    description: 'Wall, pendant, pole and corner brackets, heavy duty sun shields, industrial cables and connectors.',
    subCategories: [
      'Camera Mounts',
      'Wall Mounts',
      'Ceiling Mounts',
      'Pole Mounts',
      'Pendant Mounts',
      'Corner Mounts',
      'Mounting Brackets',
      'Sun Shields',
      'Junction Boxes',
      'Back Boxes',
      'Cables & Connectors',
      'Installation Accessories'
    ],
    bannerImage: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=1200&q=80',
    featuredIcon: 'Wrench'
  },
  {
    id: 'lighting-visual-deterrence',
    name: 'Lighting & Visual Deterrence',
    description: 'Long-range 850nm/940nm IR illuminators, white light strobe deterrents, camera-mounted spotlights.',
    subCategories: [
      'IR Illuminators',
      'White Light Illuminators',
      'Security Lighting',
      'Camera Lighting',
      'LED Lighting',
      'Lighting Accessories'
    ],
    bannerImage: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1200&q=80',
    featuredIcon: 'Lightbulb'
  },
  {
    id: 'telecommunication-communication-equipment',
    name: 'Telecommunication & Communication Equipment',
    description: 'Microwave point-to-point radios, UHF/VHF base stations, wireless backhaul and satellite links.',
    subCategories: [
      'Microwave Radio',
      'Micro Radio',
      'UHF Equipment',
      'VHF Equipment',
      'Wireless Communication',
      'Backhaul Equipment',
      'Satellite Communication',
      'Telecom Supervisory Systems',
      'Radio Accessories',
      'Communication Accessories'
    ],
    bannerImage: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=1200&q=80',
    featuredIcon: 'Satellite'
  },
  {
    id: 'accessories-replacement-parts',
    name: 'Accessories & Replacement Parts',
    description: 'OEM spare boards, optical lenses, replacement power modules, terminal blocks and upgrade kits.',
    subCategories: [
      'Camera Accessories',
      'Access Control Accessories',
      'Intercom Accessories',
      'Network Accessories',
      'Audio Accessories',
      'Power Accessories',
      'Mounting Accessories',
      'Replacement Parts',
      'Spare Parts',
      'Upgrade Kits'
    ],
    bannerImage: 'https://images.unsplash.com/photo-1581092162384-8987c1d64718?auto=format&fit=crop&w=1200&q=80',
    featuredIcon: 'Settings'
  },
  {
    id: 'renewable-energy',
    name: 'Renewable Energy',
    description: 'Smart hybrid inverters, tier-1 lithium LiFePO4 rack batteries and high-efficiency solar arrays.',
    subCategories: [
      'Smart Hybrid Inverters',
      'Lithium LiFePO4 Batteries',
      'Industrial Solar Panels'
    ],
    bannerImage: 'https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=1200&q=80',
    featuredIcon: 'Sun'
  }
];
