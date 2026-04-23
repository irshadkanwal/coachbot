'use client'

import React, { useEffect } from 'react';
import { Formik, Form } from 'formik';
import PersonalDataForm from './PersonalDataForm';
import ProfessionalBackgroundForm from './ProfessionalBackgroundForm';
import NeedsAndGoalsDataForm from './NeedsAndGoalsForm';
import DemographicsForm from './DemographicsForm';
import NextSteps from './NextSteps';
import { Button } from '@/components/shared/Button';
import { useTranslations } from 'next-intl';
import { object, string, array, boolean } from 'yup';
import { addSignup } from '@/server/actions/studioActions';
import { useRouter } from 'next/navigation';
import { PublicRoutes } from '@models/common.models';

const initialValues = {
  firstName: '',
  lastName: '',
  email: '',
  primaryProfession: [],
  areaOfFocus: [],
  yearsOfExperience: '',
  ageGroup: '',
  activeClients: '',
  policyAgreement: false,
  marketingAgreement: false,
  mostInterestedIn: [],
  currentOperate: [],
  monthlyRevenue: '',
  linkedin: '',
  otherProfiles: '',
}
const UrlRegExp = /^((http|https):\/\/)?(www\.)?([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9-_#\/?=&.]+)*(\/)?$/;


export default function StudioSignupForm({ email, firstName }: { email: string; firstName: string; }) {
  const t = useTranslations();
  const router = useRouter();
  const validationSchema = object({
    firstName: string().required('Common.form.errors.firstNameRequired'),
    lastName: string().required('Common.form.errors.lastNameRequired'),
    email: string().email('Common.form.errors.emailInvalid').required('Common.form.errors.emailRequired'),
    primaryProfession: array()
      .of(string().required())
      .min(1, 'Common.form.errors.multiselectionRequired')
      .required('Common.form.errors.selectionRequired'),
    areaOfFocus: string().when('primaryProfession',
      ([primaryProfession]) => primaryProfession.includes('Coach')
        ? array()
          .of(string().required())
          .min(1, 'Common.form.errors.multiselectionRequired')
          .required('Common.form.errors.selectionRequired')
        : array().notRequired()),
    yearsOfExperience: string().required('Common.form.errors.selectionRequired'),
    mostInterestedIn: array().of(string().notRequired()),
    challenge: string().notRequired(),
    currentOperate: array().of(string().notRequired()),
    ageGroup: string().notRequired(),
    linkedin: string().matches(UrlRegExp, 'Common.form.errors.invalidUrl').notRequired(),
    otherProfiles: string().matches(UrlRegExp, 'Common.form.errors.invalidUrl').notRequired(),
    activeClients: string().notRequired(),
    monthlyRevenue: string().notRequired(),
    policyAgreement: boolean().required('Common.form.errors.policyAgreementRequired').oneOf([true], "Common.form.errors.policyAcceptanceRequired"),
    marketingAgreement: boolean().notRequired()
  });

  const handleSubmit = async (values: any, { setSubmitting }: any) => {
    setSubmitting(true);

    const res = await addSignup(values);

    if (!!res) {
      setSubmitting(false);
      router.push(`${PublicRoutes.studioSignup}/success`);
      localStorage.removeItem('cbse');
      localStorage.removeItem('cbsn');
    }
  };

  useEffect(() => {
    if (email && localStorage) {
      localStorage.setItem('cbse', email);
      localStorage.setItem('cbsn', firstName);
      router.replace(PublicRoutes.studioSignup);
    }
  }, []);

  return (
    <Formik
      initialValues={{ ...initialValues, email: email || localStorage?.getItem('cbse') || initialValues.email, firstName: firstName || localStorage?.getItem('cbsn') || initialValues.firstName }}
      initialTouched={false}
      validationSchema={validationSchema}
      enableReinitialize={true}
      onSubmit={handleSubmit}
    >
      {({ isSubmitting }) => (
        <Form className='flex flex-col gap-y-3'>
          <PersonalDataForm />
          <ProfessionalBackgroundForm />
          <NeedsAndGoalsDataForm />
          <DemographicsForm />
          <NextSteps />
          <div className="flex flex-col justify-end items-end">
            <Button
              disabled={isSubmitting}
              variant="solid"
              color="white"
              className="border border-gray-border text-medium px-20 py-4 disabled:pointer-evnts-none disabled:text-storm-gray"
              type="submit"
            >
              {isSubmitting && <span className="cbi-voice-loader gradient-loader mx-4 inline-flex animate-spin text-lg"></span>}
              {t('Common.submitButton')}
            </Button>
          </div>
        </Form>
      )}
    </Formik>
  );
};