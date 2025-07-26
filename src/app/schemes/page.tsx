
import { SchemeCard } from '@/components/schemes/SchemeCard';

const allSchemes = [
  {
    title: 'Pradhan Mantri Fasal Bima Yojana (PMFBY)',
    crop: 'Sona Masoori Rice',
    description:
      'A comprehensive crop insurance scheme to protect farmers against yield losses due to unforeseen events.',
    eligibility:
      'All farmers growing notified crops like Rice in designated areas are eligible.',
    benefits: 'Insurance coverage against natural calamities, pests, and diseases.',
    howToApply: 'Enroll through the national crop insurance portal or a financial institution.',
    link: '#',
  },
  {
    title: 'Soil Health Card Scheme',
    crop: 'Sona Masoori Rice',
    description:
      'Provides a soil health card with crop-wise nutrient recommendations.',
    eligibility: 'All farmers are eligible to get a soil health card for their holdings.',
    benefits: 'Informed decisions on fertilizer application, leading to improved soil health and productivity.',
    howToApply: 'Contact the local agriculture department to get your soil sampled.',
    link: '#',
  },
  {
    title: 'National Food Security Mission (NFSM)',
    crop: 'Sona Masoori Rice',
    description:
      'Aims to increase the production of rice through area expansion and productivity enhancement.',
    eligibility: 'Targets districts with lower rice productivity. Assistance is provided to farmers for inputs and technology.',
    benefits: 'Subsidies on seeds, machinery, and other inputs.',
    howToApply: 'Schemes are implemented by state agriculture departments.',
    link: '#',
  },
  {
    title: 'Kisan Credit Card (KCC) Scheme',
    crop: 'Sugarcane',
    description: 'Provides farmers with timely access to credit for their cultivation and other needs.',
    eligibility: 'All farmers, including small and marginal farmers, sharecroppers, and tenants.',
    benefits: 'Low-interest credit for agricultural and allied activities.',
    howToApply: 'Apply at any commercial bank, regional rural bank, or cooperative bank.',
    link: '#',
  },
  {
    title: 'Paramparagat Krishi Vikas Yojana (PKVY)',
    crop: 'Sugarcane',
    description: 'Promotes organic farming through the adoption of organic villages and PGS certification.',
    eligibility: 'Farmers in a cluster of 50 acres or more are eligible to participate.',
    benefits: 'Financial assistance for organic inputs, certification, and marketing.',
    howToApply: 'Join a cluster formed by the state agriculture department.',
    link: '#',
  },
];


export default function SchemesPage() {
  const sortedSchemes = [...allSchemes].sort((a, b) => {
    if (a.crop === 'Sona Masoori Rice' && b.crop !== 'Sona Masoori Rice') {
      return -1;
    }
    if (a.crop !== 'Sona Masoori Rice' && b.crop === 'Sona Masoori Rice') {
      return 1;
    }
    return 0;
  });

  return (
    <>
      <h1 className="font-headline text-3xl font-bold mb-6">
        Recommended Government Schemes
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedSchemes.map((scheme, index) => (
          <SchemeCard key={index} {...scheme} />
        ))}
      </div>
    </>
  );
}
