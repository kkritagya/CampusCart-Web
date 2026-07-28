import Link from "next/link";
import styles from "./product-details.module.css";

type ProductBreadcrumbsProps = {
  title: string;
};

export function ProductBreadcrumbs({ title }: ProductBreadcrumbsProps) {
  return (
    <nav className={styles.breadcrumbs} aria-label="Breadcrumb">
      <ol>
        <li><Link href="/">Home</Link></li>
        <li><Link href="/marketplace">Marketplace</Link></li>
        <li aria-current="page">{title}</li>
      </ol>
    </nav>
  );
}
