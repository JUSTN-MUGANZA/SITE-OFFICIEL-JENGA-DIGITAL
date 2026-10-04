import { permanentRedirect } from "next/navigation";

/** L'histoire est désormais présentée sur la page « À propos ». */
export default function HistoryPage() {
  permanentRedirect("/a-propos#histoire");
}
