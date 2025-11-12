const CarouselForm = () => {
  return (
    <div className="mt-20 text-center">
      <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-10">
        Add Carousel
      </h2>

      <form className="max-w-xl mx-auto px-6 space-y-6">
        <input
          type="file"
          placeholder="Your Name"
          className="border border-red-500 bg-white rounded-md p-4 w-full "
        />

        <div className="text-center">
          <button
            type="submit"
            className="bg-[#E51A4B] hover:bg-red-700 text-white font-semibold py-4 px-8 rounded-md shadow-md transition"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default CarouselForm;
