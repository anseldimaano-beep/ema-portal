import React, { useEffect, useState } from 'react';
import api from '../services/api';
import FAQ from '../components/FAQ';

const FAQPage = () => {
  const [faqs, setFaqs] = useState([]);
  const [status, setStatus] = useState('loading'); // loading | ready | error

  useEffect(() => {
    api
      .get('/portal/faqs/')
      .then((r) => {
        setFaqs(r.data.results || []);
        setStatus('ready');
      })
      .catch(() => setStatus('error'));
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold mb-8">FAQ</h1>
      {status === 'loading' && (
        <p className="text-gray-500">Loading questions... the server may take a moment to wake up.</p>
      )}
      {status === 'error' && (
        <p className="text-gray-600">Could not load the FAQ right now. Please refresh the page in a moment.</p>
      )}
      {status === 'ready' && faqs.length === 0 && (
        <p className="text-gray-600">No questions have been posted yet.</p>
      )}
      {faqs.map((f) => (
        <FAQ key={f.id} faq={f} />
      ))}
    </div>
  );
};

export default FAQPage;
