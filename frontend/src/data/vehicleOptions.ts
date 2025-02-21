import { VehicleTypeOption } from '@/types/vehicleOptions';

export const vehicleOptions: VehicleTypeOption[] = [
  {
    value: 'car',
    label: 'Car',
    brands: [
      {
        value: 'tesla',
        label: 'Tesla',
        models: [
          {
            value: 'model3',
            label: 'Model 3',
            co2_rate: 0,
            specs: {
              'Battery': '60 kWh',
              'Range': '350 km',
              'Power': '283 hp'
            }
          },
          {
            value: 'modelY',
            label: 'Model Y',
            co2_rate: 0,
            specs: {
              'Battery': '75 kWh',
              'Range': '450 km',
              'Power': '384 hp'
            }
          }
        ]
      },
      {
        value: 'toyota',
        label: 'Toyota',
        models: [
          {
            value: 'prius',
            label: 'Prius',
            co2_rate: 94,
            specs: {
              'Engine': '1.8L Hybrid',
              'Power': '122 hp',
              'Consumption': '4.1L/100km'
            }
          },
          {
            value: 'yaris',
            label: 'Yaris',
            co2_rate: 98,
            specs: {
              'Engine': '1.5L Hybrid',
              'Power': '116 hp',
              'Consumption': '4.3L/100km'
            }
          }
        ]
      }
    ]
  },
  {
    value: 'van',
    label: 'Van',
    brands: [
      {
        value: 'volkswagen',
        label: 'Volkswagen',
        models: [
          {
            value: 'transporter',
            label: 'Transporter',
            co2_rate: 185,
            specs: {
              'Engine': '2.0 TDI',
              'Power': '150 hp',
              'Cargo': '6.7m³'
            }
          }
        ]
      },
      {
        value: 'mercedes',
        label: 'Mercedes-Benz',
        models: [
          {
            value: 'sprinter',
            label: 'Sprinter',
            co2_rate: 195,
            specs: {
              'Engine': '2.1 CDI',
              'Power': '163 hp',
              'Cargo': '7.8m³'
            }
          }
        ]
      }
    ]
  }
];
