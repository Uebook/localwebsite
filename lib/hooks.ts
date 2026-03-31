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
                    const res = await fetch(`/api/geocode?lat=${lat}&lng=${lng}`);
                    const data = await res.json();

                    if (data.error) throw new Error(data.error);

                    const addr = data.address || {};
                    console.log('useLocation: Raw Geocode Address:', addr);

                    // Specific priority for "Area" as requested
                    // Villages and small hamlets often provide the exact name like "Bisrakh"
                    const mainArea =
                        addr.village ||
                        addr.hamlet ||
                        addr.suburb ||
                        addr.neighbourhood ||
                        addr.residential ||
                        addr.allotments ||
                        addr.city_district ||
                        addr.industrial ||
                        addr.city ||
                        addr.town ||
                        addr.county ||
                        'Your Area';

                    const subArea = (mainArea === addr.village || mainArea === addr.hamlet)
                        ? (addr.suburb || addr.neighbourhood || '')
                        : '';

                    let displayLabel = mainArea;
                    if (subArea && subArea !== mainArea) {
                        displayLabel = `${mainArea}, ${subArea}`;
                    }

                    const city = addr.city || addr.town || addr.city_district || '';
                    if (city && city !== mainArea && city !== subArea && !displayLabel.includes(city)) {
                        displayLabel = `${displayLabel}, ${city}`;
                    }

                    const state = addr.state || '';
                    if (state && !displayLabel.includes(state) && displayLabel.split(',').length < 3) {
                        displayLabel = `${displayLabel}, ${state}`;
                    }

                    // --- NEW: Try to find a matching Market Circle for this area ---
                    try {
                        const circleSearchQuery = mainArea !== 'Your Area' ? mainArea : (city || state);
                        if (circleSearchQuery) {
                            const circleRes = await fetch(`/api/circles?city=${encodeURIComponent(circleSearchQuery)}`);
                            const circleData = await circleRes.json();
                            if (circleData.success && circleData.circles && circleData.circles.length > 0) {
                                const circleName = circleData.circles[0].name;
                                console.log('useLocation: Found matching circle:', circleName);
                                displayLabel = circleName;
                            }
                        }
                    } catch (err) {
                        console.error('useLocation: Failed to fetch matching circle', err);
                    }

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
            { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
        );
    }, [updateLocation]);

    return { location, updateLocation, detectLocation };
};
