import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Users, CheckCircle2, MapPin, Clock } from 'lucide-react';

interface PairMember {
  name: string;
  employeeId: string;
  status: 'active' | 'inactive';
  lastVerification: string;
  site: string;
}

interface Pair {
  id: string;
  members: PairMember[];
  site: string;
  isActive: boolean;
}

interface PairListDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  pairs: Pair[];
}

export function PairListDialog({ 
  open, 
  onOpenChange,
  title,
  pairs
}: PairListDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[80vh] overflow-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Users className="size-5 text-[#10b981]" />
            {title}
          </DialogTitle>
          <DialogDescription>
            Liste détaillée des binômes et de leurs membres
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-3 pt-2">
          {pairs.map((pair) => (
            <Card key={pair.id} className={`border-2 ${pair.isActive ? 'border-[#10b981]/30' : 'border-muted'}`}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-[#10b981]/10 flex items-center justify-center">
                      <Users className="size-4 text-[#10b981]" />
                    </div>
                    <h4 className="font-semibold">{pair.id}</h4>
                  </div>
                  <Badge className={pair.isActive ? 'bg-[#10b981]/10 text-[#10b981] border-[#10b981]/20' : 'bg-muted'}>
                    {pair.isActive ? 'Actif' : 'Inactif'}
                  </Badge>
                </div>
                
                <div className="flex items-center gap-2 mb-3 text-sm text-muted-foreground">
                  <MapPin className="size-3" />
                  <span>{pair.site}</span>
                </div>
                
                <div className="space-y-2">
                  {pair.members.map((member, idx) => (
                    <div key={idx} className="flex items-start justify-between p-2 bg-muted/30 rounded-lg">
                      <div className="flex-1">
                        <p className="font-medium text-sm">{member.name}</p>
                        <p className="text-xs text-muted-foreground">ID: {member.employeeId}</p>
                        <div className="flex items-center gap-1 mt-1">
                          <Clock className="size-3 text-muted-foreground" />
                          <span className="text-xs text-muted-foreground">{member.lastVerification}</span>
                        </div>
                      </div>
                      {member.status === 'active' && (
                        <CheckCircle2 className="size-4 text-[#10b981]" />
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}