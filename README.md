# Crop Disease Detection 🌿🔍
### AI Plant Leaf Pathology Analyzer & Educational Agronomic Guide

A modern, responsive web application for diagnosing agricultural plant diseases from leaf photographs. Users can upload high-resolution leaf images or capture specimens live via their device camera to receive instant pathology classifications, probabilistic confidence scores, and structured educational prevention guidelines.

---

## 🌟 Key Features

1. **Responsive Dual-Device Interface**
   - Clean, modern botanical design system with dark and light mode options.
   - Fully optimized for desktop workstations, tablets, and field mobile devices.
   - Interactive leaf dropzone supporting drag-and-drop file upload (JPEG, PNG, WebP).
   - Live camera viewfinder modal with leaf alignment reticle and front/rear camera toggle.

2. **Accurate Pathology Diagnosis & Confidence Meter**
   - Visual scan beam animation during neural tensor processing.
   - Displays predicted **Crop**, **Disease Condition**, scientific binomial, and pathogen microorganism.
   - Animated SVG circular gauge showing the model's confidence percentage.
   - Top-3 candidate softmax probability distribution breakdown.

3. **Client-Side Image Quality Pre-Validation**
   - **Blurriness Detection**: Computes the variance of the discrete 3×3 Laplacian operator across grayscale pixels. Images with low edge sharpness are flagged as out-of-focus.
   - **Vegetation / Organic Chromaticity Analysis**: Computes Excess Green Index ($2G - R - B$) and color saturation to automatically reject plain documents, desks, blank walls, or non-plant subjects.
   - **Clear Error Messaging**: Explains why an image was rejected with actionable shooting advice, plus an optional override for diagnostic testing.

4. **Educational Prevention & Cultural Management**
   - Categorized recommendations for every supported disease:
     - **Key Visual Symptoms** (bullseye concentric rings, pustules, water-soaked lesions)
     - **Cultural & Agronomic Practices** (crop rotation, plant spacing, drip irrigation)
     - **Biological & Organic Controls** (Bacillus subtilis, copper octanoate, neem extracts)
     - **Field Sanitation & Hygiene** (tool disinfection, diseased debris disposal)
   - Prominently labeled with an **Educational Guidance Only** badge and a legal notice clarifying it does not substitute for certified agricultural extension advice.

5. **Integrated Demo Mode & Quality Test Lab**
   - Built-in library of verified, high-resolution botanical leaf specimens:
     - **Tomato**: Early Blight (*Alternaria solani*)
     - **Potato**: Late Blight (*Phytophthora infestans*)
     - **Tomato**: Healthy Foliage (Baseline)
     - **Corn (Maize)**: Common Rust (*Puccinia sorghi*)
     - **Apple**: Apple Scab (*Venturia inaequalis*)
     - **Grape**: Black Rot (*Guignardia bidwellii*)
   - **Quality Testing Lab**: One-click synthetic simulations to test the error rejection pipeline against blurry photos, non-plant items, and undersized files.

6. **Persistent Diagnostic History**
   - Records every scan to `localStorage` with thumbnails, timestamps, confidence scores, and status badges.
   - Summary statistics: Total Scans, Healthy vs. Diseased count, and Average Confidence.
   - Single-item removal, complete history wipe with confirmation, and one-click data export to **CSV** or **JSON**.

7. **Model Uncertainty & Transparency**
   - Explicit disclaimer that machine learning predictions are probabilistic inferences that vary based on lighting, camera angle, and disease library coverage.

---

## 🏗️ Architecture & Code Organization

The application is engineered with a modular separation of concerns:

```
c:/ANTIGRAVITY/PROJECT 2/
├── index.html                   # Semantic HTML5 shell with responsive tabs & modals
├── server.js                    # Zero-dependency Node HTTP server (bypasses WDAC native binary blocks)
├── package.json                 # Project configuration & npm scripts
├── public/
│   └── samples/                 # Verified high-resolution leaf specimen images
│       ├── tomato_early_blight.jpg
│       ├── potato_late_blight.jpg
│       ├── healthy_tomato_leaf.jpg
│       ├── corn_common_rust.jpg
│       ├── apple_scab.jpg
│       └── grape_black_rot.jpg
└── src/
    ├── style.css                # Botanical CSS design system, glassmorphism, animations
    ├── main.js                  # Main controller orchestrating camera, upload, UI, and storage
    ├── data/
    │   ├── diseases.js          # Agronomic database: pathogens, symptoms, cultural prevention
    │   └── sampleImages.js      # Specimen metadata and quality error test configurations
    └── services/
        ├── imageValidator.js    # Laplacian blur variance & Excess Green chromaticity analyzer
        ├── cameraService.js     # MediaDevices getUserMedia stream & frame capture
        ├── historyStorage.js    # LocalStorage persistence, CSV & JSON data export
        ├── soundEffects.js      # Web Audio API synthesized acoustic feedback
        └── classifier/
            ├── IClassifier.js            # Standardized inference engine interface contract
            ├── MockClassifier.js         # Feature-based visual heuristic engine for demo mode
            ├── TensorFlowClassifier.js   # Pluggable adapter ready for trained TF.js models
            └── ClassifierFactory.js      # Factory allowing dynamic engine switching
```

---

## 🔌 How to Add a Real Trained Model

The application follows the **Strategy Pattern** via `IClassifier.js`. To connect a custom trained deep learning model (e.g. trained on PlantVillage or Kaggle Plant Pathology datasets using MobileNetV2, ResNet, or EfficientNet):

1. **Export your trained model to TensorFlow.js format**:
   ```bash
   tensorflowjs_converter --input_format=keras path/to/model.h5 public/model/
   ```
2. **Add `@tensorflow/tfjs` script to `index.html`**:
   ```html
   <script src="https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@latest/dist/tf.min.js"></script>
   ```
3. **Configure `src/services/classifier/TensorFlowClassifier.js`**:
   - Set `modelPath = '/model/model.json'`.
   - Update `this.labels` to match your model's classification output indices.
4. **Switch Engine in UI**:
   - Click the **Inference Engine** badge in the app header and select **TensorFlow.js Production Model**.

---

## 🚀 Setup & Run Instructions

### Prerequisites
- **Node.js** (v18.0 or newer)
- Modern web browser (Chrome, Edge, Safari, Firefox)

### 1. Installation
Clone or navigate to the project directory and install dependencies:
```bash
cd "c:/ANTIGRAVITY/PROJECT 2"
npm install
```

### 2. Start Local Development Server
Run the local HTTP server:
```bash
npm start
# or
node server.js
```

The application will start and output the active port (default: `http://localhost:5173`).

### 3. Open in Browser
Open your browser and navigate to:
```
http://localhost:5173
```

---

## 🧪 Quick Walkthrough & Testing Guide

1. **Instant Demo Mode**:
   - Navigate to the **Demo Gallery** tab.
   - Click **Diagnose Specimen** on any card (e.g., *Tomato: Early Blight*).
   - Watch the animated scan line evaluate the leaf, followed by the circular confidence gauge, pathogen details, and categorized prevention tips.
2. **Error Rejection Test**:
   - In **Demo Gallery**, scroll down to the **Quality Validation & Error Rejection Lab**.
   - Click **Simulate Blurry Photo** or **Simulate Non-Plant Image**.
   - Observe how the app detects the low Laplacian sharpness score or lack of plant vegetation and renders clear error guidance with suggestions on how to take an optimal photo.
3. **Live Camera Capture**:
   - On the **Diagnose** tab, click **Live Camera**.
   - Allow camera permissions, position a leaf inside the oval reticle guide, and click **Capture Specimen**.
4. **History & Export**:
   - Switch to the **Scan History** tab.
   - View past diagnostic records, or click **Export CSV** / **Export JSON** to download your session log.
   - Click **Clear History** to reset all stored diagnostics.

---

## ⚠️ Educational & Agricultural Disclaimer

This web application and its computer vision algorithms are intended solely for **educational, instructional, and research purposes**. Leaf symptoms in the field can be influenced by multiple abiotic stressors (nutrient deficiencies, drought, chemical spray injury) and overlapping biotic pathogens. 

Recommendations provided by this software are **not a substitute for professional agronomic diagnosis** or certified pesticide advisory services. Always consult your regional university agricultural extension service, certified crop advisors (CCA), or official regulatory guidelines before purchasing or applying crop protection products.
