import { Formik, Form, Field, ErrorMessage } from 'formik';
import { useCallback } from 'react';
import * as Yup from 'yup';

const TimeSelection = ({
  initialTime,
  onTimeChange,
}: {
  initialTime?: string;
  onTimeChange: (time: string) => void;
}) => {
  const TimeSchema = Yup.object({
    hours: Yup.string().matches(/^([01]?[0-9]|2[0-3])$/, 'Hours must be between 00 and 23'),
    minutes: Yup.string().matches(/^[0-5]?[0-9]$/, 'Minutes must be between 00 and 59'),
  });

  const formatValue = useCallback((value: string, moreThen?: number) => {
    if (!moreThen) {
      return value.length === 1 && parseInt(value, 10) <= 9 ? `0${value}` : value;
    }

    return value.length === 1 && parseInt(value, 10) > moreThen ? `0${value}` : value;
  }, []);

  const hanldeTimeSet = useCallback(({ hours, minutes }: any) => {
    const formattedTime = `${hours.padStart(2, '0')}:${minutes.padStart(2, '0')}`;
    onTimeChange(formattedTime);
  }, []);

  return (
    <Formik
      initialValues={{ hours: initialTime?.split(':')[0] || '', minutes: initialTime?.split(':')[1] || '' }}
      validationSchema={TimeSchema}
      validateOnBlur
      onSubmit={hanldeTimeSet}
    >
      {({ errors, touched, handleBlur, values, setFieldValue }) => (
        <Form>
          <div className="flex items-center gap-x-1.5 text-main">
            <div>
              <Field
                name="hours"
                type="text"
                placeholder="HH"
                maxLength={2}
                onBlur={(e: any) => {
                  setFieldValue('hours', formatValue(e.target.value));
                  handleBlur(e);
                  !errors.hours && values.minutes && hanldeTimeSet(values);
                }}
                onChange={({ target }: any) => setFieldValue('hours', formatValue(target.value, 2).slice(0, 2))}
                className="w-14 rounded-xl border border-gray-border bg-white-opacity-2 text-center hover:border-main"
              />
            </div>
            <span>:</span>
            <div>
              <Field
                name="minutes"
                type="text"
                placeholder="MM"
                maxLength={2}
                onBlur={(e: any) => {
                  setFieldValue('minutes', formatValue(e.target.value));
                  handleBlur(e);
                  !errors.minutes && values.hours && hanldeTimeSet(values);
                }}
                onChange={({ target }: any) => setFieldValue('minutes', formatValue(target.value, 5).slice(0, 2))}
                className="w-14 rounded-xl border border-gray-border bg-white-opacity-2 text-center hover:border-main"
              />
            </div>
          </div>
          <div className="flex w-full flex-col text-xs text-salmon">
            {errors.hours && touched.hours && (
              <span>
                <ErrorMessage name="hours" />
              </span>
            )}
            {errors.minutes && touched.minutes && (
              <span>
                <ErrorMessage name="minutes" />
              </span>
            )}
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default TimeSelection;
