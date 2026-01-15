import { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Tabs, TabsList, TabsTrigger, TabsContent } from './ui/tabs';
import { CheckCircle2, Clock, XCircle, MapPin, Users as UsersIcon } from 'lucide-react';
import { PresenceStatus } from '../types';

interface RealTimeMonitoringProps {
  searchQuery: string;
}

export function RealTimeMonitoring({ searchQuery }: RealTimeMonitoringProps) {
  const { t } = useLanguage();
  const { allUsers, pairs, sites } = useAuth();
  const [statusFilter, setStatusFilter] = useState<PresenceStatus | 'all'>('all');

  const employees = allUsers.filter(u => u.role === 'employee');

  // Mock employee statuses for demo
  const employeeStatuses = employees.map((emp, index) => ({
    ...emp,
    status: index % 3 === 0 ? 'present' : index % 3 === 1 ? 'absent' : 'paused' as PresenceStatus,
    lastCheckIn: new Date(Date.now() - Math.random() * 3600000),
    reliabilityScore: 80 + Math.floor(Math.random() * 20),
    currentLocation: index % 3 === 0 ? sites[0] : null,
  }));

  const filteredEmployees = employeeStatuses.filter(emp => {
    const matchesSearch = 
      emp.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.employeeId.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || emp.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusIcon = (status: PresenceStatus) => {
    switch (status) {
      case 'present': return <CheckCircle2 className="size-4 text-green-500" />;
      case 'paused': return <Clock className="size-4 text-yellow-500" />;
      default: return <XCircle className="size-4 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: PresenceStatus) => {
    const variants: Record<PresenceStatus, string> = {
      present: 'bg-green-500',
      absent: 'bg-gray-500',
      paused: 'bg-yellow-500',
      suspended: 'bg-red-500',
      notStarted: 'bg-gray-400',
    };
    
    return (
      <Badge className={variants[status]}>
        {t(`employee.status.${status}`)}
      </Badge>
    );
  };

  const getEmployeePair = (empId: string) => {
    const pair = pairs.find(p => p.active && (p.employee1Id === empId || p.employee2Id === empId));
    if (!pair) return null;
    
    const partnerId = pair.employee1Id === empId ? pair.employee2Id : pair.employee1Id;
    return allUsers.find(u => u.id === partnerId);
  };

  return (
    <div className="space-y-4">
      <Tabs value={statusFilter} onValueChange={(v) => setStatusFilter(v as PresenceStatus | 'all')}>
        <TabsList>
          <TabsTrigger value="all">All ({employeeStatuses.length})</TabsTrigger>
          <TabsTrigger value="present">
            Present ({employeeStatuses.filter(e => e.status === 'present').length})
          </TabsTrigger>
          <TabsTrigger value="absent">
            Absent ({employeeStatuses.filter(e => e.status === 'absent').length})
          </TabsTrigger>
          <TabsTrigger value="paused">
            Paused ({employeeStatuses.filter(e => e.status === 'paused').length})
          </TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="grid grid-cols-1 gap-3">
        {filteredEmployees.map((emp) => {
          const partner = getEmployeePair(emp.id);
          const site = sites.find(s => s.id === emp.currentLocation?.id);
          
          return (
            <Card key={emp.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3 flex-1">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback>
                        {emp.firstName[0]}{emp.lastName[0]}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-medium truncate">
                          {emp.firstName} {emp.lastName}
                        </p>
                        {getStatusIcon(emp.status)}
                      </div>
                      
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">
                          {emp.employeeId}
                        </p>
                        
                        {site && (
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <MapPin className="size-3" />
                            {site.name}
                          </div>
                        )}
                        
                        {partner && (
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <UsersIcon className="size-3" />
                            {partner.firstName} {partner.lastName}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col items-end gap-2">
                    {getStatusBadge(emp.status)}
                    
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground">
                        {t('employee.summary.score')}
                      </p>
                      <p className="text-sm font-medium">
                        {emp.reliabilityScore}%
                      </p>
                    </div>
                    
                    {emp.status === 'present' && (
                      <p className="text-xs text-muted-foreground">
                        Last check-in: {emp.lastCheckIn.toLocaleTimeString()}
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredEmployees.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <UsersIcon className="size-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No employees found</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
