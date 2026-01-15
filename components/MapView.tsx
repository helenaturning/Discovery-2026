import { useEffect, useRef, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { MapPin, Users } from 'lucide-react';

declare global {
  interface Window {
    google: any;
  }
}

interface MapViewProps {
  employeeId?: string; // If provided, center on this employee
  showAllEmployees?: boolean;
}

export function MapView({ employeeId, showAllEmployees = false }: MapViewProps) {
  const { t } = useLanguage();
  const { sites, pairs, allUsers, currentSession } = useAuth();
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<any>(null);
  const [markers, setMarkers] = useState<any[]>([]);

  useEffect(() => {
    // Load Google Maps script
    const loadGoogleMaps = () => {
      if (window.google) {
        initMap();
        return;
      }

      const script = document.createElement('script');
      // Note: In production, use a real API key
      script.src = `https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY_HERE`;
      script.async = true;
      script.defer = true;
      script.onload = initMap;
      document.head.appendChild(script);
    };

    const initMap = () => {
      if (!mapRef.current || !window.google) return;

      // Default center (Paris)
      const center = sites.length > 0 
        ? { lat: sites[0].latitude, lng: sites[0].longitude }
        : { lat: 48.8566, lng: 2.3522 };

      const newMap = new window.google.maps.Map(mapRef.current, {
        center,
        zoom: 12,
        mapTypeControl: false,
        fullscreenControl: false,
      });

      setMap(newMap);
    };

    loadGoogleMaps();
  }, []);

  useEffect(() => {
    if (!map || !window.google) return;

    // Clear existing markers
    markers.forEach(marker => marker.setMap(null));
    const newMarkers: any[] = [];

    // Add site markers with radius circles
    sites.forEach(site => {
      // Site marker
      const marker = new window.google.maps.Marker({
        position: { lat: site.latitude, lng: site.longitude },
        map,
        title: site.name,
        icon: {
          path: window.google.maps.SymbolPath.CIRCLE,
          scale: 12,
          fillColor: '#030213',
          fillOpacity: 1,
          strokeColor: '#ffffff',
          strokeWeight: 2,
        },
      });

      // Info window
      const infoWindow = new window.google.maps.InfoWindow({
        content: `
          <div style="padding: 8px;">
            <h3 style="margin: 0 0 4px 0; font-weight: 600;">${site.name}</h3>
            <p style="margin: 0; font-size: 14px; color: #666;">${site.address}</p>
            <p style="margin: 4px 0 0 0; font-size: 12px; color: #888;">Radius: ${site.radius}m</p>
          </div>
        `,
      });

      marker.addListener('click', () => {
        infoWindow.open(map, marker);
      });

      // Radius circle
      const circle = new window.google.maps.Circle({
        map,
        center: { lat: site.latitude, lng: site.longitude },
        radius: site.radius,
        fillColor: '#030213',
        fillOpacity: 0.1,
        strokeColor: '#030213',
        strokeOpacity: 0.3,
        strokeWeight: 2,
      });

      newMarkers.push(marker, circle);
    });

    // Add employee markers if showing all employees
    if (showAllEmployees) {
      const employees = allUsers.filter(u => u.role === 'employee');
      
      employees.forEach((emp, index) => {
        // Mock employee location near their assigned site
        const empPair = pairs.find(p => p.active && (p.employee1Id === emp.id || p.employee2Id === emp.id));
        if (!empPair) return;
        
        const site = sites.find(s => s.id === empPair.siteId);
        if (!site) return;

        // Random offset within site radius for demo
        const offset = 0.001;
        const lat = site.latitude + (Math.random() - 0.5) * offset;
        const lng = site.longitude + (Math.random() - 0.5) * offset;

        const marker = new window.google.maps.Marker({
          position: { lat, lng },
          map,
          title: `${emp.firstName} ${emp.lastName}`,
          icon: {
            path: window.google.maps.SymbolPath.CIRCLE,
            scale: 8,
            fillColor: index % 3 === 0 ? '#22c55e' : '#eab308',
            fillOpacity: 1,
            strokeColor: '#ffffff',
            strokeWeight: 2,
          },
        });

        const infoWindow = new window.google.maps.InfoWindow({
          content: `
            <div style="padding: 8px;">
              <h3 style="margin: 0 0 4px 0; font-weight: 600;">${emp.firstName} ${emp.lastName}</h3>
              <p style="margin: 0; font-size: 12px; color: #666;">${emp.employeeId}</p>
              <p style="margin: 4px 0 0 0; font-size: 12px;">
                <span style="color: ${index % 3 === 0 ? '#22c55e' : '#eab308'};">●</span>
                ${index % 3 === 0 ? 'Present' : 'Paused'}
              </p>
            </div>
          `,
        });

        marker.addListener('click', () => {
          infoWindow.open(map, marker);
        });

        newMarkers.push(marker);
      });
    }

    setMarkers(newMarkers);
  }, [map, sites, pairs, allUsers, showAllEmployees]);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <MapPin className="size-5" />
            Map View
          </CardTitle>
          <div className="flex items-center gap-2">
            {sites.length > 0 && (
              <Badge variant="outline">
                {sites.length} {sites.length === 1 ? 'site' : 'sites'}
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div 
          ref={mapRef} 
          className="w-full h-[400px] rounded-lg bg-muted"
        >
          {/* Fallback when Google Maps fails to load */}
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-center">
              <MapPin className="size-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-sm text-muted-foreground">
                Map Preview
              </p>
              <p className="text-xs text-muted-foreground mt-2">
                Google Maps integration requires API key
              </p>
            </div>
          </div>
        </div>
        
        {/* Legend */}
        <div className="mt-4 flex flex-wrap gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-primary" />
            <span className="text-muted-foreground">Sites</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-500" />
            <span className="text-muted-foreground">Present</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-yellow-500" />
            <span className="text-muted-foreground">Paused</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full border-2 border-primary bg-transparent" />
            <span className="text-muted-foreground">Site Radius</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
