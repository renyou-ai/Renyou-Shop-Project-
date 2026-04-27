export default function Diagnostics() {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-10">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-2xl text-center">
        <h1 className="text-3xl font-bold text-blue-600 mb-6">Diagnostics</h1>
        <p className="text-gray-700 mb-4">
          Bienvenue dans la section diagnostics. Ici, vous pouvez lancer une analyse intelligente
          pour obtenir des recommandations personnalisées.
        </p>
        <button
          className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700 transition"
          onClick={() => alert("🚀 Diagnostic intelligent en cours...")}
        >
          Lancer le diagnostic
        </button>
      </div>
    </div>
  );
}