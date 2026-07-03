export default function UserDiagnosticsHistory() {
  const data = JSON.parse(localStorage.getItem("diagnostics")) || [];

  return (
    <div>
      <h2 className="text-xl font-bold mb-6">Your Diagnostics</h2>

      <div className="grid grid-cols-2 gap-4">
        {data.map((d, i) => (
          <div key={i} className="p-4 border rounded-xl">
            <img src={d.image} className="w-full rounded mb-3" />
            <p>Score: {d.score}</p>
            <p className="text-sm text-gray-500">{d.date}</p>
          </div>
        ))}
      </div>
    </div>
  );
}