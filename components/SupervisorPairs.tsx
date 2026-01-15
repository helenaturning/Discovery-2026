import { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { Users, Plus, Edit2, Trash2 } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface Pair {
  id: string;
  employee1Id: string;
  employee2Id: string;
  siteId: string;
  active: boolean;
}

export function SupervisorPairs() {
  const { t } = useLanguage();
  const { pairs: contextPairs, addPair, updatePair, allUsers, sites } = useAuth();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedPair, setSelectedPair] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    employee1Id: '',
    employee2Id: '',
    siteId: '',
  });

  const handleCreatePair = () => {
    setIsCreateDialogOpen(false);
    setFormData({ employee1Id: '', employee2Id: '', siteId: '' });
    toast.success(t('success'));
  };

  const handleEditPair = () => {
    if (selectedPair) {
      const pair = contextPairs.find((p) => p.id === selectedPair);
      if (pair) {
        setFormData({
          employee1Id: pair.employee1Id,
          employee2Id: pair.employee2Id,
          siteId: pair.siteId,
        });
        setIsEditDialogOpen(true);
      }
    }
  };

  const handleUpdatePair = () => {
    if (selectedPair) {
      updatePair(selectedPair, formData);
      setIsEditDialogOpen(false);
      setFormData({ employee1Id: '', employee2Id: '', siteId: '' });
      toast.success(t('success'));
    }
  };

  return (
    <div className="space-y-6 pb-20">
      <div className="flex items-center justify-between">
        <div>
          <h2>{t('supervisor.pairs')}</h2>
          <p className="text-muted-foreground">{contextPairs.length} active pairs</p>
        </div>
        <Button onClick={() => setIsCreateDialogOpen(true)} size="sm">
          <Plus className="size-4 mr-2" />
          {t('create')}
        </Button>
      </div>

      <div className="space-y-3">
        {contextPairs.map((pair) => {
          const employee1 = allUsers.find(u => u.id === pair.employee1Id);
          const employee2 = allUsers.find(u => u.id === pair.employee2Id);
          const site = sites.find(s => s.id === pair.siteId);

          return (
            <Card key={pair.id} className="shadow-sm">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <Users className="size-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="truncate text-sm font-semibold">
                        {employee1?.firstName || 'N/A'} {employee1?.lastName || ''}
                      </h4>
                      <span className="text-muted-foreground">+</span>
                      <h4 className="truncate text-sm font-semibold">
                        {employee2?.firstName || 'N/A'} {employee2?.lastName || ''}
                      </h4>
                    </div>
                    <p className="text-sm text-muted-foreground truncate">{site?.name || 'N/A'}</p>
                    <Badge 
                      className="mt-2" 
                      variant={pair.active ? 'default' : 'secondary'}
                    >
                      {pair.active ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setSelectedPair(pair.id);
                        setFormData({
                          employee1Id: pair.employee1Id,
                          employee2Id: pair.employee2Id,
                          siteId: pair.siteId,
                        });
                        setIsEditDialogOpen(true);
                      }}
                    >
                      <Edit2 className="size-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-destructive hover:text-destructive"
                      onClick={() => {
                        updatePair(pair.id, { active: false });
                        toast.success('Pair deactivated');
                      }}
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('supervisor.pairs.create')}</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label>{t('supervisor.pairs.employee1')}</Label>
              <Select value={formData.employee1Id} onValueChange={(value) => setFormData({ ...formData, employee1Id: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {allUsers.filter(u => u.role === 'employee').map((user) => (
                    <SelectItem key={user.id} value={user.id}>
                      {user.firstName} {user.lastName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>{t('supervisor.pairs.employee2')}</Label>
              <Select value={formData.employee2Id} onValueChange={(value) => setFormData({ ...formData, employee2Id: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {allUsers.filter(u => u.role === 'employee').map((user) => (
                    <SelectItem key={user.id} value={user.id}>
                      {user.firstName} {user.lastName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>{t('employee.site')}</Label>
              <Select value={formData.siteId} onValueChange={(value) => setFormData({ ...formData, siteId: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {sites.map((site) => (
                    <SelectItem key={site.id} value={site.id}>{site.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                {t('cancel')}
              </Button>
              <Button onClick={handleCreatePair}>{t('save')}</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('supervisor.pairs.edit')}</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label>{t('supervisor.pairs.employee1')}</Label>
              <Select value={formData.employee1Id} onValueChange={(value) => setFormData({ ...formData, employee1Id: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {allUsers.filter(u => u.role === 'employee').map((user) => (
                    <SelectItem key={user.id} value={user.id}>
                      {user.firstName} {user.lastName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>{t('supervisor.pairs.employee2')}</Label>
              <Select value={formData.employee2Id} onValueChange={(value) => setFormData({ ...formData, employee2Id: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {allUsers.filter(u => u.role === 'employee').map((user) => (
                    <SelectItem key={user.id} value={user.id}>
                      {user.firstName} {user.lastName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>{t('employee.site')}</Label>
              <Select value={formData.siteId} onValueChange={(value) => setFormData({ ...formData, siteId: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {sites.map((site) => (
                    <SelectItem key={site.id} value={site.id}>{site.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                {t('cancel')}
              </Button>
              <Button onClick={handleUpdatePair}>{t('save')}</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}