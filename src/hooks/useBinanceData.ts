import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';

export const useBinanceData = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { language } = useLanguage();

  const fetchBinanceData = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('fetch-binance-data');
      
      if (error) throw error;

      toast({
        title: language === 'pt' ? 'Dados atualizados!' : 'Data updated!',
        description: language === 'pt' 
          ? `${data.tokens?.length || 0} tokens sincronizados da Binance`
          : `${data.tokens?.length || 0} tokens synced from Binance`,
      });

      return data;
    } catch (error) {
      console.error('Error fetching Binance data:', error);
      toast({
        variant: 'destructive',
        title: language === 'pt' ? 'Erro' : 'Error',
        description: language === 'pt' 
          ? 'Falha ao buscar dados da Binance'
          : 'Failed to fetch Binance data',
      });
      throw error;
    } finally {
      setLoading(false);
    }
  }, [language, toast]);

  return { fetchBinanceData, loading };
};
