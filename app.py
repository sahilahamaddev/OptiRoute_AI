from flask import Flask, render_template, request, jsonify
from algorithms import solve_tsp_greedy
import requests
import re

app = Flask(__name__)

# ==========================================
# PAN-INDIA FAST GEOCODER (No API Key Needed)
# ==========================================
def get_coordinates_free(query):
    # Split ONLY by 'and', 'to', '&'. 
    # Comma (,) is REMOVED so users can search exact addresses like "Koramangala, Bangalore"
    raw_places = re.split(r'\s+and\s+|\s+to\s+|\s*&\s*', query, flags=re.IGNORECASE)
    places = [p.strip() for p in raw_places if p.strip()]

    coords = []
    headers = {'User-Agent': 'OptiRoute_PanIndia_Dashboard/4.0'}

    try:
        for place in places:
            # India context explicitly added for better accuracy
            search_query = f"{place}, India" if "india" not in place.lower() else place

            print(f"DEBUG: Locating -> '{search_query}'")
            
            # THE SPEED HACK: Added '&countrycodes=in' to strictly search within India.
            # This makes the API response much faster as it ignores the rest of the world.
            url = f"https://nominatim.openstreetmap.org/search?q={search_query}&format=json&limit=1&countrycodes=in"
            
            response = requests.get(url, headers=headers, timeout=10)
            res_data = response.json()
            
            if res_data and len(res_data) > 0:
                lat, lon = float(res_data[0]['lat']), float(res_data[0]['lon'])
                coords.append([lat, lon])
                print(f"DEBUG: Found -> [{lat}, {lon}]")
            else:
                print(f"DEBUG: Could not find '{search_query}'")
                
        return coords if len(coords) > 0 else None
                
    except Exception as e:
        print(f"DEBUG: Request Error: {e}")
        return None

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/solve', methods=['POST'])
def solve():
    data = request.json
    coords = data.get('coords', [])
    
    if len(coords) < 2:
        return jsonify({"error": "Select at least 2 points"}), 400
        
    route_indices, distance, exec_time = solve_tsp_greedy(coords)
    route_coords = [coords[i] for i in route_indices]
    
    return jsonify({
        "route_coords": route_coords, 
        "distance": round(distance, 2), 
        "time": round(exec_time, 4)
    })

@app.route('/ai_search', methods=['POST'])
def ai_search():
    user_query = request.json.get('query')
    if not user_query:
        return jsonify({"error": "Empty Query"}), 400

    coords = get_coordinates_free(user_query)
    
    if coords:
        return jsonify({"coords": coords})
    else:
        return jsonify({"error": "Location not found. Try adding the city name (e.g., 'Andheri, Mumbai')."}), 400

if __name__ == '__main__':
    app.run(debug=True, port=5000)