import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { Calendar } from './ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Button } from './ui/button';
import { CalendarIcon, TrendingUp } from 'lucide-react';

export function HeatmapView() {
  const { t } = useLanguage();
  const { sites } = useAuth();
  const [selectedSite, setSelectedSite] = useState<string>(sites[0]?.id || '');
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date }>({
    from: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    to: new Date(),
  });

  // Mock heatmap data
  const hours = Array.from({ length: 24 }, (_, i) => i);
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  
  const getIntensity = (day: number, hour: number) => {
    // Mock data - higher during work hours
    if (hour >= 8 && hour <= 18 && day < 5) {
      return 60 + Math.random() * 40;
    }
    return Math.random() * 30;
  };

  const getColor = (intensity: number) => {
    if (intensity >= 80) return 'bg-green-600';
    if (intensity >= 60) return 'bg-green-500';
    if (intensity >= 40) return 'bg-yellow-500';
    if (intensity >= 20) return 'bg-orange-500';
    return 'bg-gray-300';
  };

  const site = sites.find(s => s.id === selectedSite);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between flex-wrap gap-4">
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="size-5" />
            {t('supervisor.heatmap')}
          </CardTitle>
          
          <div className="flex items-center gap-2">
            <Select value={selectedSite} onValueChange={setSelectedSite}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Select site" />
              </SelectTrigger>
              <SelectContent>
                {sites.map(site => (
                  <SelectItem key={site.id} value={site.id}>
                    {site.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {site && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">{site.name}</p>
                <p className="text-xs text-muted-foreground">{site.city}</p>
              </div>
              <Badge variant="outline">Last 7 days</Badge>
            </div>

            {/* Heatmap Grid */}
            <div className="overflow-x-auto">
              <div className="inline-block min-w-full">
                {/* Hour labels */}
                <div className="flex mb-2">
                  <div className="w-12" /> {/* Space for day labels */}
                  {[0, 6, 12, 18].map(h => (
                    <div key={h} className="flex-1 text-center text-xs text-muted-foreground">
                      {h}h
                    </div>
                  ))}
                </div>
                
                {/* Grid */}
                {days.map((day, dayIndex) => (
                  <div key={day} className="flex items-center gap-1 mb-1">
                    <div className="w-12 text-xs text-muted-foreground">{day}</div>
                    <div className="flex gap-0.5 flex-1">
                      {hours.map(hour => {
                        const intensity = getIntensity(dayIndex, hour);
                        return (
                          <div
                            key={`${day}-${hour}`}
                            className={`h-6 flex-1 rounded-sm ${getColor(intensity)} hover:ring-2 hover:ring-primary transition-all cursor-pointer`}
                            title={`${day} ${hour}:00 - ${Math.round(intensity)}% presence`}
                          />
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Legend */}
            <div className="flex items-center justify-between pt-4 border-t">
              <span className="text-xs text-muted-foreground">Presence Intensity</span>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">Low</span>
                <div className="flex gap-1">
                  <div className="w-4 h-4 rounded bg-gray-300" />
                  <div className="w-4 h-4 rounded bg-orange-500" />
                  <div className="w-4 h-4 rounded bg-yellow-500" />
                  <div className="w-4 h-4 rounded bg-green-500" />
                  <div className="w-4 h-4 rounded bg-green-600" />
                </div>
                <span className="text-xs text-muted-foreground">High</span>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 pt-4 border-t">
              <div className="text-center">
                <p className="text-2xl font-bold">87%</p>
                <p className="text-xs text-muted-foreground">Avg Presence</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold">9-18h</p>
                <p className="text-xs text-muted-foreground">Peak Hours</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold">Mon-Fri</p>
                <p className="text-xs text-muted-foreground">Active Days</p>
              </div>
            </div>
          </div>
        )}

        {!site && (
          <div className="py-12 text-center">
            <TrendingUp className="size-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">Select a site to view heatmap</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
