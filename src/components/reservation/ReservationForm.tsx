"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';

type FormData = {
  name: string;
  email: string;
  phone: string;
  date: string;
  time: string;
  guests: number;
  message: string;
};

const ReservationForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>();

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    console.log('Form data:', data);
    setIsSubmitting(false);
    setIsSubmitted(true);
    reset();
    
    // Reset success message after 5 seconds
    setTimeout(() => {
      setIsSubmitted(false);
    }, 5000);
  };

  return (
    <div>
      {isSubmitted ? (
        <div className="bg-success bg-opacity-10 text-success border border-success border-opacity-20 px-4 py-3 rounded mb-4"> {/* Removed dark: classes */}
          <p>Thank you for your reservation request! We will confirm your booking shortly.</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label htmlFor="name" className="form-label">
              Name *
            </label>
            <input
              id="name"
              type="text"
              className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-colors bg-background ${ /* Removed dark:bg-background-secondary */
                errors.name ? 'border-error' : 'border-input'
              }`}
              {...register('name', { required: 'Name is required' })}
            />
            {errors.name && <p className="text-error text-sm mt-1">{errors.name.message}</p>}
          </div>

          <div>
            <label htmlFor="email" className="form-label">
              Email *
            </label>
            <input
              id="email"
              type="email"
              className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-colors bg-background ${ /* Removed dark:bg-background-secondary */
                errors.email ? 'border-error' : 'border-input'
              }`}
              {...register('email', {
                required: 'Email is required',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Invalid email address',
                },
              })}
            />
            {errors.email && <p className="text-error text-sm mt-1">{errors.email.message}</p>}
          </div>

          <div>
            <label htmlFor="phone" className="form-label">
              Phone *
            </label>
            <input
              id="phone"
              type="tel"
              className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-colors bg-background ${ /* Removed dark:bg-background-secondary */
                errors.phone ? 'border-error' : 'border-input'
              }`}
              {...register('phone', { required: 'Phone number is required' })}
            />
            {errors.phone && <p className="text-error text-sm mt-1">{errors.phone.message}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="date" className="form-label">
                Date *
              </label>
              <input
                id="date"
                type="date"
                className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-colors bg-background ${ /* Removed dark:bg-background-secondary */
                  errors.date ? 'border-error' : 'border-input'
                }`}
                {...register('date', { required: 'Date is required' })}
              />
              {errors.date && <p className="text-error text-sm mt-1">{errors.date.message}</p>}
            </div>

            <div>
              <label htmlFor="time" className="form-label">
                Time *
              </label>
              <input
                id="time"
                type="time"
                className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-colors bg-background ${ /* Removed dark:bg-background-secondary */
                  errors.time ? 'border-error' : 'border-input'
                }`}
                {...register('time', { required: 'Time is required' })}
              />
              {errors.time && <p className="text-error text-sm mt-1">{errors.time.message}</p>}
            </div>
          </div>

          <div>
            <label htmlFor="guests" className="form-label">
              Number of Guests *
            </label>
            <select
              id="guests"
              className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-colors bg-background ${ /* Removed dark:bg-background-secondary */
                errors.guests ? 'border-error' : 'border-input'
              }`}
              {...register('guests', { required: 'Number of guests is required' })}
            >
              <option value="">Select number of guests</option>
              {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                <option key={num} value={num}>
                  {num} {num === 1 ? 'person' : 'people'}
                </option>
              ))}
            </select>
            {errors.guests && <p className="text-error text-sm mt-1">{errors.guests.message}</p>}
          </div>

          <div>
            <label htmlFor="message" className="form-label">
              Special Requests
            </label>
            <textarea
              id="message"
              rows={4}
              className="w-full px-4 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-colors bg-background" /* Removed dark:bg-background-secondary */
              {...register('message')}
            ></textarea>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="btn btn-primary w-full"
          >
            {isSubmitting ? 'Submitting...' : 'Reserve a Table'}
          </button>
        </form>
      )}
    </div>
  );
};

export default ReservationForm;
