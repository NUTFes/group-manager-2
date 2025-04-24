import { useEffect, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useFieldArray, useForm } from 'react-hook-form';
import { DEFAULT_DEVICE } from '../constants';
import { PowerApplicationFormData, powerApplicationSchema } from '../schema';
import { Device } from '../types';

export const usePowerForm = (defaultValues?: PowerApplicationFormData) => {
  // defaultValuesの変更を追跡するためのstate
  const [previousDefaultValues, setPreviousDefaultValues] =
    useState(defaultValues);

  const formMethods = useForm<PowerApplicationFormData>({
    resolver: zodResolver(powerApplicationSchema),
    defaultValues: defaultValues || {
      devices: [{ ...DEFAULT_DEVICE }],
    },
    mode: 'onChange',
  });

  const { control, formState, reset, setValue, watch } = formMethods;
  const { isValid } = formState;

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'devices',
  });

  // フォームの値を監視
  const watchedDevices = watch('devices');

  // 初期値が変更されたらフォームをリセット
  useEffect(() => {
    if (
      defaultValues &&
      JSON.stringify(defaultValues) !== JSON.stringify(previousDefaultValues)
    ) {
      // フォームをリセットして最新の値を設定
      reset(defaultValues);
      setPreviousDefaultValues(defaultValues);

      // デバイスのフィールド値を設定する関数
      const setDeviceValues = (device: Partial<Device>, index: number) => {
        setValue(`devices.${index}.productName`, device.productName || '');
        setValue(`devices.${index}.maxPower`, device.maxPower || 0);
        setValue(`devices.${index}.manufacturer`, device.manufacturer || '');
        setValue(`devices.${index}.model`, device.model || '');
        setValue(`devices.${index}.url`, device.url || '');

        // IDが存在する場合は設定
        if (device.id) {
          setValue(`devices.${index}.id`, device.id);
        }
      };

      // フィールドの値が正しく設定されていることを確認
      defaultValues.devices.forEach((device, index) => {
        setDeviceValues(device, index);
      });
    }
  }, [defaultValues, previousDefaultValues, reset, setValue]);

  // 合計電力の計算
  const totalPower = watchedDevices.reduce(
    (sum, device) => sum + (Number(device.maxPower) || 0),
    0
  );

  // 機器を追加
  const addDevice = () => {
    append({ ...DEFAULT_DEVICE });
  };

  // 機器を削除
  const removeDevice = (index: number) => {
    // フォームが1つしかない場合は削除せずに初期化する
    if (fields.length <= 1) {
      setValue(`devices.${index}`, { ...DEFAULT_DEVICE });
      return;
    }
    remove(index);
  };

  return {
    formMethods,
    fields,
    append,
    remove,
    addDevice,
    removeDevice,
    totalPower,
    isValid,
  };
};
