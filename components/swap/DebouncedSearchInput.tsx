// import React, { useState, useCallback, useMemo } from 'react';
// import debounce from 'lodash/debounce';
// import { BottomSheetTextInput } from "../ui/bottom-sheet.native";
//
// export const DebouncedSearchInput = ({ onSearch }) => {
//   const [inputValue, setInputValue] = useState("");
//
//   const debouncedSearch = useMemo(
//     () => debounce((query) => {
//       onSearch(query);
//     }, 300),
//     [onSearch]
//   );
//
//   const handleChange = useCallback((text) => {
//     setInputValue(text);
//     debouncedSearch(text);
//   }, [debouncedSearch]);
//
//   return (
//     <BottomSheetTextInput
//       placeholder="Search name or paste token"
//       className="my-3 bg-gray-100 rounded"
//       value={inputValue}
//       onChangeText={handleChange}
//     />
//   );
// };
