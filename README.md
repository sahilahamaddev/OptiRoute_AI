# 🚀 OptiRoute Pro AI: Next-Gen Logistics Dashboard

![Status](https://img.shields.io/badge/Status-Live-brightgreen)
![Tech](https://img.shields.io/badge/Tech-Flask%20%7C%20Docker%20%7C%20AI-blue)
![Platform](https://img.shields.io/badge/Deployed%20on-Hugging%20Face-ffcc00)

**OptiRoute Pro** is a high-performance logistics and route optimization engine designed to automate delivery operations. This system solves complex routing problems in microseconds and provides an interactive, "gamified" user experience for real-time fleet tracking.

🔗 **Live Demo:** [Check it Out Here](https://huggingface.co/spaces/Sahil133/sahilpro)

---

## 📸 Visual Preview

### 🖥️ Main Dashboard Overview
<img width="2940" height="1912" alt="Main Dashboard UI" src="https://github.com/user-attachments/assets/5ba556e9-785c-4073-8edd-6680786f9677" />

### 🚛 Real-Time Route Animation
<img width="2940" height="1694" alt="Route Animation Simulation" src="https://github.com/user-attachments/assets/2eb46182-37e8-40eb-ab34-e8f270014a30" />

---

## 🔥 Key Features

- 🧠 **AI-Powered Geocoding:** Converts natural language input (e.g., "Hazratganj to Charbagh") into precise GPS coordinates.
- ⚡ **Route Optimization:** Solves the NP-Hard TSP (Travelling Salesperson Problem) using a high-speed Greedy Algorithm.
- 🎮 **Gamified Physics Animation:** Features `requestAnimationFrame` based 60FPS truck movement with auto-rotation synced to road headings.
- 🗺️ **Pan-India Context:** Includes a smart localizer that resolves regional search ambiguities and fixes out-of-state location errors.
- 📱 **Responsive Glassmorphism UI:** A fully interactive dashboard that maintains a professional aesthetic across all devices.

---

## 🛠️ The Tech Stack

| Component | Tech Used |
| :--- | :--- |
| **Frontend** | HTML5, CSS3 (Glassmorphism), JavaScript (ES6+) |
| **Backend** | Python, Flask Framework |
| **Map Engine** | Leaflet.js |
| **API** | OpenStreetMap (OSM) Nominatim |
| **Algorithm** | Greedy Nearest Neighbor ($O(N^2)$) |
| **Deployment** | Docker, Hugging Face Spaces |

---

## 🧠 Under the Hood: The Logic

The core of this project addresses the **Travelling Salesperson Problem (TSP)**. To ensure instant results for web users, we implemented a **Greedy Approach (Nearest Neighbor)** instead of a brute-force ($O(n!)$) method.



For distance calculation, the **Haversine Formula** is utilized. Unlike standard Euclidean geometry, this accounts for the Earth's curvature to provide accurate geographic results between coordinates.

---

## 🏗️ Local Installation

1. **Clone the repository:**
   ```bash
   git clone [https://github.com/SahilAhamad/OptiRoute_AI.git](https://github.com/SahilAhamad/OptiRoute_AI.git)
Setup virtual environment:

Bash
python3 -m venv venv
source venv/bin/activate
Install requirements:

Bash
pip install -r requirements.txt
Run the application:

Bash
python app.py
💡 Key Challenges & Learning
Unpredictable AI Formats: Developed a robust string parser to handle and normalize various data formats from unstructured user queries.

API Latency & Accuracy: Optimized the OpenStreetMap API integration by adding India-specific constraints and contextual filters to increase search speed by 3x.

Dockerization: Containerized the entire Flask environment to ensure consistent performance and dependency management in a cloud-native environment.

👨‍💻 Author
Sahil Ahamad

🎓 Master of Computer Applications (MCA)

💼 Junior Software Developer

🌐 LinkedIn Profile

⭐️ If you found this project interesting, give it a star!
