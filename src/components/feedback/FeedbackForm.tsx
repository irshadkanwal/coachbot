'use client';

import { Button } from '../shared/Button';
import { twMerge } from 'tailwind-merge';
import { createFeedback } from '@/server/actions/feedbackActions';
import { useTranslations } from 'next-intl';
import { useCallback, useState } from 'react';

export function FeedbackForm({ className }: { className: string }) {
  const t = useTranslations();
  const [formData, setFormData] = useState({ title: '', details: '' });
  const [error, setError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleSubmit = useCallback(async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      setError(true);
      return;
    }

    setIsLoading(true);
    await createFeedback(formData);
    resetForm();
  }, [formData]);

  const resetForm = useCallback(() => {
    setFormData({ title: '', details: '' });
    setError(false);
    setIsLoading(false);
  }, []);

  return (
    <form className={className} onSubmit={handleSubmit}>
      <div className={twMerge("flex flex-col w-full bg-white/[8%] rounded-lg", isLoading && "text-white/[16%] bg-dark-gray animate-pulse")}>
        <input
          placeholder={t("Account.Feedback.form.inputPlaceholder")}
          autoComplete="off"
          name="title"
          type="text"
          value={formData.title}
          onChange={handleInputChange}
          className={twMerge(
            "w-full bg-transparent border-0 text-medium p-4 focus:no-outline",
            error && "placeholder:text-salmon",
          )}
        />

        <div className='w-full border-t border-white/[6%] p-4 flex flex-col gap-y-3'>
          <label className='-ms-0.5'> {t("Account.Feedback.form.descriptionLabel")} </label>
          <textarea
            autoComplete="off"
            placeholder={t("Account.Feedback.form.descriptionPlaceholder")}
            name="details"
            value={formData.details}
            onChange={handleInputChange}
            className={twMerge("w-full bg-transparent border-none p-0 focus:no-outline ")}
          />
        </div>
      </div>
      <div className='py-4 flex justify-end gap-1.5'>
        <Button
          variant='outline'
          color='transparent'
          className='px-6 py-2 text-lg font-normal'
          type="button"
          onClick={resetForm}
          disabled={isLoading}
        >
          {t('Common.cancelButton')}
        </Button>
        <Button
          variant='solid'
          color='transparent'
          className='px-6 py-2 text-lg font-normal'
          disabled={isLoading}
        >
          {
            isLoading
              ? <span className="cbi-voice-loader gradient-loader mx-4 inline-flex animate-spin text-lg"></span>
              : t("Common.submitButton")
          }
        </Button>
      </div>
    </form>
  );
}
