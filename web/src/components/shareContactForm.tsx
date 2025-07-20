'use client';
import React, { useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function ShareContactForm({ cardId, onClose }: { cardId: string, onClose: () => void }) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [designation, setDesignation] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async () => {
    if (!email) return alert('Please enter a valid email.');
    setLoading(true);

    const { error } = await supabase.from('contacts').insert({
      card_id: cardId,
      first_name: firstName,
      last_name: lastName,
      designation,
      email,
      mobile,
    });

    setLoading(false);

    if (error) {
      alert('Failed to submit contact.');
      console.error('Insert error:', error);
    } else {
      setSubmitted(true);
    }
  };

  if (submitted) {
    return (
      <div className="mt-4 p-4 bg-green-100 rounded">
        <p className="text-green-700">✅ Contact shared successfully!</p>
        <button className="mt-2 text-blue-600 underline" onClick={onClose}>Close</button>
      </div>
    );
  }

  return (
    <div className="mt-4 w-full max-w-md p-4 border border-gray-300 rounded-lg bg-white shadow">
      <h3 className="text-lg font-semibold mb-4">Share Your Contact Info</h3>
      <input
        className="w-full mb-2 p-2 border rounded"
        placeholder="First Name"
        value={firstName}
        onChange={e => setFirstName(e.target.value)}
      />
      <input
        className="w-full mb-2 p-2 border rounded"
        placeholder="Last Name"
        value={lastName}
        onChange={e => setLastName(e.target.value)}
      />
      <input
        className="w-full mb-2 p-2 border rounded"
        placeholder="Mobile"
        value={mobile}
        onChange={e => setMobile(e.target.value)}
      />
      <input
        className="w-full mb-2 p-2 border rounded"
        placeholder="Email"
        type="email"
        value={email}
        onChange={e => setEmail(e.target.value)}
      />
      <input
        className="w-full mb-2 p-2 border rounded"
        placeholder="Designation"
        value={designation}
        onChange={e => setDesignation(e.target.value)}
      />
      <div className="flex gap-4 mt-3">
        <button
          className="px-4 py-2 bg-gray-300 rounded"
          onClick={onClose}
        >
          Cancel
        </button>
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? 'Sending...' : 'Submit'}
        </button>
      </div>
    </div>
  );
}
