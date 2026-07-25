import { ErrorMessage, Field, Form, Formik, type FormikHelpers } from 'formik';
import * as Yup from 'yup';
import css from './NoteForm.module.css';
import { useId } from 'react';
import type { NoteToPost } from '../../types/note';
import { postNote } from '../../services/noteService';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';

interface NoteFormProps {
  onClose: () => void;
}

interface NoteFormValues {
  title: string;
  content: string;
  tag: 'Todo' | 'Work' | 'Personal' | 'Meeting' | 'Shopping';
}

const initialValues: NoteFormValues = {
  title: '',
  content: '',
  tag: 'Todo',
};

const Schema = Yup.object().shape({
  title: Yup.string()
    .required('Title is required')
    .min(3, 'Title must be at least 3 symbols')
    .max(50, 'Title must be less than 50 symbols'),
  content: Yup.string().max(500, 'Content must be less than 500 symbols'),
  tag: Yup.string()
    .oneOf(['Todo', 'Work', 'Personal', 'Meeting', 'Shopping'], 'Select Tag')
    .required('Tag is required'),
});

export default function NoteForm({ onClose }: NoteFormProps) {
  const formId = useId();

  const queryClient = useQueryClient();

  const postMutation = useMutation({
    mutationFn: async (note: NoteToPost) => {
      await postNote(note);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
      const notify = () => toast('Note created');
      notify();
      onClose();
    },
    onError: error => {
      const notify = () => toast(`Create false with error  : ${error}`);
      notify();
      console.log(error);
    },
  });

  const handleSubmit = (
    values: NoteFormValues,
    actions: FormikHelpers<NoteFormValues>
  ) => {
    postMutation.mutate(values);
    actions.resetForm();
  };
  return (
    <Formik
      initialValues={initialValues}
      validationSchema={Schema}
      onSubmit={handleSubmit}
    >
      <Form className={css.form}>
        <div className={css.formGroup}>
          <label htmlFor={`${formId}-title`}>Title</label>
          <Field
            id={`${formId}-title`}
            type="text"
            name="title"
            className={css.input}
          />
          <ErrorMessage name="title" component="span" className={css.error} />
        </div>

        <div className={css.formGroup}>
          <label htmlFor={`${formId}-content`}>Content</label>
          <Field
            as="textarea"
            id={`${formId}-content`}
            name="content"
            rows={8}
            className={css.textarea}
          />
          <ErrorMessage name="content" component="span" className={css.error} />
        </div>

        <div className={css.formGroup}>
          <label htmlFor={`${formId}-tag`}>Tag</label>
          <Field
            as="select"
            id={`${formId}-tag`}
            name="tag"
            className={css.select}
          >
            <option value="Todo">Todo</option>
            <option value="Work">Work</option>
            <option value="Personal">Personal</option>
            <option value="Meeting">Meeting</option>
            <option value="Shopping">Shopping</option>
          </Field>
          <ErrorMessage name="tag" component="span" className={css.error} />
        </div>

        <div className={css.actions}>
          <button onClick={onClose} type="button" className={css.cancelButton}>
            Cancel
          </button>
          <button type="submit" className={css.submitButton} disabled={false}>
            Create note
          </button>
        </div>
      </Form>
    </Formik>
  );
}
