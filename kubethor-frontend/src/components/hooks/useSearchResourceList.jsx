import { useState } from "react";

const useSearchResourceList = (initialValue = "") => {
  const [searchTerm, setSearchTerm] = useState(initialValue);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const filterData = (data) => {
    return data.filter((item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  return { searchTerm, handleSearch, filterData };
};

export default useSearchResourceList;
