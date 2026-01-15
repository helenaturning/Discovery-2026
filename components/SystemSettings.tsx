import { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Slider } from './ui/slider';
import { Settings, Clock, MapPin, Brain } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

export function SystemSettings() {
  const { t } = useLanguage();
  const [settings, setSettings] = useState({
    verificationFrequency: 90,
    defaultRadius: 100,
    aiThreshold: 75,
  });

  const handleSave = () => {
    toast.success(t('success'));
  };

  return (
    <div className="space-y-6">
      <div>
        <h2>{t('admin.settings')}</h2>
        <p className="text-muted-foreground">Configure global system parameters</p>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Clock className="size-5 text-primary" />
              </div>
              <div>
                <CardTitle>{t('admin.settings.verification')}</CardTitle>
                <CardDescription>
                  How often employees must verify their presence
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>{t('admin.settings.verification')}</Label>
                <span className="text-sm font-medium">
                  {settings.verificationFrequency} {t('admin.settings.minutes')}
                </span>
              </div>
              <Slider
                value={[settings.verificationFrequency]}
                onValueChange={([value]) => setSettings({ ...settings, verificationFrequency: value })}
                min={30}
                max={180}
                step={15}
              />
              <p className="text-xs text-muted-foreground">
                Range: 30-180 minutes
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <MapPin className="size-5 text-primary" />
              </div>
              <div>
                <CardTitle>{t('admin.settings.defaultRadius')}</CardTitle>
                <CardDescription>
                  Default authorized radius for new sites
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>{t('admin.settings.defaultRadius')}</Label>
                <span className="text-sm font-medium">
                  {settings.defaultRadius} {t('admin.settings.meters')}
                </span>
              </div>
              <Slider
                value={[settings.defaultRadius]}
                onValueChange={([value]) => setSettings({ ...settings, defaultRadius: value })}
                min={50}
                max={500}
                step={25}
              />
              <p className="text-xs text-muted-foreground">
                Range: 50-500 meters
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Brain className="size-5 text-primary" />
              </div>
              <div>
                <CardTitle>{t('admin.settings.aiThreshold')}</CardTitle>
                <CardDescription>
                  Minimum confidence score to trigger AI alerts
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>{t('admin.settings.aiThreshold')}</Label>
                <span className="text-sm font-medium">
                  {settings.aiThreshold}{t('admin.settings.percentage')}
                </span>
              </div>
              <Slider
                value={[settings.aiThreshold]}
                onValueChange={([value]) => setSettings({ ...settings, aiThreshold: value })}
                min={50}
                max={95}
                step={5}
              />
              <p className="text-xs text-muted-foreground">
                Range: 50-95%
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-end">
        <Button onClick={handleSave}>
          <Settings className="size-4 mr-2" />
          {t('save')}
        </Button>
      </div>
    </div>
  );
}
