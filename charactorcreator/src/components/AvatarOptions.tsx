// "use client";
// import { useAvatar } from "@/app/context/AvatarContext";
// import { useState } from "react";

// export default function AvatarOptions() {
//   const { generateAvatar } = useAvatar();

//   const [selectedAccessories, setSelectedAccessories] = useState<string>("");
//   const [selectedFace, setSelectedFace] = useState<string>("");
//   const [selectedFacialHair, setSelectedFacialHair] = useState<string>("");
//   const [selectedHead, setSelectedHead] = useState<string>("");
//   const [clothingColor, setClothingColor] = useState<string>("#8fa7df");
//   const [headContrastColor, setHeadContrastColor] = useState<string>("#2c1b18");
//   const [skinColor, setSkinColor] = useState<string>("#694d3d");

//   const handleGenerateAvatar = () => {
//     generateAvatar({
//       accessories: [selectedAccessories],
//       accessoriesProbability: selectedAccessories ? 100 : 0,
//       face: [selectedFace],
//       facialHair: [selectedFacialHair],
//       facialHairProbability: selectedFacialHair ? 100 : 0,
//       head: [selectedHead],
//       clothingColor: [clothingColor],
//       headContrastColor: [headContrastColor],
//       skinColor: [skinColor],
//     });
//   };

//   return (
//     <div>
//       <div>
//         <label htmlFor="accessories">Choose Accessories: </label>
//         <select
//           id="accessories"
//           value={selectedAccessories}
//           onChange={(e) => setSelectedAccessories(e.target.value)}
//         >
//           <option value="">None</option>
//           {/* Map options */}
//         </select>
//       </div>
//       {/* Add other option selectors similar to above */}
//       <button onClick={handleGenerateAvatar}>Generate Avatar</button>
//     </div>
//   );
// }
