/**
 * Supported Crops and Disease Encyclopedia
 * Provides educational guidance, key visual symptoms, and non-prescriptive prevention measures.
 */

export const CROPS = {
  TOMATO: 'Tomato (Solanum lycopersicum)',
  POTATO: 'Potato (Solanum tuberosum)',
  CORN: 'Corn / Maize (Zea mays)',
  APPLE: 'Apple (Malus domestica)',
  GRAPE: 'Grape (Vitis vinifera)'
};

export const SEVERITY = {
  HEALTHY: { label: 'Healthy Plant', color: 'emerald', code: 'healthy' },
  LOW: { label: 'Low Severity', color: 'blue', code: 'low' },
  MODERATE: { label: 'Moderate Severity', color: 'amber', code: 'moderate' },
  HIGH: { label: 'High / Severe', color: 'rose', code: 'high' }
};

export const DISEASES_DATABASE = {
  'tomato_early_blight': {
    id: 'tomato_early_blight',
    crop: 'Tomato',
    cropScientific: 'Solanum lycopersicum',
    diseaseName: 'Early Blight',
    pathogen: 'Alternaria solani (Fungus)',
    isHealthy: false,
    severity: SEVERITY.MODERATE,
    summary: 'A common fungal infection causing dark concentric ring lesions, beginning on older lower foliage and moving upward.',
    symptoms: [
      'Small brown-to-black spots with concentric rings resembling a target or bullseye.',
      'Yellow chlorotic halos surrounding the dark lesions.',
      'Premature defoliation, leaving developing tomato fruits vulnerable to sunscald.',
      'Collar rot and sunken dark cankers on lower stems.'
    ],
    environmentalTriggers: [
      'Warm temperatures (24°C–29°C / 75°F–85°F).',
      'Extended periods of leaf wetness from overhead watering, morning dew, or heavy rain.',
      'High relative humidity (>80%) combined with poor canopy airflow.'
    ],
    prevention: {
      cultural: [
        'Practice a 3- to 4-year crop rotation, avoiding solanaceous crops (potato, eggplant, pepper).',
        'Water at the base of plants using drip irrigation or soaker hoses to keep leaves dry.',
        'Prune lower leaves (up to 12–18 inches from the soil) once plants are established to prevent soil splash.',
        'Apply organic straw or plastic mulch beneath plants to create a physical barrier between soil pathogens and foliage.'
      ],
      biologicalOrganic: [
        'Apply preventive biofungicides containing Bacillus subtilis or Trichoderma harzianum.',
        'Utilize OMRI-listed copper octanoate or copper hydroxide sprays as protective barriers before symptoms appear.',
        'Apply neem oil extracts during mild weather to suppress early fungal spore germination.'
      ],
      sanitation: [
        'Thoroughly remove and destroy infected plant debris at the end of the harvest season (do not compost).',
        'Sterilize pruning shears with 70% isopropyl alcohol or 10% bleach solution between cuts.',
        'Select certified disease-resistant tomato cultivars labeled with resistance code (EB).'
      ]
    }
  },

  'potato_late_blight': {
    id: 'potato_late_blight',
    crop: 'Potato',
    cropScientific: 'Solanum tuberosum',
    diseaseName: 'Late Blight',
    pathogen: 'Phytophthora infestans (Oomycete)',
    isHealthy: false,
    severity: SEVERITY.HIGH,
    summary: 'A devastating water-mold disease that spreads rapidly in cool, wet weather, destroying foliage and rotting tubers.',
    symptoms: [
      'Irregular water-soaked, pale-to-dark brown or purplish lesions on leaf margins and tips.',
      'A delicate white cottony or mildew-like fungal fuzz visible on the undersides of leaves during humid conditions.',
      'Rapid wilting, browning, and collapse of entire vine foliage within days.',
      'Dry, reddish-brown granular rot beneath tuber skins in storage.'
    ],
    environmentalTriggers: [
      'Cool to moderate temperatures (15°C–22°C / 60°F–72°F).',
      'Persistent high humidity (>90%) and continuous leaf wetness lasting over 10 hours.',
      'Overcast, rainy, and misty weather conditions.'
    ],
    prevention: {
      cultural: [
        'Plant only certified disease-free seed tubers from verified suppliers.',
        'Ensure generous spacing between rows to maximize air circulation and sunlight penetration.',
        'Avoid overhead sprinkler irrigation; always irrigate during morning hours to speed drying.',
        'Hill soil generously over tubers to prevent spore wash-down from foliage to tubers.'
      ],
      biologicalOrganic: [
        'Preventive applications of fixed copper fungicides prior to rainy periods when regional blight forecasts alert growers.',
        'Bio-stimulants promoting plant systemic acquired resistance (SAR).',
        'Potassium phosphite applications where permitted as educational cultural suppression.'
      ],
      sanitation: [
        'Immediately rogue (dig up and seal in bags) infected plants when localized infection is detected.',
        'Destroy cull piles and self-seeded volunteer potato or tomato plants around the field perimeter.',
        'Wait at least 2 weeks after vine death before harvesting tubers to allow any surface spores to die.'
      ]
    }
  },

  'healthy_tomato': {
    id: 'healthy_tomato',
    crop: 'Tomato',
    cropScientific: 'Solanum lycopersicum',
    diseaseName: 'Healthy Tomato Leaf',
    pathogen: 'None (Optimal Plant Health)',
    isHealthy: true,
    severity: SEVERITY.HEALTHY,
    summary: 'The plant leaf demonstrates balanced chlorophyll distribution, crisp vein integrity, and absence of active fungal, bacterial, or viral lesions.',
    symptoms: [
      'Uniform rich green coloration across leaf lamina and petiole.',
      'Clean, uninterrupted venation without chlorosis or necrosis.',
      'Firm leaf turgor and healthy cuticle layer.',
      'No spots, powdery residues, wilting, or pest feeding punctures.'
    ],
    environmentalTriggers: [
      'Balanced sunlight (6–8 hours direct sunlight daily).',
      'Consistent soil moisture without waterlogging.',
      'Adequate nitrogen, potassium, calcium, and phosphorus nutrition.'
    ],
    prevention: {
      cultural: [
        'Maintain balanced fertilization; avoid excess nitrogen which induces overly lush, succulent growth vulnerable to pests.',
        'Ensure steady watering to prevent calcium deficiency (blossom end rot) and leaf stress.',
        'Maintain good air flow and weed suppression in the surrounding bed.'
      ],
      biologicalOrganic: [
        'Periodic foliar compost teas or kelp sprays to enhance natural leaf microflora resilience.',
        'Inspect plant foliage weekly for early warning signs of insect vectors (aphids, whiteflies).'
      ],
      sanitation: [
        'Clean garden tools regularly and rotate seasonal planting locations.'
      ]
    }
  },

  'corn_common_rust': {
    id: 'corn_common_rust',
    crop: 'Corn (Maize)',
    cropScientific: 'Zea mays',
    diseaseName: 'Common Rust',
    pathogen: 'Puccinia sorghi (Fungus)',
    isHealthy: false,
    severity: SEVERITY.MODERATE,
    summary: 'Fungal rust disease characterized by prominent cinnamon-brown powdery pustules that erupt through both upper and lower leaf surfaces.',
    symptoms: [
      'Oval to elongated cinnamon-brown or golden pustules (uredinia) scattered across both leaf surfaces.',
      'Powdery rusty spores that easily rub off on fingers or clothing.',
      'Chlorotic halos surrounding older pustules, eventually leading to leaf tissue death under heavy infestation.',
      'Pustules turn brownish-black late in the season as resting spores (teliospores) form.'
    ],
    environmentalTriggers: [
      'Moderate temperatures (16°C–25°C / 60°F–77°F).',
      'High relative humidity and 6 or more hours of free moisture on leaves.',
      'Winds carrying fungal spores from warmer southern regions early in the season.'
    ],
    prevention: {
      cultural: [
        'Select hybrid corn cultivars with high genetic resistance (Rp genes).',
        'Plant early in the season to allow crop development before peak airborne spore loads arrive.',
        'Maintain balanced nitrogen fertilization to avoid delayed maturity.'
      ],
      biologicalOrganic: [
        'Sulfur-based protective dusts or sprays applied preventively on specialty sweet corn.',
        'Foliar applications of antagonistic biofungicides in commercial organic sweet corn blocks.'
      ],
      sanitation: [
        'Till crop residues where feasible to encourage breakdown of overwintering volunteer plants.',
        'Control wild host grasses in field borders.'
      ]
    }
  },

  'apple_scab': {
    id: 'apple_scab',
    crop: 'Apple',
    cropScientific: 'Malus domestica',
    diseaseName: 'Apple Scab',
    pathogen: 'Venturia inaequalis (Fungus)',
    isHealthy: false,
    severity: SEVERITY.MODERATE,
    summary: 'A widespread fungal disease that attacks apple foliage and fruit, producing olive-green velvety lesions that turn dark, corky, and scab-like.',
    symptoms: [
      'Dull olive-green to smoky-brown circular velvety spots with feathery margins on leaves.',
      'Leaf puckering, curling, yellowing, and early summer defoliation.',
      'Dark, rough, corky, cracked lesions on apple skins.',
      'Premature fruit drop and stunted tree vigor.'
    ],
    environmentalTriggers: [
      'Cool, rainy spring weather (13°C–24°C / 55°F–75°F).',
      'Prolonged wet periods during bud break and early bloom (continuous leaf wetness of 9–28 hours depending on temperature).'
    ],
    prevention: {
      cultural: [
        'Prune trees annually in winter to open up canopy structure, ensuring rapid drying after rainfall.',
        'Choose scab-resistant apple cultivars such as Liberty, Prima, Enterprise, or Freedom.',
        'Rake and shred or compost fallen apple leaves in autumn, or apply urea to accelerate leaf decomposition.'
      ],
      biologicalOrganic: [
        'Preventive applications of micronized sulfur, potassium bicarbonate, or lime-sulfur during early spring wet cycles.',
        'Targeted organic copper fungicides applied at the green-tip phenological stage.'
      ],
      sanitation: [
        'Remove mummified apples remaining on branches in winter.',
        'Sanitize pruning tools between trees to prevent cross-contamination.'
      ]
    }
  },

  'grape_black_rot': {
    id: 'grape_black_rot',
    crop: 'Grape',
    cropScientific: 'Vitis vinifera',
    diseaseName: 'Black Rot',
    pathogen: 'Guignardia bidwellii (Fungus)',
    isHealthy: false,
    severity: SEVERITY.HIGH,
    summary: 'A serious fungal disease of grapevines affecting leaves, shoots, and berries, causing circular tan spots with black pycnidia and shriveled black mummies.',
    symptoms: [
      'Small, circular reddish-tan or cream-colored spots with distinct dark brown margins on leaves.',
      'Tiny black speck-like fruiting bodies (pycnidia) arranged in rings inside the tan leaf spots.',
      'Infected grape berries turn soft, pale, shrivel into hard, black, raisin-like mummies within days.',
      'Elongated, sunken black lesions on green canes and tendrils.'
    ],
    environmentalTriggers: [
      'Warm and humid conditions (21°C–27°C / 70°F–80°F).',
      'Extended periods of rain and leaf moisture during bloom and post-bloom periods.'
    ],
    prevention: {
      cultural: [
        'Train and trellis grapevines with good canopy management (shoot positioning, leaf pulling) to increase air movement and sunlight.',
        'Avoid planting in low-lying frost pockets with poor air drainage.',
        'Keep vineyard floor mowed to lower microclimate humidity.'
      ],
      biologicalOrganic: [
        'Apply copper octanoate or wettable sulfur preventively starting at early shoot growth (bud break) through 4 weeks post-bloom.',
        'Biological fungicides based on Bacillus amyloliquefaciens applied before rain forecasts.'
      ],
      sanitation: [
        'Prune out all dried black mummified berries from the vine during winter pruning.',
        'Bury or remove infected prunings from the vineyard floor so spores cannot be splashed back up.'
      ]
    }
  }
};

/**
 * Educational disclaimer required for all recommendations
 */
export const EDUCATIONAL_DISCLAIMER = {
  badge: 'Educational Guidance Only',
  shortNotice: 'Results and suggestions are for informational and educational purposes only, not professional agronomic advice.',
  fullDisclaimer: 'This application utilizes computer vision and heuristic analysis to provide educational insights into plant foliage symptoms. Model predictions are probabilistic estimates influenced by lighting, camera angle, and image quality. These findings do NOT constitute certified agricultural, pesticide, or professional horticultural advice. For commercial crop decisions, pesticide application guidelines, and definitive laboratory pathology diagnosis, always consult your local university agricultural extension service or a certified crop advisor (CCA).'
};
