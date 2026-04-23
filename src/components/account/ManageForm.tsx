'use client';

import { twMerge } from 'tailwind-merge';
import { Button } from '@/components/shared/Button';
import { Select } from '@/components/account/Select';
import { getUserName } from '@/utils/user-data';
import { useTranslations } from 'next-intl';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { optionalUserData, SelectData, SessionUser } from '@models';
import { getFullUser, getSessionUser, updateOptionalUserFields } from '@/server/actions/userActions';
import { useEffect, useState } from 'react';
import { getUserLocale, setUserLocale } from '@/utils/locale-utils';
import { Locale, locales } from '@models/locale.models';
import AccountFormSkeleton from '../skeletons/AccountFormSkeleton';

const selectData: { [key: string]: SelectData } = {
  gender: {
    titleKey: 'Account.ManageForm.formControls.gender.title',
    data: [
      { id: 1, value: 'male', name: 'Account.ManageForm.formControls.gender.male' },
      { id: 2, value: 'female', name: 'Account.ManageForm.formControls.gender.female' },
      { id: 3, value: 'other', name: 'Account.ManageForm.formControls.gender.other' },
    ],
  },
  language: {
    titleKey: 'Account.ManageForm.formControls.language.title',
    data: [
      { id: 1, value: 'en', name: 'English(US)' },
      { id: 2, value: 'de', name: 'Deutsch(DE)' },
      { id: 3, value: 'es', name: 'Spanish(ES)' },
      { id: 4, value: 'fr', name: 'French(FR)' },
      { id: 5, value: 'it', name: 'Italian(IT)' },
      { id: 6, value: 'pl', name: 'Polish(PL)' },
      { id: 7, value: 'uk', name: 'Ukrainian(UK)' },
    ],
  },
};

const validationSchema = Yup.object({
  username: Yup.string().required('Username is required'),
  gender: Yup.object().nullable(),
  language: Yup.object().nullable(),
  age: Yup.string().nullable(),
});

export function ManageAccountForm() {
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<SessionUser>({} as SessionUser);
  const t = useTranslations();
  const [isOptionalUserData, setIsOptionalUserData] = useState({
    gender: null as { id: number; value?: string; name?: string } | null,
    age: null as string | null,
    language: null as { id: number; value?: string; name?: string } | null,
  });

  useEffect(() => {
    const fetchPrismaUser = async () => {
      try {
        setIsLoading(true);

        const user = await getFullUser();
        const currentLanguage = user.language || (await getUserLocale());
        const age = user.age || '';
        const genderData = selectData.gender.data.find((item) => item.value === user.gender);
        const languageData = selectData.language.data.find((item) => item.value === currentLanguage);

        setUser(user);
        setIsOptionalUserData({
          gender: genderData || null,
          age: age || null,
          language: languageData || null,
        });
      } catch (error: any) {
        console.error('Error fetching user data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPrismaUser();
  }, []);

  const handleSubmitForm = async (values: any) => {
    try {
      setIsLoading(true);
      const userName = user.username !== values.username ? values.username : '';
      const updateData: optionalUserData = {};

      if (isOptionalUserData.age !== values.age) {
        updateData['age'] = values.age;
      }
      if (isOptionalUserData.gender?.value !== values.gender?.value) {
        updateData['gender'] = values.gender?.value;
      }
      if (isOptionalUserData.language?.value !== values.language.value) {
        updateData['language'] = values.language.value;
      }

      if (userName != '' || Object.keys(updateData).length > 0) {
        const response = await updateOptionalUserFields(userName, updateData);

        if (response) {
          if (response.authUpdateResult) {
            const user = await getSessionUser();
            setUser(user);
          }

          if (response.userDataUpdateResult?.language) {
            const locale: Locale | null = locales.includes(response.userDataUpdateResult.language as Locale)
              ? (response.userDataUpdateResult.language as Locale)
              : null;

            if (locale) {
              await setUserLocale(locale);
            }
          }

          setIsOptionalUserData((prevState) => {
            const newState = { ...prevState };

            if (updateData.age !== undefined) {
              newState.age = updateData.age ?? null;
            }

            if (updateData.gender !== undefined) {
              newState.gender = selectData.gender.data.find((item) => item.value === updateData.gender) ?? null;
            }

            if (updateData.language !== undefined) {
              newState.language = selectData.language.data.find((item) => item.value === updateData.language) ?? null;
            }

            return newState;
          });
        }
      }
    } catch (error: any) {
      console.error(`Form not submit! Error: ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <AccountFormSkeleton />;
  }

  return (
    <Formik
      initialValues={{
        username: getUserName(user) || '',
        gender: isOptionalUserData.gender || null,
        language: isOptionalUserData.language || selectData.language.data[0],
        age: isOptionalUserData.age !== null ? isOptionalUserData.age : '',
      }}
      validationSchema={validationSchema}
      onSubmit={handleSubmitForm}
      enableReinitialize={true}
    >
      {({ isSubmitting }) => (
        <Form className="flex h-full flex-col space-y-8">
          <div className="space-y-5 border-b border-gray-border pb-3.5">
            <h2 className="max-w-2xl text-xl font-medium text-main">{t('Account.ManageForm.title')}</h2>

            <div className="mt-8 grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-6">
              <div className="sm:col-span-3">
                <label htmlFor="username" className="block text-base font-normal text-light-gray">
                  {t('Account.ManageForm.formControls.username')}
                </label>

                <div className="mt-2 sm:relative">
                  <Field
                    as="input"
                    id="username"
                    name="username"
                    placeholder={t('Account.ManageForm.formControls.username')}
                    autoComplete="username"
                    className={twMerge(
                      'block w-full rounded-md border-gray-border dark:border-0 bg-white-opacity-2 px-4 py-2.5 text-[20px] font-normal text-main ring-1 ring-white-opacity-2 placeholder:text-storm-gray focus:ring-1 focus:ring-white-opacity-2'
                    )}
                  />
                </div>
              </div>
              <div className="sm:col-span-3">
                <Field
                  name="gender"
                  selectData={selectData.gender}
                  component={Select}
                  placeholder={t('Account.ManageForm.formControls.gender.title')}
                  className={twMerge('text-main')}
                />
              </div>
            </div>
            <div className="mt-8 grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-6">
              <div className="sm:col-span-3">
                <label htmlFor="username" className="block text-base font-normal text-light-gray">
                  {t('Account.ManageForm.formControls.age.title')}
                </label>

                <div className="mt-2 sm:relative">
                  <Field
                    as="input"
                    id="age"
                    name="age"
                    placeholder={t('Account.ManageForm.formControls.age.title')}
                    autoComplete="age"
                    className={twMerge(
                      'block w-full rounded-md border-gray-border dark:border-0 bg-white-opacity-2 px-4 py-3 text-[20px] font-normal text-main ring-1 ring-white-opacity-2 placeholder:text-storm-gray focus:ring-1 focus:ring-white-opacity-2'
                    )}
                  />
                </div>
              </div>
              <div className="sm:col-span-3">
                <Field
                  name="language"
                  selectData={selectData.language}
                  component={Select}
                  placeholder={t('Account.ManageForm.formControls.language.title')}
                  className={twMerge('text-main')}
                />
              </div>
            </div>
          </div>

          <div className="mt-6 flex items-center justify-end gap-x-1.5">
            <Button
              type="submit"
              disabled={isSubmitting}
              className={twMerge(
                'rounded-md hover:border-transparent border border-gray-border dark:border-transparent bg-white-opacity-2 px-6 py-3 text-lg font-normal text-dark-aquamarine hover:bg-dark-aquamarine hover:text-white focus:bg-dark-aquamarine focus:text-white'
              )}
              data-account-button="saveChanges"
            >
              {isSubmitting ? (
                <span className="cbi-voice-loader gradient-loader mx-4 inline-flex animate-spin text-lg"></span>
              ) : (
                t('Account.ManageForm.saveButton')
              )}
            </Button>

            <Button
              type="button"
              disabled={isSubmitting}
              className={twMerge('px-6 py-3 text-lg font-normal text-gray-400 border border-gray-border dark:border-0 bg-transparent')}
            >
              {t('Common.cancelButton')}
            </Button>
          </div>
        </Form>
      )}
    </Formik>
  );
}
