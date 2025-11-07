import ListCarousel from "@/components/ListDetails/ListCarousel";
import LocationSection from "@/components/ListDetails/LocationSection";
import PriceSection from "@/components/ListDetails/PriceSection";
import ReviewsSection from "@/components/ListDetails/ReviewsSection";
import RoomsSection from "@/components/ListDetails/RoomsSection";
import { Star, Car, Hotel, Utensils, Mountain } from "lucide-react";
const ListingDetails = () => {
  return (
    <div className="mx-0 pt-11 sm:mx-[10%] ">
      <ListCarousel />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 ">
        <div className="flex flex-col lg:flex-row justify-between gap-8">
          <div className="flex-1">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 leading-snug">
              Highlights of Iceland | Tracing City Sights and Northern Lights
            </h1>
            <div>
              <div className="flex flex-wrap items-center gap-3 mt-3 text-gray-600">
                <div className="flex items-center gap-1 text-emerald-600 font-medium">
                  <Star className="w-4 h-4 fill-emerald-500" />
                  <span>5.0</span>
                </div>
                <span className="text-sm">(388 reviews)</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mt-4 gap-1">
                <p className="text-xl sm:text-2xl font-bold text-gray-900">
                  INR 2,27,683
                </p>
                <span className="line-through text-gray-500 text-sm">
                  INR 3,02,818
                </span>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-4 sm:gap-6 border-y py-4 text-gray-700 text-sm sm:text-base">
              <div className="flex items-center gap-2">
                <Car size={18} /> <span>Transfer Included</span>
              </div>
              <div className="flex items-center gap-2">
                <Hotel size={18} /> <span>Stay Included</span>
              </div>
              <div className="flex items-center gap-2">
                <Utensils size={18} /> <span>Breakfast Included</span>
              </div>
              <div className="flex items-center gap-2">
                <Mountain size={18} /> <span>Sightseeing Included</span>
              </div>
            </div>
            <div className="mt-8 bg-red-50 rounded-2xl p-5 sm:p-6 shadow-inner">
              <h2 className="text-lg sm:text-xl font-semibold mb-4 text-gray-900">
                Resort Properties
              </h2>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 text-gray-700 text-sm sm:text-base">
                <div>🏊‍♂️ Swimming Pool</div>
                <div>🍽️ Kitchen Access</div>
                <div>🏋️ Gym</div>
                <div>🌐 Free Wi-Fi</div>
                <div>🚗 Parking Available</div>
                <div>🧺 Laundry Service</div>
                <div>🌳 Garden View</div>
              </div>
            </div>
            <div className="px-4 sm:px-6 mb-5">
              <RoomsSection />
            </div>
            <div className=" mb-5">
              <PriceSection />
            </div>
            {/* <div className="px-4 sm:px-6 mb-5">
              <LocationSection />
            </div> */}
            <div className="px-4 sm:px-6 mb-5">
              <ReviewsSection />
            </div>
          </div>

          <div className="w-full lg:w-[350px] border  shadow-md p-6 h-fit sticky top-20">
            <h2 className="text-gray-800 font-semibold text-lg">
              Highlights Of Iceland | Tracing City Sights And Northern Lights
            </h2>
            <div className="flex items-center justify-between mt-3">
              <p className="text-xl font-bold text-gray-900">INR 2,27,683</p>
              <span className="line-through text-gray-500 text-sm">
                INR 3,02,818
              </span>
            </div>
            <p className="text-emerald-600 text-sm mt-1">SAVE INR 75,135</p>

            <form className="mt-6 flex flex-col gap-3">
              <p>Number of Adults</p>
              <input
                type="number"
                placeholder="0"
                className="border  px-3 py-2"
              />
              <button
                type="submit"
                className="bg-[#E51A4B] hover:bg-red-700 transition text-white font-semibold py-2 rounded-lg"
              >
                Book Now
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListingDetails;
