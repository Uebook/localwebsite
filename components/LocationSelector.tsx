'use client';

import { useEffect, useState } from 'react';
import { ChevronRight, MapPin, X } from 'lucide-react';
import { getStates, getCities, getTowns, getTehsils, getSubTehsils, CIRCLES } from '@/lib/locations';

interface LocationSelectorProps {
  onBack?: () => void;
  onSelect: (location: LocationData) => void;
  initialLocation?: LocationData;
  showCircle?: boolean;
}

interface LocationData {
  state?: string;
  city?: string;
  town?: string;
  tehsil?: string;
  subTehsil?: string;
  circle?: string;
}

export default function LocationSelector({
  onBack,
  onSelect,
  initialLocation = {},
  showCircle = false
}: LocationSelectorProps) {
  const [location, setLocation] = useState<LocationData>({
    state: initialLocation.state || '',
    city: initialLocation.city || '',
    town: initialLocation.town || '',
    tehsil: initialLocation.tehsil || '',
    subTehsil: initialLocation.subTehsil || '',
    circle: initialLocation.circle || '',
  });

  const [activeStep, setActiveStep] = useState<'state' | 'city' | 'town' | 'tehsil' | 'subTehsil' | 'circle'>('state');

  const states = getStates();
  const cities = location.state ? getCities(location.state) : [];
  const towns = location.state && location.city ? getTowns(location.state, location.city) : [];
  const tehsils = location.state && location.city && location.town
    ? getTehsils(location.state, location.city, location.town)
    : [];
  const subTehsils = location.state && location.city && location.town && location.tehsil
    ? getSubTehsils(location.state, location.city, location.town, location.tehsil)
    : [];

  const handleSelect = (key: keyof LocationData, value: string) => {
    // Handling special "Entire State" or "All India" selections
    if (value === 'India-wise (All of India)') {
      onSelect({ circle: 'All India' });
      return;
    }

    if (value.startsWith('All in ')) {
      const area = value.replace('All in ', '');
      if (key === 'state') {
        onSelect({ state: area, circle: `All ${area}` });
      } else if (key === 'city') {
        onSelect({ ...location, city: area, circle: `All ${area}` });
      } else if (key === 'town') {
        onSelect({ ...location, town: area, circle: `All ${area}` });
      } else if (key === 'tehsil') {
        onSelect({ ...location, tehsil: area, circle: `All ${area}` });
      } else if (key === 'subTehsil') {
        onSelect({ ...location, subTehsil: area, circle: `All ${area}` });
      }
      return;
    }

    const newLocation: LocationData = { ...location, [key]: value };

    // Reset dependent fields
    if (key === 'state') {
      newLocation.city = '';
      newLocation.town = '';
      newLocation.tehsil = '';
      newLocation.subTehsil = '';
      setActiveStep('city');
    } else if (key === 'city') {
      newLocation.town = '';
      newLocation.tehsil = '';
      newLocation.subTehsil = '';
      setActiveStep('town');
    } else if (key === 'town') {
      newLocation.tehsil = '';
      newLocation.subTehsil = '';
      setActiveStep('tehsil');
    } else if (key === 'tehsil') {
      newLocation.subTehsil = '';
      setActiveStep('subTehsil');
    } else if (key === 'subTehsil') {
      if (showCircle) {
        setActiveStep('circle');
      } else {
        onSelect(newLocation);
        return;
      }
    } else if (key === 'circle') {
      onSelect(newLocation);
      return;
    }

    setLocation(newLocation);
  };

  const [dynamicCircles, setDynamicCircles] = useState<string[]>([]);
  const [loadingCircles, setLoadingCircles] = useState(false);

  useEffect(() => {
    const fetchCircles = async () => {
      setLoadingCircles(true);
      try {
        const res = await fetch('/api/circles');
        const data = await res.json();
        if (data.success) {
          setDynamicCircles(data.circles.map((c: any) => c.name));
        }
      } catch (error) {
        console.error('Failed to fetch circles:', error);
      } finally {
        setLoadingCircles(false);
      }
    };
    fetchCircles();
  }, []);

  const getCurrentOptions = (): string[] => {
    switch (activeStep) {
      case 'state':
        return ['India-wise (All of India)', ...states];
      case 'city':
        return [`All in ${location.state}`, ...cities];
      case 'town':
        return [`All in ${location.city}`, ...towns];
      case 'tehsil':
        return [`All in ${location.town}`, ...tehsils];
      case 'subTehsil':
        return [`All in ${location.tehsil}`, ...subTehsils];
      case 'circle':
        return dynamicCircles.length > 0 ? dynamicCircles : CIRCLES;
      default:
        return [];
    }
  };

  const getStepLabel = (): string => {
    switch (activeStep) {
      case 'state':
        return 'Select State';
      case 'city':
        return 'Select City';
      case 'town':
        return 'Select Town';
      case 'tehsil':
        return 'Select Tehsil';
      case 'subTehsil':
        return 'Select Sub-Tehsil';
      case 'circle':
        return 'Select Circle';
      default:
        return 'Select Location';
    }
  };

  const getStepKey = (): keyof LocationData => {
    return activeStep;
  };

  const canGoBack = (): boolean => {
    return activeStep !== 'state';
  };

  const handleBack = () => {
    if (activeStep === 'city') {
      setActiveStep('state');
      setLocation({ ...location, city: '', town: '', tehsil: '', subTehsil: '', circle: '' });
    } else if (activeStep === 'town') {
      setActiveStep('city');
      setLocation({ ...location, town: '', tehsil: '', subTehsil: '', circle: '' });
    } else if (activeStep === 'tehsil') {
      setActiveStep('town');
      setLocation({ ...location, tehsil: '', subTehsil: '', circle: '' });
    } else if (activeStep === 'subTehsil') {
      setActiveStep('tehsil');
      setLocation({ ...location, subTehsil: '', circle: '' });
    } else if (activeStep === 'circle') {
      setActiveStep('subTehsil');
      setLocation({ ...location, circle: '' });
    }
  };

  const options = getCurrentOptions();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          {canGoBack() ? (
            <button
              onClick={handleBack}
              className="p-2 hover:bg-gray-100 rounded-lg transition"
            >
              <ChevronRight className="w-5 h-5 text-gray-600 rotate-180" />
            </button>
          ) : (
            onBack && (
              <button
                onClick={onBack}
                className="p-2 hover:bg-gray-100 rounded-lg transition"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            )
          )}
          <h1 className="text-xl font-bold text-gray-900 flex-1 text-center">{getStepLabel()}</h1>
          <div className="w-9" />
        </div>
      </div>

      {/* Location Breadcrumb */}
      {location.state && (
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-4xl mx-auto px-4 py-2">
            <div className="flex items-center gap-2 text-sm text-gray-600 overflow-x-auto">
              {location.state && (
                <>
                  <span className="font-medium">{location.state}</span>
                  {location.city && <ChevronRight className="w-4 h-4" />}
                </>
              )}
              {location.city && (
                <>
                  <span className="font-medium">{location.city}</span>
                  {location.town && <ChevronRight className="w-4 h-4" />}
                </>
              )}
              {location.town && (
                <>
                  <span className="font-medium">{location.town}</span>
                  {location.tehsil && <ChevronRight className="w-4 h-4" />}
                </>
              )}
              {location.tehsil && (
                <>
                  <span className="font-medium">{location.tehsil}</span>
                  {location.subTehsil && <ChevronRight className="w-4 h-4" />}
                </>
              )}
              {location.subTehsil && (
                <>
                  <span className="font-medium">{location.subTehsil}</span>
                  {location.circle && <ChevronRight className="w-4 h-4" />}
                </>
              )}
              {location.circle && (
                <span className="font-medium">{location.circle}</span>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="max-w-4xl mx-auto px-4 py-6">
        {options.length === 0 ? (
          <div className="text-center py-12">
            <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">
              Please select {activeStep === 'city' ? 'a state' : activeStep === 'town' ? 'a city' : 'previous options'} first
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleSelect(getStepKey(), option)}
                className="w-full bg-white border border-gray-200 rounded-lg p-4 flex items-center justify-between hover:bg-gray-50 hover:border-orange-300 transition"
              >
                <span className="font-medium text-gray-900">{option}</span>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
