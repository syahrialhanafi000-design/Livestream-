'use client';

import React, { useState } from 'react';
import { Sparkles, TrendingUp, DollarSign, Activity, MessageCircle, MousePointer2, Clock, AlertCircle } from 'lucide-react';

interface PredictionData {
  Views: number;
  'Product clicks': number; // Keeping exact key as requested
  Likes: number;
  Comments: number;
  Duration: number;
}

interface ApiResponse {
  prediction: number;
}

export default function PredictionPage() {
  const [formData, setFormData] = useState<PredictionData>({
    Views: 0,
    'Product clicks': 0,
    Likes: 0,
    Comments: 0,
    Duration: 0,
  });

  const [prediction, setPrediction] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: parseFloat(value) || 0,
    }));
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const handlePredict = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setPrediction(null);

    try {
      // Constructing payload exactly as requested
      const payload = {
        data: {
          Views: formData.Views,
          'Product clicks': formData['Product clicks'],
          Likes: formData.Likes,
          Comments: formData.Comments,
          Duration: formData.Duration,
        },
      };

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';
      const response = await fetch(`${apiUrl}/predict`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch prediction. Is the API running?');
      }

      const result: ApiResponse = await response.json();
      setPrediction(result.prediction);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-indigo-50 via-purple-50 to-pink-50 p-6 flex items-center justify-center font-sans text-slate-800">
      <div className="max-w-4xl w-full grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        {/* Left Col: Header & Context */}
        <div className="space-y-6 text-center lg:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-100 text-indigo-600 text-sm font-medium">
            <Sparkles className="w-4 h-4" />
            <span>AI Powered Analytics</span>
          </div>
          <h1 className="text-4xl lg:text-5xl font-extrabold tracking-tight bg-clip-text text-transparent bg-linear-to-r from-indigo-600 to-purple-600">Livestream Revenue Predictor</h1>
          <p className="text-lg text-slate-600 leading-relaxed">Estimate your potential earnings using advanced machine learning. Simply enter your engagement metrics and get instant insights.</p>

          {/* Result Card (Desktop View - Floating) */}
          <div className="hidden lg:block transform transition-all hover:scale-[1.02] duration-300">
            <div className="bg-white/60 backdrop-blur-xl border border-white/40 p-6 rounded-3xl shadow-xl shadow-indigo-100/50">
              <div className="flex items-center gap-4 mb-2">
                <div className="p-3 bg-green-100 rounded-2xl text-green-600">
                  <DollarSign className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm text-slate-500 font-medium">Predicted Revenue</p>
                  <div className="h-8 flex items-center">
                    {loading ? (
                      <div className="animate-pulse w-32 h-6 bg-slate-200 rounded"></div>
                    ) : prediction !== null ? (
                      <span className="text-2xl font-bold text-slate-800">{formatCurrency(prediction)}</span>
                    ) : (
                      <span className="text-xs text-slate-400 italic">Waiting for input...</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Col: Input Form */}
        <div className="bg-white/70 backdrop-blur-md border border-white/50 rounded-3xl p-8 shadow-2xl shadow-indigo-100/40 relative overflow-hidden">
          {/* Decorative Blur Orbs */}
          <div className="absolute -top-20 -right-20 w-40 h-40 bg-purple-200/50 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-indigo-200/50 rounded-full blur-3xl pointer-events-none"></div>

          <form onSubmit={handlePredict} className="space-y-5 relative">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <InputField label="Total Views" name="Views" value={formData.Views} onChange={handleInputChange} icon={<Activity className="w-4 h-4" />} placeholder="e.g. 15000" />
              <InputField label="Product Clicks" name="Product clicks" value={formData['Product clicks']} onChange={handleInputChange} icon={<MousePointer2 className="w-4 h-4" />} placeholder="e.g. 120" />
              <InputField label="Total Likes" name="Likes" value={formData.Likes} onChange={handleInputChange} icon={<TrendingUp className="w-4 h-4" />} placeholder="e.g. 3500" />
              <InputField label="Comments" name="Comments" value={formData.Comments} onChange={handleInputChange} icon={<MessageCircle className="w-4 h-4" />} placeholder="e.g. 45" />
            </div>

            <InputField label="Duration (Minutes)" name="Duration" value={formData.Duration} onChange={handleInputChange} icon={<Clock className="w-4 h-4" />} placeholder="e.g. 60" fullWidth />

            {error && (
              <div className="p-4 bg-red-50 border border-red-100 text-red-600 rounded-xl flex items-start gap-3 text-sm animate-fade-in">
                <AlertCircle className="w-5 h-5 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-linear-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold py-4 rounded-2xl shadow-lg shadow-indigo-200/50 transition-all transform active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2">
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Analyzing Data...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  <span>Hitung Prediksi</span>
                </>
              )}
            </button>

            {/* Mobile Result Card */}
            <div className="lg:hidden mt-6 bg-indigo-50/50 border border-indigo-100 rounded-2xl p-4 text-center">
              <p className="text-xs text-indigo-400 font-semibold uppercase tracking-wider mb-1">Estimated Revenue</p>
              {loading ? <div className="h-8 w-24 bg-slate-200 rounded animate-pulse mx-auto"></div> : <p className="text-2xl font-bold text-slate-800">{prediction !== null ? formatCurrency(prediction) : 'Rp 0'}</p>}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

interface InputFieldProps {
  label: string;
  name: string;
  value: number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  icon: React.ReactNode;
  placeholder?: string;
  fullWidth?: boolean;
}

function InputField({ label, name, value, onChange, icon, placeholder, fullWidth }: InputFieldProps) {
  return (
    <div className={fullWidth ? 'col-span-1 md:col-span-2' : ''}>
      <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2 ml-1">{label}</label>
      <div className="relative group">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 peer-focus:text-indigo-500 transition-colors pointer-events-none">{icon}</div>
        <input
          type="number"
          name={name}
          value={value === 0 ? '' : value}
          onChange={onChange}
          placeholder={placeholder}
          className="peer w-full bg-white/50 border-2 border-slate-100 rounded-xl py-3 pl-11 pr-4 text-slate-800 font-medium placeholder-slate-300 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all shadow-sm hover:border-slate-200"
        />
      </div>
    </div>
  );
}
