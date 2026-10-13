export default function DbMissing() {
  return (
    <div className="rounded-2xl bg-white p-8 text-center ring-1 ring-gray-200">
      <p className="font-display text-lg font-bold text-[#13181E]">Database not connected</p>
      <p className="mt-1 text-sm text-[#4B5154]">Set MONGODB_URI and confirm Atlas Network Access allows this server.</p>
    </div>
  );
}
