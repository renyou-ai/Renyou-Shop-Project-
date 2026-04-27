export default function Routine() {
  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-50 to-gray-100 flex items-center justify-center p-10">
      <div className="bg-white shadow-lg rounded-2xl p-10 w-full max-w-2xl text-center border border-blue-200">
        <h1 className="text-3xl font-bold text-blue-700 mb-6">Discover Your Routine</h1>
        <p className="text-gray-600 mb-6">
          Ici vous pouvez découvrir une routine personnalisée adaptée à votre peau et vos besoins.
        </p>
        <button
          className="bg-blue-600 text-white px-8 py-3 rounded-xl hover:bg-blue-700 transition shadow-md"
          onClick={() => alert("🚀 Routine intelligente en cours...")}
        >
          Lancer ma routine
        </button>
      </div>
    </div>
  );
}