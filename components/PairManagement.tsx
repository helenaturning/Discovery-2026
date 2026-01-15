import { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { Switch } from './ui/switch';
import { Users, Plus, Edit2, MapPin } from 'lucide-react';
import { Pair } from '../types';
import { toast } from 'sonner@2.0.3';

interface PairManagementProps {
  searchQuery: string;
}

export function PairManagement({ searchQuery }: PairManagementProps) {
  const { t } = useLanguage();
  const { pairs, addPair, updatePair, allUsers, sites } = useAuth();
  const [showDialog, setShowDialog] = useState(false);
  const [editingPair, setEditingPair] = useState<Pair | null>(null);
  const [formData, setFormData] = useState({
    employee1Id: '',
    employee2Id: '',
    siteId: '',
    active: true,
  });

  const employees = allUsers.filter(u => u.role === 'employee');

  const filteredPairs = pairs.filter(pair => {
    const emp1 = allUsers.find(u => u.id === pair.employee1Id);
    const emp2 = allUsers.find(u => u.id === pair.employee2Id);
    const site = sites.find(s => s.id === pair.siteId);
    
    const searchLower = searchQuery.toLowerCase();
    return (
      emp1?.firstName.toLowerCase().includes(searchLower) ||
      emp1?.lastName.toLowerCase().includes(searchLower) ||
      emp2?.firstName.toLowerCase().includes(searchLower) ||
      emp2?.lastName.toLowerCase().includes(searchLower) ||
      site?.name.toLowerCase().includes(searchLower)
    );
  });

  const handleOpenDialog = (pair?: Pair) => {
    if (pair) {
      setEditingPair(pair);
      setFormData({
        employee1Id: pair.employee1Id,
        employee2Id: pair.employee2Id,
        siteId: pair.siteId,
        active: pair.active,
      });
    } else {
      setEditingPair(null);
      setFormData({
        employee1Id: '',
        employee2Id: '',
        siteId: '',
        active: true,
      });
    }
    setShowDialog(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.employee1Id === formData.employee2Id) {
      toast.error('Cannot pair an employee with themselves');
      return;
    }
    
    if (editingPair) {
      updatePair(editingPair.id, formData);
      toast.success('Pair updated');
    } else {
      addPair(formData);
      toast.success('Pair created');
    }
    
    setShowDialog(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h3>{t('supervisor.pairs')}</h3>
          <p className="text-sm text-muted-foreground">{filteredPairs.length} pairs</p>
        </div>
        <Button onClick={() => handleOpenDialog()}>
          <Plus className="size-4 mr-2" />
          {t('supervisor.pairs.create')}
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {filteredPairs.map((pair) => {
          const emp1 = allUsers.find(u => u.id === pair.employee1Id);
          const emp2 = allUsers.find(u => u.id === pair.employee2Id);
          const site = sites.find(s => s.id === pair.siteId);
          
          return (
            <Card key={pair.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Users className="size-5 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">
                        {emp1?.firstName} {emp1?.lastName} & {emp2?.firstName} {emp2?.lastName}
                      </CardTitle>
                      <CardDescription className="flex items-center gap-1 mt-1">
                        <MapPin className="size-3" />
                        {site?.name}
                      </CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={pair.active ? 'default' : 'secondary'}>
                      {pair.active ? 'Active' : 'Inactive'}
                    </Badge>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleOpenDialog(pair)}
                    >
                      <Edit2 className="size-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground mb-1">Employee 1</p>
                    <p className="font-medium">{emp1?.employeeId}</p>
                    <p className="text-muted-foreground">{emp1?.email}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground mb-1">Employee 2</p>
                    <p className="font-medium">{emp2?.employeeId}</p>
                    <p className="text-muted-foreground">{emp2?.email}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredPairs.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <Users className="size-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">
              {searchQuery ? 'No pairs found' : 'No pairs yet. Create your first pair.'}
            </p>
          </CardContent>
        </Card>
      )}

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingPair ? t('supervisor.pairs.edit') : t('supervisor.pairs.create')}
            </DialogTitle>
            <DialogDescription>
              Assign two employees to work together at a site
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label>{t('supervisor.pairs.employee1')}</Label>
              <Select
                value={formData.employee1Id}
                onValueChange={(value) => setFormData({ ...formData, employee1Id: value })}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select employee" />
                </SelectTrigger>
                <SelectContent>
                  {employees.map((emp) => (
                    <SelectItem key={emp.id} value={emp.id}>
                      {emp.firstName} {emp.lastName} ({emp.employeeId})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>{t('supervisor.pairs.employee2')}</Label>
              <Select
                value={formData.employee2Id}
                onValueChange={(value) => setFormData({ ...formData, employee2Id: value })}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select employee" />
                </SelectTrigger>
                <SelectContent>
                  {employees.map((emp) => (
                    <SelectItem key={emp.id} value={emp.id} disabled={emp.id === formData.employee1Id}>
                      {emp.firstName} {emp.lastName} ({emp.employeeId})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>{t('supervisor.sites')}</Label>
              <Select
                value={formData.siteId}
                onValueChange={(value) => setFormData({ ...formData, siteId: value })}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select site" />
                </SelectTrigger>
                <SelectContent>
                  {sites.map((site) => (
                    <SelectItem key={site.id} value={site.id}>
                      {site.name} ({site.city})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
              <Label htmlFor="active">Active</Label>
              <Switch
                id="active"
                checked={formData.active}
                onCheckedChange={(checked) => setFormData({ ...formData, active: checked })}
              />
            </div>
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setShowDialog(false)}>
                {t('cancel')}
              </Button>
              <Button type="submit">
                {t('save')}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
