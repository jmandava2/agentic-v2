
import { SchemeCard } from '@/components/schemes/SchemeCard';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

const digitalFarmSchemes = [
  {
    title: 'Pradhan Mantri Fasal Bima Yojana (PMFBY)',
    description:
      'A comprehensive crop insurance scheme to protect farmers against yield losses due to unforeseen events, crucial for the Sona Masoori Rice crop.',
    eligibility:
      'All farmers growing notified crops like Rice in designated areas are eligible.',
    link: '#',
  },
  {
    title: 'Soil Health Card Scheme',
    description:
      'Provides a soil health card to help make informed decisions on fertilizers for the Clay Loam soil.',
    eligibility: 'All farmers are eligible to get a soil health card.',
    link: '#',
  },
  {
    title: 'National Food Security Mission (NFSM)',
    description:
      'Aims to increase the production of rice through area expansion and productivity enhancement.',
    eligibility: 'Targets districts with lower rice productivity.',
    link: '#',
  },
];

const secondFarmSchemes = [
   {
    title: 'Kisan Credit Card (KCC) Scheme',
    description: 'Provides farmers with timely access to credit for their cultivation and other needs in a hassle-free manner.',
    eligibility: 'All farmers, including small and marginal farmers, sharecroppers, and tenants.',
    link: '#',
  },
    {
    title: 'Paramparagat Krishi Vikas Yojana (PKVY)',
    description: 'Promotes organic farming through the adoption of organic village by cluster approach and PGS certification.',
    eligibility: 'Farmers in a cluster of 50 acres or more are eligible to participate.',
    link: '#',
  },
]

export default function SchemesPage() {
  return (
    <>
      <h1 className="font-headline text-3xl font-bold mb-6">
        Government Schemes by Farm
      </h1>
      <div className="space-y-8">
        <Card className="bg-background/50">
          <CardHeader>
            <CardTitle className="font-headline text-2xl">
              My Digital Farm (Sona Masoori Rice)
            </CardTitle>
            <CardDescription>
              Recommended schemes based on your crop, soil, and location.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {digitalFarmSchemes.map((scheme, index) => (
                <SchemeCard key={index} {...scheme} />
              ))}
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-background/50">
          <CardHeader>
            <CardTitle className="font-headline text-2xl">
              Green Acres (Sugarcane)
            </CardTitle>
            <CardDescription>
              Recommended schemes based on your crop, soil, and location.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {secondFarmSchemes.map((scheme, index) => (
                <SchemeCard key={index} {...scheme} />
              ))}
            </div>
          </CardContent>
        </Card>

      </div>
    </>
  );
}
