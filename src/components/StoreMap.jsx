import React, { useState, useCallback } from 'react';
import { GoogleMap, useJsApiLoader, Marker, InfoWindow } from '@react-google-maps/api';
import { Loader2, MapPin } from 'lucide-react';
import { CONFIG } from '../context/AppContext';

const containerStyle = {
    width: '100%',
    height: '500px',
    borderRadius: '1rem'
};

const defaultCenter = {
    lat: 41.0082, // Istanbul
    lng: 28.9784
};

// Harita Stili (Sadeleştirilmiş / Premium hissi için Grayscale + Yeşil tonlar)
const mapStyles = [
    {
        "featureType": "all",
        "elementType": "geometry",
        "stylers": [{ "color": "#f5f5f5" }]
    },
    {
        "featureType": "all",
        "elementType": "labels.icon",
        "stylers": [{ "visibility": "off" }]
    },
    {
        "featureType": "all",
        "elementType": "labels.text.fill",
        "stylers": [{ "color": "#616161" }]
    },
    {
        "featureType": "all",
        "elementType": "labels.text.stroke",
        "stylers": [{ "color": "#f5f5f5" }]
    },
    {
        "featureType": "administrative.land_parcel",
        "elementType": "labels.text.fill",
        "stylers": [{ "color": "#bdbdbd" }]
    },
    {
        "featureType": "poi",
        "elementType": "geometry",
        "stylers": [{ "color": "#eeeeee" }]
    },
    {
        "featureType": "poi",
        "elementType": "labels.text.fill",
        "stylers": [{ "color": "#757575" }]
    },
    {
        "featureType": "poi.park",
        "elementType": "geometry",
        "stylers": [{ "color": "#e5e5e5" }]
    },
    {
        "featureType": "poi.park",
        "elementType": "labels.text.fill",
        "stylers": [{ "color": "#9e9e9e" }]
    },
    {
        "featureType": "road",
        "elementType": "geometry",
        "stylers": [{ "color": "#ffffff" }]
    },
    {
        "featureType": "road.arterial",
        "elementType": "labels.text.fill",
        "stylers": [{ "color": "#757575" }]
    },
    {
        "featureType": "road.highway",
        "elementType": "geometry",
        "stylers": [{ "color": "#dadada" }]
    },
    {
        "featureType": "road.highway",
        "elementType": "labels.text.fill",
        "stylers": [{ "color": "#616161" }]
    },
    {
        "featureType": "road.local",
        "elementType": "labels.text.fill",
        "stylers": [{ "color": "#9e9e9e" }]
    },
    {
        "featureType": "transit.line",
        "elementType": "geometry",
        "stylers": [{ "color": "#e5e5e5" }]
    },
    {
        "featureType": "transit.station",
        "elementType": "geometry",
        "stylers": [{ "color": "#eeeeee" }]
    },
    {
        "featureType": "water",
        "elementType": "geometry",
        "stylers": [{ "color": "#c9c9c9" }]
    },
    {
        "featureType": "water",
        "elementType": "labels.text.fill",
        "stylers": [{ "color": "#9e9e9e" }]
    }
];

const StoreMap = ({ locations }) => {
    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY
    });

    const [map, setMap] = useState(null);
    const [selectedLocation, setSelectedLocation] = useState(null);

    const onLoad = useCallback(function callback(map) {
        // Harita yüklendiğinde, tüm markerları kapsayacak şekilde zoom ayarla
        if (locations.length > 0) {
            const bounds = new window.google.maps.LatLngBounds();
            locations.forEach(loc => {
                if (loc.latitude && loc.longitude) {
                    bounds.extend({ lat: Number(loc.latitude), lng: Number(loc.longitude) });
                }
            });
            map.fitBounds(bounds);
        }
        setMap(map);
    }, [locations]);

    const onUnmount = useCallback(function callback(map) {
        setMap(null);
    }, []);

    if (!isLoaded) return <div className="h-[500px] w-full bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400"><Loader2 className="animate-spin mr-2" /> Harita Yükleniyor...</div>;

    return (
        <div className="rounded-2xl overflow-hidden shadow-lg border border-gray-200">
            <GoogleMap
                mapContainerStyle={containerStyle}
                center={defaultCenter}
                zoom={12}
                onLoad={onLoad}
                onUnmount={onUnmount}
                options={{
                    styles: mapStyles,
                    disableDefaultUI: false, // Zoom kontrolü vs. olsun
                    streetViewControl: false,
                    mapTypeControl: false,
                }}
            >
                {locations.map(loc => (
                    (loc.latitude && loc.longitude) && (
                        <Marker
                            key={loc.id}
                            position={{ lat: Number(loc.latitude), lng: Number(loc.longitude) }}
                            onClick={() => setSelectedLocation(loc)}
                        // icon={{ url: '/location-pin.png' }} // Özel ikon eklenebilir
                        />
                    )
                ))}

                {selectedLocation && (
                    <InfoWindow
                        position={{ lat: Number(selectedLocation.latitude), lng: Number(selectedLocation.longitude) }}
                        onCloseClick={() => setSelectedLocation(null)}
                    >
                        <div className="p-2 min-w-[200px]">
                            <h3 className="font-bold text-[#132A13] text-lg">{selectedLocation.name}</h3>
                            <p className="text-gray-600 text-sm mb-2">{selectedLocation.description}</p>
                            <div className={`inline-block px-2 py-1 rounded text-xs font-bold ${selectedLocation.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                {selectedLocation.status === 'active' ? 'Açık' : 'Kapalı'}
                            </div>
                            {selectedLocation.stockStatus && (
                                <div className="mt-2 text-xs font-bold text-[#4F772D]">
                                    Stok Durumu: {selectedLocation.stockStatus}
                                </div>
                            )}
                        </div>
                    </InfoWindow>
                )}
            </GoogleMap>
        </div>
    );
}

export default React.memo(StoreMap);
