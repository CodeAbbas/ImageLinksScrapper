import React from 'react';
import { Search, Loader2, ExternalLink, AlertCircle } from 'lucide-react';

export default function UrlInputForm({ url, setUrl, loading, error, onSubmit }) {
  return (
    <div className="bg-white rounded-3xl shadow-lg border border-slate-100 p-8">
      <form onSubmit={onSubmit} className="flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-grow w-full">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <ExternalLink className="h-5 w-5 text-slate-400" />
          </div>
          <input
            type="url"
            required
            placeholder="https://example.com/product/..."
            className="w-full pl-11 pr-6 py-4 bg-slate-50 border border-slate-200 rounded-full focus:ring-4 focus:ring-blue-100 focus:border-blue-400 transition-all outline-none text-slate-700 shadow-inner"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full md:w-auto px-8 py-4 bg-gradient-to-r from-blue-600 via-cyan-500 to-teal-400 hover:from-blue-700 hover:via-cyan-600 hover:to-teal-500 text-white font-bold rounded-full shadow-md hover:shadow-xl hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100 min-w-[160px]"
        >
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5" />}
          <span>Extract Links</span>
        </button>
      </form>
      {error && (
        <div className="mt-4 text-sm text-red-600 flex items-center gap-2 bg-red-50 p-3 rounded-xl inline-flex">
          <AlertCircle className="w-4 h-4" /> {error}
        </div>
      )}
    </div>
  );
}