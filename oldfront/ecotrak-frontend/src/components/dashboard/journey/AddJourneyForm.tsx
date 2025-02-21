'use client';

import React from 'react';
import { CreateJourneyDTO, TransportMode, TRANSPORT_MODE_LABELS } from '@/types/journey';
import { createEmptyJourney } from '@/lib/utils/journey';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Modal } from '@/components/ui/modal';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

interface AddJourneyFormProps {
  onSubmit: (data: CreateJourneyDTO) => Promise<void>;
  onClose: () => void;
}

const journeySchema = z.object({
  transport_mode: z.nativeEnum(TransportMode),
  start_location: z.string().min(1, 'Start location is required'),
  end_location: z.string().min(1, 'End location is required'),
  start_time: z.string().min(1, 'Start time is required'),
  end_time: z.string().optional(),
  start_address: z.string().min(1, 'Start address is required'),
  end_address: z.string().min(1, 'End address is required'),
  distance_km: z.number().min(0),
  duration_min: z.number().min(0),
  co2_kg: z.number().min(0),
  notes: z.string().optional(),
});

export function AddJourneyForm({ onSubmit, onClose }: AddJourneyFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CreateJourneyDTO>({
    resolver: zodResolver(journeySchema),
    defaultValues: createEmptyJourney(),
  });

  return (
    <Modal title="Add Journey" onClose={onClose}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <Select
            {...register('transport_mode')}
            label="Transport Mode"
            error={errors.transport_mode?.message}
          >
            {Object.entries(TRANSPORT_MODE_LABELS).map(([mode, label]) => (
              <option key={mode} value={mode}>
                {label}
              </option>
            ))}
          </Select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Input
            {...register('start_location')}
            label="Start Location"
            error={errors.start_location?.message}
          />
          <Input
            {...register('end_location')}
            label="End Location"
            error={errors.end_location?.message}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Input
            {...register('start_address')}
            label="Start Address"
            error={errors.start_address?.message}
          />
          <Input
            {...register('end_address')}
            label="End Address"
            error={errors.end_address?.message}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Input
            {...register('start_time')}
            type="datetime-local"
            label="Start Time"
            error={errors.start_time?.message}
          />
          <Input
            {...register('end_time')}
            type="datetime-local"
            label="End Time (Optional)"
            error={errors.end_time?.message}
          />
        </div>

        <div className="grid grid-cols-3 gap-4">
          <Input
            {...register('distance_km', { valueAsNumber: true })}
            type="number"
            step="0.1"
            label="Distance (km)"
            error={errors.distance_km?.message}
          />
          <Input
            {...register('duration_min', { valueAsNumber: true })}
            type="number"
            label="Duration (min)"
            error={errors.duration_min?.message}
          />
          <Input
            {...register('co2_kg', { valueAsNumber: true })}
            type="number"
            step="0.1"
            label="CO₂ (kg)"
            error={errors.co2_kg?.message}
          />
        </div>

        <div>
          <Textarea
            {...register('notes')}
            label="Notes (Optional)"
            error={errors.notes?.message}
          />
        </div>

        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Adding...' : 'Add Journey'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
