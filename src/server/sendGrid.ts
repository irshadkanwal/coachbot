'use server';

import { SendGridContact } from '@models/account.models';
import { Client } from '@sendgrid/client';
import logger from 'lib/logger';

const sgClient = new Client();
sgClient.setApiKey(process.env.SENDGRID_API_KEY || '');

export const subscribeEmail = async (body: SendGridContact, listId = process.env.SENDGRID_LIST_ID): Promise<boolean> => {
  try {
    const data = {
      list_ids: [listId],
      contacts: [body],
      asm: { group_id: 30101, groups_to_display: [30101] },
    };

    await sgClient.request({
      method: 'PUT',
      url: '/v3/marketing/contacts',
      body: data,
    });

    return true;
  } catch (error: any) {
    logger.error('[SendGrid] Error during email subscription:', error);

    return false;
  }
};

export const subscribeCoach = async (formData: SendGridContact): Promise<boolean> => {
  try {
    const subscribeRes = await subscribeEmail(formData, process.env.SENDGRID_STUDIO_LIST_ID);
    await sendStudioSignupConfirmationLetter(formData.email, formData.first_name);

    return !!subscribeRes;
  } catch (error: any) {
    logger.error('[SendGrid] Error during coach subscription:', error);

    return false;
  }
};

export const sendStudioSignupConfirmationLetter = async (email: string, first_name: string): Promise<boolean> => {
  try {
    const data = {
      personalizations: [{
        to: [{ email }, { email: process.env.SENDGRID_COPY_EMAIL }],
        dynamic_template_data: { first_name, email }
      }],
      from: { email: process.env.SENDGRID_DEFAULT_SENDER, name: 'CoachBot' },
      template_id: process.env.SENDGRID_STUDIO_EMAIL_TEMPLATE_ID,
      asm: { group_id: 30100, groups_to_display: [30100, 30101] },
    };

    const resp = await sgClient.request({
      method: 'POST',
      url: '/v3/mail/send',
      body: data,
    });


    return resp[1];
  } catch (error: any) {
    logger.error('[SendGrid] Error during sending Studio confirmation email:', error);

    return false;
  }
};

export const getContactByEmail = async (email: string): Promise<any> => {
  try {
    const [_, response] = await sgClient.request({
      url: `/v3/marketing/contacts/search/emails`,
      method: 'POST',
      body: {
        emails: [email],
      },
    });
    const result = Object.values(response.result)[0] as any;

    return result.contact;
  } catch (error: any) {
    logger.error('[SendGrid] search by email error:', error);

    return;
  }
};

export const unsubscribeByEmail = async (email: string): Promise<void> => {
  try {
    const contact = await getContactByEmail(email);

    if (contact?.id) {
      await sgClient.request({
        url: `/v3/marketing/contacts`,
        method: 'DELETE',
        qs: {
          ids: contact.id,
        },
      });
    }
  } catch (error: any) {
    logger.error('[SendGrid] unsubscription error:', error);
  }
};
