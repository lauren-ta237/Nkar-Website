import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Check, Loader2, Send } from 'lucide-react';
import { contactTopics } from '@/data/site';

const schema = z.object({
  name: z.string().min(2, 'Please tell us your name.'),
  email: z.string().email('Please enter a valid email address.'),
  where: z.string().optional(),
  topic: z.string().min(1, 'Please choose what your message is about.'),
  message: z
    .string()
    .min(20, 'Please write at least 20 characters so the message is useful.'),
  consent: z
    .boolean()
    .refine((value) => value === true, { message: 'Please confirm before sending.' })
});

const fieldClass =
  'mt-2 w-full rounded-sm border border-border bg-ivory px-4 py-3 text-sm text-forest-800 outline-none transition-colors placeholder:text-muted-foreground focus:border-gold-500';
const labelClass = 'block text-[11px] font-semibold uppercase tracking-[0.24em] text-forest-700';
const errorClass = 'mt-2 text-xs text-clay-700';

export default function ContactForm() {
  const [reviewed, setReviewed] = useState(null);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      name: '',
      email: '',
      where: '',
      topic: '',
      message: '',
      consent: false
    }
  });

  const onSubmit = async (values) => {
    // The site is frontend-only: this demonstrates the form and its validation.
    // Nothing is transmitted, stored or delivered anywhere.
    await new Promise((resolve) => window.setTimeout(resolve, 700));
    setReviewed(values);
    reset();
  };

  if (reviewed) {
    return (
      <div className="border border-gold-500/40 bg-gold-50/70 p-8">
        <p className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.3em] text-gold-700">
          <Check className="h-4 w-4" aria-hidden="true" />
          Message checked
        </p>
        <h3 className="mt-4 font-display text-2xl text-forest-700">
          Thank you, {reviewed.name}.
        </h3>
        <p className="mt-4 text-sm leading-relaxed text-forest-800">
          Your message passed validation, but <strong>nothing has been sent</strong> — this website
          is a frontend demonstration and does not deliver messages yet. To reach Nkar Woo Land
          today, please use the contact details on this page. A form service can be connected later
          so that messages arrive automatically.
        </p>
        <dl className="mt-6 space-y-2 border-t border-gold-500/30 pt-5 text-xs text-forest-700">
          <div>
            <dt className="inline text-muted-foreground">Subject: </dt>
            <dd className="inline">{reviewed.topic}</dd>
          </div>
          <div>
            <dt className="inline text-muted-foreground">Reply address: </dt>
            <dd className="inline">{reviewed.email}</dd>
          </div>
          <div>
            <dt className="inline text-muted-foreground">Message length: </dt>
            <dd className="inline">{reviewed.message.length} characters</dd>
          </div>
        </dl>
        <button
          type="button"
          onClick={() => setReviewed(null)}
          className="mt-6 inline-flex items-center gap-2 bg-forest-700 px-6 py-3 text-[11px] font-semibold uppercase tracking-[0.22em] text-ivory transition-colors hover:bg-gold-600"
        >
          Write another message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-6">
      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label className={labelClass} htmlFor="contact-name">
            Your name
          </label>
          <input id="contact-name" className={fieldClass} {...register('name')} />
          {errors.name && <p className={errorClass}>{errors.name.message}</p>}
        </div>
        <div>
          <label className={labelClass} htmlFor="contact-email">
            Email address
          </label>
          <input id="contact-email" type="email" className={fieldClass} {...register('email')} />
          {errors.email && <p className={errorClass}>{errors.email.message}</p>}
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label className={labelClass} htmlFor="contact-where">
            Where you are writing from <span className="normal-case tracking-normal">(optional)</span>
          </label>
          <input
            id="contact-where"
            className={fieldClass}
            placeholder="Nkar, Yaoundé, Paris, Toronto…"
            {...register('where')}
          />
        </div>
        <div>
          <label className={labelClass} htmlFor="contact-topic">
            What is it about?
          </label>
          <select id="contact-topic" className={fieldClass} {...register('topic')}>
            <option value="">Choose a subject…</option>
            {contactTopics.map((topic) => (
              <option key={topic.title} value={topic.title}>
                {topic.title}
              </option>
            ))}
            <option value="Something else">Something else</option>
          </select>
          {errors.topic && <p className={errorClass}>{errors.topic.message}</p>}
        </div>
      </div>

      <div>
        <label className={labelClass} htmlFor="contact-message">
          Your message
        </label>
        <textarea
          id="contact-message"
          rows={6}
          className={fieldClass}
          placeholder="Tell us what you hold, what you would like to add, or what needs correcting."
          {...register('message')}
        />
        {errors.message && <p className={errorClass}>{errors.message.message}</p>}
      </div>

      <div className="flex items-start gap-3">
        <input
          id="contact-consent"
          type="checkbox"
          className="mt-1 h-4 w-4 accent-forest-700"
          {...register('consent')}
        />
        <label htmlFor="contact-consent" className="text-xs leading-relaxed text-muted-foreground">
          I understand that this form is a demonstration: it will check my details but will not
          deliver my message anywhere.
        </label>
      </div>
      {errors.consent && <p className={errorClass}>{errors.consent.message}</p>}

      <button
        type="submit"
        disabled={isSubmitting}
        className="inline-flex items-center gap-2 bg-forest-700 px-7 py-3.5 text-[11px] font-semibold uppercase tracking-[0.22em] text-ivory transition-colors hover:bg-gold-600 disabled:opacity-60"
      >
        {isSubmitting ? (
          <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
        ) : (
          <Send className="h-4 w-4" aria-hidden="true" />
        )}
        {isSubmitting ? 'Checking…' : 'Check my message'}
      </button>
    </form>
  );
}