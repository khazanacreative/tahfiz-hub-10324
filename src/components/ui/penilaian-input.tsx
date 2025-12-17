'use client';

import * as React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

interface PenilaianInputProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  getColorClass: (value: number) => string;
}

export function PenilaianInput({ label, value, onChange, getColorClass }: PenilaianInputProps) {
  const handleSliderChange = (values: number[]) => {
    onChange(values[0]);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseInt(e.target.value) || 0;
    // Clamp value between 0 and 100
    const clampedValue = Math.max(0, Math.min(100, newValue));
    onChange(clampedValue);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-4">
        <Label className="text-xs md:text-sm font-semibold flex-1">{label} (0-100)</Label>
        <div className="flex items-center gap-2">
          <Input
            type="number"
            min="0"
            max="100"
            value={value}
            onChange={handleInputChange}
            className="w-16 h-8 text-center text-sm px-2"
          />
          <Badge className={`text-lg md:text-xl px-4 py-1 ${getColorClass(value)}`}>
            {value}
          </Badge>
        </div>
      </div>
      <Slider
        defaultValue={[value]}
        onValueChange={handleSliderChange}
        max={100}
        step={1}
        className="py-4"
      />
      <Progress value={value} className="h-2 md:h-3" />
      <div className="flex justify-between text-xs text-gray-500">
        <span className="text-left">0<br/>Kurang</span>
        <span className="text-center">71<br/>Cukup</span>
        <span className="text-center">81<br/>Baik</span>
        <span className="text-right">91<br/>Sangat Baik</span>
      </div>
    </div>
  );
}
