import { Search } from "lucide-react";
import { useState, memo, useEffect } from "react";
import { doctorService } from "../services/doctorService.js";
import { Underline } from "lucide-react";

const SearchPets = memo(({ onSelectedPet }) => {
  const [search, setSearch] = useState(
    () => sessionStorage.getItem("doctor_search_term") || ""
  );
  const [petsList, setPetsList] = useState(() => {
    const saved = sessionStorage.getItem("doctor_search_results");
    return saved ? JSON.parse(saved) : [];
  });
  const [petS, setPetS] = useState(() => {
    const saved = sessionStorage.getItem("doctor_search_selected_pet");
    return saved ? JSON.parse(saved) : "";
  });

  useEffect(() => {
    sessionStorage.setItem("doctor_search_term", search);
  }, [search]);

  useEffect(() => {
    sessionStorage.setItem("doctor_search_results", JSON.stringify(petsList));
  }, [petsList]);

  useEffect(() => {
    if (petS) {
      sessionStorage.setItem(
        "doctor_search_selected_pet",
        JSON.stringify(petS)
      );
    } else {
      sessionStorage.removeItem("doctor_search_selected_pet");
    }
  }, [petS]);

  const onEnter = async () => {
    if (search.length === 10) {
      const pets = await doctorService.getPetsByPhone(search);
      setPetsList(pets);
      console.log(pets);
    } else {
      setPetsList([]);
      onSelectedPet();
    }
  };

  const handleSelect = (pet) => {
    onSelectedPet(pet); // tham chieu ra ngoai
    setPetS(pet); // bien o trong
  };
  return (
    <div className="lg:col-span-1">
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Tìm kiếm thú cưng</h2>

        {/* Search Input */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none z-10" />
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
            }}
            onKeyDown={(e) => {
              console.log(e.key);
              if (e.key === "Enter") {
                onEnter();
              }
            }}
            placeholder="Tìm kiếm theo số điện thoại khách hàng"
            className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
          />
        </div>

        {/* Pet List */}
        <div className="space-y-3 max-h-[600px] overflow-y-auto">
          {petsList.map((pet) => (
            <button
              key={pet.mathucung}
              onClick={() => handleSelect(pet)}
              className={`w-full text-left p-4 border-2 rounded-lg transition-all ${
                petS?.mathucung === pet.mathucung
                  ? "border-blue-600 bg-blue-50"
                  : "border-gray-200 hover:border-gray-300 bg-white"
              }`}
            >
              <div className="flex items-start space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-bold text-lg">
                    {pet.ten.charAt(0)}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-gray-900">{pet.ten}</h3>
                  <p className="text-sm text-gray-600">
                    {pet.loai} - {pet.giong}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">{pet.mathucung}</p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
});
export default SearchPets;
