import { loadFont as loadRubik } from "@remotion/google-fonts/Rubik";
import { loadFont as loadQuicksand } from "@remotion/google-fonts/Quicksand";

const r = loadRubik("normal", { weights: ["500", "700", "900"], subsets: ["latin"] });
const q = loadQuicksand("normal", { weights: ["400", "500", "700"], subsets: ["latin"] });

export const rubik = r.fontFamily;
export const quicksand = q.fontFamily;
