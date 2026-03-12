import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import React, { Suspense } from "react";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { AutoPilotProvider } from "@/contexts/AutoSyncContext";
import { AIAutoPilotProvider } from "@/contexts/AutoPilotContext";
import { GamificationProvider } from "@/contexts/GamificationContext";
import { MonetizationProvider } from "@/contexts/MonetizationContext";
import { AlertProvider } from "@/contexts/AlertContext";
import { TradingBotProvider } from "@/contexts/TradingBotContext";
import AuthGuard from "@/components/guards/AuthGuard";
import AppLayout from "@/components/layout/AppLayout";
import { XPNotification, AchievementPopup } from "@/components/gamification";
import Auth from "@/pages/Auth";
import Upgrade from "@/pages/Upgrade";
import LandingPage from "@/pages/LandingPage";
import UpdatePasswordPage from "@/pages/UpdatePasswordPage";
import Dashboard from "@/pages/Dashboard";
import RadarPage from "@/pages/RadarPage";
import AlertsPage from "@/pages/AlertsPage";
import ChatPage from "@/pages/ChatPage";
import LibraryPage from "@/pages/LibraryPage";
import ProfilePage from "@/pages/ProfilePage";
import CommunityPage from "@/pages/CommunityPage";
import AdminPage from "@/pages/AdminPage";
import GemHunterPage from "@/pages/GemHunterPage";
import NotFound from "./pages/NotFound";

// Lazy-loaded heavy pages for faster initial load
const SniperPage = React.lazy(() => import("@/pages/SniperPage"));
const AutoPilotPage = React.lazy(() => import("@/pages/AutoPilotPage"));
const BubblesPage = React.lazy(() => import("@/pages/BubblesPage"));
const SwingAnalysisPage = React.lazy(() => import("@/pages/SwingAnalysisPage"));
const GemPage = React.lazy(() => import("@/pages/GemPage"));
const TradeMasterProPage = React.lazy(() => import("@/pages/TradeMasterProPage"));
const TradeMasterAulaPage = React.lazy(() => import("@/pages/TradeMasterAulaPage"));
const CursoTradeMasterSalesPage = React.lazy(() => import("@/pages/CursoTradeMasterSalesPage"));

const LazyFallback = () => (
  <div className="flex items-center justify-center py-20">
    <div className="text-center space-y-3">
      <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
      <p className="text-sm text-muted-foreground">Loading...</p>
    </div>
  </div>
);

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <LanguageProvider>
      <AuthProvider>
        <AutoPilotProvider>
          <AIAutoPilotProvider>
            <GamificationProvider>
              <MonetizationProvider>
                <AlertProvider>
                  <TradingBotProvider>
                    <TooltipProvider>
                      <Toaster />
                      <Sonner />
                      <BrowserRouter>
                        <Routes>
                          <Route path="/" element={<LandingPage />} />
                          <Route path="/auth" element={<Auth />} />
                          <Route path="/upgrade" element={<Upgrade />} />
                          <Route path="/update-password" element={<UpdatePasswordPage />} />
                          <Route path="/curso-trade-master" element={<Suspense fallback={<LazyFallback />}><CursoTradeMasterSalesPage /></Suspense>} />

                          {/* Protected routes */}
                          <Route element={<AuthGuard><AppLayout /></AuthGuard>}>
                            <Route path="/dashboard" element={<Dashboard />} />
                            <Route path="/radar" element={<RadarPage />} />
                            <Route path="/swing" element={<Suspense fallback={<LazyFallback />}><SwingAnalysisPage /></Suspense>} />
                            <Route path="/sniper" element={<Suspense fallback={<LazyFallback />}><SniperPage /></Suspense>} />
                            <Route path="/alerts" element={<AlertsPage />} />
                            <Route path="/chat" element={<ChatPage />} />
                            <Route path="/bubbles" element={<Suspense fallback={<LazyFallback />}><BubblesPage /></Suspense>} />
                            <Route path="/library" element={<LibraryPage />} />
                            <Route path="/gems/:id" element={<Suspense fallback={<LazyFallback />}><GemPage /></Suspense>} />
                            <Route path="/gem-hunter" element={<GemHunterPage />} />
                            <Route path="/community" element={<CommunityPage />} />
                            <Route path="/profile" element={<ProfilePage />} />
                            <Route path="/autopilot" element={<Suspense fallback={<LazyFallback />}><AutoPilotPage /></Suspense>} />
                            <Route path="/admin" element={<AuthGuard requireAdmin><AdminPage /></AuthGuard>} />
                            <Route path="/biblioteca/trade-master-pro" element={<Suspense fallback={<LazyFallback />}><TradeMasterProPage /></Suspense>} />
                            <Route path="/biblioteca/trade-master-pro/:modulo/:aula" element={<Suspense fallback={<LazyFallback />}><TradeMasterAulaPage /></Suspense>} />
                          </Route>

                          <Route path="*" element={<NotFound />} />
                        </Routes>
                        <XPNotification />
                        <AchievementPopup />
                      </BrowserRouter>
                    </TooltipProvider>
                  </TradingBotProvider>
                </AlertProvider>
              </MonetizationProvider>
            </GamificationProvider>
          </AIAutoPilotProvider>
        </AutoPilotProvider>
      </AuthProvider>
    </LanguageProvider>
  </QueryClientProvider>
);

export default App;
