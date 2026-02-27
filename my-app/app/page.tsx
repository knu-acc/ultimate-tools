import { redirect } from "next/navigation";

const DEFAULT_LOCALE = "ru";

/**
 * Корень сайта: редирект на язык по умолчанию.
 * Нужно для Netlify и других платформ, где middleware может не обработать /.
 */
export default function RootPage() {
  redirect(`/${DEFAULT_LOCALE}`);
}
