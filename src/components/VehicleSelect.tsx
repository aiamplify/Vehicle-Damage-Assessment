import React from 'react';
import { useStore } from '../store';

interface Props {
  onSelect: (vehicleId: string) => void;
}

export function VehicleSelect({ onSelect }: Props) {
  const vehicles = useStore((state) => state.vehicles);

  return (
    <div className="space-y-2">
      <label htmlFor="vehicle" className="block text-sm font-medium text-gray-700">
        Select Vehicle
      </label>
      <select
        id="vehicle"
        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        onChange={(e) => onSelect(e.target.value)}
        defaultValue=""
      >
        <option value="" disabled>Choose a vehicle...</option>
        {vehicles.map((vehicle) => (
          <option key={vehicle.id} value={vehicle.id}>
            {vehicle.year} {vehicle.make} {vehicle.model} - {vehicle.vin}
          </option>
        ))}
      </select>
    </div>
  );
}