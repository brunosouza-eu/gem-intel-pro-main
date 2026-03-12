/**
 * ✏️ Edit Profile Modal
 * Premium modal for editing user profile — no links allowed
 */
import React, { useState, useEffect } from 'react';
import { X, User, MapPin, FileText, Camera, Loader2, Check, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { updateProfile, containsLink } from '@/lib/communityService';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { useGamification } from '@/contexts/GamificationContext';

interface EditProfileModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    profile: {
        username?: string | null;
        bio?: string;
        location?: string;
        avatar_url?: string | null;
    } | null;
    onSuccess?: () => void;
}

export function EditProfileModal({ open, onOpenChange, profile, onSuccess }: EditProfileModalProps) {
    const { language } = useLanguage();
    const { refreshProfile } = useAuth();
    const { refreshProfile: refreshGamificationProfile } = useGamification();
    const pt = language === 'pt';
    const fileInputRef = React.useRef<HTMLInputElement>(null);

    const [username, setUsername] = useState('');
    const [bio, setBio] = useState('');
    const [location, setLocation] = useState('');
    const [avatarUrl, setAvatarUrl] = useState('');
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (profile && open) {
            setUsername(profile.username || '');
            setBio(profile.bio || '');
            setLocation(profile.location || '');
            setAvatarUrl(profile.avatar_url || '');
            setSaved(false);
            setError('');
        }
    }, [profile, open]);

    // Check for links as user types
    const bioHasLink = containsLink(bio);
    const locationHasLink = containsLink(location);

    const handleSave = async () => {
        setError('');

        if (bioHasLink || locationHasLink) {
            setError(pt ? 'Links não são permitidos no perfil.' : 'Links are not allowed in profile.');
            return;
        }

        if (!username.trim()) {
            setError(pt ? 'Nome de usuário é obrigatório.' : 'Username is required.');
            return;
        }

        setSaving(true);
        try {
            const result = await updateProfile({
                username: username.trim(),
                bio: bio.trim(),
                location: location.trim(),
                avatar_url: avatarUrl.trim() || undefined,
            });

            if (result.success) {
                setSaved(true);
                await refreshProfile();
                await refreshGamificationProfile();
                setTimeout(() => {
                    onOpenChange(false);
                    onSuccess?.();
                }, 600);
            } else {
                setError(result.error || (pt ? 'Erro ao salvar.' : 'Error saving.'));
            }
        } catch (err: any) {
            setError(err.message || (pt ? 'Erro inesperado.' : 'Unexpected error.'));
        } finally {
            setSaving(false);
        }
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                const MAX_SIZE = 250;
                let width = img.width;
                let height = img.height;

                if (width > height) {
                    if (width > MAX_SIZE) {
                        height *= MAX_SIZE / width;
                        width = MAX_SIZE;
                    }
                } else {
                    if (height > MAX_SIZE) {
                        width *= MAX_SIZE / height;
                        height = MAX_SIZE;
                    }
                }

                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');
                ctx?.drawImage(img, 0, 0, width, height);

                const dataUrl = canvas.toDataURL('image/webp', 0.8);
                setAvatarUrl(dataUrl);
            };
            img.src = event.target?.result as string;
        };
        reader.readAsDataURL(file);
    };

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={() => onOpenChange(false)}
            />

            {/* Modal */}
            <div className={cn(
                "relative w-full max-w-md rounded-2xl overflow-hidden",
                "bg-card/95 backdrop-blur-xl border border-border/50",
                "shadow-2xl shadow-primary/5",
                "animate-in fade-in-0 zoom-in-95 duration-200"
            )}>
                {/* Cover gradient */}
                <div className="h-24 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-500 relative">
                    <button
                        onClick={() => onOpenChange(false)}
                        className="absolute top-3 right-3 p-1.5 rounded-full bg-black/30 hover:bg-black/50 text-white transition-colors"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>

                {/* Avatar area */}
                <div className="px-6 -mt-10 mb-4 flex justify-center lg:justify-start">
                    <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                        <div className="relative w-20 h-20 rounded-full border-4 border-card bg-muted overflow-hidden flex items-center justify-center">
                            {avatarUrl ? (
                                <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600 text-white text-2xl font-bold">
                                    {username?.charAt(0)?.toUpperCase() || '?'}
                                </div>
                            )}
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center">
                                <Camera className="w-5 h-5 text-white mb-0.5" />
                                <span className="text-[9px] text-white font-medium">{pt ? 'Alterar' : 'Change'}</span>
                            </div>
                        </div>
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleImageUpload}
                            accept="image/*"
                            className="hidden"
                        />
                    </div>
                </div>

                {/* Form */}
                <div className="px-6 pb-6 space-y-4 max-h-[60vh] overflow-y-auto">
                    <h2 className="text-lg font-bold">
                        {pt ? 'Editar Perfil' : 'Edit Profile'}
                    </h2>

                    {/* Error */}
                    {error && (
                        <div className="flex items-center gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs">
                            <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                            {error}
                        </div>
                    )}

                    {/* Username */}
                    <div>
                        <label className="text-xs font-medium text-muted-foreground flex items-center gap-1.5 mb-1.5">
                            <User className="w-3.5 h-3.5" />
                            {pt ? 'Nome de usuário' : 'Username'} *
                        </label>
                        <input
                            value={username}
                            onChange={e => setUsername(e.target.value)}
                            maxLength={30}
                            className={cn(
                                "w-full px-3 py-2.5 rounded-xl text-sm",
                                "bg-muted/50 border border-border/50",
                                "focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50",
                                "transition-all placeholder:text-muted-foreground/50"
                            )}
                            placeholder={pt ? 'Seu nome...' : 'Your name...'}
                        />
                    </div>

                    {/* Bio */}
                    <div>
                        <label className="text-xs font-medium text-muted-foreground flex items-center gap-1.5 mb-1.5">
                            <FileText className="w-3.5 h-3.5" />
                            Bio
                        </label>
                        <textarea
                            value={bio}
                            onChange={e => setBio(e.target.value)}
                            maxLength={160}
                            rows={3}
                            className={cn(
                                "w-full px-3 py-2.5 rounded-xl text-sm resize-none",
                                "bg-muted/50 border",
                                bioHasLink ? "border-red-500/50 ring-1 ring-red-500/20" : "border-border/50",
                                "focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50",
                                "transition-all placeholder:text-muted-foreground/50"
                            )}
                            placeholder={pt ? 'Conta um pouco sobre você...' : 'Tell us about yourself...'}
                        />
                        <div className="flex justify-between mt-1">
                            {bioHasLink ? (
                                <span className="text-[10px] text-red-400 flex items-center gap-1">
                                    <AlertTriangle className="w-3 h-3" />
                                    {pt ? 'Links não permitidos' : 'Links not allowed'}
                                </span>
                            ) : <span />}
                            <span className="text-[10px] text-muted-foreground">{bio.length}/160</span>
                        </div>
                    </div>

                    {/* Location */}
                    <div>
                        <label className="text-xs font-medium text-muted-foreground flex items-center gap-1.5 mb-1.5">
                            <MapPin className="w-3.5 h-3.5" />
                            {pt ? 'Localização' : 'Location'}
                        </label>
                        <input
                            value={location}
                            onChange={e => setLocation(e.target.value)}
                            maxLength={50}
                            className={cn(
                                "w-full px-3 py-2.5 rounded-xl text-sm",
                                "bg-muted/50 border",
                                locationHasLink ? "border-red-500/50 ring-1 ring-red-500/20" : "border-border/50",
                                "focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50",
                                "transition-all placeholder:text-muted-foreground/50"
                            )}
                            placeholder={pt ? 'Sua cidade...' : 'Your city...'}
                        />
                        {locationHasLink && (
                            <span className="text-[10px] text-red-400 flex items-center gap-1 mt-1">
                                <AlertTriangle className="w-3 h-3" />
                                {pt ? 'Links não permitidos' : 'Links not allowed'}
                            </span>
                        )}
                    </div>

                    {/* Save Button */}
                    <button
                        onClick={handleSave}
                        disabled={saving || saved || bioHasLink || locationHasLink}
                        className={cn(
                            "w-full py-3 rounded-xl font-semibold text-sm transition-all",
                            "flex items-center justify-center gap-2",
                            saved
                                ? "bg-emerald-500 text-white"
                                : "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white",
                            "disabled:opacity-60 disabled:cursor-not-allowed",
                            "shadow-lg shadow-primary/20 hover:shadow-primary/30"
                        )}
                    >
                        {saved ? (
                            <><Check className="w-4 h-4" /> {pt ? 'Salvo!' : 'Saved!'}</>
                        ) : saving ? (
                            <><Loader2 className="w-4 h-4 animate-spin" /> {pt ? 'Salvando...' : 'Saving...'}</>
                        ) : (
                            pt ? 'Salvar Alterações' : 'Save Changes'
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
