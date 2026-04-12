let map = L.map('map', {zoomControl: false}).setView([26.8467, 80.9462], 13); 
L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png').addTo(map);

let points = [];
let pointNames = []; 
let markers = [];
let polyline = null;
let truckMarker = null;
let optimizedRoute = [];

// Magic: Truck Body Wrapper added for Rotation
const createIcon = (type) => L.divIcon({
    className: `custom-marker ${type}`,
    html: type === 'warehouse' ? '<i class="fa-solid fa-building-user"></i>' : 
          type === 'truck' ? '<div id="truck-body"><i class="fa-solid fa-truck-fast"></i></div>' : '<i class="fa-solid fa-box"></i>',
    iconSize: [40, 40],
    iconAnchor: [20, 20]
});

function showToast(message) {
    let toast = document.getElementById("toast");
    toast.innerText = message;
    toast.className = "toast show";
    setTimeout(() => { toast.className = toast.className.replace("show", ""); }, 3000);
}

map.on('click', (e) => {
    addMarker(e.latlng.lat, e.latlng.lng, `Drop ${points.length}`);
});

function addMarker(lat, lng, placeName) {
    let isWarehouse = points.length === 0;
    let type = isWarehouse ? 'warehouse' : 'package';
    let marker = L.marker([lat, lng], {icon: createIcon(type)}).addTo(map);
    
    let labelText = isWarehouse ? `🏢 Hub: ${placeName}` : `📦 ${placeName}`;
    marker.bindTooltip(labelText, { permanent: true, direction: 'top', offset: [0, -25], className: 'custom-tooltip' }).openTooltip();

    markers.push(marker);
    points.push([lat, lng]);
    pointNames.push(placeName); 
    document.getElementById('count').innerText = points.length;
}

function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; 
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return (R * c).toFixed(2);
}

function generateTimeline(routeCoords) {
    const logContainer = document.getElementById('route-log');
    logContainer.innerHTML = ""; 

    let totalCalculatedDistance = 0;

    for (let i = 0; i < routeCoords.length - 1; i++) {
        let p1 = routeCoords[i];
        let p2 = routeCoords[i+1];
        
        let segmentDist = calculateDistance(p1[0], p1[1], p2[0], p2[1]);
        totalCalculatedDistance += parseFloat(segmentDist);
        let segmentTime = Math.ceil(segmentDist * 2.5); 
        
        let name1 = pointNames.find((_, idx) => Math.abs(points[idx][0] - p1[0]) < 0.001) || `Stop ${i+1}`;
        let name2 = pointNames.find((_, idx) => Math.abs(points[idx][1] - p2[1]) < 0.001) || `Stop ${i+2}`;

        let logEntry = document.createElement('div');
        logEntry.className = 'log-entry';
        logEntry.id = `log-entry-${i}`;
        logEntry.style.animationDelay = `${i * 0.15}s`; 
        
        logEntry.innerHTML = `
            <div class="dot"></div>
            <div class="route-details">
                <p class="route-names">
                    ${name1} <i class="fa-solid fa-arrow-right-long route-arrow"></i> ${name2}
                </p>
                <div>
                    <span class="route-badge dist"><i class="fa-solid fa-map-pin"></i> ${segmentDist} km</span>
                    <span class="route-badge time"><i class="fa-solid fa-clock"></i> ~${segmentTime} min</span>
                </div>
            </div>
        `;
        logContainer.appendChild(logEntry);
    }
    return totalCalculatedDistance.toFixed(2);
}

// Update Active log visually
function updateActiveLog(currentIndex) {
    let allLogs = document.querySelectorAll('.log-entry');
    allLogs.forEach((log, index) => {
        log.classList.remove('active');
        if (index < currentIndex) {
            log.classList.add('completed');
        } else if (index === currentIndex) {
            log.classList.add('active');
            // Auto scroll to active log
            log.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    });
}

async function optimize() {
    if(points.length < 2) return showToast("⚠️ Add at least 2 locations!");

    showToast("⚙️ AI Optimizing Route...");
    document.getElementById('route-log').innerHTML = '<p class="empty-msg"><i class="fa-solid fa-spinner fa-spin"></i> Calculating path...</p>';

    try {
        const res = await fetch('/solve', { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({coords: points}) });
        const data = await res.json();
        
        if(data.route_coords) {
            optimizedRoute = data.route_coords;
            if(polyline) map.removeLayer(polyline);
            
            polyline = L.polyline(optimizedRoute, { color: '#00f2fe', weight: 5, opacity: 0.9, className: 'animated-route' }).addTo(map);
            map.fitBounds(polyline.getBounds(), {padding: [50, 50]});

            let realTotalDist = generateTimeline(optimizedRoute);
            
            document.getElementById('dist').innerText = realTotalDist + " km";
            document.getElementById('sim-btn').disabled = false;
            showToast("✅ Route Calculated!");
        }
    } catch (err) {
        showToast("❌ Optimization Failed!");
    }
}

// ==========================================
// THE REALISTIC PHYSICS ENGINE
// ==========================================
function simulateDelivery() {
    if(!optimizedRoute.length) return;
    
    document.getElementById('sim-btn').disabled = true;
    showToast("🚀 Dispatching Vehicle!");

    if(truckMarker) map.removeLayer(truckMarker);
    truckMarker = L.marker(optimizedRoute[0], {icon: createIcon('truck'), zIndexOffset: 1000}).addTo(map);
    
    let currentSegment = 0;
    let progress = 0; 
    let baseSpeed = parseFloat(document.getElementById('sim-speed').value); // Dynamic Speed

    function animateFrame() {
        if (currentSegment >= optimizedRoute.length - 1) {
            showToast("🎉 Delivery Completed!");
            updateActiveLog(999); // Mark all complete
            document.getElementById('sim-btn').disabled = false;
            return;
        }

        updateActiveLog(currentSegment); // Highlight Timeline

        let p1LatLng = L.latLng(optimizedRoute[currentSegment]);
        let p2LatLng = L.latLng(optimizedRoute[currentSegment + 1]);

        // Calculate Physics (Decelerate slightly as it reaches 1)
        let easeProgress = progress < 0.5 ? 2 * progress * progress : -1 + (4 - 2 * progress) * progress; // Ease In-Out Quad
        if (easeProgress > 1) easeProgress = 1;

        // Smooth Interpolation Formula
        let lat = p1LatLng.lat + (p2LatLng.lat - p1LatLng.lat) * easeProgress;
        let lng = p1LatLng.lng + (p2LatLng.lng - p1LatLng.lng) * easeProgress;
        truckMarker.setLatLng([lat, lng]);

        // Calculate Rotation (Screen pixels math for accuracy)
        let pt1 = map.latLngToLayerPoint(p1LatLng);
        let pt2 = map.latLngToLayerPoint(p2LatLng);
        let angleDeg = Math.atan2(pt2.y - pt1.y, pt2.x - pt1.x) * 180 / Math.PI;

        // Apply Rotation to the HTML element inside the marker
        let truckDOM = document.getElementById('truck-body');
        if (truckDOM) {
            // Flip the icon if it's moving left so the truck isn't driving upside down!
            if (angleDeg > 90 || angleDeg < -90) {
                truckDOM.style.transform = `rotate(${angleDeg}deg) scaleY(-1)`;
            } else {
                truckDOM.style.transform = `rotate(${angleDeg}deg) scaleY(1)`;
            }
        }

        // Advance Progress
        progress += baseSpeed;

        if (progress >= 1) {
            progress = 0; // Reset for next segment
            currentSegment++;
            // Pause slightly at each stop
            setTimeout(() => { requestAnimationFrame(animateFrame); }, 500);
        } else {
            requestAnimationFrame(animateFrame); // Loop at 60 FPS
        }
    }

    setTimeout(() => { requestAnimationFrame(animateFrame); }, 500);
}

// AI Integration
async function askAI() {
    const query = document.getElementById('ai-input').value;
    if(!query) return showToast("✍️ Please enter locations!");

    const btn = document.getElementById('ai-btn');
    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i>';
    
    let placeNames = query.split(/ and | to |,|&/i).map(s => s.trim()).filter(s => s);

    try {
        const res = await fetch('/ai_search', { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({query}) });
        const data = await res.json();
        
        if(data.coords && data.coords.length > 0) {
            data.coords.forEach((c, index) => {
                let name = placeNames[index] ? placeNames[index] : `Location ${index + 1}`;
                addMarker(c[0], c[1], name);
            });
            setTimeout(optimize, 800); 
            document.getElementById('ai-input').value = "";
        } else {
            showToast("🤖 Location not found.");
        }
    } catch (err) {
        showToast("⚠️ Network Error");
    } finally {
        btn.innerHTML = '<i class="fa-solid fa-wand-magic-sparkles"></i> AI';
    }
}

function reset() { location.reload(); }

document.getElementById("ai-input").addEventListener("keypress", function(event) {
    if (event.key === "Enter") { event.preventDefault(); askAI(); }
});