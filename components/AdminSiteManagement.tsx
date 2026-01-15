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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Plus, Pencil, Trash2, MapPin } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface Site {
  id: string;
  name: string;
  address: string;
  city: string;
  latitude: number;
  longitude: number;
  radius: number;
  supervisor: string;
}

export function AdminSiteManagement() {
  const { t } = useLanguage();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingSite, setEditingSite] = useState<Site | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    city: '',
    latitude: '',
    longitude: '',
    radius: '100',
  });

  // Mock sites data
  const [sites, setSites] = useState<Site[]>([
    {
      id: '1',
      name: 'Site Alpha',
      address: '123 Rue de la Paix',
      city: 'Paris',
      latitude: 48.8566,
      longitude: 2.3522,
      radius: 100,
      supervisor: 'Marie Martin',
    },
    {
      id: '2',
      name: 'Site Beta',
      address: '456 Avenue des Champs',
      city: 'Lyon',
      latitude: 45.7640,
      longitude: 4.8357,
      radius: 150,
      supervisor: 'Marie Martin',
    },
  ]);

  const handleCreateSite = () => {
    const newSite: Site = {
      id: Date.now().toString(),
      name: formData.name,
      address: formData.address,
      city: formData.city,
      latitude: parseFloat(formData.latitude) || 0,
      longitude: parseFloat(formData.longitude) || 0,
      radius: parseInt(formData.radius) || 100,
      supervisor: 'Unassigned',
    };
    setSites([...sites, newSite]);
    setIsCreateDialogOpen(false);
    resetForm();
    toast.success(t('success'));
  };

  const handleEditSite = () => {
    if (editingSite) {
      setSites(sites.map(s => s.id === editingSite.id ? {
        ...editingSite,
        name: formData.name,
        address: formData.address,
        city: formData.city,
        latitude: parseFloat(formData.latitude) || 0,
        longitude: parseFloat(formData.longitude) || 0,
        radius: parseInt(formData.radius) || 100,
      } : s));
      setEditingSite(null);
      resetForm();
      toast.success(t('success'));
    }
  };

  const handleDeleteSite = (id: string) => {
    setSites(sites.filter(s => s.id !== id));
    toast.success(t('success'));
  };

  const resetForm = () => {
    setFormData({
      name: '',
      address: '',
      city: '',
      latitude: '',
      longitude: '',
      radius: '100',
    });
  };

  const openEditDialog = (site: Site) => {
    setEditingSite(site);
    setFormData({
      name: site.name,
      address: site.address,
      city: site.city,
      latitude: site.latitude.toString(),
      longitude: site.longitude.toString(),
      radius: site.radius.toString(),
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2>{t('supervisor.sites')}</h2>
          <p className="text-muted-foreground">{t('supervisor.sites.create')}</p>
        </div>
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <Plus className="size-4 mr-2" />
          {t('supervisor.sites.create')}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t('supervisor.sites.name')}</TableHead>
                  <TableHead>{t('supervisor.sites.city')}</TableHead>
                  <TableHead>{t('supervisor.sites.radius')}</TableHead>
                  <TableHead className="text-right">{t('edit')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sites.map((site) => (
                  <TableRow key={site.id}>
                    <TableCell>{site.name}</TableCell>
                    <TableCell>{site.city}</TableCell>
                    <TableCell>{site.radius}m</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openEditDialog(site)}
                        >
                          <Pencil className="size-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteSite(site.id)}
                        >
                          <Trash2 className="size-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
              <div className="text-center">
                <MapPin className="size-12 mx-auto mb-2 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">Google Maps</p>
                <p className="text-xs text-muted-foreground">All Sites Overview</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Create/Edit Dialog */}
      <Dialog 
        open={isCreateDialogOpen || !!editingSite} 
        onOpenChange={(open) => {
          if (!open) {
            setIsCreateDialogOpen(false);
            setEditingSite(null);
            resetForm();
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingSite ? t('supervisor.sites.edit') : t('supervisor.sites.create')}
            </DialogTitle>
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

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Latitude</Label>
                <Input
                  type="number"
                  step="0.0001"
                  value={formData.latitude}
                  onChange={(e) => setFormData({ ...formData, latitude: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Longitude</Label>
                <Input
                  type="number"
                  step="0.0001"
                  value={formData.longitude}
                  onChange={(e) => setFormData({ ...formData, longitude: e.target.value })}
                />
              </div>
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
              <div className="text-center">
                <MapPin className="size-8 mx-auto mb-2 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">Map Picker</p>
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setIsCreateDialogOpen(false);
                  setEditingSite(null);
                  resetForm();
                }}
              >
                {t('cancel')}
              </Button>
              <Button onClick={editingSite ? handleEditSite : handleCreateSite}>
                {t('save')}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
