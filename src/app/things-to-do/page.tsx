import IncludeItemSection from "@/components/ThingsToDo/IncludeItemSection";
import ReviewsSection from "@/components/ThingsToDo/ReviewsSection";
import ThingsCarousel from "@/components/ThingsToDo/ThingsCarousel";
import {
  Star,
  Car,
  Hotel,
  Utensils,
  Mountain,
  Users,
  ClockFading,
  Hourglass,
  Clock1,
  Smartphone,
  PawPrint,
  BookA,
} from "lucide-react";
const ListingDetails = () => {
  return (
    <div className="mx-0 pt-11 sm:mx-[10%] ">
      <ThingsCarousel />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 ">
        <div className="flex flex-col lg:flex-row justify-between gap-8">
          <div className="flex-1">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 leading-snug">
              Discover Rocky Mountain National Park
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
            <div className="mt-8 bg-red-50 px-3 py-3 border rounded-lg">
              <h2 className="text-lg sm:text-xl font-semibold mb-4 text-gray-900">
                About
              </h2>
              <p>
                Explore the Rocky Mountain National Park on this all-day trip
                from Denver or Boulder. Discover the rugged scenery of the
                Colorado mountains as you weave through small towns and travel
                over alpine passes. Be on the lookout for wildlife such as elk,
                black bears, and moose. Inside the park, you’ll have the chance
                to take short hikes or simply relax.
              </p>
            </div>

            <div className="mt-6 px-4 flex flex-col gap-4 sm:gap-6 border-y py-4 text-gray-700 text-sm sm:text-base">
              <div className="flex items-center gap-2">
                <Users size={18} /> <span>Ages 8-99, max of 50 per group</span>
              </div>
              <div className="flex items-center gap-2">
                <Hourglass size={18} /> <span>Duration: 8h</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock1 size={18} /> <span>Start time: Check availability</span>
              </div>
              <div className="flex items-center gap-2">
                <Smartphone size={18} /> <span>Mobile ticket</span>
              </div>
              <div className="flex items-center gap-2">
                <PawPrint size={18} />{" "}
                <span>Meets animal welfare guidelines</span>
              </div>
              <div className="flex items-center gap-2">
                <BookA size={18} /> <span>Live guide: English</span>
              </div>
            </div>

            <div className="px-4 sm:px-3 mt-5 mb-5">
              <IncludeItemSection />
            </div>
            <div className="px-4 sm:px-3 mb-5">
              <ReviewsSection />
            </div>
          </div>

          <div className="w-full lg:w-[350px] border  shadow-md p-6 h-fit sticky top-20">
            <h2 className="text-gray-800 font-semibold text-lg">
              Discover Rocky Mountain National Park
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
              <p>Number of Children</p>
              <input
                type="number"
                placeholder="0"
                className="border  px-3 py-2"
              />
              <button
                type="submit"
                className="bg-[#E51A4B] hover:bg-red-700 transition text-white font-semibold py-2 rounded-lg"
              >
                Check Availability
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListingDetails;
