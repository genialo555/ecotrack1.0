import axios from 'axios';
import type { Vehicle, CreateVehicleDto, UpdateVehicleDto } from '@/types/vehicle';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

export async function getUserVehicles(): Promise<Vehicle[]> {
  try {
    const response = await axios.get<Vehicle[]>(`${API_URL}/vehicles`);
    return response.data;
  } catch (error) {
    console.error('Error fetching user vehicles:', error);
    return [];
  }
}

export async function getVehicle(id: string): Promise<Vehicle | null> {
  try {
    const response = await axios.get<Vehicle>(`${API_URL}/vehicles/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching vehicle:', error);
    return null;
  }
}

export async function createVehicle(data: CreateVehicleDto): Promise<Vehicle | null> {
  try {
    const response = await axios.post<Vehicle>(`${API_URL}/vehicles`, data);
    return response.data;
  } catch (error) {
    console.error('Error creating vehicle:', error);
    return null;
  }
}

export async function updateVehicle(id: string, data: UpdateVehicleDto): Promise<Vehicle | null> {
  try {
    const response = await axios.put<Vehicle>(`${API_URL}/vehicles/${id}`, data);
    return response.data;
  } catch (error) {
    console.error('Error updating vehicle:', error);
    return null;
  }
}

export async function deleteVehicle(id: string): Promise<boolean> {
  try {
    await axios.delete(`${API_URL}/vehicles/${id}`);
    return true;
  } catch (error) {
    console.error('Error deleting vehicle:', error);
    return false;
  }
}
