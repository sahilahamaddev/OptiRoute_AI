# 🚀 OptiRoute Pro AI: Next-Gen Logistics Dashboard

![Status](https://img.shields.io/badge/Status-Live-brightgreen)
![Tech](https://img.shields.io/badge/Tech-Flask%20%7C%20Docker%20%7C%20AI-blue)
![Platform](https://img.shields.io/badge/Deployed%20on-Hugging%20Face-ffcc00)

**OptiRoute Pro** ek high-performance logistics aur route optimization engine hai jo delivery operations ko automate karne ke liye banaya gaya hai. Ye system complex route problems ko microseconds mein solve karta hai aur ek interactive "Gamified" experience deta hai.

🔗 **Live Demo:** [Check it Out Here](https://huggingface.co/spaces/Sahil133/sahilpro)

---

## 📸 Visual Preview
### 🖥️ Main Dashboard Overview
<img width="2940" height="1912" alt="image" src="https://github.com/user-attachments/assets/5ba556e9-785c-4073-8edd-6680786f9677" />


### 🚛 Real-Time Route Animation
<img width="2940" height="1694" alt="image" src="https://github.com/user-attachments/assets/2eb46182-37e8-40eb-ab34-e8f270014a30" />

---

## 🔥 Key Features

- 🧠 **AI-Powered Geocoding:** Natural language input (e.g., "Hazratganj to Charbagh") ko map coordinates mein badalta hai.
- ⚡ **Route Optimization:** NP-Hard TSP (Travelling Salesperson Problem) ko Greedy Algorithm ke zariye solve karta hai.
- 🎮 **Gamified Physics Animation:** 60FPS `requestAnimationFrame` based truck movement jo road ke heading ke hisaab se auto-rotate hota hai.
- 🗺️ **Pan-India Context:** Smart localizer jo regional search ambiguities (500km errors) ko solve karta hai.
- 📱 **Responsive Glassmorphism UI:** Fully interactive dashboard jo har device par ekdum professional lagta hai.

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

Is project ka dil **Travelling Salesperson Problem (TSP)** hai. Humne brute-force ($O(n!)$) ke bajaye ek **Greedy Approach** use ki hai taaki result instantly mile. 



Distance calculation ke liye humne **Haversine Formula** ka use kiya hai jo Earth ke curvature ko consider karke exact results deta hai.

---

## 🏗️ Local Installation

1. Repo clone karein:
   ```bash
   git clone [https://github.com/SahilAhamad/OptiRoute_AI.git](https://github.com/SahilAhamad/OptiRoute_AI.git)
Virtual environment setup karein:

Bash
python3 -m venv venv
source venv/bin/activate
Requirements install karein:

Bash
pip install -r requirements.txt
App run karein:

Bash
python app.py
💡 Key Challenges & Learning
Unpredictable AI Formats: Different data formats ko handle karne ke liye robust parser banaya.

API Latency: OpenStreetMap API ko optimize kiya aur India-specific constraints add kiye speed badhane ke liye.

Dockerization: Poore Flask environment ko containerize kiya taaki kisi bhi machine par bina error ke chale.

👨‍💻 Author
Sahil Ahamad

🎓 Master of Computer Applications (MCA)

💼 Junior Software Developer

🌐 LinkedIn Profile

⭐️ If you found this project interesting, give it a star!
