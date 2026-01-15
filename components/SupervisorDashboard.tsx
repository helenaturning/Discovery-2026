import { useLanguage } from '../contexts/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Users, MapPin, UsersRound, AlertCircle, TrendingUp, Activity } from 'lucide-react';
import { useState } from 'react';
import { PairListDialog } from './PairListDialog';

export function SupervisorDashboard() {
  const { t } = useLanguage();
  const [pairDialogOpen, setPairDialogOpen] = useState(false);
  const [selectedPairType, setSelectedPairType] = useState<'total' | 'active'>('total');

  const kpis = {
    activeEmployees: 24,
    totalEmployees: 28,
    activePairs: 12,
    totalPairs: 14,
    activeSites: 2,
    aiAlerts: 3,
  };
  
  // Mock pairs data
  const allPairs = [
    {
      id: 'Binôme #1',
      members: [
        { name: 'Jean Dupont', employeeId: 'EMP001', status: 'active' as const, lastVerification: 'Il y a 5 min', site: 'Site Alpha' },
        { name: 'Marie Martin', employeeId: 'EMP002', status: 'active' as const, lastVerification: 'Il y a 8 min', site: 'Site Alpha' }
      ],
      site: 'Site Alpha',
      isActive: true
    },
    {
      id: 'Binôme #2',
      members: [
        { name: 'Pierre Bernard', employeeId: 'EMP003', status: 'active' as const, lastVerification: 'Il y a 12 min', site: 'Site Alpha' },
        { name: 'Sophie Laurent', employeeId: 'EMP004', status: 'active' as const, lastVerification: 'Il y a 10 min', site: 'Site Alpha' }
      ],
      site: 'Site Alpha',
      isActive: true
    },
    {
      id: 'Binôme #3',
      members: [
        { name: 'Luc Moreau', employeeId: 'EMP005', status: 'active' as const, lastVerification: 'Il y a 7 min', site: 'Site Beta' },
        { name: 'Alice Petit', employeeId: 'EMP006', status: 'active' as const, lastVerification: 'Il y a 6 min', site: 'Site Beta' }
      ],
      site: 'Site Beta',
      isActive: true
    },
    {
      id: 'Binôme #4',
      members: [
        { name: 'Thomas Robert', employeeId: 'EMP007', status: 'active' as const, lastVerification: 'Il y a 15 min', site: 'Site Beta' },
        { name: 'Emma Leroy', employeeId: 'EMP008', status: 'active' as const, lastVerification: 'Il y a 13 min', site: 'Site Beta' }
      ],
      site: 'Site Beta',
      isActive: true
    },
    {
      id: 'Binôme #5',
      members: [
        { name: 'Lucas Simon', employeeId: 'EMP009', status: 'active' as const, lastVerification: 'Il y a 9 min', site: 'Site Alpha' },
        { name: 'Chloé Michel', employeeId: 'EMP010', status: 'active' as const, lastVerification: 'Il y a 11 min', site: 'Site Alpha' }
      ],
      site: 'Site Alpha',
      isActive: true
    },
    {
      id: 'Binôme #6',
      members: [
        { name: 'Hugo Lefebvre', employeeId: 'EMP011', status: 'active' as const, lastVerification: 'Il y a 14 min', site: 'Site Alpha' },
        { name: 'Léa Garcia', employeeId: 'EMP012', status: 'active' as const, lastVerification: 'Il y a 16 min', site: 'Site Alpha' }
      ],
      site: 'Site Alpha',
      isActive: true
    },
    {
      id: 'Binôme #7',
      members: [
        { name: 'Nathan Roux', employeeId: 'EMP013', status: 'active' as const, lastVerification: 'Il y a 18 min', site: 'Site Beta' },
        { name: 'Manon Girard', employeeId: 'EMP014', status: 'active' as const, lastVerification: 'Il y a 17 min', site: 'Site Beta' }
      ],
      site: 'Site Beta',
      isActive: true
    },
    {
      id: 'Binôme #8',
      members: [
        { name: 'Julien Andre', employeeId: 'EMP015', status: 'active' as const, lastVerification: 'Il y a 20 min', site: 'Site Beta' },
        { name: 'Clara Rousseau', employeeId: 'EMP016', status: 'active' as const, lastVerification: 'Il y a 19 min', site: 'Site Beta' }
      ],
      site: 'Site Beta',
      isActive: true
    },
    {
      id: 'Binôme #9',
      members: [
        { name: 'Antoine Vincent', employeeId: 'EMP017', status: 'active' as const, lastVerification: 'Il y a 22 min', site: 'Site Alpha' },
        { name: 'Camille Morel', employeeId: 'EMP018', status: 'active' as const, lastVerification: 'Il y a 21 min', site: 'Site Alpha' }
      ],
      site: 'Site Alpha',
      isActive: true
    },
    {
      id: 'Binôme #10',
      members: [
        { name: 'Maxime Fournier', employeeId: 'EMP019', status: 'active' as const, lastVerification: 'Il y a 24 min', site: 'Site Beta' },
        { name: 'Sarah Bonnet', employeeId: 'EMP020', status: 'active' as const, lastVerification: 'Il y a 23 min', site: 'Site Beta' }
      ],
      site: 'Site Beta',
      isActive: true
    },
    {
      id: 'Binôme #11',
      members: [
        { name: 'Théo Lambert', employeeId: 'EMP021', status: 'active' as const, lastVerification: 'Il y a 26 min', site: 'Site Alpha' },
        { name: 'Océane Durand', employeeId: 'EMP022', status: 'active' as const, lastVerification: 'Il y a 25 min', site: 'Site Alpha' }
      ],
      site: 'Site Alpha',
      isActive: true
    },
    {
      id: 'Binôme #12',
      members: [
        { name: 'Gabriel Blanc', employeeId: 'EMP023', status: 'active' as const, lastVerification: 'Il y a 28 min', site: 'Site Beta' },
        { name: 'Inès Guerin', employeeId: 'EMP024', status: 'active' as const, lastVerification: 'Il y a 27 min', site: 'Site Beta' }
      ],
      site: 'Site Beta',
      isActive: true
    },
    {
      id: 'Binôme #13',
      members: [
        { name: 'Alexandre Boyer', employeeId: 'EMP025', status: 'inactive' as const, lastVerification: 'Il y a 2h', site: 'Site Alpha' },
        { name: 'Julie Garnier', employeeId: 'EMP026', status: 'inactive' as const, lastVerification: 'Il y a 2h', site: 'Site Alpha' }
      ],
      site: 'Site Alpha',
      isActive: false
    },
    {
      id: 'Binôme #14',
      members: [
        { name: 'Raphaël Chevalier', employeeId: 'EMP027', status: 'inactive' as const, lastVerification: 'Il y a 3h', site: 'Site Beta' },
        { name: 'Zoé Martin', employeeId: 'EMP028', status: 'inactive' as const, lastVerification: 'Il y a 3h', site: 'Site Beta' }
      ],
      site: 'Site Beta',
      isActive: false
    },
  ];
  
  const activePairs = allPairs.filter(pair => pair.isActive);

  const handleOpenPairList = (type: 'total' | 'active') => {
    setSelectedPairType(type);
    setPairDialogOpen(true);
  };

  const employeePercentage = (kpis.activeEmployees / kpis.totalEmployees) * 100;

  return (
    <div className="space-y-4 pb-20 max-w-[390px] mx-auto">
      <div>
        <h2>{t('supervisor.dashboard')}</h2>
        <p className="text-sm text-muted-foreground">Vue d'ensemble en temps réel</p>
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
              <div className="text-3xl font-bold text-[#f59e0b] mb-1">{kpis.totalPairs}</div>
              <p className="text-xs text-muted-foreground font-semibold">Total Binômes</p>
            </div>

            <div 
              className="text-center p-4 bg-gradient-to-br from-[#10b981]/10 to-[#059669]/5 rounded-lg border border-[#10b981]/30 cursor-pointer hover:shadow-md transition-all"
              onClick={() => handleOpenPairList('active')}
            >
              <div className="flex items-center justify-center gap-2 mb-2">
                <Users className="size-5 text-[#10b981]" />
              </div>
              <div className="text-3xl font-bold text-[#10b981] mb-1">{kpis.activePairs}</div>
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

      {/* KPI Cards */}
      <div className="grid grid-cols-2 gap-3">
        <Card className="shadow-sm border-2 border-[#10b981]/20 card-hover">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="w-10 h-10 rounded-lg bg-[#10b981]/10 flex items-center justify-center">
                <Users className="size-5 text-[#10b981]" />
              </div>
              <TrendingUp className="size-4 text-[#10b981]" />
            </div>
            <div className="text-2xl font-bold mb-1">{kpis.activeEmployees}/{kpis.totalEmployees}</div>
            <p className="text-xs text-muted-foreground font-semibold mb-2">Employés Actifs</p>
            <div className="h-1.5 bg-muted rounded-full overflow-hidden">
              <div className="h-full bg-[#10b981] rounded-full transition-all duration-500" style={{ width: `${employeePercentage}%` }} />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-2 border-[#10b981]/20 card-hover">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="w-10 h-10 rounded-lg bg-[#10b981]/10 flex items-center justify-center">
                <MapPin className="size-5 text-[#10b981]" />
              </div>
            </div>
            <div className="text-2xl font-bold mb-1">{kpis.activeSites}</div>
            <p className="text-xs text-muted-foreground font-semibold">Sites</p>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-2 border-[#ef4444]/20 bg-gradient-to-br from-[#ef4444]/5 to-transparent card-hover">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="w-10 h-10 rounded-lg bg-[#ef4444]/10 flex items-center justify-center">
                <AlertCircle className="size-5 text-[#ef4444]" />
              </div>
              {kpis.aiAlerts > 0 && (
                <div className="w-2 h-2 rounded-full bg-[#ef4444] animate-pulse" />
              )}
            </div>
            <div className="text-2xl font-bold mb-1 text-[#ef4444]">{kpis.aiAlerts}</div>
            <p className="text-xs text-muted-foreground font-semibold">Alertes IA</p>
          </CardContent>
        </Card>
      </div>

      {/* Map View */}
      <Card className="shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <MapPin className="size-5 text-[#10b981]" />
            Carte des Sites
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="aspect-square bg-gradient-to-br from-[#e0f2fe] to-[#dbeafe] relative overflow-hidden">
            {/* Grid pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="grid grid-cols-8 grid-rows-8 h-full">
                {[...Array(64)].map((_, i) => (
                  <div key={i} className="border border-[#10b981]" />
                ))}
              </div>
            </div>

            {/* Google Maps badge */}
            <div className="absolute top-4 right-4 bg-white px-3 py-1.5 rounded-full shadow-lg border z-10">
              <p className="text-xs font-bold">Google Maps</p>
            </div>

            {/* Real-time tracking badge */}
            <div className="absolute top-4 left-4 z-10">
              <div className="bg-white px-3 py-1.5 rounded-full shadow-lg border flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[#10b981] animate-pulse" />
                <p className="text-xs font-bold text-[#10b981]">LIVE</p>
              </div>
            </div>

            {/* Site markers */}
            <div className="absolute top-1/3 left-1/3 z-10">
              <div className="relative">
                <div className="w-12 h-12 rounded-full bg-[#10b981] border-4 border-white shadow-xl flex items-center justify-center">
                  <MapPin className="size-6 text-white" fill="white" />
                </div>
                <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-white border-2 border-[#10b981] flex items-center justify-center shadow">
                  <span className="text-xs font-bold text-[#10b981]">12</span>
                </div>
              </div>
            </div>

            <div className="absolute top-1/2 right-1/4 z-10">
              <div className="relative">
                <div className="w-12 h-12 rounded-full bg-[#f59e0b] border-4 border-white shadow-xl flex items-center justify-center animate-pulse">
                  <MapPin className="size-6 text-white" fill="white" />
                </div>
                <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-white border-2 border-[#f59e0b] flex items-center justify-center shadow">
                  <span className="text-xs font-bold text-[#f59e0b]">12</span>
                </div>
              </div>
            </div>

            {/* Legend */}
            <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur rounded-lg p-3 shadow-lg border">
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#10b981]" />
                  <span className="font-semibold">Site Alpha (12)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#f59e0b]" />
                  <span className="font-semibold">Site Beta (12)</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card className="shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Activity className="size-5 text-[#10b981]" />
            Activité Récente
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y">
            {[
              { employee: 'Jean Dupont', action: 'Vérification validée', time: '2min', status: 'success', icon: '✓' },
              { employee: 'Marie Martin', action: 'Arrivée sur site', time: '15min', status: 'success', icon: '→' },
              { employee: 'Pierre Bernard', action: 'Anomalie GPS détectée', time: '32min', status: 'warning', icon: '⚠' },
              { employee: 'Sophie Laurent', action: 'Pause démarrée', time: '45min', status: 'info', icon: '⏸' },
            ].map((activity, i) => (
              <div key={i} className="flex items-center justify-between px-4 py-3 hover:bg-muted/50 transition-colors">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg shrink-0 ${
                    activity.status === 'success' ? 'bg-[#10b981]/10' :
                    activity.status === 'warning' ? 'bg-[#ef4444]/10' :
                    'bg-[#f59e0b]/10'
                  }`}>
                    {activity.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm truncate">{activity.employee}</p>
                    <p className="text-xs text-muted-foreground truncate">{activity.action}</p>
                  </div>
                </div>
                <Badge className={`shrink-0 ${
                  activity.status === 'warning' 
                    ? 'bg-[#ef4444]/10 text-[#ef4444] border-[#ef4444]/20' 
                    : 'bg-muted text-muted-foreground border-border'
                }`}>
                  {activity.time}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}