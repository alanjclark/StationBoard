#!/usr/bin/env python3
"""
Script to remove duplicate station entries from stations.json
"""

import json

def main():
    # Read stations
    with open('backend/src/data/stations.json', 'r') as f:
        stations = json.load(f)
    
    print(f"Original station count: {len(stations)}")
    
    # Remove duplicates - keep first occurrence
    seen_crs = set()
    unique_stations = []
    
    for station in stations:
        crs = station['crs']
        if crs not in seen_crs:
            seen_crs.add(crs)
            unique_stations.append(station)
        else:
            print(f"Removing duplicate: {crs} - {station['name']}")
    
    print(f"Unique station count: {len(unique_stations)}")
    print(f"Removed {len(stations) - len(unique_stations)} duplicates")
    
    # Write back to file
    with open('backend/src/data/stations.json', 'w') as f:
        json.dump(unique_stations, f, indent=2)
    
    print("Fixed stations.json")

if __name__ == '__main__':
    main()

