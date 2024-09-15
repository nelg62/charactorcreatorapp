// "use client";
// import { useAvatar } from "../app/context/AvatarContext";
// import React from "react";

// function CreateAvatar() {
//   const avatarContext = useAvatar();

//   console.log("Avatar Context:", avatarContext);

//   const {
//     avatarData,
//     setSelectedAccessories,
//     setSelectedFace,
//     setSelectedFacialHair,
//     setSelectedHead,
//     setClothingColor,
//     setHeadContrastColor,
//     setSkinColor,
//     avatarAccessoriesChoices,
//     avatarFaceChoices,
//     avatarFacialHairChoices,
//     avatarHeadChoices,
//     clothingColor,
//     headContrastColor,
//     skinColor,
//   } = avatarContext;

//   return (
//     <div>
//       <div>
//         <label htmlFor="accessories">Choose Accessories: </label>
//         <select
//           id="accessories"
//           onChange={(e) => setSelectedAccessories(e.target.value)}
//           className="text-blue-500"
//         >
//           <option value="">None</option>
//           {avatarAccessoriesChoices.map((accessory) => (
//             <option key={accessory} value={accessory}>
//               {accessory}
//             </option>
//           ))}
//         </select>
//       </div>

//       <div>
//         <label htmlFor="face">Choose Face Type: </label>
//         <select
//           id="face"
//           onChange={(e) => setSelectedFace(e.target.value)}
//           className="text-blue-500"
//         >
//           {avatarFaceChoices.map((face) => (
//             <option key={face} value={face}>
//               {face}
//             </option>
//           ))}
//         </select>
//       </div>

//       <div>
//         <label htmlFor="facialhair">Choose Facial Hair: </label>
//         <select
//           id="facialhair"
//           onChange={(e) => setSelectedFacialHair(e.target.value)}
//           className="text-blue-500"
//         >
//           <option value="">None</option>
//           {avatarFacialHairChoices.map((facialhair) => (
//             <option key={facialhair} value={facialhair}>
//               {facialhair}
//             </option>
//           ))}
//         </select>
//       </div>

//       <div>
//         <label htmlFor="head">Choose Hair: </label>
//         <select
//           id="head"
//           onChange={(e) => setSelectedHead(e.target.value)}
//           className="text-blue-500"
//         >
//           {avatarHeadChoices.map((head) => (
//             <option key={head} value={head}>
//               {head}
//             </option>
//           ))}
//         </select>
//       </div>

//       <div>
//         <label htmlFor="clothingColor">Choose Clothing Color: </label>
//         <input
//           id="clothingColor"
//           type="color"
//           value={`#${clothingColor}`}
//           onChange={(e) => setClothingColor(e.target.value.replace("#", ""))}
//         />
//       </div>

//       <div>
//         <label htmlFor="hairColor">Choose Hair Color: </label>
//         <input
//           id="hairColor"
//           type="color"
//           value={`#${headContrastColor}`}
//           onChange={(e) =>
//             setHeadContrastColor(e.target.value.replace("#", ""))
//           }
//         />
//       </div>

//       <div>
//         <label htmlFor="skinColor">Choose Skin Color: </label>
//         <input
//           id="skinColor"
//           type="color"
//           value={`#${skinColor}`}
//           onChange={(e) => setSkinColor(e.target.value.replace("#", ""))}
//         />
//       </div>

//       <div>
//         {/* Render the generated avatar */}
//         <img src={avatarData} alt="Avatar" />
//       </div>
//     </div>
//   );
// }

// export default CreateAvatar;
