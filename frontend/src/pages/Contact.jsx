import React, { useState } from 'react';
import api from '../services/api';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
const Contact = () => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);
    setError('');
    try {
      await api.post('/portal/contact/', form);
      setSubmitted(true);
      setForm({ name: '', email: '', subject: '', message: '' });
    } catch (err) {
      setError(
        'Could not send your message. The server may be waking up, so please wait a moment and try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <div className="max-w-7xl mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold mb-8">Contact Us</h1>
      <div className="grid md:grid-cols-2 gap-12">
        <div className="space-y-6">
          <div className="flex items-start space-x-4">
            <MapPin className="h-6 w-6 text-primary-800 mt-1" />
            <div>
              <h3 className="font-semibold">Address</h3>
              <p className="text-gray-600">
                Pinamalayan, Oriental Mindoro, Philippines
              </p>
            </div>
          </div>
          <div className="flex items-start space-x-4">
            <Phone className="h-6 w-6 text-primary-800 mt-1" />
            <div>
              <h3 className="font-semibold">Phone</h3>
              <p className="text-gray-600">0909 375 1973</p>
            </div>
          </div>
          <div className="flex items-start space-x-4">
            <Mail className="h-6 w-6 text-primary-800 mt-1" />
            <div>
              <h3 className="font-semibold">Email</h3>
              <p className="text-gray-600">eemgcollege@gmail.com</p>
            </div>
          </div>
        </div>
        <div className="card">
          {submitted ? (
            <div className="text-center py-8">
              <Send className="h-12 w-12 text-green-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-green-600">
                Message Sent!
              </h3>
              <p className="text-gray-600 mt-2">Thank you. We will get back to you soon.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                placeholder="Name"
                className="input-field"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
              <input
                type="email"
                placeholder="Email"
                className="input-field"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
              <input
                type="text"
                placeholder="Subject"
                className="input-field"
                required
                value={form.subject}
                onChange={(e) => setForm({ ...form, subject: e.target.value })}
              />
              <textarea
                placeholder="Message"
                rows="4"
                className="input-field"
                required
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
              ></textarea>
              {error && (
                <p role="alert" className="text-sm text-red-600">
                  {error}
                </p>
              )}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full btn-primary disabled:opacity-60 disabled:cursor-not-allowed"
              >
                <Send className="h-4 w-4 inline mr-2" />
                {isSubmitting ? 'Sending...' : 'Send'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
export default Contact;
