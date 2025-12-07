import React, { createContext, useContext, useState, useEffect } from 'react';
import { collection, doc, onSnapshot, getDocs } from 'firebase/firestore';
import { db } from '../firebase';

const LocationContext = createContext();

export const LocationProvider = ({ children }) => {
    const [locations, setLocations] = useState([]);
    const [activeLocation, setActiveLocation] = useState(null);
    const [inventory, setInventory] = useState({}); // { productID: stockCount }
    const [loading, setLoading] = useState(true);

    // 1. Lokasyonları Çek
    useEffect(() => {
        const fetchLocations = async () => {
            try {
                if (!db) return;
                const colRef = collection(db, "locations");
                const snap = await getDocs(colRef);
                const list = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setLocations(list);

                // Varsayılan olarak ilkini seç (veya localStorage'dan al)
                if (list.length > 0) {
                    const savedLocId = localStorage.getItem("beecup_active_location");
                    const savedLoc = list.find(l => l.id === savedLocId);
                    setActiveLocation(savedLoc || list[0]);
                }
                setLoading(false);
            } catch (err) {
                console.error("Lokasyon hatası:", err);
                setLoading(false);
            }
        };

        fetchLocations();
    }, []);

    // 2. Seçili Lokasyona Göre Envanter Dinle
    useEffect(() => {
        if (!activeLocation || !db) return;

        // Seçimi kaydet
        localStorage.setItem("beecup_active_location", activeLocation.id);

        const locationRef = doc(db, "locations", activeLocation.id);

        // Real-time listener
        const unsubscribe = onSnapshot(locationRef, (docSnap) => {
            if (docSnap.exists()) {
                const data = docSnap.data();
                setInventory(data.inventory || {});
            } else {
                setInventory({});
            }
        });

        return () => unsubscribe();
    }, [activeLocation]);

    const selectLocation = (loc) => {
        setActiveLocation(loc);
    };

    return (
        <LocationContext.Provider value={{ locations, activeLocation, selectLocation, inventory, loading }}>
            {children}
        </LocationContext.Provider>
    );
};

export const useStoreLocation = () => useContext(LocationContext);
