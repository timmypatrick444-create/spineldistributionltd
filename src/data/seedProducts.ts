import { Product } from '../types.ts';

export const SEED_PRODUCTS: Product[] = [
  // 1. Video Surveillance & Cameras
  {
    id: 'prod-cam-01',
    name: 'AXIS Q1656-LE 4MP Ultra-Low Light Box Camera with Lightfinder 2.0 & Forensic WDR',
    sku: 'AXIS-Q1656-LE',
    category: 'Video Surveillance & Cameras',
    subCategory: 'Box Cameras',
    priceUSD: 1489.00,
    originalPriceUSD: 1699.00,
    rating: 4.9,
    reviewsCount: 142,
    inStock: true,
    stockQuantity: 45,
    brand: 'Axis Communications',
    badge: 'Spinel\'s Choice',
    isPrimeEligible: true,
    freeDelivery: true,
    warrantyYears: 5,
    description: 'The AXIS Q1656-LE is an exceptional box camera designed for mission-critical surveillance in challenging lighting conditions. Features 4MP resolution at 60 fps, deep learning processing unit (DLPU) for granular object classification, and built-in IR illumination up to 80 meters.',
    features: [
      'Exceptional images with 1/1.8" sensor and Lightfinder 2.0',
      'Forensic WDR up to 120 dB',
      'Built-in cybersecurity with Axis Edge Vault & TPM 2.0',
      'OptimizedIR illumination up to 80 m (262 ft)',
      'IP66, IP67, NEMA 4X, and IK10 vandal-resistant rating'
    ],
    specifications: {
      'Sensor': '1/1.8" Progressive Scan RGB CMOS',
      'Resolution': '2688 x 1520 (4 Megapixel)',
      'Frame Rate': 'Up to 60 fps in all resolutions',
      'Lens Mount': 'CS-mount, P-Iris lens included 3.9-10mm',
      'Power': 'PoE IEEE 802.3af/802.3at Type 1 Class 3'
    },
    imageUrl: 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&w=800&q=80',
    createdAt: '2026-01-15T08:00:00.000Z'
  },
  {
    id: 'prod-cam-02',
    name: 'Hikvision DarkFighter 4K UHD Motorized Varifocal Bullet Camera with AcuSense 2.0',
    sku: 'HIK-DS-2CD2T86G2-4I',
    category: 'Video Surveillance & Cameras',
    subCategory: 'Bullet Cameras',
    priceUSD: 469.00,
    originalPriceUSD: 549.00,
    rating: 4.8,
    reviewsCount: 318,
    inStock: true,
    stockQuantity: 120,
    brand: 'Hikvision',
    badge: 'Best Seller',
    isPrimeEligible: true,
    freeDelivery: true,
    warrantyYears: 3,
    description: 'Industrial 4K DarkFighter bullet camera delivering 3840 x 2160 video at 30 fps with ultra-low lux performance. Equipped with false-alarm reduction based on human and vehicle target classification via deep learning.',
    features: [
      'High quality imaging with 8 MP (4K) resolution',
      'DarkFighter technology for supreme low-light performance',
      'Focus on human and vehicle targets based on deep learning',
      'Clear imaging against strong back light with 120 dB true WDR',
      'Water and dust resistant (IP67) and vandal-resistant housing'
    ],
    specifications: {
      'Sensor': '1/1.8" Progressive Scan CMOS',
      'Resolution': '3840 x 2160 at 30 fps',
      'Focal Length': '2.8 mm to 12 mm Motorized Zoom',
      'IR Distance': 'Up to 80 meters Smart IR',
      'Enclosure': 'IP67 Weatherproof metal chassis'
    },
    imageUrl: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=800&q=80',
    createdAt: '2026-01-18T10:00:00.000Z'
  },
  {
    id: 'prod-cam-03',
    name: 'Hanwha Techwin Wisenet X 4K Vandal-Resistant Outdoor Dome Camera with AI Analytics',
    sku: 'HWH-XNV-9082R',
    category: 'Video Surveillance & Cameras',
    subCategory: 'Dome Cameras',
    priceUSD: 890.00,
    rating: 4.7,
    reviewsCount: 89,
    inStock: true,
    stockQuantity: 64,
    brand: 'Hanwha Vision',
    badge: 'Enterprise Certified',
    isPrimeEligible: true,
    freeDelivery: true,
    warrantyYears: 5,
    description: 'Professional AI-based 4K outdoor vandal dome camera. Eliminates false alarms caused by moving trees, shadows, or animals, categorizing humans, faces, vehicles and license plates with high accuracy.',
    features: [
      '4K resolution at 30 fps with extreme WDR (120dB)',
      'AI-based object classification (Person, Face, Vehicle, License Plate)',
      'BestShot support for maximum bandwidth and storage optimization',
      'WiseIR with 40m viewable length',
      'Hard coated dome bubble, IP67, IP66, NEMA 4X, IK10+'
    ],
    specifications: {
      'Lens': '2.8 ~ 8.4mm (3x) motorized varifocal',
      'Field of View': 'H: 114° ~ 40.2° / V: 62.0° ~ 22.5°',
      'Audio': 'Two-way audio support with line in/out',
      'Card Slot': 'Dual Micro SD/SDHC/SDXC up to 512GB'
    },
    imageUrl: 'https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=800&q=80',
    createdAt: '2026-01-20T12:00:00.000Z'
  },
  {
    id: 'prod-cam-04',
    name: 'Bosch AUTODOME inteox 7000i 2MP 40x Optical Zoom Laser Starlight PTZ Camera',
    sku: 'BOSCH-NDP-7512-Z40L',
    category: 'Video Surveillance & Cameras',
    subCategory: 'PTZ Cameras',
    priceUSD: 4250.00,
    originalPriceUSD: 4799.00,
    rating: 5.0,
    reviewsCount: 34,
    inStock: true,
    stockQuantity: 18,
    brand: 'Bosch Security',
    badge: 'Enterprise Certified',
    isPrimeEligible: true,
    freeDelivery: true,
    warrantyYears: 5,
    description: 'The AUTODOME inteox 7000i combines open camera OS platform with 40x optical zoom and Starlight low-light sensitivity. Built-in video analytics enable tracking of fast-moving targets across perimeters.',
    features: [
      '40x optical zoom with optical image stabilization (OIS)',
      'Starlight camera technology with excellent low-light sensitivity (0.0077 lux)',
      'Laser illumination technology up to 450 m (1476 ft)',
      'Intelligent Video Analytics triggered automated tracking',
      'Rugged outdoor housing IK10 and IP68'
    ],
    specifications: {
      'Zoom': '40x Optical, 12x Digital',
      'Speed': 'Pan: 400°/s, Tilt: 300°/s',
      'Pan Range': '360° continuous rotation',
      'Operating Temp': '-40°C to +55°C (-40°F to +131°F)'
    },
    imageUrl: 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&w=800&q=80',
    createdAt: '2026-01-22T14:00:00.000Z'
  },
  {
    id: 'prod-cam-05',
    name: 'FLIR Saros DH-390 Dome Thermal & Optical Perimeter Security Multisensor Camera',
    sku: 'FLIR-SAROS-DH390',
    category: 'Video Surveillance & Cameras',
    subCategory: 'Thermal Cameras',
    priceUSD: 3650.00,
    rating: 4.8,
    reviewsCount: 22,
    inStock: true,
    stockQuantity: 12,
    brand: 'Teledyne FLIR',
    badge: 'Enterprise Certified',
    freeDelivery: true,
    warrantyYears: 3,
    description: 'Dual-sensor thermal and 4K visual camera with onboard analytics and two-way audio talkdown. Engineered for high-risk critical infrastructure and perimeter intrusion protection in zero visibility.',
    features: [
      'High resolution thermal uncooled VOx microbolometer',
      'Integrated 4K optical sensor with wide dynamic range',
      'On-board FLIR thermal analytics with target classification',
      'White light LED strobe and two-way audio for active deterrence',
      'Cybersecurity hardened for enterprise SCADA & banking systems'
    ],
    specifications: {
      'Thermal Resolution': '320 x 256 VOx sensor',
      'Visible Resolution': '3840 x 2160 4K sensor',
      'Spectral Range': '7.5 to 13.5 µm',
      'Weather Resistance': 'IP66 with internal defroster'
    },
    imageUrl: 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&w=800&q=80',
    createdAt: '2026-01-25T15:00:00.000Z'
  },

  // 2. Video Management & Recording
  {
    id: 'prod-vm-01',
    name: 'Supermicro 64-Channel 4U Enterprise RAID Recording Server with 128TB Storage',
    sku: 'SM-REC-4U-64CH',
    category: 'Video Management & Recording',
    subCategory: 'Recording Servers',
    priceUSD: 5890.00,
    rating: 4.9,
    reviewsCount: 56,
    inStock: true,
    stockQuantity: 15,
    brand: 'Supermicro / Milestone',
    badge: 'Enterprise Certified',
    freeDelivery: true,
    warrantyYears: 5,
    description: 'High-throughput 4U rackmount video recording server pre-configured with dual Intel Xeon Silver processors, 64GB DDR4 ECC RAM, hardware RAID controller and 16 hot-swap bays loaded with 128TB enterprise storage.',
    features: [
      'Dual Intel Xeon Silver 4314 (32 cores total)',
      '128TB Raw enterprise SAS storage (16x 8TB Seagate Exos)',
      'MegaRAID 12Gb/s Hardware RAID 0, 1, 5, 6, 10, 50, 60 with 4GB Cache',
      'Dual redundant 1200W Platinum Level power supplies',
      'Pre-loaded Milestone XProtect Corporate / Genetec certified hardware'
    ],
    specifications: {
      'Form Factor': '4U Rackmount with sliding rails',
      'Network': '4x 10GbE SFP+ plus 2x 1GbE RJ45 ports',
      'Throughput': 'Up to 1200 Mbps continuous video write',
      'Management': 'IPMI 2.0 with dedicated LAN and KVM over IP'
    },
    imageUrl: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=80',
    createdAt: '2026-01-28T09:00:00.000Z'
  },
  {
    id: 'prod-vm-02',
    name: 'Milestone XProtect Corporate Base License & 1-Year Care Plus Support',
    sku: 'MLS-XP-CORP-BASE',
    category: 'Video Management & Recording',
    subCategory: 'Video Management Software (VMS)',
    priceUSD: 2450.00,
    rating: 4.9,
    reviewsCount: 78,
    inStock: true,
    stockQuantity: 500,
    brand: 'Milestone Systems',
    badge: 'Best Seller',
    freeDelivery: true,
    warrantyYears: 1,
    description: 'Top-tier enterprise open platform VMS designed for large-scale, high-security multi-site deployments with central management, federated architecture and failover recording servers.',
    features: [
      'Unlimited number of connected cameras and servers',
      'Milestone Interconnect & Federated Architecture support',
      'Centralized Smart Wall multi-monitor command center module',
      'Edge storage with flexible automated retrieval and failover sync',
      'Strict FIPS 140-2 compliance and end-to-end video encryption'
    ],
    specifications: {
      'License Type': 'Perpetual Base License with 1-Yr Care Plus',
      'Max Cameras': 'Unlimited (per-device licenses added as needed)',
      'Architecture': 'Distributed multi-tier client/server',
      'Client Support': 'Smart Client, Web Client, Mobile App iOS/Android'
    },
    imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80',
    createdAt: '2026-01-30T11:00:00.000Z'
  },

  // 3. Access Control & Door Security
  {
    id: 'prod-ac-01',
    name: 'HID Aero X1100 Intelligent Controller for 4 Reader Interfaces & 2 Doors',
    sku: 'HID-AERO-X1100',
    category: 'Access Control & Door Security',
    subCategory: 'Door Controllers',
    priceUSD: 980.00,
    originalPriceUSD: 1120.00,
    rating: 4.8,
    reviewsCount: 112,
    inStock: true,
    stockQuantity: 80,
    brand: 'HID Global',
    badge: 'Spinel\'s Choice',
    isPrimeEligible: true,
    freeDelivery: true,
    warrantyYears: 3,
    description: 'The HID Aero X1100 provides onboard IO and reader connectivity for up to 2 doors (4 readers). Features hardware cryptographic co-processor, OSDP Secure Channel protocol, and native BACnet IP integration.',
    features: [
      'Onboard 2-door controller with expandable sub-panel capability',
      'Hardware root-of-trust crypto chip for TLS 1.3 encrypted data',
      'OSDP v2.2 with Secure Channel for reader-to-controller encryption',
      'BACnet MS/TP and IP support for direct BMS automation integration',
      'Capacity for up to 250,000 cardholders and 50,000 offline event logs'
    ],
    specifications: {
      'Inputs': '7 General purpose supervised inputs',
      'Outputs': '4 Form-C 5A relays',
      'Power': 'PoE+ (IEEE 802.3at) or 12-24 VDC external',
      'Operating Temp': '0°C to 70°C'
    },
    imageUrl: 'https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=800&q=80',
    createdAt: '2026-02-01T10:00:00.000Z'
  },
  {
    id: 'prod-ac-02',
    name: 'Suprema BioStation 3 Contactless Face Recognition & Mobile Access Terminal',
    sku: 'SUP-BS3-DB',
    category: 'Access Control & Door Security',
    subCategory: 'Biometric Readers',
    priceUSD: 1250.00,
    rating: 4.9,
    reviewsCount: 65,
    inStock: true,
    stockQuantity: 40,
    brand: 'Suprema',
    badge: 'Enterprise Certified',
    isPrimeEligible: true,
    freeDelivery: true,
    warrantyYears: 2,
    description: 'Next-generation AI face recognition terminal packed in a slim, modern form factor. Offers contactless face authentication, mobile credentials (NFC/BLE), RFID cards, QR codes and two-way VoIP intercom.',
    features: [
      'Advanced NPU AI engine for under 0.2-second facial match',
      'Fake face detection preventing spoofing with photos or 3D masks',
      'Supports RFID, NFC, BLE, Dynamic QR code and Face credentials',
      'Built-in SIP VoIP two-way video communication station',
      'IP65 and IK06 certified for indoor and outdoor installations'
    ],
    specifications: {
      'Display': '5.0" IPS Color Touchscreen LCD',
      'Capacity': '100,000 users / 5,000,000 text logs',
      'Camera': 'Dual visual and infrared cameras',
      'Dimensions': '82 mm x 171 mm x 24.7 mm'
    },
    imageUrl: 'https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=800&q=80',
    createdAt: '2026-02-03T12:00:00.000Z'
  },

  // 4. Intercom & IP Communication
  {
    id: 'prod-int-01',
    name: '2N IP Verso 2.0 Modular Video Intercom Station with Full HD Camera & Touch Keypad',
    sku: '2N-IP-VERSO-2',
    category: 'Intercom & IP Communication',
    subCategory: 'Video Intercoms',
    priceUSD: 1690.00,
    rating: 4.9,
    reviewsCount: 94,
    inStock: true,
    stockQuantity: 35,
    brand: '2N / Axis',
    badge: 'Best Seller',
    isPrimeEligible: true,
    freeDelivery: true,
    warrantyYears: 3,
    description: 'The benchmark modular IP intercom station with Full HD wide-angle camera, adaptive WDR, infrared night illumination and capacitive touchscreen module. Directly integrates with VMS, PBX, and mobile apps.',
    features: [
      'Full HD wide-angle camera with 138° viewing angle and WDR',
      'Modular configuration: Combine keypad, RFID, BLE or fingerprint',
      'Direct SIP 2.0 protocol support for VoIP phone networks',
      'Anodized aluminum alloy housing rated IP54 and IK08',
      'Bi-directional audio with acoustic echo cancellation (AEC)'
    ],
    specifications: {
      'Camera': 'Full HD 1080p, 30 fps, Night IR',
      'Audio': '2W loudspeaker with dual noise-cancelling mics',
      'Power': 'PoE 802.3af Class 0 or 12V DC',
      'Protocols': 'SIP 2.0, ONVIF Profile S/T, RTSP, HTTP/HTTPS'
    },
    imageUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80',
    createdAt: '2026-02-05T14:00:00.000Z'
  },

  // 5. Networking & Connectivity
  {
    id: 'prod-net-01',
    name: 'Cisco Catalyst 9300 48-Port PoE+ Gigabit Managed Switch with 740W Power Budget',
    sku: 'CISCO-C9300-48P-A',
    category: 'Networking & Connectivity',
    subCategory: 'PoE Switches',
    priceUSD: 3890.00,
    originalPriceUSD: 4450.00,
    rating: 4.9,
    reviewsCount: 154,
    inStock: true,
    stockQuantity: 28,
    brand: 'Cisco Systems',
    badge: 'Enterprise Certified',
    freeDelivery: true,
    warrantyYears: 5,
    description: 'Enterprise core and access layer switch delivering 48 10/100/1000 PoE+ ports with 740W power budget, StackWise-480 high-speed stacking architecture, and Cisco DNA Premier security stack.',
    features: [
      '48x 10/100/1000 Gigabit Ethernet PoE+ ports (up to 30W/port)',
      'StackWise-480 technology delivers 480 Gbps stacking bandwidth',
      'Dual redundant hot-swappable power supplies and modular fans',
      'Hardware-based Encrypted Traffic Analytics (ETA) and MACsec-256',
      'Layer 3 dynamic routing: OSPF, BGP, EIGRP, VRF and PIM'
    ],
    specifications: {
      'Switching Capacity': '256 Gbps (with uplinks)',
      'PoE Budget': '740W default, expandable to 1440W',
      'Forwarding Rate': '190.48 Mpps',
      'Rack Units': '1U Standard 19-inch EIA rackmount'
    },
    imageUrl: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=800&q=80',
    createdAt: '2026-02-08T08:00:00.000Z'
  },
  {
    id: 'prod-net-02',
    name: 'Ubiquiti UniFi Enterprise 8-Port 2.5GbE PoE+ Switch with 10G SFP+ Uplinks',
    sku: 'UBQ-USW-ENT-8-POE',
    category: 'Networking & Connectivity',
    subCategory: 'Managed Switches',
    priceUSD: 479.00,
    rating: 4.8,
    reviewsCount: 280,
    inStock: true,
    stockQuantity: 95,
    brand: 'Ubiquiti',
    badge: 'Spinel\'s Choice',
    isPrimeEligible: true,
    freeDelivery: true,
    warrantyYears: 2,
    description: 'Layer 3 managed switch with eight 2.5G RJ45 ports delivering 802.3at PoE+ and two 10G SFP+ ports for high-bandwidth fiber interconnects. Managed seamlessly via UniFi Network Controller.',
    features: [
      '8x 2.5 Gbps 802.3at PoE+ Ethernet ports',
      '2x 10 Gbps SFP+ optical transceiver ports',
      '120W total PoE power budget',
      '1.3" LCM color touchscreen display with AR switch management',
      'Near-silent cooling suitable for desktop or wall mount'
    ],
    specifications: {
      'Throughput': '40 Gbps non-blocking',
      'PoE Standards': 'PoE+ (802.3at/af)',
      'Dimensions': '200 x 248 x 44 mm',
      'Power Supply': 'Internal 150W AC/DC'
    },
    imageUrl: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=800&q=80',
    createdAt: '2026-02-10T09:00:00.000Z'
  },

  // 6. Security Sensors & Detection
  {
    id: 'prod-sen-01',
    name: 'OPTEX Redscan Pro RLS-50100V 360-Degree LiDAR Perimeter Laser Detector 100m',
    sku: 'OPTEX-RLS-50100V',
    category: 'Security Sensors & Detection',
    subCategory: 'Perimeter Sensors',
    priceUSD: 3200.00,
    rating: 5.0,
    reviewsCount: 19,
    inStock: true,
    stockQuantity: 14,
    brand: 'OPTEX',
    badge: 'Enterprise Certified',
    freeDelivery: true,
    warrantyYears: 3,
    description: 'High-precision laser detector providing 50x100 meter detection area. Utilizes time-of-flight LiDAR technology to pinpoint target X/Y coordinates, speed and size with zero false alarms from weather or foliage.',
    features: [
      '50 x 100 m (165 x 330 ft) horizontal or vertical detection area',
      'Integrated high-resolution assistance camera for rapid alignment',
      'Independent customizable detection zones with selective relay outputs',
      'Direct ONVIF Profile S and Milestone / Genetec integration',
      'Operates in extreme fog, rain, snow and direct sunlight (IP66)'
    ],
    specifications: {
      'Detection Method': 'Infrared laser scan (Time-of-flight)',
      'Laser Class': 'Class 1 eye-safe (IEC/EN60825-1)',
      'Power': 'PoE+ (IEEE 802.3at) or 19.2 - 28.8 VDC',
      'Output': '8 programmable dry contact outputs & IP events'
    },
    imageUrl: 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?auto=format&fit=crop&w=800&q=80',
    createdAt: '2026-02-12T11:00:00.000Z'
  },

  // 7. Public Address (PAGA) System
  {
    id: 'prod-pa-01',
    name: 'Bogen Platinum Series 250W Public Address Mixer Amplifier with 70V/100V Line Output',
    sku: 'BOG-PA-250W',
    category: 'Public Address (PAGA) System',
    subCategory: 'Amplifiers',
    priceUSD: 850.00,
    rating: 4.7,
    reviewsCount: 42,
    inStock: true,
    stockQuantity: 25,
    brand: 'Bogen Communications',
    badge: 'Spinel\'s Choice',
    isPrimeEligible: true,
    freeDelivery: true,
    warrantyYears: 3,
    description: 'Commercial 250W mixer amplifier engineered for continuous 24/7 background music, voice paging, and emergency notification over 25V, 70V, 100V speaker lines or 4/8-ohm systems.',
    features: [
      '250W RMS continuous power into 70V/100V/8Ω speaker loads',
      '6 versatile inputs with dedicated priority telephone/microphone paging',
      'Automated voice-activated muting on emergency broadcasts',
      'Bass, treble, and 5-band master graphic equalization',
      'Thermal, short-circuit, and DC overload electronic protection'
    ],
    specifications: {
      'Frequency Response': '20 Hz to 20 kHz ±1 dB',
      'Distortion': 'Less than 0.5% THD at rated power',
      'Dimensions': '19" rack mountable (2U)',
      'Input Voltage': '120V / 240V AC 50/60Hz switchable'
    },
    imageUrl: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=800&q=80',
    createdAt: '2026-02-14T13:00:00.000Z'
  },

  // 8. Security Software & Licenses
  {
    id: 'prod-sw-01',
    name: 'BriefCam Video Analytics Syndicate License for Automated Person & Vehicle Review',
    sku: 'BRF-SYN-LIC-16',
    category: 'Security Software & Licenses',
    subCategory: 'AI Software',
    priceUSD: 6400.00,
    rating: 5.0,
    reviewsCount: 16,
    inStock: true,
    stockQuantity: 100,
    brand: 'BriefCam / Canon',
    badge: 'Enterprise Certified',
    freeDelivery: true,
    warrantyYears: 1,
    description: 'Syndicate video synopsis AI software license pack. Compresses hours of video surveillance into minutes while classifying clothing colors, vehicle models, speed, cross-directional paths and demographic attributes.',
    features: [
      'Rapid video review: Watch 24 hours of video footage in 5 minutes',
      'Granular filtering: Color, direction, speed, dwell time, object size',
      'Real-time rule alerting with immediate push triggers to command center',
      'Quantitative visual heatmaps for retail traffic and footfall metrics',
      'Seamless multi-server plug-in for Milestone, Genetec, and Avigilon'
    ],
    specifications: {
      'Channels': '16 Camera Concurrent Processing License',
      'Hardware Requirements': 'NVIDIA RTX GPU with CUDA 12+ required',
      'OS Support': 'Windows Server 2022 / 2025, Ubuntu 22.04 LTS',
      'Delivery': 'Electronic Software Delivery (ESD) with License Key'
    },
    imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80',
    createdAt: '2026-02-16T15:00:00.000Z'
  },

  // 9. Storage & Data Infrastructure
  {
    id: 'prod-sto-01',
    name: 'Seagate Exos X20 20TB Enterprise 7200 RPM 3.5" SATA 6Gb/s 256MB Cache Hard Drive',
    sku: 'ST-EXOS-20TB',
    category: 'Storage & Data Infrastructure',
    subCategory: 'Hard Drives',
    priceUSD: 369.00,
    originalPriceUSD: 429.00,
    rating: 4.8,
    reviewsCount: 610,
    inStock: true,
    stockQuantity: 240,
    brand: 'Seagate',
    badge: 'Best Seller',
    isPrimeEligible: true,
    freeDelivery: true,
    warrantyYears: 5,
    description: 'Top-tier enterprise data center hard drive tailored for 24x7 surveillance video streaming and multi-drive storage arrays. Delivers 2.5M-hour MTBF and PowerChoice idle energy savings.',
    features: [
      'Massive 20TB capacity on Helium sealed-drive design',
      'Sustained transfer rates up to 285 MB/s',
      'Engineered for 550TB/year intensive enterprise workloads',
      'Digital environmental sensors to detect internal humidity and temperature',
      'Seagate Secure hardware encryption (SED) for data protection'
    ],
    specifications: {
      'Interface': 'SATA 6 Gb/s',
      'Rotational Speed': '7200 RPM',
      'Buffer Cache': '256 MB Multisegmented DRAM',
      'MTBF': '2,500,000 Hours'
    },
    imageUrl: 'https://images.unsplash.com/photo-1597852074816-d933c4d2b988?auto=format&fit=crop&w=800&q=80',
    createdAt: '2026-02-18T10:00:00.000Z'
  },

  // 10. Power & Electrical Systems
  {
    id: 'prod-pwr-01',
    name: 'APC Smart-UPS On-Line 3000VA 3kVA 230V Double-Conversion Online Rack/Tower UPS',
    sku: 'APC-SRT3000XLI',
    category: 'Power & Electrical Systems',
    subCategory: 'UPS Systems',
    priceUSD: 2190.00,
    rating: 4.9,
    reviewsCount: 135,
    inStock: true,
    stockQuantity: 32,
    brand: 'Schneider Electric / APC',
    badge: 'Enterprise Certified',
    freeDelivery: true,
    warrantyYears: 3,
    description: 'Zero transfer time true double-conversion online UPS protecting mission-critical servers, NVRs, and telecom gear against power surges, brownouts, frequency variations and total blackouts.',
    features: [
      '3000VA / 2700 Watts continuous pure sine wave clean power',
      'True online double-conversion topology with zero transfer delay',
      'SmartSlot interface for network management card (NMC3) remote monitoring',
      'Scalable runtime with plug-and-play external battery packs (XLBP)',
      'Convertible 3U rackmount or standalone vertical tower orientation'
    ],
    specifications: {
      'Input Voltage': '230V Nominal (100V - 275V wide range)',
      'Output Connections': '(6) IEC 320 C13 & (2) IEC 320 C19 sockets',
      'Recharge Time': 'Typically 3 hours to 90%',
      'Weight': '31.3 kg'
    },
    imageUrl: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&w=800&q=80',
    createdAt: '2026-02-20T12:00:00.000Z'
  },

  // 11. Enclosures & Housings
  {
    id: 'prod-enc-01',
    name: 'Videotec MAXIMUS MPXHD Stainless Steel Explosion-Proof PTZ Camera Enclosure',
    sku: 'VDT-MPXHD-SS',
    category: 'Enclosures & Housings',
    subCategory: 'Explosion-Proof Housings',
    priceUSD: 7200.00,
    rating: 5.0,
    reviewsCount: 8,
    inStock: true,
    stockQuantity: 10,
    brand: 'Videotec',
    badge: 'Enterprise Certified',
    freeDelivery: true,
    warrantyYears: 5,
    description: 'AISI 316L electropolished stainless steel explosion-proof PTZ camera housing certified for ATEX, IECEx, and UL hazardous zones 1 and 2 (Gas), 21 and 22 (Dust). Ideal for offshore oil rigs and chemical plants.',
    features: [
      'Certified ATEX/IECEx Ex d IIC T6, Ex tb IIIC T85°C',
      'AISI 316L marine grade passivated stainless steel body',
      'Integrated wiper with automated fluid wash system support',
      'Pre-wired hazardous location armored umbilical cable',
      'Continuous 360° pan rotation with variable speed control'
    ],
    specifications: {
      'Operating Temp': '-40°C to +60°C with internal heating',
      'Ingress Protection': 'IP66, IP67, IP68, IP69',
      'Window': 'Thermal shock resistant tempered thick glass',
      'Certifications': 'ATEX, IECEx, INMETRO, UL/cUL Class I Div 1'
    },
    imageUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
    createdAt: '2026-02-22T14:00:00.000Z'
  },

  // 12. Mounting & Surveillance Accessories
  {
    id: 'prod-mnt-01',
    name: 'Industrial Heavy Duty Stainless Steel Pole Mount Adapter with Dual Steel Straps',
    sku: 'IND-MNT-POL-SS',
    category: 'Mounting & Surveillance Accessories',
    subCategory: 'Pole Mounts',
    priceUSD: 119.00,
    originalPriceUSD: 149.00,
    rating: 4.8,
    reviewsCount: 340,
    inStock: true,
    stockQuantity: 300,
    brand: 'SecuPro Mounts',
    badge: 'Best Seller',
    isPrimeEligible: true,
    freeDelivery: true,
    warrantyYears: 10,
    description: 'Marine-grade corrosion resistant stainless steel pole bracket designed to securely affix PTZ domes, bullet cameras, and solar junction boxes onto cylindrical posts ranging from 3 to 8 inches in diameter.',
    features: [
      'Engineered from 3mm thick AISI 304 marine stainless steel',
      'Universal hole matrix compatible with Axis, Hikvision, Dahua, and Bosch brackets',
      'Includes two 8-inch high-torque quick-tightening stainless steel worm clamps',
      'Supports static payload loads up to 45 kg (100 lbs)',
      'Cable pass-through hole prevents tampering and environmental degradation'
    ],
    specifications: {
      'Pole Diameter': '80 mm to 200 mm (3.1" to 7.9")',
      'Plate Dimensions': '195 mm x 150 mm x 50 mm',
      'Weight Capacity': '45 kg',
      'Finish': 'Polished anti-corrosion brush'
    },
    imageUrl: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=800&q=80',
    createdAt: '2026-02-24T09:00:00.000Z'
  },

  // 13. Lighting & Visual Deterrence
  {
    id: 'prod-lit-01',
    name: 'Raytec VARIO2 IP PoE Long-Range 850nm Infrared Illuminator with Adaptive Beam',
    sku: 'RAY-VAR2-IP-I8-1',
    category: 'Lighting & Visual Deterrence',
    subCategory: 'IR Illuminators',
    priceUSD: 1150.00,
    rating: 4.9,
    reviewsCount: 52,
    inStock: true,
    stockQuantity: 44,
    brand: 'Raytec Systems',
    badge: 'Enterprise Certified',
    isPrimeEligible: true,
    freeDelivery: true,
    warrantyYears: 5,
    description: 'High performance network IP-controlled infrared illuminator delivering uniform night lighting up to 350 meters. Features interchangeable holographic lens inserts and dynamic HTTP/VMS triggered light bursts.',
    features: [
      'Reaches up to 350m (1148ft) with ultra-efficient PLATINUM Elite SMT LEDs',
      'Full IP web interface: Adjust intensity, timers, and day/night thresholds',
      'VARIO interchangeable holographic diffusers (10°, 35°, 60°, 80°)',
      'Automated deterrent strobe mode activated on camera motion alarm',
      'PoE+ (IEEE 802.3at) powered for straightforward installation'
    ],
    specifications: {
      'Wavelength': '850nm semi-covert infrared',
      'Beam Angles': '10° x 10° up to 120° x 120°',
      'Housing': 'IP66 powder-coated aluminum extrusion',
      'Power Consumption': '48W max'
    },
    imageUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=800&q=80',
    createdAt: '2026-02-26T11:00:00.000Z'
  },

  // 14. Telecommunication & Communication Equipment
  {
    id: 'prod-tel-01',
    name: 'Cambium Networks ePMP Force 425 5GHz Point-to-Point 1Gbps Backhaul Dish Radio',
    sku: 'CAM-FORCE-425',
    category: 'Telecommunication & Communication Equipment',
    subCategory: 'Microwave Radio',
    priceUSD: 690.00,
    originalPriceUSD: 780.00,
    rating: 4.8,
    reviewsCount: 88,
    inStock: true,
    stockQuantity: 55,
    brand: 'Cambium Networks',
    badge: 'Best Seller',
    isPrimeEligible: true,
    freeDelivery: true,
    warrantyYears: 3,
    description: 'High capacity wireless point-to-point microwave dish transceiver delivering up to 1 Gbps real throughput over distances exceeding 30 kilometers. Perfect for backhauling remote CCTV camera clusters.',
    features: [
      'Up to 1 Gbps aggregate throughput on 802.11ax hardware foundation',
      'High-gain 25 dBi parabolic reflector dish for long-range link budget',
      'Sub-5 millisecond latency suitable for PTZ control and VoIP transmission',
      'Ruggedized IP67 housing survives winds up to 200 km/h (125 mph)',
      'Real-time automated frequency selection and interference avoidance'
    ],
    specifications: {
      'Frequency': '4910 to 6135 MHz',
      'Channel Width': '20 / 40 / 80 MHz',
      'Antenna Gain': '25 dBi integrated dual slant dish',
      'Ethernet': '10/100/1000 Base-T with passive PoE'
    },
    imageUrl: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80',
    createdAt: '2026-02-28T14:00:00.000Z'
  },

  // 15. Accessories & Replacement Parts
  {
    id: 'prod-acc-01',
    name: 'Belden Industrial Category 6A Shielded F/UTP Outdoor Direct Burial Cable 1000ft',
    sku: 'BELDEN-7953A-1K',
    category: 'Accessories & Replacement Parts',
    subCategory: 'Network Accessories',
    priceUSD: 520.00,
    rating: 4.9,
    reviewsCount: 175,
    inStock: true,
    stockQuantity: 80,
    brand: 'Belden',
    badge: 'Spinel\'s Choice',
    isPrimeEligible: true,
    freeDelivery: true,
    warrantyYears: 10,
    description: 'Heavy duty 1000-foot spool of Cat 6A industrial Ethernet cable. Features aluminum foil shield, UV-resistant dual jacket, and water-blocking gel for direct underground burial or wet conduits.',
    features: [
      'Supports 10GBase-T up to 100 meters (328 ft) and High-Power 90W PoE++',
      'UV-resistant, oil-resistant and chemical-resistant industrial polyurethane jacket',
      'Heavy overall Beldfoil aluminum foil shielding against EMI / RFI noise',
      'Direct burial rated without requiring rigid conduit in standard soil',
      'Operating temperature range -40°C to +75°C'
    ],
    specifications: {
      'Length': '1000 feet (305 meters) pull box',
      'Conductors': '4-pair 23 AWG solid bare copper',
      'Impedance': '100 Ohms ±15%',
      'Jacket Color': 'Industrial Matte Black'
    },
    imageUrl: 'https://images.unsplash.com/photo-1581092162384-8987c1d64718?auto=format&fit=crop&w=800&q=80',
    createdAt: '2026-03-01T08:00:00.000Z'
  },

  // 16. Renewable Energy
  {
    id: 'prod-ren-01',
    name: 'Deye 12kW Three-Phase Hybrid Inverter 48V with Dual MPPT & Generator Control',
    sku: 'DEYE-SUN-12K-SG04',
    category: 'Renewable Energy',
    subCategory: 'Smart Hybrid Inverters',
    priceUSD: 2850.00,
    originalPriceUSD: 3200.00,
    rating: 4.9,
    reviewsCount: 104,
    inStock: true,
    stockQuantity: 22,
    brand: 'Deye Solar',
    badge: 'Enterprise Certified',
    freeDelivery: true,
    warrantyYears: 5,
    description: 'Industrial 12kW low-voltage 48V hybrid inverter supporting solar panels, battery storage, AC grid and automated diesel generator start. Enables continuous zero-interruption power for security outposts.',
    features: [
      '12,000W continuous AC output with 24,000W peak surge handling',
      '48V low voltage battery architecture for highest technician safety',
      'Dual MPPT with up to 15,600W PV solar array input capacity',
      'Unbalanced three-phase output support (each phase up to 50% rated power)',
      'Ultra-fast 4ms automatic transfer switch (ATS) function for sensitive electronics'
    ],
    specifications: {
      'AC Nominal Power': '12,000 Watts 3-Phase 400V/230V',
      'Battery Voltage Range': '40V to 60V DC',
      'Max Efficiency': '97.60%',
      'Communication': 'CAN / RS485 / Wi-Fi / DRM'
    },
    imageUrl: 'https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=800&q=80',
    createdAt: '2026-03-02T10:00:00.000Z'
  },
  {
    id: 'prod-ren-02',
    name: 'Pylontech US5000 4.8kWh 48V LiFePO4 Server Rack Lithium Battery Module 6000 Cycles',
    sku: 'PYLON-US5000',
    category: 'Renewable Energy',
    subCategory: 'Lithium LiFePO4 Batteries',
    priceUSD: 1490.00,
    originalPriceUSD: 1750.00,
    rating: 4.9,
    reviewsCount: 220,
    inStock: true,
    stockQuantity: 60,
    brand: 'Pylontech',
    badge: 'Best Seller',
    isPrimeEligible: true,
    freeDelivery: true,
    warrantyYears: 10,
    description: 'The gold standard 48V 4.8kWh lithium iron phosphate (LiFePO4) energy storage battery designed for standard 19-inch equipment racks. Scalable up to 16 units in parallel for 76.8kWh storage.',
    features: [
      '4.8 kWh nominal capacity with 95% usable depth of discharge (DoD)',
      '6,000+ lifecycle cycles at 25°C with 10-year manufacturer warranty',
      'Integrated intelligent Battery Management System (BMS) balances each cell',
      'Standard 19-inch 3U rack-mount chassis for server room clean integration',
      'CAN & RS485 communication protocols compatible with top solar inverters'
    ],
    specifications: {
      'Nominal Voltage': '48V DC',
      'Rated Capacity': '100 Ah (4,800 Wh)',
      'Discharge Current': 'Recommended 50A, Max 100A continuous',
      'Weight': '39.7 kg'
    },
    imageUrl: 'https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=800&q=80',
    createdAt: '2026-03-03T11:00:00.000Z'
  },
  {
    id: 'prod-ren-03',
    name: 'JA Solar 550W DeepBlue 3.0 Pro Monocrystalline Half-Cell Industrial Solar Panel',
    sku: 'JA-JAM72S30-550',
    category: 'Renewable Energy',
    subCategory: 'Industrial Solar Panels',
    priceUSD: 195.00,
    originalPriceUSD: 235.00,
    rating: 4.8,
    reviewsCount: 310,
    inStock: true,
    stockQuantity: 400,
    brand: 'JA Solar',
    badge: 'Spinel\'s Choice',
    freeDelivery: true,
    warrantyYears: 25,
    description: 'Tier-1 high-efficiency 550W bifacial-capable monocrystalline solar module featuring 11-busbar PERC half-cell architecture with superior low-irradiance performance.',
    features: [
      '550 Watts peak output with module efficiency up to 21.3%',
      'Lower temperature coefficient minimizes power loss in hot desert or tropical environments',
      'Heavy-duty 35mm anodized aluminum frame withstands 5400 Pa snow / 2400 Pa wind loads',
      'Lower internal resistance reduces hotspot risk and boosts reliability',
      '25-year linear power performance warranty'
    ],
    specifications: {
      'Peak Power (Pmax)': '550 Watts',
      'Open Circuit Voltage (Voc)': '49.90 V',
      'Short Circuit Current (Isc)': '14.00 A',
      'Dimensions': '2279 mm x 1134 mm x 35 mm'
    },
    imageUrl: 'https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=800&q=80',
    createdAt: '2026-03-04T12:00:00.000Z'
  }
];
