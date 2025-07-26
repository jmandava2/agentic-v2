
import { SchemeCard } from '@/components/schemes/SchemeCard';

const schemes = [
  {
    title: 'Pradhan Mantri Fasal Bima Yojana (PMFBY)',
    description: 'A comprehensive crop insurance scheme to protect farmers against yield losses due to unforeseen events.',
    eligibility: 'All farmers including sharecroppers and tenant farmers growing notified crops in the notified areas are eligible.',
    link: '#',
  },
  {
    title: 'Pradhan Mantri Kisan Samman Nidhi (PM-KISAN)',
    description: 'A central sector scheme with 100% funding from the Government of India to supplement the financial needs of small and marginal farmers.',
    eligibility: 'All small and marginal farmer families are eligible for the scheme benefits.',
    link: '#',
  },
    {
    title: 'Kisan Credit Card (KCC) Scheme',
    description: 'Provides farmers with timely access to credit for their cultivation and other needs in a hassle-free manner.',
    eligibility: 'All farmers, including small and marginal farmers, sharecroppers, and tenants.',
    link: '#',
  },
    {
    title: 'Soil Health Card Scheme',
    description: 'A scheme to provide every farmer with a soil health card, which will help them to make informed decisions about the use of fertilizers.',
    eligibility: 'All farmers are eligible to get a soil health card for their land.',
    link: '#',
  },
    {
    title: 'National Food Security Mission (NFSM)',
    description: 'Aims to increase the production of rice, wheat, pulses, coarse cereals, and commercial crops through area expansion and productivity enhancement.',
    eligibility: 'Varies by component, generally targets districts with lower productivity.',
    link: '#',
  },
  {
    title: 'Paramparagat Krishi Vikas Yojana (PKVY)',
    description: 'Promotes organic farming through the adoption of organic village by cluster approach and PGS certification.',
    eligibility: 'Farmers in a cluster of 50 acres or more are eligible to participate.',
    link: '#',
  },
];


export default function SchemesPage() {
  return (
    <>
      <h1 className="font-headline text-3xl font-bold mb-6">Government Schemes</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {schemes.map((scheme, index) => (
          <SchemeCard key={index} {...scheme} />
        ))}
      </div>
    </>
  );
}
