// Default Indian States, Cities, Towns, Tehsils, and Sub-tehsils
// Shared from Admin Panel
export const INDIAN_LOCATIONS = {
  "Delhi": {
    cities: {
      "New Delhi": {
        towns: {
          "Central Delhi": {
            tehsils: {
              "Connaught Place": {
                subTehsils: ["CP", "Janpath", "Parliament Street"]
              },
              "Chandni Chowk": {
                subTehsils: ["Old Delhi", "Red Fort", "Jama Masjid"]
              }
            }
          },
          "South Delhi": {
            tehsils: {
              "Saket": {
                subTehsils: ["Malviya Nagar", "Hauz Khas", "Green Park"]
              },
              "Vasant Kunj": {
                subTehsils: ["Vasant Vihar", "Munirka", "RK Puram"]
              }
            }
          }
        }
      }
    }
  },
  "Maharashtra": {
    cities: {
      "Mumbai": {
        towns: {
          "Mumbai Suburban": {
            tehsils: {
              "Andheri": {
                subTehsils: ["Andheri East", "Andheri West", "Jogeshwari"]
              },
              "Bandra": {
                subTehsils: ["Bandra East", "Bandra West", "Khar"]
              }
            }
          },
          "Thane": {
            tehsils: {
              "Thane": {
                subTehsils: ["Thane West", "Thane East", "Kopri"]
              }
            }
          }
        }
      },
      "Pune": {
        towns: {
          "Pune": {
            tehsils: {
              "Pune City": {
                subTehsils: ["Shivajinagar", "Kothrud", "Hinjewadi"]
              }
            }
          }
        }
      }
    }
  },
  "Karnataka": {
    cities: {
      "Bangalore": {
        towns: {
          "Bangalore Urban": {
            tehsils: {
              "Bangalore North": {
                subTehsils: ["Hebbal", "Yelahanka", "Yeshwanthpur"]
              },
              "Bangalore South": {
                subTehsils: ["Koramangala", "HSR Layout", "BTM Layout"]
              }
            }
          }
        }
      }
    }
  },
  "Gujarat": {
    cities: {
      "Ahmedabad": {
        towns: {
          "Ahmedabad": {
            tehsils: {
              "Ahmedabad City": {
                subTehsils: ["Navrangpura", "Maninagar", "Vastrapur"]
              }
            }
          }
        }
      }
    }
  },
  "Tamil Nadu": {
    cities: {
      "Chennai": {
        towns: {
          "Chennai": {
            tehsils: {
              "Chennai North": {
                subTehsils: ["T Nagar", "Anna Nagar", "Kilpauk"]
              }
            }
          }
        }
      }
    }
  },
  "West Bengal": {
    cities: {
      "Kolkata": {
        towns: {
          "Kolkata": {
            tehsils: {
              "Kolkata North": {
                subTehsils: ["Salt Lake", "New Town", "Rajarhat"]
              }
            }
          }
        }
      }
    }
  },
  "Rajasthan": {
    cities: {
      "Jaipur": {
        towns: {
          "Jaipur": {
            tehsils: {
              "Jaipur City": {
                subTehsils: ["Malviya Nagar", "Vaishali Nagar", "C Scheme"]
              }
            }
          }
        }
      }
    }
  },
  "Uttar Pradesh": {
    cities: {
      "Lucknow": {
        towns: {
          "Lucknow": {
            tehsils: {
              "Lucknow City": {
                subTehsils: ["Gomti Nagar", "Hazratganj", "Aliganj"]
              }
            }
          }
        }
      }
    }
  },
  "Telangana": {
    cities: {
      "Hyderabad": {
        towns: {
          "Hyderabad": {
            tehsils: {
              "Hyderabad Central": {
                subTehsils: ["Banjara Hills", "Jubilee Hills", "Hitech City"]
              }
            }
          }
        }
      }
    }
  },
  "Punjab": {
    cities: {
      "Amritsar": {
        towns: {
          "Amritsar City": {
            tehsils: {
              "Amritsar-1": { subTehsils: ["Hall Bazaar", "Katra Ahluwalia", "Town Hall", "Golden Temple Area"] },
              "Amritsar-2": { subTehsils: ["Block A", "Block B", "District Shopping Center", "Ranjit Avenue"] }
            }
          }
        }
      },
      "Ludhiana": {
        towns: {
          "Ludhiana West": {
            tehsils: {
              "Sarabha Nagar": { subTehsils: ["Kipps Market", "Malhar Road", "Gurdev Nagar"] },
              "Model Town": { subTehsils: ["Pritam Palace", "Jawaddi", "Atam Nagar"] }
            }
          }
        }
      },
      "Chandigarh": {
        towns: {
          "Chandigarh": {
            tehsils: {
              "Chandigarh": {
                subTehsils: ["Sector 17", "Sector 35", "Sector 22"]
              }
            }
          }
        }
      }
    }
  }
};

// Helper functions to get location lists
export const getStates = () => Object.keys(INDIAN_LOCATIONS);

export const getCities = (state: string) => {
  if (!state) return [];
  const stateKey = state as keyof typeof INDIAN_LOCATIONS;
  if (!INDIAN_LOCATIONS[stateKey]) return [];
  return Object.keys(INDIAN_LOCATIONS[stateKey].cities);
};

export const getTowns = (state: string, city: string) => {
  if (!state || !city) return [];
  const stateKey = state as keyof typeof INDIAN_LOCATIONS;
  const stateData = INDIAN_LOCATIONS[stateKey];
  if (!stateData) return [];
  const cityData = (stateData.cities as any)[city];
  if (!cityData) return [];
  return Object.keys(cityData.towns);
};

export const getTehsils = (state: string, city: string, town: string) => {
  if (!state || !city || !town) return [];
  const stateKey = state as keyof typeof INDIAN_LOCATIONS;
  const stateData = INDIAN_LOCATIONS[stateKey];
  if (!stateData) return [];
  const cityData = (stateData.cities as any)[city];
  if (!cityData) return [];
  const townData = (cityData.towns as any)[town];
  if (!townData) return [];
  return Object.keys(townData.tehsils);
};

export const getSubTehsils = (state: string, city: string, town: string, tehsil: string) => {
  if (!state || !city || !town || !tehsil) return [];
  const stateKey = state as keyof typeof INDIAN_LOCATIONS;
  const stateData = INDIAN_LOCATIONS[stateKey];
  if (!stateData) return [];
  const cityData = (stateData.cities as any)[city];
  if (!cityData) return [];
  const townData = (cityData.towns as any)[town];
  if (!townData) return [];
  const tehsilData = (townData.tehsils as any)[tehsil];
  if (!tehsilData) return [];
  return tehsilData.subTehsils;
};

// Circles for filtering
export const CIRCLES = ['North Circle', 'South Circle', 'East Circle', 'West Circle', 'Central Circle'];
