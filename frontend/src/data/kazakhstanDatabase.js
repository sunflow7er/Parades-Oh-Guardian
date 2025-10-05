// Data compiled from Kazakhstan Emergency Situations Ministry, historical records, and publicly available
// seismic / meteorological summaries. Probabilities here are qualitative relative likelihood indices
// (0-100) NOT literal annual occurrence percentages. 

export const kazakhstanCitiesDatabase = {
  cities: [
    {
      id: 'almaty',
      name: 'Almaty',
      region: 'Almaty Region',
      coordinates: { lat: 43.2220, lng: 76.8512 },
      population: 2000000,
      elevation: 830,
      climate: 'Continental',
      description: 'Former capital, largest city, located in foothills of Trans-Ili Alatau mountains',
      naturalDisasters: {
        earthquake: {
          probability: 35, // Realistic seismic activity based on geological surveys
          severity: 'Moderate to High',
          lastEvent: '1887-1911 series',
          description: 'Located near active Tien Shan fault system, moderate earthquake risk',
          safetyLevel: 'Moderate Risk',
          preparedness: 'Building codes updated, emergency systems in place'
        },
        flood: {
          probability: 45,
          severity: 'Medium',
          lastEvent: '2018 spring floods',
          description: 'Mountain snowmelt and mudflows from Ile and Karasu rivers',
          safetyLevel: 'Low to Moderate Risk',
          preparedness: 'Flood barriers, early warning systems'
        },
        mudslide: {
          probability: 60,
          severity: 'High',
          lastEvent: '2021',
          description: 'Mountainous terrain increases mudslide risk during heavy rains',
          safetyLevel: 'Moderate Risk',
          preparedness: 'Monitoring systems, evacuation routes'
        },
        drought: {
          probability: 25,
          severity: 'Low',
          lastEvent: '2012',
          description: 'Adequate water supply from mountain sources',
          safetyLevel: 'Low Risk',
          preparedness: 'Water reserves, conservation plans'
        },
        heatwave: {
          probability: 40,
          severity: 'Medium',
          lastEvent: '2024',
          description: 'Summer temperatures can exceed 40°C',
          safetyLevel: 'Low Risk',
          preparedness: 'Cooling centers, health advisories'
        }
      },
      weatherProfile: {
        averageTemp: { winter: -8, summer: 24 },
        precipitation: { annual: 560, pattern: 'Spring peak, dry summer' },
        wind: { average: 12, max: 35 },
        extremes: { minTemp: -38, maxTemp: 43 }
      }
    },
    {
      id: 'astana',
      name: 'Nur-Sultan (Astana)',
      region: 'Akmola Region',
      coordinates: { lat: 51.1694, lng: 71.4491 },
      population: 1200000,
      elevation: 347,
      climate: 'Extreme Continental',
      description: 'Capital city, modern planned city in northern steppe',
      naturalDisasters: {
        blizzard: {
          probability: 90,
          severity: 'Very High',
          lastEvent: '2023-2024 winter',
          description: 'Severe winter storms with temperatures below -40°C and high winds',
          safetyLevel: 'High Risk',
          preparedness: 'Emergency heating systems, snow removal, emergency supplies'
        },
        drought: {
          probability: 55,
          severity: 'Medium',
          lastEvent: '2012-2013',
          description: 'Steppe climate vulnerable to extended dry periods',
          safetyLevel: 'Moderate Risk',
          preparedness: 'Water management systems, agricultural contingencies'
        },
        dust_storm: {
          probability: 40,
          severity: 'Medium',
          lastEvent: '2023',
          description: 'Strong winds can create dust storms from surrounding steppe',
          safetyLevel: 'Low to Moderate Risk',
          preparedness: 'Air quality monitoring, health advisories'
        },
        flood: {
          probability: 25,
          severity: 'Low',
          lastEvent: '2017',
          description: 'Spring snowmelt from Ishim River basin',
          safetyLevel: 'Low Risk',
          preparedness: 'River monitoring, drainage systems'
        },
        earthquake: {
          probability: 15,
          severity: 'Low',
          lastEvent: 'Minor tremors',
          description: 'Low seismic activity in northern Kazakhstan',
          safetyLevel: 'Very Low Risk',
          preparedness: 'Basic building standards'
        }
      },
      weatherProfile: {
        averageTemp: { winter: -17, summer: 20 },
        precipitation: { annual: 320, pattern: 'Low, concentrated in summer' },
        wind: { average: 15, max: 45 },
        extremes: { minTemp: -52, maxTemp: 41 }
      }
    },
    {
      id: 'shymkent',
      name: 'Shymkent',
      region: 'Turkestan Region',
      coordinates: { lat: 42.3000, lng: 69.6000 },
      population: 1000000,
      elevation: 534,
      climate: 'Semi-arid',
      description: 'Southern industrial city, gateway to Central Asia',
      naturalDisasters: {
        drought: {
          probability: 65,
          severity: 'High',
          lastEvent: '2021-2022',
          description: 'Arid climate makes region vulnerable to water shortages',
          safetyLevel: 'Moderate to High Risk',
          preparedness: 'Water conservation, agricultural adaptation'
        },
        earthquake: {
          probability: 25,
          severity: 'Moderate',
          lastEvent: '1990s series',
          description: 'Southern location with lower seismic activity than Almaty region',
          safetyLevel: 'Low to Moderate Risk',
          preparedness: 'Seismic monitoring, building codes'
        },
        heatwave: {
          probability: 45,
          severity: 'Moderate to High',
          lastEvent: '2024',
          description: 'Southern location experiences hot summers with occasional extreme heat',
          safetyLevel: 'Moderate Risk',
          preparedness: 'Heat emergency plans, cooling centers'
        },
        flood: {
          probability: 35,
          severity: 'Medium',
          lastEvent: '2020',
          description: 'Flash floods from Syr Darya tributaries during heavy rains',
          safetyLevel: 'Low to Moderate Risk',
          preparedness: 'Flood channels, early warning'
        },
        dust_storm: {
          probability: 50,
          severity: 'Medium',
          lastEvent: '2023',
          description: 'Proximity to deserts increases dust storm frequency',
          safetyLevel: 'Moderate Risk',
          preparedness: 'Air quality monitoring'
        }
      },
      weatherProfile: {
        averageTemp: { winter: -2, summer: 28 },
        precipitation: { annual: 380, pattern: 'Spring maximum, dry summer' },
        wind: { average: 10, max: 30 },
        extremes: { minTemp: -25, maxTemp: 46 }
      }
    },
    {
      id: 'aktobe',
      name: 'Aktobe',
      region: 'Aktobe Region',
      coordinates: { lat: 50.2839, lng: 57.2094 },
      population: 500000,
      elevation: 219,
      climate: 'Continental',
      description: 'Western Kazakhstan industrial center, oil and gas hub',
      naturalDisasters: {
        drought: {
          probability: 60,
          severity: 'High',
          lastEvent: '2012-2013',
          description: 'Semi-arid climate with irregular precipitation',
          safetyLevel: 'Moderate Risk',
          preparedness: 'Water management, drought monitoring'
        },
        dust_storm: {
          probability: 55,
          severity: 'Medium',
          lastEvent: '2022',
          description: 'Steppe location with strong winds creates dust storms',
          safetyLevel: 'Moderate Risk',
          preparedness: 'Weather monitoring, health protocols'
        },
        blizzard: {
          probability: 70,
          severity: 'High',
          lastEvent: '2023-2024',
          description: 'Severe winter conditions with heavy snow and wind',
          safetyLevel: 'Moderate to High Risk',
          preparedness: 'Winter emergency services, heating systems'
        },
        flood: {
          probability: 30,
          severity: 'Medium',
          lastEvent: '2019',
          description: 'Spring flooding from Ilek River and tributaries',
          safetyLevel: 'Low Risk',
          preparedness: 'River management, drainage'
        },
        earthquake: {
          probability: 20,
          severity: 'Low',
          lastEvent: 'Minor events',
          description: 'Low seismic activity in western region',
          safetyLevel: 'Very Low Risk',
          preparedness: 'Standard building codes'
        }
      },
      weatherProfile: {
        averageTemp: { winter: -12, summer: 22 },
        precipitation: { annual: 280, pattern: 'Spring peak, variable' },
        wind: { average: 14, max: 40 },
        extremes: { minTemp: -42, maxTemp: 44 }
      }
    },
    {
      id: 'taraz',
      name: 'Taraz',
      region: 'Zhambyl Region',
      coordinates: { lat: 42.9000, lng: 71.3667 },
      population: 400000,
      elevation: 628,
      climate: 'Semi-arid',
      description: 'Ancient Silk Road city, agricultural center',
      naturalDisasters: {
        earthquake: {
          probability: 75,
          severity: 'High',
          lastEvent: '2003',
          description: 'Located in Tian Shan seismic zone with active faults',
          safetyLevel: 'Moderate to High Risk',
          preparedness: 'Seismic monitoring, emergency response'
        },
        drought: {
          probability: 55,
          severity: 'Medium',
          lastEvent: '2021',
          description: 'Agricultural region vulnerable to water shortages',
          safetyLevel: 'Moderate Risk',
          preparedness: 'Irrigation systems, crop management'
        },
        flood: {
          probability: 45,
          severity: 'Medium',
          lastEvent: '2018',
          description: 'Shu River flooding during snowmelt and heavy rains',
          safetyLevel: 'Moderate Risk',
          preparedness: 'Flood barriers, river monitoring'
        },
        heatwave: {
          probability: 50,
          severity: 'Medium',
          lastEvent: '2024',
          description: 'Continental climate with hot summers',
          safetyLevel: 'Low to Moderate Risk',
          preparedness: 'Heat advisories, cooling centers'
        },
        landslide: {
          probability: 35,
          severity: 'Medium',
          lastEvent: '2020',
          description: 'Mountainous areas prone to landslides during heavy rains',
          safetyLevel: 'Low to Moderate Risk',
          preparedness: 'Slope monitoring, evacuation routes'
        }
      },
      weatherProfile: {
        averageTemp: { winter: -5, summer: 26 },
        precipitation: { annual: 420, pattern: 'Spring maximum' },
        wind: { average: 11, max: 32 },
        extremes: { minTemp: -30, maxTemp: 42 }
      }
    },
    {
      id: 'pavlodar',
      name: 'Pavlodar',
      region: 'Pavlodar Region',
      coordinates: { lat: 52.2833, lng: 76.9667 },
      population: 360000,
      elevation: 124,
      climate: 'Continental',
      description: 'Northern industrial city, petrochemical center on Irtysh River',
      naturalDisasters: {
        flood: {
          probability: 70,
          severity: 'High',
          lastEvent: '2017',
          description: 'Irtysh River flooding during spring snowmelt and heavy rains',
          safetyLevel: 'Moderate to High Risk',
          preparedness: 'Flood defenses, evacuation plans'
        },
        blizzard: {
          probability: 80,
          severity: 'High',
          lastEvent: '2023-2024',
          description: 'Severe winter storms with heavy snow and strong winds',
          safetyLevel: 'High Risk',
          preparedness: 'Winter emergency services, shelters'
        },
        drought: {
          probability: 45,
          severity: 'Medium',
          lastEvent: '2012',
          description: 'Northern steppe vulnerable to dry periods',
          safetyLevel: 'Moderate Risk',
          preparedness: 'Water reserves, agricultural adaptation'
        },
        ice_jam: {
          probability: 60,
          severity: 'Medium',
          lastEvent: '2019',
          description: 'Irtysh River ice jams cause flooding during spring breakup',
          safetyLevel: 'Moderate Risk',
          preparedness: 'Ice monitoring, controlled icebreaking'
        },
        earthquake: {
          probability: 15,
          severity: 'Low',
          lastEvent: 'Minor tremors',
          description: 'Stable platform with minimal seismic activity',
          safetyLevel: 'Very Low Risk',
          preparedness: 'Basic standards'
        }
      },
      weatherProfile: {
        averageTemp: { winter: -16, summer: 21 },
        precipitation: { annual: 310, pattern: 'Summer maximum' },
        wind: { average: 13, max: 38 },
        extremes: { minTemp: -47, maxTemp: 40 }
      }
    },
    {
      id: 'tokyo',
      name: 'Tokyo',
      region: 'Kanto Region, Japan',
      coordinates: { lat: 35.6762, lng: 139.6503 },
      population: 37400000,
      elevation: 40,
      climate: 'Humid subtropical',
      description: 'Capital of Japan, largest urban area in the world',
      naturalDisasters: {
        earthquake: {
          probability: 40,
          severity: 'High',
          lastEvent: '2011 Tohoku (9.0), 1923 Great Kanto (7.9)',
          description: 'Located on Pacific Ring of Fire, high seismic activity expected',
          safetyLevel: 'High Risk - Well Prepared',
          preparedness: 'World-class earthquake preparedness, strict building codes, early warning systems'
        },
        tsunami: {
          probability: 30,
          severity: 'High',
          lastEvent: '2011 Tohoku tsunami',
          description: 'Tokyo Bay provides some protection, but risk exists for coastal areas',
          safetyLevel: 'Moderate Risk',
          preparedness: 'Tsunami barriers, evacuation routes, warning systems'
        },
        typhoon: {
          probability: 65,
          severity: 'High',
          lastEvent: '2019 Typhoon Hagibis',
          description: 'Annual typhoon season brings strong winds and heavy rain',
          safetyLevel: 'Moderate Risk',
          preparedness: 'Advanced meteorological monitoring, flood defenses, evacuation protocols'
        },
        flood: {
          probability: 40,
          severity: 'Moderate',
          lastEvent: '2019 Typhoon Hagibis',
          description: 'Heavy rainfall can overwhelm drainage systems',
          safetyLevel: 'Moderate Risk',
          preparedness: 'Extensive drainage systems, flood barriers, pumping stations'
        },
        heatwave: {
          probability: 60,
          severity: 'High',
          lastEvent: '2023 summer',
          description: 'Urban heat island effect intensifies summer temperatures',
          safetyLevel: 'Moderate Risk',
          preparedness: 'Cooling centers, health advisories, urban planning initiatives'
        }
      },
      weatherProfile: {
        averageTemp: { winter: 6, summer: 26 },
        precipitation: { annual: 1520, pattern: 'Rainy season June-July, dry winter' },
        wind: { average: 12, max: 180 },
        extremes: { minTemp: -9, maxTemp: 39 }
      }
    },
    {
      id: 'osaka',
      name: 'Osaka',
      region: 'Kansai Region, Japan',
      coordinates: { lat: 34.6937, lng: 135.5023 },
      population: 19300000,
      elevation: 5,
      climate: 'Humid subtropical',
      description: 'Major commercial hub, second largest urban area in Japan',
      naturalDisasters: {
        earthquake: {
          probability: 45,
          severity: 'High',
          lastEvent: '1995 Great Hanshin earthquake (6.9)',
          description: 'Located near several active fault lines including Nankai Trough',
          safetyLevel: 'High Risk - Well Prepared',
          preparedness: 'Reinforced infrastructure post-1995, advanced monitoring systems'
        },
        tsunami: {
          probability: 35,
          severity: 'High',
          lastEvent: 'Historical records from Nankai Trough',
          description: 'Osaka Bay vulnerable to Nankai Trough megathrust earthquakes',
          safetyLevel: 'High Risk',
          preparedness: 'Tsunami walls, evacuation buildings, early warning systems'
        },
        typhoon: {
          probability: 60,
          severity: 'High',
          lastEvent: '2018 Typhoon Jebi',
          description: 'Exposed to Pacific typhoons, storm surge risk',
          safetyLevel: 'Moderate Risk',
          preparedness: 'Storm barriers, evacuation procedures, weather monitoring'
        },
        flood: {
          probability: 35,
          severity: 'Moderate',
          lastEvent: '2018 heavy rains',
          description: 'Low elevation increases flood risk during heavy rainfall',
          safetyLevel: 'Moderate Risk',
          preparedness: 'Comprehensive drainage, pumping systems, river management'
        },
        heatwave: {
          probability: 70,
          severity: 'High',
          lastEvent: '2023 summer',
          description: 'Dense urban area with significant heat island effect',
          safetyLevel: 'Moderate Risk',
          preparedness: 'Public cooling facilities, health monitoring, heat action plans'
        }
      },
      weatherProfile: {
        averageTemp: { winter: 6, summer: 28 },
        precipitation: { annual: 1270, pattern: 'Rainy season peak, dry winter' },
        wind: { average: 10, max: 160 },
        extremes: { minTemp: -7, maxTemp: 39 }
      }
    },
    {
      id: 'kyoto',
      name: 'Kyoto',
      region: 'Kansai Region, Japan',
      coordinates: { lat: 35.0116, lng: 135.7681 },
      population: 1460000,
      elevation: 56,
      climate: 'Humid subtropical',
      description: 'Ancient capital, UNESCO World Heritage sites, cultural center',
      naturalDisasters: {
        earthquake: {
          probability: 40,
          severity: 'Moderate to High',
          lastEvent: '1995 Great Hanshin earthquake effects',
          description: 'Inland location with moderate seismic risk from regional faults',
          safetyLevel: 'Moderate to High Risk',
          preparedness: 'Historical building reinforcement, modern safety standards'
        },
        flood: {
          probability: 50,
          severity: 'Moderate',
          lastEvent: '2018 heavy rains',
          description: 'Surrounded by mountains, flash flood risk during heavy rains',
          safetyLevel: 'Moderate Risk',
          preparedness: 'River management, early warning systems, drainage improvements'
        },
        typhoon: {
          probability: 60,
          severity: 'Moderate',
          lastEvent: '2018 Typhoon Jebi',
          description: 'Inland location provides some protection from direct typhoon impact',
          safetyLevel: 'Moderate Risk',
          preparedness: 'Weather monitoring, cultural site protection protocols'
        },
        landslide: {
          probability: 40,
          severity: 'Moderate',
          lastEvent: '2017 heavy rains',
          description: 'Mountainous terrain increases landslide risk during heavy rainfall',
          safetyLevel: 'Moderate Risk',
          preparedness: 'Slope monitoring, evacuation routes, geological surveys'
        },
        heatwave: {
          probability: 65,
          severity: 'High',
          lastEvent: '2023 summer',
          description: 'Basin topography traps heat, creating intense summer conditions',
          safetyLevel: 'Moderate Risk',
          preparedness: 'Traditional cooling methods, modern heat management, tourist advisories'
        }
      },
      weatherProfile: {
        averageTemp: { winter: 4, summer: 27 },
        precipitation: { annual: 1570, pattern: 'Rainy season peak, snowy winters' },
        wind: { average: 8, max: 120 },
        extremes: { minTemp: -11, maxTemp: 39 }
      }
    }
  ],
  
  // Regional disaster statistics
  regionalStats: {
    earthquakes: {
      frequency: 'Southern regions (Almaty, Shymkent, Taraz) - High risk due to Tian Shan seismic belt',
      magnitude: 'Up to 7.5 magnitude possible in Almaty region',
      preparedness: 'Building codes updated post-1990s, monitoring systems active'
    },
    floods: {
      frequency: 'Spring (April-May) snowmelt, summer flash floods',
      severity: 'River cities (Pavlodar, Almaty) most vulnerable',
      preparedness: 'Early warning systems, flood barriers in major cities'
    },
    droughts: {
      frequency: '7-10 year cycles, increasing with climate change',
      severity: 'Western and southern regions most affected',
      preparedness: 'Water management improvements, crop diversification'
    },
    winter_storms: {
      frequency: 'Northern regions (Astana, Pavlodar, Aktobe) - Annual occurrence',
      severity: 'Temperatures below -40°C, winds up to 80 km/h',
      preparedness: 'Emergency heating, snow removal, food reserves'
    }
  },
  
  // Event safety recommendations by city
  eventSafetyGuidelines: {
    wedding: {
      almaty: { bestMonths: ['May', 'June', 'September'], risks: ['Earthquake preparedness', 'Mudslide awareness'] },
      astana: { bestMonths: ['June', 'July', 'August'], risks: ['Winter storm contingency', 'Extreme cold backup'] },
      shymkent: { bestMonths: ['April', 'May', 'October'], risks: ['Heat management', 'Drought considerations'] },
      aktobe: { bestMonths: ['May', 'June', 'September'], risks: ['Dust storm monitoring', 'Winter backup plans'] },
      taraz: { bestMonths: ['May', 'September', 'October'], risks: ['Earthquake safety', 'Flood season avoidance'] },
      pavlodar: { bestMonths: ['June', 'July', 'August'], risks: ['Flood season planning', 'Winter storm backup'] }
    },
    festival: {
      almaty: { bestMonths: ['May', 'June', 'September'], risks: ['Seismic safety measures', 'Mountain weather changes'] },
      astana: { bestMonths: ['June', 'July'], risks: ['Extreme weather shelters', 'Heating backup'] },
      shymkent: { bestMonths: ['April', 'May', 'October'], risks: ['Heat protection', 'Dust management'] },
      aktobe: { bestMonths: ['May', 'June', 'September'], risks: ['Wind protection', 'Weather monitoring'] },
      taraz: { bestMonths: ['May', 'September'], risks: ['Emergency protocols', 'Weather flexibility'] },
      pavlodar: { bestMonths: ['June', 'July'], risks: ['Flood contingency', 'Severe weather shelter'] }
    }
  }
};

export default kazakhstanCitiesDatabase;