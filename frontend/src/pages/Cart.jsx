import { useCart } from "../context/CartContext";

export default function Cart() {
  const { cart, removeFromCart, clearCart } = useCart();

  return (
    <div className="p-10">
      <h1 className="text-2xl mb-6">Votre Panier</h1>
      {cart.length === 0 ? (
        <p>Panier vide</p>
      ) : (
        <>
          {cart.map((item) => (
            <div key={item._id} className="flex justify-between items-center border-b py-2">
              <span>{item.name}</span>
              <button
                onClick={() => removeFromCart(item._id)}
                className="bg-red-600 text-white px-4 py-1 rounded hover:bg-red-700"
              >
                Supprimer
              </button>
            </div>
          ))}
          <button
            onClick={clearCart}
            className="bg-gray-600 text-white px-4 py-2 mt-4 rounded hover:bg-gray-700"
          >
            Vider le panier
          </button>
        </>
      )}
    </div>
  );
}