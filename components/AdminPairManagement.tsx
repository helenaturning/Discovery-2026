import { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Label } from './ui/label';
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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Badge } from './ui/badge';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface Pair {
  id: string;
  employee1: string;
  employee2: string;
  site: string;
  status: 'active' | 'inactive';
}

export function AdminPairManagement() {
  const { t } = useLanguage();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    employee1: '',
    employee2: '',
    site: '',
  });

  // Mock pairs data
  const [pairs, setPairs] = useState<Pair[]>([
    {
      id: '1',
      employee1: 'Jean Dupont',
      employee2: 'Pierre Bernard',
      site: 'Site Alpha',
      status: 'active',
    },
    {
      id: '2',
      employee1: 'Marie Martin',
      employee2: 'Sophie Laurent',
      site: 'Site Beta',
      status: 'active',
    },
  ]);

  // Mock employees and sites for selection
  const mockEmployees = [
    'Jean Dupont',
    'Pierre Bernard',
    'Marie Martin',
    'Sophie Laurent',
    'Thomas Petit',
  ];

  const mockSites = [
    'Site Alpha',
    'Site Beta',
    'Site Gamma',
  ];

  const handleCreatePair = () => {
    if (formData.employee1 === formData.employee2) {
      toast.error('Cannot pair an employee with themselves');
      return;
    }

    const newPair: Pair = {
      id: Date.now().toString(),
      ...formData,
      status: 'active',
    };
    setPairs([...pairs, newPair]);
    setIsCreateDialogOpen(false);
    resetForm();
    toast.success(t('success'));
  };

  const handleDeletePair = (id: string) => {
    setPairs(pairs.filter(p => p.id !== id));
    toast.success(t('success'));
  };

  const resetForm = () => {
    setFormData({
      employee1: '',
      employee2: '',
      site: '',
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2>{t('supervisor.pairs')}</h2>
          <p className="text-muted-foreground">{t('supervisor.pairs.create')}</p>
        </div>
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <Plus className="size-4 mr-2" />
          {t('supervisor.pairs.create')}
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t('supervisor.pairs.employee1')}</TableHead>
                <TableHead>{t('supervisor.pairs.employee2')}</TableHead>
                <TableHead>{t('employee.site')}</TableHead>
                <TableHead>{t('admin.users.status')}</TableHead>
                <TableHead className="text-right">{t('edit')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pairs.map((pair) => (
                <TableRow key={pair.id}>
                  <TableCell>{pair.employee1}</TableCell>
                  <TableCell>{pair.employee2}</TableCell>
                  <TableCell>{pair.site}</TableCell>
                  <TableCell>
                    <Badge variant={pair.status === 'active' ? 'default' : 'secondary'}>
                      {t(`admin.users.${pair.status}`)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeletePair(pair.id)}
                    >
                      <Trash2 className="size-4 text-destructive" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Create Dialog */}
      <Dialog 
        open={isCreateDialogOpen} 
        onOpenChange={(open) => {
          if (!open) {
            setIsCreateDialogOpen(false);
            resetForm();
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('supervisor.pairs.create')}</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label>{t('supervisor.pairs.employee1')}</Label>
              <Select value={formData.employee1} onValueChange={(value) => setFormData({ ...formData, employee1: value })}>
                <SelectTrigger>
                  <SelectValue placeholder={t('supervisor.pairs.employee1')} />
                </SelectTrigger>
                <SelectContent>
                  {mockEmployees.map((emp) => (
                    <SelectItem key={emp} value={emp}>{emp}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>{t('supervisor.pairs.employee2')}</Label>
              <Select value={formData.employee2} onValueChange={(value) => setFormData({ ...formData, employee2: value })}>
                <SelectTrigger>
                  <SelectValue placeholder={t('supervisor.pairs.employee2')} />
                </SelectTrigger>
                <SelectContent>
                  {mockEmployees.map((emp) => (
                    <SelectItem key={emp} value={emp}>{emp}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>{t('employee.site')}</Label>
              <Select value={formData.site} onValueChange={(value) => setFormData({ ...formData, site: value })}>
                <SelectTrigger>
                  <SelectValue placeholder={t('employee.site')} />
                </SelectTrigger>
                <SelectContent>
                  {mockSites.map((site) => (
                    <SelectItem key={site} value={site}>{site}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setIsCreateDialogOpen(false);
                  resetForm();
                }}
              >
                {t('cancel')}
              </Button>
              <Button 
                onClick={handleCreatePair}
                disabled={!formData.employee1 || !formData.employee2 || !formData.site}
              >
                {t('save')}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
