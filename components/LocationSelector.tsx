'use client';

import { useEffect, useState, useCallback } from 'react';
import { ChevronRight, MapPin, X, Loader2 } from 'lucide-react';

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

type Step = 'state' | 'city' | 'town' | 'tehsil' | 'subTehsil' | 'circle';

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

  const [activeStep, setActiveStep] = useState<Step>('state');
  const [options, setOptions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchOptions = useCallback(async (step: Step, loc: LocationData) => {
    setLoading(true);
    try {
      let parentType = '';
      let parentValue = '';

      if (step === 'city') {
        parentType = 'state';
        parentValue = loc.state || '';
      } else if (step === 'town') {
        parentType = 'city';
        parentValue = loc.city || '';
      } else if (step === 'tehsil') {
        parentType = 'town';
        parentValue = loc.town || '';
      } else if (step === 'subTehsil') {
        parentType = 'tehsil';
        parentValue = loc.tehsil || '';
      }

      const url = new URL('/api/locations', window.location.origin);
      if (parentType) {
        url.searchParams.set('parentType', parentType);
        url.searchParams.set('parentValue', parentValue);
      }

      const res = await fetch(url.toString());
      const result = await res.json();

      if (result.success) {
        let fetchedOptions = result.data || [];
        
        // Add "All in..." options for user convenience
        if (step === 'state') {
          setOptions(['India-wise (All of India)', ...fetchedOptions]);
        } else if (step === 'city') {
          setOptions([`All in ${loc.state}`, ...fetchedOptions]);
        } else if (step === 'town') {
          setOptions([`All in ${loc.city}`, ...fetchedOptions]);
        } else if (step === 'tehsil') {
          setOptions([`All in ${loc.town}`, ...fetchedOptions]);
        } else if (step === 'subTehsil') {
          setOptions([`All in ${loc.tehsil}`, ...fetchedOptions]);
        } else if (step === 'circle') {
          // Circles might still be hardcoded or fetched from another API
          // For now, let's keep them as a static list if not available
          setOptions(['North Circle', 'South Circle', 'East Circle', 'West Circle', 'Central Circle']);
        } else {
          setOptions(fetchedOptions);
        }
      }
    } catch (error) {
      console.error('Error fetching location options:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Initial fetch for states
    if (activeStep === 'state') {
      fetchOptions('state', location);
    }
  }, [activeStep, fetchOptions]);

  const handleSelect = async (key: keyof LocationData, value: string) => {
    if (value === 'India-wise (All of India)') {
      onSelect({ circle: 'All India' });
      return;
    }

    if (value.startsWith('All in ')) {
      const area = value.replace('All in ', '');
      const finalLocation = { ...location };
      if (key === 'state') finalLocation.state = area;
      else if (key === 'city') finalLocation.city = area;
      else if (key === 'town') finalLocation.town = area;
      else if (key === 'tehsil') finalLocation.tehsil = area;
      else if (key === 'subTehsil') finalLocation.subTehsil = area;
      
      onSelect({ ...finalLocation, circle: `All ${area}` });
      return;
    }

    const newLocation: LocationData = { ...location, [key]: value };

    if (key === 'state') {
      newLocation.city = '';
      newLocation.town = '';
      newLocation.tehsil = '';
      newLocation.subTehsil = '';
      setActiveStep('city');
      fetchOptions('city', newLocation);
    } else if (key === 'city') {
      newLocation.town = '';
      newLocation.tehsil = '';
      newLocation.subTehsil = '';
      setActiveStep('town');
      fetchOptions('town', newLocation);
    } else if (key === 'town') {
      newLocation.tehsil = '';
      newLocation.subTehsil = '';
      setActiveStep('tehsil');
      fetchOptions('tehsil', newLocation);
    } else if (key === 'tehsil') {
      newLocation.subTehsil = '';
      setActiveStep('subTehsil');
      fetchOptions('subTehsil', newLocation);
    } else if (key === 'subTehsil') {
      if (showCircle) {
        setActiveStep('circle');
        fetchOptions('circle', newLocation);
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

  const getStepLabel = (): string => {
    switch (activeStep) {
      case 'state': return 'Select State';
      case 'city': return 'Select City';
      case 'town': return 'Select Town';
      case 'tehsil': return 'Select Tehsil';
      case 'subTehsil': return 'Select Sub-Tehsil';
      case 'circle': return 'Select Circle';
      default: return 'Select Location';
    }
  };

  const handleBack = () => {
    if (activeStep === 'city') {
      setActiveStep('state');
      setLocation({ ...location, city: '', town: '', tehsil: '', subTehsil: '', circle: '' });
      fetchOptions('state', {});
    } else if (activeStep === 'town') {
      setActiveStep('city');
      setLocation({ ...location, town: '', tehsil: '', subTehsil: '', circle: '' });
      fetchOptions('city', location);
    } else if (activeStep === 'tehsil') {
      setActiveStep('town');
      setLocation({ ...location, tehsil: '', subTehsil: '', circle: '' });
      fetchOptions('town', location);
    } else if (activeStep === 'subTehsil') {
      setActiveStep('tehsil');
      setLocation({ ...location, subTehsil: '', circle: '' });
      fetchOptions('tehsil', location);
    } else if (activeStep === 'circle') {
      setActiveStep('subTehsil');
      setLocation({ ...location, circle: '' });
      fetchOptions('subTehsil', location);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          {activeStep !== 'state' ? (
            <button onClick={handleBack} className="p-2 hover:bg-gray-100 rounded-lg transition">
              <ChevronRight className="w-5 h-5 text-gray-600 rotate-180" />
            </button>
          ) : (
            onBack && (
              <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-lg transition">
                <X className="w-5 h-5 text-gray-600" />
              </button>
            )
          )}
          <h1 className="text-xl font-bold text-gray-900 flex-1 text-center">{getStepLabel()}</h1>
          <div className="w-9" />
        </div>
      </div>

      {/* Breadcrumb */}
      {location.state && (
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-4xl mx-auto px-4 py-2">
            <div className="flex items-center gap-2 text-sm text-gray-600 overflow-x-auto whitespace-nowrap scrollbar-hide">
              <span className="font-medium text-orange-600">{location.state}</span>
              {location.city && (
                <>
                  <ChevronRight className="w-4 h-4 flex-shrink-0" />
                  <span className="font-medium text-gray-900">{location.city}</span>
                </>
              )}
              {location.town && (
                <>
                  <ChevronRight className="w-4 h-4 flex-shrink-0" />
                  <span className="font-medium text-gray-900">{location.town}</span>
                </>
              )}
              {location.tehsil && (
                <>
                  <ChevronRight className="w-4 h-4 flex-shrink-0" />
                  <span className="font-medium text-gray-900">{location.tehsil}</span>
                </>
              )}
              {location.subTehsil && (
                <>
                  <ChevronRight className="w-4 h-4 flex-shrink-0" />
                  <span className="font-medium text-gray-900">{location.subTehsil}</span>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 max-w-4xl w-full mx-auto px-4 py-6">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-10 h-10 text-orange-500 animate-spin mb-4" />
            <p className="text-gray-500 font-medium">Fetching available locations...</p>
          </div>
        ) : options.length === 0 ? (
          <div className="text-center py-20">
            <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <MapPin className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-gray-600 font-medium">No locations found for this selection</p>
            <button onClick={handleBack} className="mt-4 text-orange-600 font-bold hover:underline">
              Go Back
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pb-20">
            {options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleSelect(activeStep, option)}
                className="group bg-white border border-gray-200 rounded-xl p-4 flex items-center justify-between hover:border-orange-500 hover:shadow-md transition-all duration-200"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${option.startsWith('All in') ? 'bg-orange-100' : 'bg-gray-100'} group-hover:bg-orange-100 transition-colors`}>
                    <MapPin className={`w-4 h-4 ${option.startsWith('All in') ? 'text-orange-600' : 'text-gray-400'} group-hover:text-orange-600`} />
                  </div>
                  <span className={`font-semibold ${option.startsWith('All in') ? 'text-orange-700' : 'text-gray-900'}`}>{option}</span>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-orange-500 transition-colors" />
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

