import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useAffiliates, AffiliateLinks } from '@/hooks/useAffiliates';
import { Save, Link as LinkIcon, ExternalLink } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

export const AffiliateSettings: React.FC = () => {
    const { links, updateLink } = useAffiliates();
    const [formData, setFormData] = useState<AffiliateLinks>(links);

    const handleChange = (platform: keyof AffiliateLinks, value: string) => {
        setFormData(prev => ({ ...prev, [platform]: value }));
    };

    const handleSave = () => {
        Object.entries(formData).forEach(([key, value]) => {
            updateLink(key as keyof AffiliateLinks, value);
        });

        toast({
            title: "Settings Saved",
            description: "Affiliate links updated successfully.",
            className: "bg-green-600 text-white"
        });
    };

    return (
        <Card className="border-primary/20 bg-card/50">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <LinkIcon className="w-5 h-5 text-primary" />
                    Affiliate Links Configuration
                </CardTitle>
                <CardDescription>
                    Set your referral links here. These will be used throughout the app (Buttons, Charts, etc).
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="mexc">MEXC Link (Gems & Memecoins)</Label>
                    <div className="flex gap-2">
                        <Input
                            id="mexc"
                            placeholder="https://www.mexc.com/pt-BR/acquisition/custom-sign-up?shareCode=..."
                            value={formData.mexc}
                            onChange={(e) => handleChange('mexc', e.target.value)}
                            className="bg-background/50"
                        />
                        {formData.mexc && (
                            <Button variant="ghost" size="icon" onClick={() => window.open(formData.mexc, '_blank')}>
                                <ExternalLink className="w-4 h-4" />
                            </Button>
                        )}
                    </div>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="bybit">Bybit Link (Futures & Swing)</Label>
                    <div className="flex gap-2">
                        <Input
                            id="bybit"
                            placeholder="https://www.bybit.com/register?affiliate_id=..."
                            value={formData.bybit}
                            onChange={(e) => handleChange('bybit', e.target.value)}
                            className="bg-background/50"
                        />
                        {formData.bybit && (
                            <Button variant="ghost" size="icon" onClick={() => window.open(formData.bybit, '_blank')}>
                                <ExternalLink className="w-4 h-4" />
                            </Button>
                        )}
                    </div>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="binance">Binance Link (General)</Label>
                    <div className="flex gap-2">
                        <Input
                            id="binance"
                            placeholder="https://accounts.binance.com/register?ref=..."
                            value={formData.binance}
                            onChange={(e) => handleChange('binance', e.target.value)}
                            className="bg-background/50"
                        />
                        {formData.binance && (
                            <Button variant="ghost" size="icon" onClick={() => window.open(formData.binance, '_blank')}>
                                <ExternalLink className="w-4 h-4" />
                            </Button>
                        )}
                    </div>
                </div>

                <Button onClick={handleSave} className="w-full mt-4 bg-primary hover:bg-primary/90">
                    <Save className="w-4 h-4 mr-2" />
                    Save Affiliate Links
                </Button>
            </CardContent>
        </Card>
    );
};
