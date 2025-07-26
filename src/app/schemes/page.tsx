'use client';

import { SchemeCard } from '@/components/schemes/SchemeCard';
import { Separator } from '@/components/ui/separator';
import { useLanguage } from '@/hooks/use-language';
import { TranslationKey } from '@/lib/translations';

type Scheme = {
  titleKey: TranslationKey;
  crop: 'Sona Masoori Rice' | 'Sugarcane';
  descriptionKey: TranslationKey;
  eligibilityKey: TranslationKey;
  benefitsKey: TranslationKey;
  howToApplyKey: TranslationKey;
  link: string;
};

const allSchemes: Scheme[] = [
  {
    titleKey: 'schemes.list.pmfby.title',
    crop: 'Sona Masoori Rice',
    descriptionKey: 'schemes.list.pmfby.description',
    eligibilityKey: 'schemes.list.pmfby.eligibility',
    benefitsKey: 'schemes.list.pmfby.benefits',
    howToApplyKey: 'schemes.list.pmfby.howToApply',
    link: '#',
  },
  {
    titleKey: 'schemes.list.soilHealthCard.title',
    crop: 'Sona Masoori Rice',
    descriptionKey: 'schemes.list.soilHealthCard.description',
    eligibilityKey: 'schemes.list.soilHealthCard.eligibility',
    benefitsKey: 'schemes.list.soilHealthCard.benefits',
    howToApplyKey: 'schemes.list.soilHealthCard.howToApply',
    link: '#',
  },
  {
    titleKey: 'schemes.list.nfsm.title',
    crop: 'Sona Masoori Rice',
    descriptionKey: 'schemes.list.nfsm.description',
    eligibilityKey: 'schemes.list.nfsm.eligibility',
    benefitsKey: 'schemes.list.nfsm.benefits',
    howToApplyKey: 'schemes.list.nfsm.howToApply',
    link: '#',
  },
  {
    titleKey: 'schemes.list.kcc.title',
    crop: 'Sugarcane',
    descriptionKey: 'schemes.list.kcc.description',
    eligibilityKey: 'schemes.list.kcc.eligibility',
    benefitsKey: 'schemes.list.kcc.benefits',
    howToApplyKey: 'schemes.list.kcc.howToApply',
    link: '#',
  },
  {
    titleKey: 'schemes.list.pkvy.title',
    crop: 'Sugarcane',
    descriptionKey: 'schemes.list.pkvy.description',
    eligibilityKey: 'schemes.list.pkvy.eligibility',
    benefitsKey: 'schemes.list.pkvy.benefits',
    howToApplyKey: 'schemes.list.pkvy.howToApply',
    link: '#',
  },
];


export default function SchemesPage() {
  const { t } = useLanguage();
  const recommendedSchemes = allSchemes.filter(
    (scheme) => scheme.crop === 'Sona Masoori Rice'
  );
  const otherSchemes = allSchemes.filter(
    (scheme) => scheme.crop !== 'Sona Masoori Rice'
  );

  return (
    <>
      <h1 className="font-headline text-3xl font-bold mb-6">
        {t('schemes.title')}
      </h1>
      
      <div>
        <h2 className="font-headline text-2xl font-semibold mb-4">{t('schemes.recommended')}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recommendedSchemes.map((scheme, index) => (
            <SchemeCard key={index} {...scheme} />
            ))}
        </div>
      </div>

      <Separator className="my-8" />

      <div>
        <h2 className="font-headline text-2xl font-semibold mb-4">{t('schemes.other')}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {otherSchemes.map((scheme, index) => (
            <SchemeCard key={index} {...scheme} />
            ))}
        </div>
      </div>
    </>
  );
}
