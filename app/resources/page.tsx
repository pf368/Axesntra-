import type { Metadata } from 'next';
import { ResourcesHub } from '@/components/resources-hub';

export const metadata: Metadata = {
  title: 'DOT Compliance Resources & Guides for Fleet Safety Managers | Axesntra',
  description:
    'Plain-language guides on DOT violations, CSA BASICs, FMCSA audits, and corrective actions. Built for fleet safety managers, owner-operators, and compliance teams.',
};

export default function ResourcesPage() {
  return <ResourcesHub />;
}
