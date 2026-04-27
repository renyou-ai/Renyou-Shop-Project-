export default function ProductsMatch() {
  return (
    <div className="min-h-screen bg-gradient-to-r from-teal-50 to-gray-100 flex items-center justify-center p-10">
      <div className="bg-white shadow-lg rounded-2xl p-10 w-full max-w-2xl text-center border border-teal-200">
        <h1 className="text-3xl font-bold text-teal-700 mb-6">Match-Perfect Products</h1>
        <p className="text-gray-600 mb-6">
          Trouvez les produits parfaitement adaptés à votre peau grâce à notre diagnostic intelligent.
        </p>
        <button
          className="bg-teal-600 text-white px-8 py-3 rounded-xl hover:bg-teal-700 transition shadow-md"
          onClick={() => alert("✨ Recherche de produits en cours...")}
        >
          Trouver mes produits
        </button>
      </div>
    </div>
  );
}