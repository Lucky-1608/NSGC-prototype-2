export default function Loading() {
    return (
        <div className="min-h-screen bg-black text-white flex items-center justify-center">
            <div className="flex flex-col items-center gap-4">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500"></div>
                <p className="text-gray-400 animate-pulse">Loading complaints...</p>
            </div>
        </div>
    );
}
