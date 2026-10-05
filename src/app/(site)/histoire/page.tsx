import { permanentRedirect } from "next/navigation";

/** Ancienne page « Histoire », retirée : les anciens liens mènent à « À propos ». */
export default function HistoryPage() {
  permanentRedirect("/a-propos");
}
