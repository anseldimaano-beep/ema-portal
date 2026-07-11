import React from 'react';
const FAQ = ({faq}) => <div className="card mb-4"><h3 className="font-bold">{faq.question}</h3><p className="mt-2 text-gray-600">{faq.answer}</p></div>;
export default FAQ;