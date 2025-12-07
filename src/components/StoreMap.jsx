import React, { useState, useCallback, useEffect, useRef } from 'react';
import { GoogleMap, useJsApiLoader, MarkerF, InfoWindowF } from '@react-google-maps/api';
import { Loader2, Navigation, Clock, Info } from 'lucide-react';

const containerStyle = {
    width: '100%',
    height: '600px',
    borderRadius: '1rem'
};

const defaultCenter = {
    lat: 41.0082,
    lng: 28.9784
};

const StoreMap = ({ locations, focusedLocation, onMarkerClick }) => {
    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY
    });

    const [map, setMap] = useState(null);
    const mapRef = useRef(null);

    const onLoad = useCallback(function callback(map) {
        mapRef.current = map;
        setMap(map);
        if (locations.length > 0) {
            const bounds = new window.google.maps.LatLngBounds();
            let validLocs = 0;
            locations.forEach(loc => {
                const lat = parseFloat(loc.latitude);
                const lng = parseFloat(loc.longitude);
                if (!isNaN(lat) && !isNaN(lng)) {
                    bounds.extend({ lat, lng });
                    validLocs++;
                }
            });
            if (validLocs > 0) map.fitBounds(bounds);
        }
    }, [locations]);

    // Odaklanma ve Zoom Animasyonu
    useEffect(() => {
        if (map && focusedLocation && focusedLocation.latitude && focusedLocation.longitude) {
            const lat = parseFloat(focusedLocation.latitude);
            const lng = parseFloat(focusedLocation.longitude);
            if (!isNaN(lat) && !isNaN(lng)) {
                map.panTo({ lat, lng });
                map.setZoom(15);
            }
        }
    }, [map, focusedLocation]);

    const onUnmount = useCallback(function callback(map) {
        setMap(null);
        mapRef.current = null;
    }, []);

    if (!isLoaded) return <div className="h-[600px] w-full bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400"><Loader2 className="animate-spin mr-2" /> Harita Yükleniyor...</div>;

    return (
        <div className="rounded-2xl overflow-hidden shadow-lg border border-gray-200 h-full relative">
            <GoogleMap
                mapContainerStyle={containerStyle}
                center={defaultCenter}
                zoom={12}
                onLoad={onLoad}
                onUnmount={onUnmount}
                options={{
                    disableDefaultUI: true, // Varsayılan tüm butonları gizle
                    zoomControl: true, // Sadece zoom görünsün
                    streetViewControl: false,
                    mapTypeControl: false,
                    fullscreenControl: false,
                    styles: [
                        {
                            featureType: "poi",
                            elementType: "labels",
                            stylers: [{ visibility: "off" }], // Haritadaki diğer yerleri gizle (sade görünüm)
                        },
                    ],
                }}
            >
                {locations.map(loc => {
                    const lat = parseFloat(loc.latitude);
                    const lng = parseFloat(loc.longitude);
                    if (isNaN(lat) || isNaN(lng)) return null;

                    const isSelected = focusedLocation?.id === loc.id;

                    return (
                        <MarkerF
                            key={loc.id}
                            position={{ lat, lng }}
                            onClick={() => onMarkerClick && onMarkerClick(loc)}
                            icon={{
                                url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(
                                    `<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="${isSelected ? '#132A13' : '#4F772D'}"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/><circle cx="12" cy="6.5" r="2.5" fill="white"/></svg>`
                                )}`,
                                scaledSize: window.google && new window.google.maps.Size(isSelected ? 50 : 40, isSelected ? 50 : 40),
                                anchor: window.google && new window.google.maps.Point(isSelected ? 25 : 20, isSelected ? 50 : 40)
                            }}
                            animation={isSelected ? window.google.maps.Animation.DROP : null}
                            zIndex={isSelected ? 1000 : 1}
                        />
                    );
                })}

                {focusedLocation && (
                    <InfoWindowF
                        position={{ lat: parseFloat(focusedLocation.latitude), lng: parseFloat(focusedLocation.longitude) }}
                        onCloseClick={() => onMarkerClick(null)}
                        options={{
                            pixelOffset: new window.google.maps.Size(0, -50),
                            maxWidth: 320
                        }}
                    >
                        <div className="p-1 min-w-[240px]">
                            {/* Başlık ve Durum */}
                            <div className="flex justify-between items-start mb-2 pb-2 border-b border-gray-100">
                                <div>
                                    <h3 className="font-bold text-[#132A13] text-lg leading-tight">{focusedLocation.name}</h3>
                                    <p className="text-xs text-gray-400 mt-0.5">{focusedLocation.city || 'İstanbul'}</p>
                                </div>
                                <div className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide border ${focusedLocation.status === 'active' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'}`}>
                                    {focusedLocation.status === 'active' ? 'Açık' : 'Kapalı'}
                                </div>
                            </div>

                            {/* Detaylar */}
                            <div className="space-y-2 mb-3">
                                <div className="flex items-center gap-2 text-xs text-gray-600">
                                    <Clock size={14} className="text-[#4F772D]" />
                                    <span className="font-medium">08:00 - 22:00</span>
                                </div>
                                <div className="flex items-center gap-2 text-xs text-gray-600">
                                    <Info size={14} className="text-[#4F772D]" />
                                    <span className="font-medium">
                                        {focusedLocation.stockStatus ? `Stok: ${focusedLocation.stockStatus}` : 'Stok Var'}
                                    </span>
                                </div>
                            </div>

                            {/* Yol Tarifi Butonu */}
                            <a
                                href={`https://www.google.com/maps/dir/?api=1&destination=${focusedLocation.latitude},${focusedLocation.longitude}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-center gap-2 w-full py-2 bg-[#4F772D] hover:bg-[#3d5e22] text-white text-xs font-bold rounded-lg transition-colors group"
                            >
                                <Navigation size={14} className="fill-current" />
                                Yol Tarifi Al
                            </a>
                        </div>
                    </InfoWindowF>
                )}
            </GoogleMap>
        </div>
    );
}

export default React.memo(StoreMap);
