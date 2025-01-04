// import axios from "axios";
//
// const { data } = await axios.get(
// 	`https://stx.city/api/fetchFrontEnd/bondingData?page=1limit=1`,
// );

import { cvToValue, hexToCV } from "@stacks/transactions";

// console.log(data);
const data = hexToCV(
	"0x070a0c00000002046e616d65020000000761746f6d69635f096e616d6573706163650200000003627463",
);
console.log(JSON.stringify(data, null, 2));
