/**
 * Saved Vendors Utility for Web
 * Handles saving and loading saved vendors from browser localStorage
 */

const SAVED_VENDORS_KEY = 'localmarket_saved_vendors';
const SAVED_VENDOR_IDS_KEY = 'localmarket_saved_vendor_ids';

export interface SavedVendor {
    id: string;
    name: string;
    category?: string;
    rating?: number;
    reviewCount?: number;
    distance?: string;
    imageUrl?: string;
    address?: string;
    openTime?: string;
    isVerified?: boolean;
    savedAt?: string;
    [key: string]: any;
}

export const saveVendor = (vendor: any): void => {
    if (typeof window === 'undefined') return;
    try {
        if (!vendor || !vendor.id) {
            console.warn('Invalid vendor data');
            return;
        }

        const savedVendorsJson = localStorage.getItem(SAVED_VENDORS_KEY);
        const savedVendors: SavedVendor[] = savedVendorsJson ? JSON.parse(savedVendorsJson) : [];

        const existingIndex = savedVendors.findIndex(v => v.id === vendor.id);

        if (existingIndex === -1) {
            savedVendors.push({
                ...vendor,
                savedAt: new Date().toISOString(),
            });
        } else {
            savedVendors[existingIndex] = {
                ...savedVendors[existingIndex],
                ...vendor,
                savedAt: new Date().toISOString(),
            };
        }

        localStorage.setItem(SAVED_VENDORS_KEY, JSON.stringify(savedVendors));

        const savedIds = savedVendors.map(v => v.id);
        localStorage.setItem(SAVED_VENDOR_IDS_KEY, JSON.stringify(savedIds));

        console.log('Vendor saved:', vendor.id);
    } catch (error) {
        console.error('Error saving vendor:', error);
    }
};

export const removeSavedVendor = (vendorId: string): void => {
    if (typeof window === 'undefined') return;
    try {
        if (!vendorId) return;

        const savedVendorsJson = localStorage.getItem(SAVED_VENDORS_KEY);
        const savedVendors: SavedVendor[] = savedVendorsJson ? JSON.parse(savedVendorsJson) : [];

        const filteredVendors = savedVendors.filter(v => v.id !== vendorId);

        localStorage.setItem(SAVED_VENDORS_KEY, JSON.stringify(filteredVendors));

        const savedIds = filteredVendors.map(v => v.id);
        localStorage.setItem(SAVED_VENDOR_IDS_KEY, JSON.stringify(savedIds));

        console.log('Vendor removed from saved:', vendorId);
    } catch (error) {
        console.error('Error removing saved vendor:', error);
    }
};

export const getSavedVendors = (): SavedVendor[] => {
    if (typeof window === 'undefined') return [];
    try {
        const savedVendorsJson = localStorage.getItem(SAVED_VENDORS_KEY);
        if (savedVendorsJson) {
            return JSON.parse(savedVendorsJson);
        }
        return [];
    } catch (error) {
        console.error('Error getting saved vendors:', error);
        return [];
    }
};

export const getSavedVendorIds = (): string[] => {
    if (typeof window === 'undefined') return [];
    try {
        const savedIdsJson = localStorage.getItem(SAVED_VENDOR_IDS_KEY);
        if (savedIdsJson) {
            return JSON.parse(savedIdsJson);
        }
        return [];
    } catch (error) {
        console.error('Error getting saved vendor IDs:', error);
        return [];
    }
};

export const isVendorSaved = (vendorId: string): boolean => {
    if (typeof window === 'undefined') return false;
    try {
        const savedIds = getSavedVendorIds();
        return savedIds.includes(vendorId);
    } catch (error) {
        console.error('Error checking if vendor is saved:', error);
        return false;
    }
};

export const clearSavedVendors = (): void => {
    if (typeof window === 'undefined') return;
    try {
        localStorage.removeItem(SAVED_VENDORS_KEY);
        localStorage.removeItem(SAVED_VENDOR_IDS_KEY);
        console.log('All saved vendors cleared');
    } catch (error) {
        console.error('Error clearing saved vendors:', error);
    }
};
