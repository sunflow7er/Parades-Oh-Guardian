import json
import sqlite3
from pathlib import Path

class LocationDatabase:
    """
    Comprehensive database of world cities with NASA data integration
    """
    
    def __init__(self):
        self.db_path = Path('data/locations.db')
        self.db_path.parent.mkdir(exist_ok=True)
        self.init_database()
    
    def init_database(self):
        """Initialize SQLite database with world cities"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        # Create cities table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS cities (
                id INTEGER PRIMARY KEY,
                name TEXT NOT NULL,
                country_code TEXT NOT NULL,
                country_name TEXT NOT NULL,
                latitude REAL NOT NULL,
                longitude REAL NOT NULL,
                population INTEGER,
                timezone TEXT,
                elevation INTEGER,
                climate_zone TEXT,
                nasa_data_available BOOLEAN DEFAULT 1
            )
        ''')
        
        # Insert major world cities
        cities_data = self.get_world_cities()
        cursor.executemany('''
            INSERT OR REPLACE INTO cities 
            (name, country_code, country_name, latitude, longitude, population, timezone, elevation, climate_zone)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', cities_data)
        
        conn.commit()
        conn.close()
    
    def get_world_cities(self):
        """Return comprehensive list of world cities"""
        return [
            # Kazakhstan - Major cities
            ('Almaty', 'KZ', 'Kazakhstan', 43.2220, 76.8512, 1916000, 'Asia/Almaty', 768, 'Continental'),
            ('Nur-Sultan (Astana)', 'KZ', 'Kazakhstan', 51.1694, 71.4491, 1136000, 'Asia/Almaty', 347, 'Continental'),
            ('Shymkent', 'KZ', 'Kazakhstan', 42.3000, 69.6000, 1002000, 'Asia/Almaty', 538, 'Continental'),
            ('Karaganda', 'KZ', 'Kazakhstan', 49.8047, 73.1094, 497000, 'Asia/Almaty', 553, 'Continental'),
            ('Oral (Uralsk)', 'KZ', 'Kazakhstan', 51.2167, 51.3667, 245000, 'Asia/Oral', 36, 'Continental'),
            ('Taraz', 'KZ', 'Kazakhstan', 42.9000, 71.3667, 358153, 'Asia/Almaty', 661, 'Continental'),
            ('Pavlodar', 'KZ', 'Kazakhstan', 52.3000, 76.9500, 335000, 'Asia/Almaty', 124, 'Continental'),
            ('Semey', 'KZ', 'Kazakhstan', 50.4111, 80.2275, 299264, 'Asia/Almaty', 206, 'Continental'),
            
            # USA - Major cities
            ('New York', 'US', 'United States', 40.7128, -74.0060, 8336817, 'America/New_York', 10, 'Temperate'),
            ('Los Angeles', 'US', 'United States', 34.0522, -118.2437, 3979576, 'America/Los_Angeles', 71, 'Mediterranean'),
            ('Chicago', 'US', 'United States', 41.8781, -87.6298, 2693976, 'America/Chicago', 181, 'Continental'),
            ('Houston', 'US', 'United States', 29.7604, -95.3698, 2320268, 'America/Chicago', 13, 'Subtropical'),
            ('Phoenix', 'US', 'United States', 33.4484, -112.0740, 1680992, 'America/Phoenix', 331, 'Desert'),
            ('Philadelphia', 'US', 'United States', 39.9526, -75.1652, 1584064, 'America/New_York', 12, 'Temperate'),
            ('San Antonio', 'US', 'United States', 29.4241, -98.4936, 1547253, 'America/Chicago', 198, 'Subtropical'),
            ('San Diego', 'US', 'United States', 32.7157, -117.1611, 1423851, 'America/Los_Angeles', 19, 'Mediterranean'),
            ('Dallas', 'US', 'United States', 32.7767, -96.7970, 1343573, 'America/Chicago', 131, 'Subtropical'),
            ('San Jose', 'US', 'United States', 37.3382, -121.8863, 1021795, 'America/Los_Angeles', 25, 'Mediterranean'),
            
            # Japan - Major cities
            ('Tokyo', 'JP', 'Japan', 35.6762, 139.6503, 37400068, 'Asia/Tokyo', 40, 'Temperate'),
            ('Osaka', 'JP', 'Japan', 34.6937, 135.5023, 2691185, 'Asia/Tokyo', 5, 'Temperate'),
            ('Kyoto', 'JP', 'Japan', 35.0116, 135.7681, 1475183, 'Asia/Tokyo', 56, 'Temperate'),
            ('Yokohama', 'JP', 'Japan', 35.4437, 139.6380, 3726167, 'Asia/Tokyo', 2, 'Temperate'),
            ('Nagoya', 'JP', 'Japan', 35.1815, 136.9066, 2295638, 'Asia/Tokyo', 51, 'Temperate'),
            ('Sapporo', 'JP', 'Japan', 43.0642, 141.3469, 1952356, 'Asia/Tokyo', 29, 'Continental'),
            ('Fukuoka', 'JP', 'Japan', 33.5904, 130.4017, 1538681, 'Asia/Tokyo', 3, 'Subtropical'),
            ('Kobe', 'JP', 'Japan', 34.6901, 135.1956, 1518870, 'Asia/Tokyo', 56, 'Temperate'),
            
            # Europe - Major cities
            ('London', 'GB', 'United Kingdom', 51.5074, -0.1278, 9648110, 'Europe/London', 11, 'Oceanic'),
            ('Paris', 'FR', 'France', 48.8566, 2.3522, 2161000, 'Europe/Paris', 35, 'Oceanic'),
            ('Berlin', 'DE', 'Germany', 52.5200, 13.4050, 3669491, 'Europe/Berlin', 34, 'Temperate'),
            ('Madrid', 'ES', 'Spain', 40.4168, -3.7038, 3223334, 'Europe/Madrid', 650, 'Mediterranean'),
            ('Rome', 'IT', 'Italy', 41.9028, 12.4964, 2872800, 'Europe/Rome', 21, 'Mediterranean'),
            ('Amsterdam', 'NL', 'Netherlands', 52.3676, 4.9041, 872680, 'Europe/Amsterdam', -2, 'Oceanic'),
            ('Vienna', 'AT', 'Austria', 48.2082, 16.3738, 1911191, 'Europe/Vienna', 171, 'Continental'),
            ('Prague', 'CZ', 'Czech Republic', 50.0755, 14.4378, 1318982, 'Europe/Prague', 399, 'Continental'),
            
            # Other regions
            ('Moscow', 'RU', 'Russia', 55.7558, 37.6176, 12615279, 'Europe/Moscow', 156, 'Continental'),
            ('Beijing', 'CN', 'China', 39.9042, 116.4074, 21540000, 'Asia/Shanghai', 43, 'Continental'),
            ('Mumbai', 'IN', 'India', 19.0760, 72.8777, 20411274, 'Asia/Kolkata', 14, 'Tropical'),
            ('Sydney', 'AU', 'Australia', -33.8688, 151.2093, 5312163, 'Australia/Sydney', 58, 'Oceanic'),
        ]
    
    def search_cities(self, query, limit=10):
        """Search cities by name"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        cursor.execute('''
            SELECT name, country_name, latitude, longitude, population, climate_zone
            FROM cities 
            WHERE name LIKE ? OR country_name LIKE ?
            ORDER BY population DESC
            LIMIT ?
        ''', (f'%{query}%', f'%{query}%', limit))
        
        results = cursor.fetchall()
        conn.close()
        
        return [
            {
                'name': f"{row[0]}, {row[1]}",
                'lat': row[2],
                'lon': row[3],
                'population': row[4],
                'climate': row[5]
            }
            for row in results
        ]
    
    def get_country_cities(self, country_code):
        """Get all cities for a specific country"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        cursor.execute('''
            SELECT name, latitude, longitude, population
            FROM cities 
            WHERE country_code = ?
            ORDER BY population DESC
        ''', (country_code,))
        
        results = cursor.fetchall()
        conn.close()
        
        return results

# Global instance
location_db = LocationDatabase()
