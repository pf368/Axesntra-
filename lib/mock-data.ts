import { mockCarriers } from './mock-carriers';
import { CarrierBrief } from './types';

export { mockCarriers };

export const mockCarrierData = mockCarriers[0];

export function getCarrierById(id: string): CarrierBrief | undefined {
  return mockCarriers.find((c) => c.id === id);
}

export function getCarrierByDot(usdot: string): CarrierBrief | undefined {
  return mockCarriers.find((c) => c.usdot === usdot);
}
