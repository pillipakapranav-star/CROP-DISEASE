/**
 * Preset Demonstration Leaf Samples & Quality Test Cases
 */

export const SAMPLE_IMAGES = [
  {
    id: 'sample_tomato_early_blight',
    title: 'Tomato: Early Blight',
    crop: 'Tomato',
    diseaseId: 'tomato_early_blight',
    path: '/samples/tomato_early_blight.jpg',
    description: 'Alternaria concentric target lesions on foliage with chlorotic yellow halo.',
    badge: 'Disease Sample',
    expectedStatus: 'valid'
  },
  {
    id: 'sample_potato_late_blight',
    title: 'Potato: Late Blight',
    crop: 'Potato',
    diseaseId: 'potato_late_blight',
    path: '/samples/potato_late_blight.jpg',
    description: 'Phytophthora dark water-soaked necrotic lesions and mildew margins.',
    badge: 'High Severity',
    expectedStatus: 'valid'
  },
  {
    id: 'sample_healthy_tomato',
    title: 'Tomato: Healthy Leaf',
    crop: 'Tomato',
    diseaseId: 'healthy_tomato',
    path: '/samples/healthy_tomato_leaf.jpg',
    description: 'Vibrant chlorophyll, intact venation, no fungal spots or deficiencies.',
    badge: 'Healthy Baseline',
    expectedStatus: 'valid'
  },
  {
    id: 'sample_corn_common_rust',
    title: 'Corn: Common Rust',
    crop: 'Corn (Maize)',
    diseaseId: 'corn_common_rust',
    path: '/samples/corn_common_rust.jpg',
    description: 'Prominent cinnamon-brown powdery pustules erupting across leaf surface.',
    badge: 'Disease Sample',
    expectedStatus: 'valid'
  },
  {
    id: 'sample_apple_scab',
    title: 'Apple: Apple Scab',
    crop: 'Apple',
    diseaseId: 'apple_scab',
    path: '/samples/apple_scab.jpg',
    description: 'Olive-green to velvety dark circular scab lesions on leaf lamina.',
    badge: 'Disease Sample',
    expectedStatus: 'valid'
  },
  {
    id: 'sample_grape_black_rot',
    title: 'Grape: Black Rot',
    crop: 'Grape',
    diseaseId: 'grape_black_rot',
    path: '/samples/grape_black_rot.jpg',
    description: 'Circular reddish-tan spots with dark border and visible pycnidia specks.',
    badge: 'Disease Sample',
    expectedStatus: 'valid'
  }
];

export const ERROR_TEST_CASES = [
  {
    id: 'test_blurry_image',
    title: 'Simulate Blurry Photo',
    type: 'blurry',
    description: 'Severely out-of-focus capture. Tests edge sharpness and blur validation.',
    badge: 'Quality Error'
  },
  {
    id: 'test_non_plant_image',
    title: 'Simulate Non-Plant Image',
    type: 'non_plant',
    description: 'Solid wall / paper / screenshot. Tests vegetation chromaticity rejection.',
    badge: 'Invalid Subject'
  },
  {
    id: 'test_low_resolution',
    title: 'Simulate Low Resolution',
    type: 'low_res',
    description: 'Extremely pixelated tiny icon. Tests resolution validation threshold.',
    badge: 'Format Error'
  }
];
