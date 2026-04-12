import numpy as np
import time

def calculate_distance(p1, p2):
    # p1, p2 are [lat, lon]
    return np.sqrt((p1[0]-p2[0])**2 + (p1[1]-p2[1])**2)

def solve_tsp_greedy(points):
    n = len(points)
    if n < 2: return list(range(n)), 0, 0
    
    start_time = time.time()
    unvisited = list(range(1, n))
    route = [0]
    total_distance = 0
    
    current_node = 0
    while unvisited:
        next_node = min(unvisited, key=lambda x: calculate_distance(points[current_node], points[x]))
        dist = calculate_distance(points[current_node], points[next_node])
        total_distance += dist
        current_node = next_node
        unvisited.remove(next_node)
        route.append(next_node)
        
    # Return to start
    total_distance += calculate_distance(points[route[-1]], points[0])
    route.append(0)
    
    execution_time = (time.time() - start_time) * 1000
    return route, total_distance, execution_time