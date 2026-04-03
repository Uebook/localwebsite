import { useState, useEffect, useCallback } from 'react';

export interface LocationState {
    lat: number | null;
    lng: number | null;
    city: string;
    loading: boolean;
    error: string | null;
}

export const useLocation = () => {
    const [location, setLocation] = useState<LocationState>({
        lat: null,
        lng: null,
        city: '',
        loading: false, // Don't start with loading: true to avoid flicker on first load if we have saved data
        error: null,
    });

    useEffect(() => {
        const loadLocation = () => {
            const savedLocation = localStorage.getItem('localmarket_location');
            if (savedLocation) {
                try {
                    const parsed = JSON.parse(savedLocation);
                    if (parsed.city) {
                        setLocation({ ...parsed, loading: false, error: null });
                    }
                } catch (e) {
                    console.error('Failed to parse saved location', e);
                }
            } else {
                setLocation(prev => ({ ...prev, loading: false }));
            }
        };

        loadLocation();

        // Listen for changes from other components/tabs
        const handleUpdate = () => {
            // Use setTimeout to push to next tick and avoid React "update in render" errors
            setTimeout(() => {
                console.log('useLocation: Syncing location change');
                loadLocation();
            }, 0);
        };

        window.addEventListener('localmarket_location_changed', handleUpdate);
        window.addEventListener('storage', (e) => {
            if (e.key === 'localmarket_location') handleUpdate();
        });

        return () => {
            window.removeEventListener('localmarket_location_changed', handleUpdate);
            window.removeEventListener('storage', handleUpdate);
        };
    }, []);

    const updateLocation = useCallback((newLoc: Partial<LocationState>) => {
        const savedLocation = localStorage.getItem('localmarket_location');
        let current = {};
        try {
            current = savedLocation ? JSON.parse(savedLocation) : {};
        } catch (e) {
            console.error('Failed to parse current location', e);
        }

        const updated = { ...current, ...newLoc, loading: false };
        console.log('useLocation: Updating location:', updated);
        localStorage.setItem('localmarket_location', JSON.stringify(updated));

        // Update local state
        setLocation(updated as LocationState);

        // Notify other instances of this hook asynchronously
        setTimeout(() => {
            window.dispatchEvent(new Event('localmarket_location_changed'));
        }, 0);
    }, []);

    const detectLocation = useCallback(async () => {
        if (!navigator.geolocation) {
            updateLocation({ error: 'Geolocation not supported' });
            return;
        }

        setLocation(prev => ({ ...prev, loading: true, error: null }));

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { latitude: lat, longitude: lng } = position.coords;
                try {
                    const res = await fetch(`/api/location/detect?lat=${lat}&lng=${lng}`);
                    const data = await res.json();

                    if (!res.ok || data.error) throw new Error(data.error || 'Failed to detect area');

                    console.log('useLocation: Optimized Detection Result:', data);

                    const displayLabel = data.displayLabel || 'Your Area';
                    updateLocation({ lat, lng, city: displayLabel, loading: false, error: null });
                    console.log('useLocation: Detection complete:', displayLabel);
                } catch (err: any) {
                    console.error('useLocation: Geocoding failed', err);
                    updateLocation({ lat, lng, city: 'Unknown Location', loading: false, error: err.message });
                }
            },
            (err) => {
                const msg = err.code === 1 ? 'Location access denied' : 'Could not detect location';
                updateLocation({ loading: false, error: msg });
                console.warn('useLocation: Geolocation failed', msg);
            },
            { enableHighAccuracy: false, timeout: 5000, maximumAge: 60000 }
        );
    }, [updateLocation]);

    return { location, updateLocation, detectLocation };
};
