# UK Railway Stations Data Collection Guide

This guide provides instructions for sourcing and integrating a complete list of UK railway stations with CRS codes into the StationBoard application.

## Overview

The current `stations.json` file contains only 11 sample stations. To make the application fully functional, we need to add approximately **2,500+ UK railway stations** with their CRS (Computer Reservation System) codes.

## Data Requirements

Each station entry should include:
- **crs**: 3-letter station code (e.g., "PAD", "KGX", "EUS")
- **name**: Full station name (e.g., "London Paddington")
- **description**: Display name (typically same as name)
- **category**: Station category (e.g., "A", "B", "C") - indicates station importance/size

### Current Data Structure

```json
{
  "crs": "PAD",
  "name": "London Paddington",
  "description": "London Paddington",
  "category": "A"
}
```

## Data Sources

### Option 1: National Rail Enquiries API

The official National Rail Enquiries API provides station data:

**Endpoint**: `http://datafeeds.networkrail.co.uk/feeds/station_codes.xml`

This XML file contains all UK station codes but requires parsing.

**Access**: Requires registration at https://datafeeds.networkrail.co.uk/

**Usage**:
```bash
curl -u username:password http://datafeeds.networkrail.co.uk/feeds/station_codes.xml -o station_codes.xml
```

### Option 2: Open Data Portal (Department for Transport)

The UK government provides open railway data:

**Link**: https://www.gov.uk/government/statistical-data-sets/rail-station-usage-data

Contains:
- Station usage statistics
- Station names and codes
- Geographic data

**Format**: CSV available for download

### Option 3: Community Datasets

Several community-maintained datasets on GitHub:

1. **UK Train Station Locations**
   - Repository: Search GitHub for "UK train station locations"
   - Format: JSON/CSV
   - May include latitude/longitude

2. **National Rail Station Codes**
   - Various repositories with CRS code mappings
   - Search: "national rail station codes json"

### Option 4: Scraping National Rail Website

National Rail Enquiries website contains a searchable list:
- https://www.nationalrail.co.uk/stations_destinations/

**Note**: Check robots.txt and terms of service before scraping

## Implementation Steps

### Step 1: Download the Data

Choose one of the sources above and download the station data in JSON or CSV format.

### Step 2: Data Transformation Script

Create a script to convert the downloaded data into the required JSON format.

**Example script** (if starting from CSV):

```javascript
// convert-stations.js
const fs = require('fs');
const csv = require('csv-parser');

const stations = [];

fs.createReadStream('stations.csv')
  .pipe(csv())
  .on('data', (row) => {
    stations.push({
      crs: row.CRS || row.crs,
      name: row.Name || row.name,
      description: row.Description || row.Name || row.name,
      category: row.Category || row.category || 'C'
    });
  })
  .on('end', () => {
    fs.writeFileSync('stations.json', JSON.stringify(stations, null, 2));
    console.log(`Converted ${stations.length} stations`);
  });
```

### Step 3: Validate the Data

Ensure all entries have:
- Valid CRS codes (3 letters, uppercase)
- Non-empty name field
- Proper formatting

**Validation script**:

```javascript
// validate-stations.js
const stations = require('./stations.json');

const errors = [];

stations.forEach((station, index) => {
  if (!station.crs || station.crs.length !== 3) {
    errors.push(`Station at index ${index} has invalid CRS: ${station.crs}`);
  }
  if (!station.name) {
    errors.push(`Station at index ${index} missing name`);
  }
  if (station.crs !== station.crs.toUpperCase()) {
    console.warn(`Station ${station.crs} has lowercase CRS code`);
  }
});

if (errors.length > 0) {
  console.error('Validation errors:', errors);
  process.exit(1);
}

console.log(`✓ Validated ${stations.length} stations`);
```

### Step 4: Sort and Clean the Data

Sort alphabetically and ensure unique entries:

```javascript
// clean-stations.js
const stations = require('./stations.json');

// Remove duplicates based on CRS code
const uniqueStations = Array.from(
  new Map(stations.map(station => [station.crs, station])).values()
);

// Sort alphabetically by name
uniqueStations.sort((a, b) => a.name.localeCompare(b.name));

console.log(`Reduced from ${stations.length} to ${uniqueStations.length} unique stations`);

// Write to file
require('fs').writeFileSync(
  'stations.json',
  JSON.stringify(uniqueStations, null, 2)
);
```

### Step 5: Update the Application

Once you have the complete stations.json file:

1. Replace `backend/src/data/stations.json` with the new file
2. Restart the backend service
3. Test the station selector to ensure all stations are searchable

## Testing the Import

After importing the data, test:

1. **Station Search**: Navigate to `/` and search for various stations
2. **CRS Codes**: Verify that common stations (PAD, KGX, EUS, etc.) work
3. **Display**: Check that station names display correctly
4. **Performance**: Ensure search is responsive with ~2,500 stations

## Expected Results

After successful import, you should have:

- **~2,580** total stations (as of National Rail counts)
- All major stations (category A and B)
- Regional and branch line stations (category C)
- Heritage and preserved railways included
- London Underground, Glasgow Subway connections where applicable

## File Size Considerations

With ~2,500 stations:
- **Minified JSON**: ~200KB
- **Formatted JSON**: ~400KB
- **With coordinates**: ~600KB

This is well within acceptable limits for a web application.

## Categories Reference

- **Category A**: Major stations (typically 10M+ passenger entries per year)
- **Category B**: Moderate stations (500K-10M entries)
- **Category C**: Small stations (<500K entries)

## Automation

Consider creating an automated update process:

```bash
#!/bin/bash
# update-stations.sh

# Download latest data
curl -o stations_raw.json "https://api.example.com/stations"

# Convert to our format
node convert-stations.js

# Validate
node validate-stations.js

# Update in project
cp stations.json backend/src/data/

# Restart backend
docker-compose restart backend
```

## Alternative: Use Live API

Instead of maintaining a static list, consider using the National Rail API to:
- Search for stations dynamically
- Lookup CRS codes on demand
- Always have up-to-date station information

This would require modifying the `StationSelector` component to call an API endpoint.

## Legal Considerations

- **Data Licensing**: Ensure the data source allows redistribution
- **Attribution**: Include appropriate credits if required
- **Terms of Service**: Check API usage limits and restrictions

## Support

For issues or questions:
- Check the National Rail Enquiries API documentation
- Review Network Rail data feeds documentation
- Consult UK railway data community forums

---

**Last Updated**: $(date)
**Total Stations Needed**: ~2,500
**Current Stations**: 11 (sample data)


