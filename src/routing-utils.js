// // Preferences
// export function parsePreferences(search = "") {
//   const searchParams = new URLSearchParams(search);
//   const path = searchParams.get("preferences") || "";
//   // Ignore labels if search does not contain a preferences path
//   const labels = searchParams.has("preferences")
//     ? searchParams.get("labels")
//     : "";

//   const [, section = "", subsection = ""] = path.split("/");

//   const data = {};

//   if (labels) {
//     data.labels = labels;
//   }

//   return { section, subsection, data };
// }
