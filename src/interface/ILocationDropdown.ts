interface Location {
  id: string;
  name: string;
}
interface LocationDropdownProps {
  locations: Location[];
  selectedLocations: string[];
  onLocationChange: (id: string, checked: boolean) => void;
}
