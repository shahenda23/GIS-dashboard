import { useEffect, useRef } from 'react'
import * as maptilersdk from '@maptiler/sdk';
import "@maptiler/sdk/dist/maptiler-sdk.css";
import { MapConfig } from '../../types/builder.types'


interface MapWidgetProps {
  widgetId: string
  config: Partial<MapConfig>
}

function MapWidget2({ widgetId, config }: MapWidgetProps) {

    const mapContainer = useRef<HTMLDivElement>(null);
    const mapInstance = useRef<maptilersdk.Map | null>(null);
    maptilersdk.config.apiKey = 'ydeUYqeXv8WFtyvDNyef';
    (maptilersdk.Map as any).workerUrl = `${process.env.PUBLIC_URL ?? ''}/maplibre-gl-csp-worker.js`;

    useEffect(() => {
        if (!mapContainer.current) return;

        mapInstance.current = new maptilersdk.Map({
            container: mapContainer.current,
            style: 'https://api.maptiler.com/maps/streets-v4/style.json?key=ydeUYqeXv8WFtyvDNyef',
            center: [0, 0],
            zoom: 2,
        });

        return () => {
            mapInstance.current?.remove();
            mapInstance.current = null;
        };
    }, []);

    return <div ref={mapContainer} style={{ width: '100%', height: '100%' }} />;
}
export default MapWidget2