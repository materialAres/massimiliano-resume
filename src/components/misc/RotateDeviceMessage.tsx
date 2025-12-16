export const RotateDeviceMessage = () => {
  return (
    <div className="fixed inset-0 bg-[#a5b9fd] z-50 flex items-center justify-center p-6">
      <div className="text-center text-white max-w-md">
        <h1 className="text-3xl font-bold mb-4">Please Rotate Your Device</h1>

        <p className="text-lg text-gray-200 mb-6">
          The experience is best enjoyed in landscape mode
        </p>

        <div className="flex items-center justify-center gap-2 text-sm text-gray-300">
          <div className="w-8 h-12 border-2 border-white rounded"></div>
          <span className="text-2xl">→</span>
          <div className="w-12 h-8 border-2 border-white rounded"></div>
        </div>
      </div>
    </div>
  );
};
