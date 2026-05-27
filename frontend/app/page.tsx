"use client";
import { useState } from "react";

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const analyze = async () => {
    if (!file) return;
    setLoading(true);
    setError("");
    setResult("");
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await fetch("https://resumex-backend-kp51.onrender.com/analyze", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "Something went wrong");
      setResult(data.result);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const parseResult = (text: string) => {
    const score = text.match(/SCORE:\s*(\d+)/)?.[1];
    const roast = text.match(/ROAST:\n([\s\S]*?)\n\nSTRENGTHS:/)?.[1];
    const strengths = text.match(/STRENGTHS:\n([\s\S]*?)\n\nIMPROVEMENTS:/)?.[1]
      ?.split("\n").filter(l => l.startsWith("-")).map(l => l.slice(2));
    const improvements = text.match(/IMPROVEMENTS:\n([\s\S]*?)\n\nVERDICT:/)?.[1]
      ?.split("\n").filter(l => l.startsWith("-")).map(l => l.slice(2));
    const verdict = text.match(/VERDICT:\n([\s\S]*?)$/)?.[1];
    return { score, roast, strengths, improvements, verdict };
  };

  const parsed = result ? parseResult(result) : null;
  const scoreColor = parsed?.score
    ? parseInt(parsed.score) >= 70 ? "text-green-400"
    : parseInt(parsed.score) >= 50 ? "text-yellow-400"
    : "text-red-400"
    : "";

  return (
    <main className="min-h-screen bg-gray-950 text-white p-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-10 text-center">
          <h1 className="text-4xl font-bold mb-2">ResumeX ⚡</h1>
          <p className="text-gray-400">Brutally honest AI feedback on your resume.</p>
        </div>

        <div className="bg-gray-900 rounded-2xl p-6 mb-6 border border-gray-800">
          <label className="block mb-4">
            <div className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${file ? "border-purple-500 bg-purple-500/10" : "border-gray-700 hover:border-gray-500"}`}>
              <input type="file" accept=".pdf" className="hidden" onChange={e => setFile(e.target.files?.[0] || null)} />
              {file ? (
                <div>
                  <p className="text-purple-400 font-medium">📄 {file.name}</p>
                  <p className="text-gray-500 text-sm mt-1">Click to change file</p>
                </div>
              ) : (
                <div>
                  <p className="text-gray-400">Drop your resume PDF here</p>
                  <p className="text-gray-600 text-sm mt-1">or click to browse</p>
                </div>
              )}
            </div>
          </label>

          <button
            onClick={analyze}
            disabled={!file || loading}
            className="w-full py-3 rounded-xl font-semibold text-white bg-purple-600 hover:bg-purple-500 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
          >
            {loading ? "Analyzing... 🔍" : "Roast My Resume 🔥"}
          </button>

          {error && <p className="text-red-400 mt-3 text-sm text-center">{error}</p>}
        </div>

        {parsed && (
          <div className="space-y-4">
            <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800 text-center">
              <p className="text-gray-400 text-sm mb-1">Overall Score</p>
              <p className={`text-7xl font-bold ${scoreColor}`}>{parsed.score}<span className="text-3xl text-gray-500">/100</span></p>
            </div>

            <div className="bg-gray-900 rounded-2xl p-6 border border-red-900/50">
              <h2 className="text-red-400 font-semibold mb-3">🔥 The Roast</h2>
              <p className="text-gray-300 leading-relaxed">{parsed.roast}</p>
            </div>

            <div className="bg-gray-900 rounded-2xl p-6 border border-green-900/50">
              <h2 className="text-green-400 font-semibold mb-3">✅ Strengths</h2>
              <ul className="space-y-2">
                {parsed.strengths?.map((s, i) => (
                  <li key={i} className="text-gray-300 flex gap-2"><span className="text-green-500 mt-0.5">•</span>{s}</li>
                ))}
              </ul>
            </div>

            <div className="bg-gray-900 rounded-2xl p-6 border border-yellow-900/50">
              <h2 className="text-yellow-400 font-semibold mb-3">⚡ Improvements</h2>
              <ul className="space-y-2">
                {parsed.improvements?.map((s, i) => (
                  <li key={i} className="text-gray-300 flex gap-2"><span className="text-yellow-500 mt-0.5">•</span>{s}</li>
                ))}
              </ul>
            </div>

            <div className="bg-gray-900 rounded-2xl p-6 border border-gray-700">
              <h2 className="text-gray-400 font-semibold mb-3">⚖️ Verdict</h2>
              <p className="text-white font-medium">{parsed.verdict}</p>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
