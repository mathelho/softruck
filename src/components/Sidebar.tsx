interface SidebarProps {
    longitude: number,
    latitude: number,
    zoom: number
}

export function Sidebar({ longitude, latitude, zoom }: SidebarProps) {
    return (
        <div className="sidebar">
            Longitude: {longitude} | Latitude: {latitude} | Zoom: {zoom}
        </div>
    );
}