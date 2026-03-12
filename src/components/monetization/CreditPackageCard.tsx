import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Coins, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/contexts/LanguageContext';

export interface CreditPackage {
    id: string;
    name: string;
    credits: number;
    price: number;
    image_url?: string;
    popular?: boolean;
    desc?: string;
}

interface CreditPackageCardProps {
    pkg: CreditPackage;
    onPurchase: (pkg: CreditPackage) => void;
    isLoading?: boolean;
}

const CreditPackageCard: React.FC<CreditPackageCardProps> = ({ pkg, onPurchase, isLoading }) => {
    const { language, t } = useLanguage();
    const ts = (key: string) => String(t(key as any) || key);

    const isPt = language === 'pt';
    const currencySymbol = isPt ? 'R$' : '$';

    const formatPrice = (price: number) => {
        if (isPt) {
            return `R$ ${price.toFixed(2).replace('.', ',')}`;
        }
        return `$${price.toFixed(2)}`;
    };

    return (
        <Card className={cn(
            "relative border-border/50 transition-all duration-300 hover:border-primary/50 hover:shadow-lg hover:-translate-y-1",
            pkg.popular ? "bg-primary/5 border-primary/30" : "bg-card/50"
        )}>
            {pkg.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-primary text-primary-foreground text-xs font-bold rounded-full shadow-md whitespace-nowrap">
                    {ts('mostPopularBadge')}
                </div>
            )}

            <CardHeader className="text-center pb-2">
                <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                    <Coins className="w-6 h-6 text-primary" />
                </div>
                <CardTitle className="text-xl">{pkg.name}</CardTitle>
                <CardDescription className="text-2xl font-bold text-foreground mt-2">
                    {pkg.credits} <span className="text-sm font-normal text-muted-foreground">{ts('creditsLabel')}</span>
                </CardDescription>
            </CardHeader>

            <CardContent className="text-center pb-4">
                <div className="text-3xl font-bold text-emerald-500">
                    {formatPrice(pkg.price)}
                </div>
                {pkg.desc ? (
                    <p className="text-xs text-emerald-400 font-bold bg-emerald-500/10 px-3 py-1 rounded-full mt-3 inline-block border border-emerald-500/20">
                        {pkg.desc}
                    </p>
                ) : (
                    <p className="text-xs text-muted-foreground mt-1">
                        {ts('oneTimePayment')}
                    </p>
                )}
            </CardContent>

            <CardFooter>
                <Button
                    variant={pkg.popular ? "default" : "outline"}
                    className="w-full"
                    onClick={() => onPurchase(pkg)}
                    disabled={isLoading}
                >
                    {isLoading ? ts('processingBtn') : ts('buyNowBtn')}
                </Button>
            </CardFooter>
        </Card>
    );
};

export default CreditPackageCard;
