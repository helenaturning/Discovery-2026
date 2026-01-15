import { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { MapPin, Plus } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface Site {
  id: string;
  name: string;
  address: string;
  city: string;
  activeEmployees: number;
  radius: number;
}

export function SupervisorSites() {
  const { t } = useLanguage();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    city: '',
    radius: '100',
  });

  // Mock sites data
  const [sites] = useState<Site[]>([
    {
      id: '1',
      name: 'Site Alpha',
      address: '123 Rue de la Paix',
      city: 'Paris',
      activeEmployees: 24,
      radius: 100,
    },
    {
      id: '2',
      name: 'Site Beta',
      address: '456 Avenue des Champs',
      city: 'Lyon',
      activeEmployees: 18,
      radius: 150,
    },
  ]);

  const handleCreateSite = () => {
    setIsCreateDialogOpen(false);
    setFormData({ name: '', address: '', city: '', radius: '100' });
    toast.success(t('success'));
  };

  return (
    <div className="space-y-6 pb-20">
      <div className="flex items-center justify-between">
        <div>
          <h2>{t('supervisor.sites')}</h2>
          <p className="text-muted-foreground">{sites.length} active sites</p>
        </div>
        <Button onClick={() => setIsCreateDialogOpen(true)} size="sm">
          <Plus className="size-4 mr-2" />
          {t('create')}
        </Button>
      </div>

      {/* Map View */}
      <Card>
        <CardContent className="p-4">
          <div className="aspect-video bg-muted rounded-lg flex items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-green-50" />
            <div className="relative text-center z-10">
              <MapPin className="size-12 mx-auto mb-2 text-primary" />
              <p className="text-sm">Google Maps</p>
              <p className="text-xs text-muted-foreground">Sites Overview</p>
            </div>
            <div className="absolute top-1/4 left-1/3 w-6 h-6 rounded-full bg-green-500 border-2 border-white shadow" />
            <div className="absolute top-1/2 right-1/4 w-6 h-6 rounded-full bg-blue-500 border-2 border-white shadow" />
          </div>
        </CardContent>
      </Card>

      {/* Sites List */}
      <div className="space-y-3">
        {sites.map((site) => (
          <Card key={site.id}>
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <MapPin className="size-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="truncate">{site.name}</h3>
                  <p className="text-sm text-muted-foreground truncate">{site.city}</p>
                  <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                    <span>{site.activeEmployees} employees</span>
                    <span>{site.radius}m radius</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Create Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('supervisor.sites.create')}</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label>{t('supervisor.sites.name')}</Label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label>{t('supervisor.sites.city')}</Label>
              <Input
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label>{t('supervisor.sites.address')}</Label>
              <Input
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label>{t('supervisor.sites.radius')}</Label>
              <Input
                type="number"
                value={formData.radius}
                onChange={(e) => setFormData({ ...formData, radius: e.target.value })}
              />
            </div>

            <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
              <MapPin className="size-8 text-muted-foreground" />
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                {t('cancel')}
              </Button>
              <Button onClick={handleCreateSite}>{t('save')}</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
