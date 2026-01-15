import { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Users, MapPin, UsersRound, Settings, Building2, TrendingUp } from 'lucide-react';
import { UserManagement } from './UserManagement';
import { AdminSiteManagement } from './AdminSiteManagement';
import { AdminPairManagement } from './AdminPairManagement';
import { SystemSettings } from './SystemSettings';
import { AdminMapView } from './AdminMapView';
import { PairListDialog } from './PairListDialog';

export function AdminDashboard() {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState('overview');
  const [pairDialogOpen, setPairDialogOpen] = useState(false);
  const [selectedPairType, setSelectedPairType] = useState<'total' | 'active'>('total');

  const metrics = {
    totalEmployees: 156,
    totalSupervisors: 12,
    totalSites: 24,
    totalPairs: 78,
    activePairs: 70,
    activeToday: 142,
  };
  
  // Mock pairs data for administrator
  const allPairs = Array.from({ length: 78 }, (_, i) => ({
    id: `Binôme #${i + 1}`,
    members: [
      { 
        name: `Employé ${i * 2 + 1}`, 
        employeeId: `EMP${String(i * 2 + 1).padStart(3, '0')}`, 
        status: (i < 70 ? 'active' : 'inactive') as const, 
        lastVerification: i < 70 ? `Il y a ${Math.floor(Math.random() * 30) + 1} min` : 'Il y a 2h+', 
        site: `Site ${String.fromCharCode(65 + (i % 24))}` 
      },
      { 
        name: `Employé ${i * 2 + 2}`, 
        employeeId: `EMP${String(i * 2 + 2).padStart(3, '0')}`, 
        status: (i < 70 ? 'active' : 'inactive') as const, 
        lastVerification: i < 70 ? `Il y a ${Math.floor(Math.random() * 30) + 1} min` : 'Il y a 2h+', 
        site: `Site ${String.fromCharCode(65 + (i % 24))}` 
      }
    ],
    site: `Site ${String.fromCharCode(65 + (i % 24))}`,
    isActive: i < 70
  }));
  
  const activePairs = allPairs.filter(pair => pair.isActive);

  const handleOpenPairList = (type: 'total' | 'active') => {
    setSelectedPairType(type);
    setPairDialogOpen(true);
  };

  const activePercentage = (metrics.activeToday / metrics.totalEmployees) * 100;

  return (
    <div className="space-y-6 pb-20 max-w-[390px] mx-auto">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-6 bg-muted">
          <TabsTrigger value="overview" className="text-xs">Tableau</TabsTrigger>
          <TabsTrigger value="map" className="text-xs">Carte</TabsTrigger>
          <TabsTrigger value="users" className="text-xs">Utilisateurs</TabsTrigger>
          <TabsTrigger value="sites" className="text-xs">Sites</TabsTrigger>
          <TabsTrigger value="pairs" className="text-xs">Binômes</TabsTrigger>
          <TabsTrigger value="settings" className="text-xs">Réglages</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div>
            <h2>{t('admin.dashboard')}</h2>
            <p className="text-sm text-muted-foreground">{t('admin.metrics')}</p>
          </div>

          {/* Présence des Binômes Board */}
          <Card className="shadow-sm border-2 border-[#f59e0b]/30">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <UsersRound className="size-5 text-[#f59e0b]" />
                Présence des Binômes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3 mb-3">
                <div 
                  className="text-center p-4 bg-gradient-to-br from-[#f59e0b]/10 to-[#f59e0b]/5 rounded-lg border border-[#f59e0b]/30 cursor-pointer hover:shadow-md transition-all"
                  onClick={() => handleOpenPairList('total')}
                >
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Users className="size-5 text-[#f59e0b]" />
                  </div>
                  <div className="text-3xl font-bold text-[#f59e0b] mb-1">{metrics.totalPairs}</div>
                  <p className="text-xs text-muted-foreground font-semibold">Total Binômes</p>
                </div>

                <div 
                  className="text-center p-4 bg-gradient-to-br from-[#10b981]/10 to-[#059669]/5 rounded-lg border border-[#10b981]/30 cursor-pointer hover:shadow-md transition-all"
                  onClick={() => handleOpenPairList('active')}
                >
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Users className="size-5 text-[#10b981]" />
                  </div>
                  <div className="text-3xl font-bold text-[#10b981] mb-1">{metrics.activePairs}</div>
                  <p className="text-xs text-muted-foreground font-semibold">Binômes Actifs</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Pair List Dialog */}
          <PairListDialog
            open={pairDialogOpen}
            onOpenChange={setPairDialogOpen}
            title={selectedPairType === 'total' ? 'Tous les Binômes' : 'Binômes Actifs'}
            pairs={selectedPairType === 'total' ? allPairs : activePairs}
          />

          <div className="grid grid-cols-2 gap-3">
            <Card className="shadow-sm border-2 border-[#10b981]/20 card-hover">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="w-10 h-10 rounded-lg bg-[#10b981]/10 flex items-center justify-center">
                    <Users className="size-5 text-[#10b981]" />
                  </div>
                  <TrendingUp className="size-4 text-[#10b981]" />
                </div>
                <div className="text-2xl font-bold mb-1">{metrics.totalEmployees}</div>
                <p className="text-xs text-muted-foreground font-semibold mb-2">{t('admin.totalEmployees')}</p>
                <div className="text-xs text-muted-foreground">
                  <span className="text-[#10b981] font-semibold">{metrics.activeToday} actifs</span> aujourd'hui
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-sm border-2 border-[#f59e0b]/20 card-hover">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="w-10 h-10 rounded-lg bg-[#f59e0b]/10 flex items-center justify-center">
                    <Building2 className="size-5 text-[#f59e0b]" />
                  </div>
                </div>
                <div className="text-2xl font-bold mb-1">{metrics.totalSupervisors}</div>
                <p className="text-xs text-muted-foreground font-semibold">{t('admin.totalSupervisors')}</p>
              </CardContent>
            </Card>

            <Card className="shadow-sm border-2 border-[#10b981]/20 card-hover">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="w-10 h-10 rounded-lg bg-[#10b981]/10 flex items-center justify-center">
                    <MapPin className="size-5 text-[#10b981]" />
                  </div>
                </div>
                <div className="text-2xl font-bold mb-1">{metrics.totalSites}</div>
                <p className="text-xs text-muted-foreground font-semibold">{t('admin.totalSites')}</p>
              </CardContent>
            </Card>

            <Card className="shadow-sm border-2 border-[#ef4444]/20 card-hover">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="w-10 h-10 rounded-lg bg-[#ef4444]/10 flex items-center justify-center">
                    <UsersRound className="size-5 text-[#ef4444]" />
                  </div>
                </div>
                <div className="text-2xl font-bold mb-1">{metrics.totalPairs}</div>
                <p className="text-xs text-muted-foreground font-semibold">{t('admin.totalPairs')}</p>
              </CardContent>
            </Card>
          </div>

          <Card className="shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <MapPin className="size-5 text-[#10b981]" />
                {t('nav.map')}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <AdminMapView />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="map">
          <AdminMapView />
        </TabsContent>

        <TabsContent value="users">
          <UserManagement />
        </TabsContent>

        <TabsContent value="sites">
          <AdminSiteManagement />
        </TabsContent>

        <TabsContent value="pairs">
          <AdminPairManagement />
        </TabsContent>

        <TabsContent value="settings">
          <SystemSettings />
        </TabsContent>
      </Tabs>
    </div>
  );
}